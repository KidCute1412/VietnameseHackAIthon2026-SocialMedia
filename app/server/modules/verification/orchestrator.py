from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Optional, Protocol
from uuid import uuid4

from sqlalchemy.orm import Session

from config import settings
from modules.verification.models import Source, Verification, VerificationEvent, VerificationJob
from integrations.vnpt.smartreader import SmartReaderClient
from integrations.vnpt.smartvoice import SmartVoiceClient

DOCUMENT_MIME_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
}
DOCUMENT_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}
AUDIO_MIME_TYPES = {
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/x-wav",
    "audio/wave",
}
AUDIO_EXTENSIONS = {".mp3", ".wav"}
DOCUMENT_MAX_BYTES = 10 * 1024 * 1024
AUDIO_MAX_BYTES = 20 * 1024 * 1024


class JobDispatcher(Protocol):
    def enqueue_manual_ingestion(self, verification_job_id: int) -> str:
        ...


@dataclass
class StoredUpload:
    filename: str
    content_type: str
    path: Path
    size_bytes: int


@dataclass
class CreatedVerification:
    verification: Verification
    source: Source
    job: VerificationJob


class ManualIngestionError(Exception):
    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code
        self.message = message


def create_verification_from_text(
    db: Session,
    dispatcher: JobDispatcher,
    *,
    title: Optional[str],
    raw_content: str,
    source_url: Optional[str],
) -> CreatedVerification:
    if not raw_content.strip():
        raise ManualIngestionError("empty_raw_content", "raw_content must not be empty")

    verification = Verification(
        title=title,
        raw_content=raw_content,
        source_url=source_url,
        status="queued",
    )
    db.add(verification)
    db.flush()

    source = Source(
        verification_id=verification.id,
        kind="text",
        title=title,
        raw_text=raw_content,
        metadata_json={"source_url": source_url} if source_url else {},
    )
    job = VerificationJob(
        verification_id=verification.id,
        job_type="manual_ingestion",
        provider="inline_text",
        status="queued",
    )
    db.add_all(
        [
            source,
            job,
            VerificationEvent(
                verification_id=verification.id,
                status="queued",
                message="Verification queued",
            ),
        ]
    )
    db.flush()

    job.payload = {"verification_id": verification.id}
    job.result = {"dispatcher_job_id": dispatcher.enqueue_manual_ingestion(job.id)}
    db.commit()
    db.refresh(verification)
    db.refresh(source)
    db.refresh(job)
    return CreatedVerification(verification=verification, source=source, job=job)


def create_verification_from_upload(
    db: Session,
    dispatcher: JobDispatcher,
    *,
    title: Optional[str],
    source_url: Optional[str],
    upload: StoredUpload,
) -> CreatedVerification:
    source_kind = classify_upload(upload.filename, upload.content_type)
    verification = Verification(title=title, source_url=source_url, status="queued")
    db.add(verification)
    db.flush()

    source = Source(
        verification_id=verification.id,
        kind=source_kind,
        title=title,
        file_name=upload.filename,
        mime_type=upload.content_type,
        storage_path=str(upload.path),
        metadata_json={
            "source_url": source_url,
            "size_bytes": upload.size_bytes,
        },
    )
    job = VerificationJob(
        verification_id=verification.id,
        job_type="manual_ingestion",
        provider="vnpt_smartreader" if source_kind == "file_upload" else "vnpt_smartvoice",
        status="queued",
    )
    db.add_all(
        [
            source,
            job,
            VerificationEvent(
                verification_id=verification.id,
                status="queued",
                message="Upload accepted and queued",
            ),
        ]
    )
    db.flush()

    job.payload = {
        "verification_id": verification.id,
        "source_id": source.id,
        "storage_path": source.storage_path,
    }
    job.result = {"dispatcher_job_id": dispatcher.enqueue_manual_ingestion(job.id)}
    db.commit()
    db.refresh(verification)
    db.refresh(source)
    db.refresh(job)
    return CreatedVerification(verification=verification, source=source, job=job)


def persist_upload(
    *,
    filename: str,
    content_type: str,
    payload: bytes,
) -> StoredUpload:
    validate_upload(filename=filename, content_type=content_type, payload=payload)
    suffix = Path(filename).suffix.lower()
    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)
    path = upload_dir / f"{uuid4().hex}{suffix}"
    path.write_bytes(payload)
    return StoredUpload(
        filename=filename,
        content_type=content_type,
        path=path,
        size_bytes=len(payload),
    )


def validate_upload(*, filename: str, content_type: str, payload: bytes) -> None:
    source_kind = classify_upload(filename, content_type)
    size = len(payload)
    if source_kind == "file_upload" and size > DOCUMENT_MAX_BYTES:
        raise ManualIngestionError("payload_too_large", "Image and PDF uploads must be smaller than 10MB")
    if source_kind == "audio_upload" and size > AUDIO_MAX_BYTES:
        raise ManualIngestionError("payload_too_large", "Audio uploads must be smaller than 20MB")


def classify_upload(filename: str, content_type: str) -> str:
    suffix = Path(filename).suffix.lower()
    normalized = (content_type or "").lower()
    if normalized in DOCUMENT_MIME_TYPES or suffix in DOCUMENT_EXTENSIONS:
        return "file_upload"
    if normalized in AUDIO_MIME_TYPES or suffix in AUDIO_EXTENSIONS:
        return "audio_upload"
    raise ManualIngestionError("unsupported_media_type", "Unsupported media type")


def process_manual_ingestion_job(db: Session, verification_job_id: int) -> None:
    job = db.query(VerificationJob).filter(VerificationJob.id == verification_job_id).first()
    if job is None:
        raise ManualIngestionError("job_not_found", f"Verification job {verification_job_id} was not found")

    verification = job.verification
    source = verification.source
    if verification is None or source is None:
        raise ManualIngestionError("verification_not_found", "Verification source data is missing")
    if job.status == "succeeded" and verification.status == "completed":
        return

    now = datetime.utcnow()
    job.status = "running"
    job.attempt_count += 1
    job.started_at = now
    verification.status = "processing"
    verification.updated_at = now
    db.add(
        VerificationEvent(
            verification_id=verification.id,
            status="processing",
            message="Manual ingestion is processing",
        )
    )
    db.commit()

    try:
        raw_text, provider_result = _extract_raw_text(source)
        source.raw_text = raw_text
        source.external_ref = provider_result.get("external_ref")
        source.metadata_json = {**(source.metadata_json or {}), **provider_result}
        verification.raw_content = raw_text
        verification.status = "completed"
        verification.error_message = None
        verification.completed_at = datetime.utcnow()
        verification.updated_at = verification.completed_at
        job.status = "succeeded"
        job.finished_at = verification.completed_at
        job.result = provider_result
        db.add(
            VerificationEvent(
                verification_id=verification.id,
                status="completed",
                message="Manual ingestion completed",
            )
        )
        db.commit()
    except Exception as exc:
        finished_at = datetime.utcnow()
        verification.status = "failed"
        verification.error_message = str(exc)
        verification.updated_at = finished_at
        job.status = "failed"
        job.finished_at = finished_at
        job.result = {"error": str(exc)}
        db.add(
            VerificationEvent(
                verification_id=verification.id,
                status="failed",
                message=str(exc),
            )
        )
        db.commit()
        raise


def _extract_raw_text(source: Source) -> tuple[str, dict]:
    if source.kind == "text":
        return source.raw_text or "", {"provider": "inline_text"}

    storage_path = Path(source.storage_path or "")
    if not storage_path.exists():
        raise FileNotFoundError(f"Stored upload not found: {storage_path}")

    payload = storage_path.read_bytes()
    if source.kind == "file_upload":
        client = SmartReaderClient()
        result = client.extract_text(
            payload=payload,
            filename=source.file_name or storage_path.name,
            content_type=source.mime_type or "application/octet-stream",
        )
        return result["raw_text"], result

    if source.kind == "audio_upload":
        client = SmartVoiceClient()
        result = client.transcribe_audio(
            payload=payload,
            filename=source.file_name or storage_path.name,
            content_type=source.mime_type or "application/octet-stream",
        )
        return result["raw_text"], result

    raise ManualIngestionError("unsupported_source_kind", f"Unsupported source kind: {source.kind}")

# API for Verifications Orchestration (Hot/Cold paths)
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session, joinedload

from modules.deps import get_db, get_job_dispatcher
from modules.verification.models import Verification
from modules.verification.schemas import (
    VerificationCreate,
    VerificationCreateFromTrending,
    VerificationDetail,
    VerificationEventSchema,
    VerificationResponse,
)
from modules.verification.orchestrator import (
    ManualIngestionError,
    create_verification_from_text,
    create_verification_from_upload,
    persist_upload,
)

router = APIRouter()


@router.post("", response_model=VerificationResponse, status_code=status.HTTP_202_ACCEPTED)
async def create_verification(
    request: Request,
    db: Session = Depends(get_db),
    dispatcher=Depends(get_job_dispatcher),
) -> Any:
    try:
        content_type = request.headers.get("content-type", "").lower()
        if "application/json" in content_type:
            payload = VerificationCreate.model_validate(await request.json())
            if not payload.raw_content:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail={"code": "raw_content_required", "message": "raw_content is required for JSON requests"},
                )
            created = create_verification_from_text(
                db,
                dispatcher,
                title=payload.title,
                raw_content=payload.raw_content,
                source_url=payload.source_url,
            )
        else:
            form = await request.form()
            upload = form.get("file")
            if upload is None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail={"code": "file_required", "message": "Multipart requests must include file"},
                )
            payload = await upload.read()
            stored = persist_upload(
                filename=upload.filename or "upload.bin",
                content_type=upload.content_type or "application/octet-stream",
                payload=payload,
            )
            created = create_verification_from_upload(
                db,
                dispatcher,
                title=form.get("title"),
                source_url=form.get("source_url"),
                upload=stored,
            )
    except ManualIngestionError as exc:
        status_code = status.HTTP_400_BAD_REQUEST
        if exc.code == "payload_too_large":
            status_code = status.HTTP_413_CONTENT_TOO_LARGE
        elif exc.code == "unsupported_media_type":
            status_code = status.HTTP_415_UNSUPPORTED_MEDIA_TYPE
        raise HTTPException(status_code=status_code, detail={"code": exc.code, "message": exc.message}) from exc

    return {
        "id": created.verification.id,
        "task_id": created.job.id,
        "source_id": created.source.id,
        "status": created.verification.status,
        "created_at": created.verification.created_at,
        "updated_at": created.verification.updated_at,
    }


@router.post("/from-trending", response_model=VerificationResponse, status_code=status.HTTP_202_ACCEPTED)
async def create_verification_from_trending(
    payload: VerificationCreateFromTrending,
    db: Session = Depends(get_db),
    dispatcher=Depends(get_job_dispatcher),
) -> Any:
    created = create_verification_from_text(
        db,
        dispatcher,
        title=f"Trending post {payload.post_id}",
        raw_content=payload.post_id,
        source_url=payload.source_url,
    )
    created.source.kind = "trending_post"
    created.source.external_ref = payload.post_id
    db.commit()
    return {
        "id": created.verification.id,
        "task_id": created.job.id,
        "source_id": created.source.id,
        "status": created.verification.status,
        "created_at": created.verification.created_at,
        "updated_at": created.verification.updated_at,
    }


@router.get("", response_model=List[VerificationResponse])
async def list_verifications(db: Session = Depends(get_db)) -> Any:
    items = (
        db.query(Verification)
        .options(joinedload(Verification.source), joinedload(Verification.jobs))
        .order_by(Verification.created_at.desc())
        .all()
    )
    return [
        {
            "id": item.id,
            "task_id": item.jobs[0].id if item.jobs else None,
            "source_id": item.source.id if item.source else None,
            "status": item.status,
            "created_at": item.created_at,
            "updated_at": item.updated_at,
        }
        for item in items
    ]


@router.get("/{id}", response_model=VerificationDetail)
async def get_verification_detail(id: int, db: Session = Depends(get_db)) -> Any:
    item = (
        db.query(Verification)
        .options(
            joinedload(Verification.source),
            joinedload(Verification.jobs),
            joinedload(Verification.events),
        )
        .filter(Verification.id == id)
        .first()
    )
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "not_found", "message": "Verification not found"},
        )

    source = None
    if item.source:
        source = {
            "id": item.source.id,
            "kind": item.source.kind,
            "title": item.source.title,
            "raw_text": item.source.raw_text,
            "file_name": item.source.file_name,
            "mime_type": item.source.mime_type,
            "external_ref": item.source.external_ref,
            "metadata": item.source.metadata_json or {},
        }

    return {
        "id": item.id,
        "task_id": item.jobs[0].id if item.jobs else None,
        "source_id": item.source.id if item.source else None,
        "status": item.status,
        "title": item.title,
        "raw_content": item.raw_content,
        "source_url": item.source_url,
        "error_message": item.error_message,
        "trust_score": item.trust_score,
        "impact_score": item.impact_score,
        "risk_score": item.risk_score,
        "claims": item.claims,
        "evidences": item.evidences,
        "editorial_outline": item.editorial_outline,
        "source": source,
        "jobs": item.jobs,
        "events": item.events,
        "created_at": item.created_at,
        "updated_at": item.updated_at,
    }


@router.get("/{id}/events", response_model=List[VerificationEventSchema])
async def get_verification_events(id: int, db: Session = Depends(get_db)) -> Any:
    item = (
        db.query(Verification)
        .options(joinedload(Verification.events))
        .filter(Verification.id == id)
        .first()
    )
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "not_found", "message": "Verification not found"},
        )
    return item.events

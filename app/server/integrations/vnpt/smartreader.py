# Client for VNPT SmartReader (OCR image/PDF digitization)
from __future__ import annotations

from typing import Any

import httpx

from config import settings


class SmartReaderClient:
    def __init__(self) -> None:
        self.timeout = settings.VNPT_TIMEOUT_SECONDS

    def extract_text(self, *, payload: bytes, filename: str, content_type: str) -> dict[str, Any]:
        upload_result = self._upload_file(payload=payload, filename=filename, content_type=content_type)
        raw_text = self._ocr_document(
            file_hash=upload_result["hash"],
            file_type=upload_result["file_type"],
        )
        return {
            "provider": "vnpt_smartreader",
            "external_ref": upload_result["hash"],
            "file_type": upload_result["file_type"],
            "raw_text": raw_text,
        }

    def _upload_file(self, *, payload: bytes, filename: str, content_type: str) -> dict[str, str]:
        with httpx.Client(timeout=self.timeout) as client:
            response = client.post(
                settings.VNPT_SMARTREADER_UPLOAD_URL,
                headers=_shared_headers(),
                data={"title": "Hashing document", "description": "Hashing document"},
                files={"file": (filename, payload, content_type)},
            )
            response.raise_for_status()
        data = response.json()
        file_hash = _deep_get(data, "object", "hash") or _deep_get(data, "data", "hash") or data.get("hash")
        file_type = _deep_get(data, "object", "fileType") or _deep_get(data, "data", "fileType") or data.get("fileType")
        if not file_hash or not file_type:
            raise ValueError("SmartReader upload response did not include hash/fileType")
        return {"hash": file_hash, "file_type": file_type}

    def _ocr_document(self, *, file_hash: str, file_type: str) -> str:
        payload = {
            "file_hash": file_hash,
            "file_type": file_type,
            "token": settings.VNPT_SMARTREADER_BODY_TOKEN,
            "client_session": settings.VNPT_CLIENT_SESSION,
            "details": True,
        }
        with httpx.Client(timeout=self.timeout) as client:
            response = client.post(
                settings.VNPT_SMARTREADER_OCR_URL,
                headers={**_shared_headers(), "Content-Type": "application/json"},
                json=payload,
            )
            response.raise_for_status()
        data = response.json()
        raw_text = _extract_text(data)
        if not raw_text:
            raise ValueError("SmartReader OCR response did not contain extractable text")
        return raw_text


def _shared_headers() -> dict[str, str]:
    headers = {
        "Token-id": settings.VNPT_TOKEN_ID,
        "Token-key": settings.VNPT_TOKEN_KEY,
        "mac-address": settings.VNPT_MAC_ADDRESS,
    }
    if settings.VNPT_AUTHORIZATION:
        headers["Authorization"] = settings.VNPT_AUTHORIZATION
    return headers


def _deep_get(data: dict[str, Any], *keys: str) -> Any:
    current: Any = data
    for key in keys:
        if not isinstance(current, dict):
            return None
        current = current.get(key)
    return current


def _extract_text(node: Any) -> str:
    if isinstance(node, str):
        return node.strip()
    if isinstance(node, list):
        parts = [_extract_text(item) for item in node]
        return "\n".join(part for part in parts if part).strip()
    if isinstance(node, dict):
        for key in ("text", "full_text", "raw_text", "content", "ocr_text"):
            value = node.get(key)
            if isinstance(value, str) and value.strip():
                return value.strip()
        for key in ("data", "object", "result", "results", "pages", "items"):
            if key in node:
                value = _extract_text(node[key])
                if value:
                    return value
    return ""

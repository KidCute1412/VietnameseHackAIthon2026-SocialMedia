# Client for VNPT SmartVoice (STT audio transcription)
from __future__ import annotations

from typing import Any

import httpx

from config import settings


class SmartVoiceClient:
    def __init__(self) -> None:
        self.timeout = settings.VNPT_TIMEOUT_SECONDS

    def transcribe_audio(self, *, payload: bytes, filename: str, content_type: str) -> dict[str, Any]:
        with httpx.Client(timeout=self.timeout) as client:
            response = client.post(
                settings.VNPT_SMARTVOICE_STT_URL,
                headers=_shared_headers(),
                data={"clientSession": settings.VNPT_CLIENT_SESSION},
                files={"audioFile": (filename, payload, content_type)},
            )
            response.raise_for_status()
        data = response.json()
        raw_text = _extract_text(data)
        if not raw_text:
            raise ValueError("SmartVoice STT response did not contain transcription text")
        return {
            "provider": "vnpt_smartvoice",
            "raw_text": raw_text,
            "external_ref": _extract_external_ref(data),
        }


def _shared_headers() -> dict[str, str]:
    headers = {
        "token-id": settings.VNPT_TOKEN_ID,
        "token-key": settings.VNPT_TOKEN_KEY,
    }
    if settings.VNPT_AUTHORIZATION:
        headers["Authorization"] = settings.VNPT_AUTHORIZATION
    return headers


def _extract_text(node: Any) -> str:
    if isinstance(node, str):
        return node.strip()
    if isinstance(node, list):
        parts = [_extract_text(item) for item in node]
        return "\n".join(part for part in parts if part).strip()
    if isinstance(node, dict):
        for key in ("text", "transcript", "transcription", "raw_text", "content"):
            value = node.get(key)
            if isinstance(value, str) and value.strip():
                return value.strip()
        for key in ("data", "object", "result", "results", "segments"):
            if key in node:
                value = _extract_text(node[key])
                if value:
                    return value
    return ""


def _extract_external_ref(data: Any) -> str | None:
    if isinstance(data, dict):
        for key in ("requestId", "taskId", "jobId", "id"):
            value = data.get(key)
            if isinstance(value, str) and value:
                return value
        for nested in ("data", "object", "result"):
            value = data.get(nested)
            extracted = _extract_external_ref(value)
            if extracted:
                return extracted
    return None

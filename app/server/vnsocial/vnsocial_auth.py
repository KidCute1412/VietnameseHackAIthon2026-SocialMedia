import json
import os
from pathlib import Path
from threading import Lock
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from dotenv import load_dotenv


SERVER_ENV_FILE = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(SERVER_ENV_FILE)
load_dotenv()

LOGIN_URL_ENV = "VNSOCIAL_LOGIN_URL"
USERNAME_ENV = "VNSOCIAL_USERNAME"
PASSWORD_ENV = "VNSOCIAL_PASSWORD"

TOKEN_ENV = "VNSOCIAL_TOKEN"
TIMEOUT_ENV = "VNSOCIAL_TIMEOUT_SECONDS"

DEFAULT_LOGIN_URL = "https://api-vnsocialplus.vnpt.vn/social-api/v1/login"

_token_lock = Lock()
_vnsocial_token: str | None = os.getenv(TOKEN_ENV)


class VNSocialAuthError(RuntimeError):
    pass


def can_attempt_vnsocial_login() -> bool:
    return bool(os.getenv(TOKEN_ENV) or (os.getenv(USERNAME_ENV) and os.getenv(PASSWORD_ENV)))


def get_vnsocial_token() -> str:
    global _vnsocial_token

    if _vnsocial_token:
        return _vnsocial_token

    with _token_lock:
        if _vnsocial_token:
            return _vnsocial_token

        env_token = os.getenv(TOKEN_ENV)
        if env_token:
            _vnsocial_token = env_token
            return _vnsocial_token

        username = os.getenv(USERNAME_ENV)
        password = os.getenv(PASSWORD_ENV)
        if not username or not password:
            raise VNSocialAuthError(f"Missing {USERNAME_ENV} or {PASSWORD_ENV}")

        response_payload = _call_login_api(username, password)
        token = _extract_token(response_payload)
        if not token:
            raise VNSocialAuthError("VNPT login response does not contain a token")

        _vnsocial_token = token
        return _vnsocial_token


def _call_login_api(username: str, password: str) -> dict[str, Any]:
    login_url = os.getenv(LOGIN_URL_ENV, DEFAULT_LOGIN_URL)
    payload = json.dumps({"username": username, "password": password}).encode("utf-8")
    request = Request(
        login_url,
        data=payload,
        headers={"Content-Type": "application/json", "Accept": "application/json"},
        method="POST",
    )

    try:
        with urlopen(request, timeout=_timeout_seconds()) as response:
            raw_body = response.read().decode("utf-8")
    except HTTPError as exc:
        raise VNSocialAuthError(f"VNPT login failed with status {exc.code}") from exc
    except URLError as exc:
        raise VNSocialAuthError(f"VNPT login request failed: {exc.reason}") from exc
    except TimeoutError as exc:
        raise VNSocialAuthError("VNPT login request timed out") from exc

    try:
        parsed_body = json.loads(raw_body)
    except json.JSONDecodeError as exc:
        raise VNSocialAuthError("VNPT login response is not valid JSON") from exc

    if not isinstance(parsed_body, dict):
        raise VNSocialAuthError("VNPT login response must be a JSON object")

    return parsed_body


def _timeout_seconds() -> float:
    raw_timeout = os.getenv(TIMEOUT_ENV, "10")
    try:
        return float(raw_timeout)
    except ValueError as exc:
        raise VNSocialAuthError(f"{TIMEOUT_ENV} must be a number") from exc


def _extract_token(payload: Any) -> str | None:
    if not isinstance(payload, dict):
        return None

    for key in ("token", "access_token", "accessToken"):
        token = payload.get(key)
        if isinstance(token, str) and token:
            return token

    for key in ("data", "result", "object"):
        token = _extract_token(payload.get(key))
        if token:
            return token

    return None

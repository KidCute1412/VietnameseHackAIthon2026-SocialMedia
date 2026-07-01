import json
import os
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from vnsocial.vnsocial_auth import TIMEOUT_ENV, VNSocialAuthError, get_vnsocial_token


PROJECTS_URL_ENV = "VNSOCIAL_PROJECTS_URL"
DEFAULT_PROJECTS_URL = "https://api-vnsocialplus.vnpt.vn/social-api/v1/projects"


class VNSocialAPIError(RuntimeError):
    pass


def get_vnsocial_projects() -> dict[str, Any]:
    token = get_vnsocial_token()
    request = Request(
        os.getenv(PROJECTS_URL_ENV, DEFAULT_PROJECTS_URL),
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "x-access-token": token,
        },
        method="GET",
    )

    try:
        with urlopen(request, timeout=_timeout_seconds()) as response:
            raw_body = response.read().decode("utf-8")
    except HTTPError as exc:
        raise VNSocialAPIError(f"VNPT projects request failed with status {exc.code}") from exc
    except URLError as exc:
        raise VNSocialAPIError(f"VNPT projects request failed: {exc.reason}") from exc
    except TimeoutError as exc:
        raise VNSocialAPIError("VNPT projects request timed out") from exc

    try:
        parsed_body = json.loads(raw_body)
    except json.JSONDecodeError as exc:
        raise VNSocialAPIError("VNPT projects response is not valid JSON") from exc

    if not isinstance(parsed_body, dict):
        raise VNSocialAPIError("VNPT projects response must be a JSON object")

    return parsed_body


def _timeout_seconds() -> float:
    raw_timeout = os.getenv(TIMEOUT_ENV, "10")
    try:
        return float(raw_timeout)
    except ValueError as exc:
        raise VNSocialAuthError(f"{TIMEOUT_ENV} must be a number") from exc

import json
import os
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from integrations.vnpt.auth import TIMEOUT_ENV, VNSocialAuthError, get_vnsocial_token


PROJECTS_URL_ENV = "VNSOCIAL_PROJECTS_URL"
HOT_POSTS_URL_ENV = "VNSOCIAL_HOT_POSTS_URL"
DEFAULT_PROJECTS_URL = "https://api-vnsocialplus.vnpt.vn/social-api/v1/projects"
DEFAULT_HOT_POSTS_URL = (
    "https://api-vnsocialplus.vnpt.vn/social-api/v1/projects/hot-posts"
)


class VNSocialAPIError(RuntimeError):
    pass


def get_vnsocial_projects() -> dict[str, Any]:
    return _request_vnsocial_json(
        os.getenv(PROJECTS_URL_ENV, DEFAULT_PROJECTS_URL),
        "GET",
        None,
        "projects",
    )


def get_vnsocial_hot_posts(payload: dict[str, Any]) -> dict[str, Any]:
    return _request_vnsocial_json(
        os.getenv(HOT_POSTS_URL_ENV, DEFAULT_HOT_POSTS_URL),
        "POST",
        payload,
        "hot posts",
    )


def _request_vnsocial_json(
    url: str,
    method: str,
    payload: dict[str, Any] | None,
    resource_name: str,
) -> dict[str, Any]:
    token = get_vnsocial_token()
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    request = Request(
        url,
        data=data,
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "x-access-token": token,
        },
        method=method,
    )

    try:
        with urlopen(request, timeout=_timeout_seconds()) as response:
            raw_body = response.read().decode("utf-8")
    except HTTPError as exc:
        raise VNSocialAPIError(
            f"VNPT {resource_name} request failed with status {exc.code}"
        ) from exc
    except URLError as exc:
        raise VNSocialAPIError(
            f"VNPT {resource_name} request failed: {exc.reason}"
        ) from exc
    except TimeoutError as exc:
        raise VNSocialAPIError(f"VNPT {resource_name} request timed out") from exc

    try:
        parsed_body = json.loads(raw_body)
    except json.JSONDecodeError as exc:
        raise VNSocialAPIError(
            f"VNPT {resource_name} response is not valid JSON"
        ) from exc

    if not isinstance(parsed_body, dict):
        raise VNSocialAPIError(f"VNPT {resource_name} response must be a JSON object")

    return parsed_body


def _timeout_seconds() -> float:
    raw_timeout = os.getenv(TIMEOUT_ENV, "10")
    try:
        return float(raw_timeout)
    except ValueError as exc:
        raise VNSocialAuthError(f"{TIMEOUT_ENV} must be a number") from exc

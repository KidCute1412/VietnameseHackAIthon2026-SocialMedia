from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from vnsocial.vnsocial_auth import VNSocialAuthError
from vnsocial.vnsocial_client import (
    VNSocialAPIError,
    get_vnsocial_hot_posts,
    get_vnsocial_projects,
)

router = APIRouter()

ALLOWED_HOT_POST_SOURCES = {"baochi", "facebook", "forum", "youtube", "tiktok"}


class VNSocialHotPostsRequest(BaseModel):
    project_id: str
    source: str
    start_time: int
    end_time: int


@router.api_route("/projects", methods=["GET", "POST"])
def list_vnsocial_projects():
    try:
        return get_vnsocial_projects()
    except VNSocialAuthError as exc:
        raise HTTPException(
            status_code=503,
            detail={"code": "vnsocial_auth_failed", "message": str(exc)},
        ) from exc
    except VNSocialAPIError as exc:
        raise HTTPException(
            status_code=502,
            detail={"code": "vnsocial_projects_failed", "message": str(exc)},
        ) from exc


@router.api_route("/hot-posts", methods=["POST"])
def list_vnsocial_hot_posts(request: VNSocialHotPostsRequest):
    payload = _hot_posts_payload(request)

    try:
        return get_vnsocial_hot_posts(payload)
    except VNSocialAuthError as exc:
        raise HTTPException(
            status_code=503,
            detail={"code": "vnsocial_auth_failed", "message": str(exc)},
        ) from exc
    except VNSocialAPIError as exc:
        raise HTTPException(
            status_code=502,
            detail={"code": "vnsocial_hot_posts_failed", "message": str(exc)},
        ) from exc


def _hot_posts_payload(request: VNSocialHotPostsRequest) -> dict[str, Any]:
    payload = _model_to_dict(request)
    payload["project_id"] = payload["project_id"].strip()
    payload["source"] = payload["source"].strip()

    if not payload["project_id"]:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "invalid_project_id",
                "message": "project_id is required",
            },
        )

    if payload["source"] not in ALLOWED_HOT_POST_SOURCES:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "invalid_source",
                "message": (
                    "source must be one of baochi, facebook, forum, "
                    "youtube, tiktok"
                ),
            },
        )

    if payload["end_time"] < payload["start_time"]:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "invalid_time_range",
                "message": "end_time must be greater than or equal to start_time",
            },
        )

    return payload


def _model_to_dict(model: BaseModel) -> dict[str, Any]:
    if hasattr(model, "model_dump"):
        return model.model_dump()
    return model.dict()

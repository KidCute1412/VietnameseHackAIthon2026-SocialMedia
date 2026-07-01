from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException

from vnsocial.vnsocial_auth import (
    VNSocialAuthError,
    can_attempt_vnsocial_login,
    get_vnsocial_token,
)
from vnsocial.vnsocial_client import VNSocialAPIError, get_vnsocial_projects
from api.v1 import api_router
from config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    if can_attempt_vnsocial_login():
        try:
            get_vnsocial_token()
            print("VNPT vnSocial login successful")
        except VNSocialAuthError as exc:
            print(f"VNPT vnSocial login failed: {exc}")

    yield


app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

# Register API routes
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {"message": "Hello World"}


@app.get("/api/vnsocial/projects")
@app.post("/api/vnsocial/projects")
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


from contextlib import asynccontextmanager

from fastapi import FastAPI

from api.v1 import api_router
from config import settings
from database import init_db
from vnsocial.vnsocial_auth import (
    VNSocialAuthError,
    can_attempt_vnsocial_login,
    get_vnsocial_token,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()

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

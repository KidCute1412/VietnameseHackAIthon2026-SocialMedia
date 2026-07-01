from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

from integrations.vnpt.auth import (
    VNSocialAuthError,
    can_attempt_vnsocial_login,
    get_vnsocial_token,
)
from modules import api_router
from config import settings
from database import init_db
from modules.auth.services import decode_access_token
from modules.auth.scheduler import start_otp_cleanup_scheduler


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    scheduler = start_otp_cleanup_scheduler()

    try:
        if can_attempt_vnsocial_login():
            try:
                get_vnsocial_token()
                print("VNPT vnSocial login successful")
            except VNSocialAuthError as exc:
                print(f"VNPT vnSocial login failed: {exc}")

        yield
    finally:
        scheduler.shutdown(wait=False)


app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _is_public_path(path: str) -> bool:
    public_exact_paths = {"/docs", "/redoc", "/openapi.json"}
    public_auth_prefixes = ("/auth/", f"{settings.API_V1_STR}/auth/")
    return path in public_exact_paths or path.startswith(public_auth_prefixes)


@app.middleware("http")
async def require_jwt_cookie(request: Request, call_next):
    if request.method == "OPTIONS" or _is_public_path(request.url.path):
        return await call_next(request)

    token_payload = decode_access_token(
        request.cookies.get(settings.AUTH_COOKIE_NAME)
    )
    if not token_payload:
        return JSONResponse(
            status_code=401,
            content={
                "detail": {
                    "code": "unauthorized",
                    "message": "Authentication required",
                }
            },
        )

    request.state.user_id = token_payload.get("sub")
    return await call_next(request)


# Register API routes
app.include_router(api_router, prefix=settings.API_V1_STR)

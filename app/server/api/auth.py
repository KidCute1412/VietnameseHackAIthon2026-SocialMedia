from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from api.deps import get_current_user, get_db
from config import settings
from models.auth import User
from schemas.auth import (
    AuthCredentials,
    AuthMessage,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    VerifyOTPRequest,
)
from services.auth_service import (
    check_password,
    create_access_token,
    create_otp_code,
    create_user,
    delete_otp_codes_for_email,
    find_valid_otp_code,
    get_user_by_email,
    hash_password,
    normalize_email,
)
from services.email_service import EmailDeliveryError, send_password_reset_otp

router = APIRouter()


def _bad_request(code: str, message: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail={"code": code, "message": message},
    )


def _validate_email(email: str) -> str:
    normalized_email = normalize_email(email)
    if not normalized_email or "@" not in normalized_email:
        raise _bad_request("invalid_email", "A valid email is required")
    return normalized_email


def _validate_password(password: str) -> None:
    if len(password) < 6:
        raise _bad_request(
            "weak_password",
            "Password must be at least 6 characters long",
        )


def _set_auth_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=settings.AUTH_COOKIE_NAME,
        value=token,
        max_age=settings.JWT_EXPIRE_MINUTES * 60,
        httponly=True,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite=settings.AUTH_COOKIE_SAMESITE,
        path="/",
    )


def _clear_auth_cookie(response: Response) -> None:
    response.delete_cookie(
        key=settings.AUTH_COOKIE_NAME,
        path="/",
        secure=settings.AUTH_COOKIE_SECURE,
        samesite=settings.AUTH_COOKIE_SAMESITE,
        httponly=True,
    )


@router.post(
    "/register",
    response_model=AuthMessage,
    status_code=status.HTTP_201_CREATED,
)
def register(payload: AuthCredentials, db: Session = Depends(get_db)) -> AuthMessage:
    email = _validate_email(payload.email)
    _validate_password(payload.password)

    if get_user_by_email(db, email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": "email_exists", "message": "Email already exists"},
        )

    user = create_user(db, email, payload.password)
    return AuthMessage(message="Registration successful", user=user)


@router.post("/login", response_model=AuthMessage)
def login(
    payload: AuthCredentials,
    response: Response,
    db: Session = Depends(get_db),
) -> AuthMessage:
    email = _validate_email(payload.email)
    user = get_user_by_email(db, email)

    if not user or not check_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "code": "invalid_credentials",
                "message": "Email or password is incorrect",
            },
        )

    _set_auth_cookie(response, create_access_token(user))
    return AuthMessage(message="Login successful", user=user)


@router.post("/logout", response_model=AuthMessage)
def logout(response: Response) -> AuthMessage:
    _clear_auth_cookie(response)
    return AuthMessage(message="Logout successful")


@router.get("/me", response_model=AuthMessage)
def get_session(current_user: User = Depends(get_current_user)) -> AuthMessage:
    return AuthMessage(message="Authenticated", user=current_user)


@router.post("/forgot-password", response_model=AuthMessage)
def forgot_password(
    payload: ForgotPasswordRequest,
    db: Session = Depends(get_db),
) -> AuthMessage:
    email = _validate_email(payload.email)
    user = get_user_by_email(db, email)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "user_not_found", "message": "User not found"},
        )

    otp_code = create_otp_code(db, email)

    try:
        send_password_reset_otp(email, otp_code.otp)
    except EmailDeliveryError as exc:
        delete_otp_codes_for_email(db, email)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={"code": "otp_email_failed", "message": str(exc)},
        ) from exc

    return AuthMessage(message="OTP sent")


@router.post("/verify-otp", response_model=AuthMessage)
def verify_otp(
    payload: VerifyOTPRequest,
    db: Session = Depends(get_db),
) -> AuthMessage:
    email = _validate_email(payload.email)

    if not find_valid_otp_code(db, email, payload.otp):
        raise _bad_request("invalid_otp", "OTP is invalid or expired")

    return AuthMessage(message="OTP verified")


@router.post("/reset-password", response_model=AuthMessage)
def reset_password(
    payload: ResetPasswordRequest,
    db: Session = Depends(get_db),
) -> AuthMessage:
    email = _validate_email(payload.email)
    _validate_password(payload.new_password)

    otp = payload.otp or payload.reset_token
    if not otp or not find_valid_otp_code(db, email, otp):
        raise _bad_request("invalid_reset_token", "Reset token is invalid or expired")

    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "user_not_found", "message": "User not found"},
        )

    user.password_hash = hash_password(payload.new_password)
    delete_otp_codes_for_email(db, email)
    db.commit()
    return AuthMessage(message="Password reset successful")

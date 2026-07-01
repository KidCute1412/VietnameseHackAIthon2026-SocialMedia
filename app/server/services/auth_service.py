from datetime import datetime, timedelta, timezone
import secrets

import bcrypt
import jwt
from sqlalchemy.orm import Session

from config import settings
from models.auth import OTPCode, User


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def normalize_email(email: str) -> str:
    return email.strip().lower()


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def check_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == normalize_email(email)).first()


def create_user(db: Session, email: str, password: str) -> User:
    user = User(email=normalize_email(email), password_hash=hash_password(password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def create_access_token(user: User) -> str:
    now = utc_now()
    payload = {
        "sub": str(user.id),
        "email": user.email,
        "iat": now,
        "exp": now + timedelta(minutes=settings.JWT_EXPIRE_MINUTES),
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str | None) -> dict | None:
    if not token:
        return None

    try:
        return jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
    except jwt.PyJWTError:
        return None


def create_otp_code(db: Session, email: str) -> OTPCode:
    normalized_email = normalize_email(email)
    db.query(OTPCode).filter(OTPCode.email == normalized_email).delete()

    otp_code = OTPCode(
        email=normalized_email,
        otp=f"{secrets.randbelow(1_000_000):06d}",
        expired_at=utc_now() + timedelta(minutes=settings.OTP_EXPIRE_MINUTES),
    )
    db.add(otp_code)
    db.commit()
    db.refresh(otp_code)
    return otp_code


def find_valid_otp_code(db: Session, email: str, otp: str) -> OTPCode | None:
    return (
        db.query(OTPCode)
        .filter(
            OTPCode.email == normalize_email(email),
            OTPCode.otp == otp.strip(),
            OTPCode.expired_at >= utc_now(),
        )
        .order_by(OTPCode.created_at.desc())
        .first()
    )


def delete_otp_codes_for_email(db: Session, email: str) -> int:
    return (
        db.query(OTPCode)
        .filter(OTPCode.email == normalize_email(email))
        .delete(synchronize_session=False)
    )


def delete_expired_otp_codes(db: Session) -> int:
    return (
        db.query(OTPCode)
        .filter(OTPCode.expired_at < utc_now())
        .delete(synchronize_session=False)
    )

# Common API dependencies
from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from config import settings
from database import get_db
from models.auth import User
from services.auth_service import decode_access_token
from vnsocial.smartbot_client import SmartBotClient

def get_smartbot_client() -> SmartBotClient:
    return SmartBotClient()


def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
) -> User:
    payload = decode_access_token(request.cookies.get(settings.AUTH_COOKIE_NAME))
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "unauthorized", "message": "Authentication required"},
        )

    try:
        user_id = int(payload["sub"])
    except (KeyError, TypeError, ValueError) as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "invalid_token", "message": "Invalid token"},
        ) from exc

    user = db.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "invalid_token", "message": "Invalid token"},
        )

    return user

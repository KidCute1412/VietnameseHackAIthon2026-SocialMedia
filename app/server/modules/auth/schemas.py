from datetime import datetime

from pydantic import BaseModel


class AuthCredentials(BaseModel):
    email: str
    password: str


class ForgotPasswordRequest(BaseModel):
    email: str


class VerifyOTPRequest(BaseModel):
    email: str
    otp: str


class ResetPasswordRequest(BaseModel):
    email: str
    new_password: str
    otp: str | None = None
    reset_token: str | None = None


class AuthUser(BaseModel):
    id: int
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


class AuthMessage(BaseModel):
    message: str
    user: AuthUser | None = None

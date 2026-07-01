from email.message import EmailMessage
from email.utils import formataddr
import smtplib

from config import settings


class EmailDeliveryError(Exception):
    pass


def send_password_reset_otp(to_email: str, otp: str) -> bool:
    if not settings.SMTP_ENABLED:
        print(f"SMTP disabled. Password reset OTP for {to_email}: {otp}")
        return False

    _validate_smtp_settings()
    message = _build_otp_message(to_email, otp)

    try:
        _send_email(message)
    except OSError as exc:
        raise EmailDeliveryError(f"Failed to send OTP email: {exc}") from exc
    except smtplib.SMTPException as exc:
        raise EmailDeliveryError(f"Failed to send OTP email: {exc}") from exc

    return True


def _validate_smtp_settings() -> None:
    missing_fields = []

    if not settings.SMTP_HOST:
        missing_fields.append("SMTP_HOST")
    if not settings.SMTP_FROM_EMAIL:
        missing_fields.append("SMTP_FROM_EMAIL")
    if settings.SMTP_USE_TLS and settings.SMTP_USE_SSL:
        raise EmailDeliveryError("SMTP_USE_TLS and SMTP_USE_SSL cannot both be true")

    if missing_fields:
        raise EmailDeliveryError(
            f"Missing SMTP configuration: {', '.join(missing_fields)}"
        )


def _build_otp_message(to_email: str, otp: str) -> EmailMessage:
    message = EmailMessage()
    message["Subject"] = "Ma OTP dat lai mat khau HypeRoom"
    message["From"] = formataddr((settings.SMTP_FROM_NAME, settings.SMTP_FROM_EMAIL))
    message["To"] = to_email
    message.set_content(
        "\n".join(
            [
                "Xin chao,",
                "",
                f"Ma OTP dat lai mat khau HypeRoom cua ban la: {otp}",
                f"Ma nay het han sau {settings.OTP_EXPIRE_MINUTES} phut.",
                "",
                "Neu ban khong yeu cau dat lai mat khau, hay bo qua email nay.",
                "",
                "HypeRoom",
            ]
        )
    )
    return message


def _send_email(message: EmailMessage) -> None:
    smtp_class = smtplib.SMTP_SSL if settings.SMTP_USE_SSL else smtplib.SMTP

    with smtp_class(
        settings.SMTP_HOST,
        settings.SMTP_PORT,
        timeout=settings.SMTP_TIMEOUT_SECONDS,
    ) as smtp:
        if settings.SMTP_USE_TLS and not settings.SMTP_USE_SSL:
            smtp.starttls()

        if settings.SMTP_USERNAME:
            smtp.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)

        smtp.send_message(message)

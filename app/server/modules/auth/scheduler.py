from apscheduler.schedulers.background import BackgroundScheduler

from config import settings
from database import SessionLocal
from modules.auth.services import delete_expired_otp_codes


def cleanup_expired_otps() -> None:
    db = SessionLocal()
    try:
        deleted_count = delete_expired_otp_codes(db)
        db.commit()
        if deleted_count:
            print(f"Deleted {deleted_count} expired OTP code(s)")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def start_otp_cleanup_scheduler() -> BackgroundScheduler:
    scheduler = BackgroundScheduler(timezone="UTC")
    scheduler.add_job(
        cleanup_expired_otps,
        "interval",
        minutes=settings.OTP_CLEANUP_INTERVAL_MINUTES,
        id="delete_expired_otps",
        replace_existing=True,
    )
    scheduler.start()
    return scheduler

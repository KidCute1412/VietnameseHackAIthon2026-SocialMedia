from config import settings


def get_redis_connection():
    from redis import Redis

    if not settings.REDIS_URL:
        raise RuntimeError("REDIS_URL is not configured")
    return Redis.from_url(settings.REDIS_URL, ssl_cert_reqs=None, decode_responses=False)


def get_manual_ingestion_queue():
    from rq import Queue

    return Queue(
        name=settings.REDIS_QUEUE_NAME,
        connection=get_redis_connection(),
        default_timeout=settings.REDIS_DEFAULT_TIMEOUT_SECONDS,
    )

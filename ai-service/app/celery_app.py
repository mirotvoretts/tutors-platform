from celery import Celery
import os

redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
broker_url = os.getenv("CELERY_BROKER_URL", redis_url)
result_backend = os.getenv("CELERY_RESULT_BACKEND", redis_url)

celery_app = Celery(
    "stopro_ai",
    broker=broker_url,
    backend=result_backend,
    include=["app.tasks"]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

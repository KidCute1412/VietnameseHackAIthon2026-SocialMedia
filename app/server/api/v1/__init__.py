# Router v1 bundle
from fastapi import APIRouter
from api.v1.trending import router as trending_router
from api.v1.verifications import router as verifications_router
from api.v1.feedbacks import router as feedbacks_router
from api.v1.metrics import router as metrics_router
from api.v1.vnsocial import router as vnsocial_router

api_router = APIRouter()

api_router.include_router(trending_router, prefix="/trending", tags=["trending"])
api_router.include_router(verifications_router, prefix="/verifications", tags=["verifications"])
api_router.include_router(feedbacks_router, prefix="/feedbacks", tags=["feedbacks"])
api_router.include_router(metrics_router, prefix="/metrics", tags=["metrics"])
api_router.include_router(vnsocial_router, prefix="/vnsocial", tags=["vnsocial"])

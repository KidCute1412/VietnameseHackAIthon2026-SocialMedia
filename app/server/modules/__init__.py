from fastapi import APIRouter
from modules.trending.router import router as trending_router
from modules.verification.router import router as verifications_router
from modules.feedback.router import router as feedbacks_router
from modules.auth.router import router as auth_router

api_router = APIRouter()

api_router.include_router(trending_router, prefix="/trending", tags=["trending"])
api_router.include_router(verifications_router, prefix="/verifications", tags=["verifications"])
api_router.include_router(feedbacks_router, prefix="/feedbacks", tags=["feedbacks"])
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])


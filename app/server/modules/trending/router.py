# API for vnSocial Trending Topics
from fastapi import APIRouter, Depends
from typing import Any
from modules.trending.schemas import TrendingResponse

router = APIRouter()

@router.get("", response_model=TrendingResponse)
async def get_trending() -> Any:
    # Prototype: Return mock trending data from vnSocial
    return {
        "topics": [
            {
                "id": "trend-1",
                "title": "Sự việc lan truyền về HypeRoom",
                "content": "Một số thông tin thú vị xuất hiện trên mạng xã hội hôm nay...",
                "engagement_count": 1500,
                "published_at": "2026-07-01T12:00:00Z"
            }
        ]
    }

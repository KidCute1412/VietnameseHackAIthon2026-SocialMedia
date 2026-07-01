# Pydantic schemas for trending topics from vnSocial
from typing import List, Optional
from pydantic import BaseModel

class TrendingPost(BaseModel):
    id: str
    title: Optional[str] = None
    content: str
    author: Optional[str] = None
    engagement_count: Optional[int] = 0
    published_at: Optional[str] = None
    source_url: Optional[str] = None

class TrendingResponse(BaseModel):
    topics: List[TrendingPost]

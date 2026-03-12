from datetime import datetime

from pydantic import BaseModel, Field


class FavoriteCreate(BaseModel):
    anime_id: int = Field(..., gt=0)
    anime_source: str = Field(default="jikan", min_length=1, max_length=50)
    title: str = Field(..., min_length=1, max_length=255)
    title_japanese: str | None = Field(default=None, max_length=255)
    image: str | None = Field(default=None, max_length=500)
    score: float | None = None
    anime_url: str | None = Field(default=None, max_length=500)


class FavoriteResponse(BaseModel):
    id: int
    user_id: int
    anime_id: int
    anime_source: str
    title: str
    title_japanese: str | None = None
    image: str | None = None
    score: float | None = None
    anime_url: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}
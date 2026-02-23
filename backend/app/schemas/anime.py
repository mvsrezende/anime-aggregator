from pydantic import BaseModel, Field
from typing import List, Optional


class AnimeListItem(BaseModel):
    source: str = Field(default="jikan")
    id: int
    title: str
    title_japanese: Optional[str] = None
    url: Optional[str] = None
    image: Optional[str] = None
    score: Optional[float] = None
    year: Optional[int] = None
    episodes: Optional[int] = None
    status: Optional[str] = None
    synopsis: Optional[str] = None
    genres: List[str] = []


class PageMeta(BaseModel):
    page: int
    per_page: int
    has_next_page: bool


class AnimeSearchResponse(BaseModel):
    meta: PageMeta
    items: List[AnimeListItem]
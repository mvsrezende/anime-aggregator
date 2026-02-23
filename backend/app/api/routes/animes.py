from fastapi import APIRouter, Query
from typing import Optional

from app.clients.jikan import JikanClient
from app.schemas.anime import AnimeListItem, AnimeSearchResponse
from app.services.anime_service import normalize_list, normalize_single

router = APIRouter(prefix="/animes", tags=["animes"])

client = JikanClient()


@router.get("/search", response_model=AnimeSearchResponse)
async def search_animes(
    q: str = Query(min_length=1, max_length=100),
    page: int = Query(default=1, ge=1, le=1000),
    limit: int = Query(default=12, ge=1, le=25),
):
    payload = await client.search_anime(q=q, page=page, limit=limit)
    return normalize_list(payload, page=page, limit=limit)


@router.get("/{mal_id}", response_model=AnimeListItem)
async def get_anime(mal_id: int):
    payload = await client.get_anime(mal_id=mal_id)
    return normalize_single(payload)


@router.get("/top/list", response_model=AnimeSearchResponse)
async def top_animes(
    page: int = Query(default=1, ge=1, le=1000),
    limit: int = Query(default=12, ge=1, le=25),
    filter_: Optional[str] = Query(default=None, description="e.g. airing, upcoming, bypopularity, favorite"),
):
    payload = await client.top_anime(page=page, limit=limit, filter_=filter_)
    return normalize_list(payload, page=page, limit=limit)
from typing import Optional

from fastapi import APIRouter, Depends, Query, Response

from app.api.deps import DbSession, get_current_user
from app.clients.jikan import JikanClient
from app.models.search_history import SearchHistory
from app.models.user import User
from app.schemas.anime import AnimeListItem, AnimeSearchResponse
from app.services.anime_cache_service import (
    get_valid_anime_cache_payload,
    upsert_anime_cache,
)
from app.services.anime_service import normalize_list, normalize_single

router = APIRouter(prefix="/animes", tags=["animes"])

client = JikanClient()


@router.get("/search", response_model=AnimeSearchResponse)
async def search_animes(
    db: DbSession,
    q: str = Query(min_length=1, max_length=100),
    page: int = Query(default=1, ge=1, le=1000),
    limit: int = Query(default=12, ge=1, le=25),
    current_user: User = Depends(get_current_user),
):
    payload = await client.search_anime(q=q, page=page, limit=limit)

    search_entry = SearchHistory(
        user_id=current_user.id,
        query=q.strip(),
    )
    db.add(search_entry)
    db.commit()

    return normalize_list(payload, page=page, limit=limit)


@router.get("/{mal_id}", response_model=AnimeListItem)
async def get_anime(
    mal_id: int,
    response: Response,
    db: DbSession,
):
    cached_payload = get_valid_anime_cache_payload(
        db=db,
        anime_id=mal_id,
        source="jikan",
    )

    if cached_payload is not None:
        response.headers["X-Cache"] = "HIT"
        return normalize_single(cached_payload)

    payload = await client.get_anime(mal_id=mal_id)
    upsert_anime_cache(
        db=db,
        anime_id=mal_id,
        payload=payload,
        source="jikan",
    )

    response.headers["X-Cache"] = "MISS"
    return normalize_single(payload)


@router.get("/top/list", response_model=AnimeSearchResponse)
async def top_animes(
    page: int = Query(default=1, ge=1, le=1000),
    limit: int = Query(default=12, ge=1, le=25),
    filter_: Optional[str] = Query(
        default=None,
        description="e.g. airing, upcoming, bypopularity, favorite",
    ),
):
    payload = await client.top_anime(page=page, limit=limit, filter_=filter_)
    return normalize_list(payload, page=page, limit=limit)
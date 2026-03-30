from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.settings import settings
from app.models.anime_cache import AnimeCache
from app.services.anime_service import normalize_single


def _ensure_aware(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt


def get_valid_anime_cache_payload(
    db: Session,
    anime_id: int,
    source: str = "jikan",
) -> dict | None:
    cache = db.scalar(
        select(AnimeCache).where(
            AnimeCache.source == source,
            AnimeCache.anime_id == anime_id,
        )
    )

    if not cache:
        return None

    now = datetime.now(timezone.utc)
    expires_at = _ensure_aware(cache.expires_at)

    if expires_at <= now:
        return None

    return cache.payload_json


def upsert_anime_cache(
    db: Session,
    anime_id: int,
    payload: dict,
    source: str = "jikan",
) -> AnimeCache:
    anime = normalize_single(payload)

    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(hours=settings.anime_cache_ttl_hours)

    cache = db.scalar(
        select(AnimeCache).where(
            AnimeCache.source == source,
            AnimeCache.anime_id == anime_id,
        )
    )

    if not cache:
        cache = AnimeCache(
            source=source,
            anime_id=anime_id,
            title=anime.title,
            title_japanese=anime.title_japanese,
            image=anime.image,
            score=anime.score,
            synopsis=anime.synopsis,
            anime_url=anime.url,
            payload_json=payload,
            cached_at=now,
            expires_at=expires_at,
        )
        db.add(cache)
    else:
        cache.title = anime.title
        cache.title_japanese = anime.title_japanese
        cache.image = anime.image
        cache.score = anime.score
        cache.synopsis = anime.synopsis
        cache.anime_url = anime.url
        cache.payload_json = payload
        cache.cached_at = now
        cache.expires_at = expires_at

    db.commit()
    db.refresh(cache)
    return cache
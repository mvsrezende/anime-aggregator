from typing import Any, Dict, List
from app.schemas.anime import AnimeListItem, AnimeSearchResponse, PageMeta


def _pick_image(item: Dict[str, Any]) -> str | None:
    images = item.get("images") or {}
    jpg = images.get("jpg") or {}
    webp = images.get("webp") or {}
    return jpg.get("large_image_url") or jpg.get("image_url") or webp.get("large_image_url") or webp.get("image_url")


def _genres(item: Dict[str, Any]) -> List[str]:
    genres = item.get("genres") or []
    return [g.get("name") for g in genres if g.get("name")]


def normalize_list(payload: Dict[str, Any], page: int, limit: int) -> AnimeSearchResponse:
    pagination = (payload.get("pagination") or {})
    items = payload.get("data") or []

    normalized = [
        AnimeListItem(
            source="jikan",
            id=int(it.get("mal_id")),
            title=it.get("title") or "",
            title_japanese=it.get("title_japanese"),
            url=it.get("url"),
            image=_pick_image(it),
            score=it.get("score"),
            year=it.get("year"),
            episodes=it.get("episodes"),
            status=it.get("status"),
            synopsis=it.get("synopsis"),
            genres=_genres(it),
        )
        for it in items
        if it.get("mal_id") is not None
    ]

    meta = PageMeta(
        page=page,
        per_page=limit,
        has_next_page=bool(pagination.get("has_next_page")),
    )
    return AnimeSearchResponse(meta=meta, items=normalized)


def normalize_single(payload: Dict[str, Any]) -> AnimeListItem:
    it = payload.get("data") or {}
    return AnimeListItem(
        source="jikan",
        id=int(it.get("mal_id")),
        title=it.get("title") or "",
        title_japanese=it.get("title_japanese"),
        url=it.get("url"),
        image=_pick_image(it),
        score=it.get("score"),
        year=it.get("year"),
        episodes=it.get("episodes"),
        status=it.get("status"),
        synopsis=it.get("synopsis"),
        genres=_genres(it),
    )
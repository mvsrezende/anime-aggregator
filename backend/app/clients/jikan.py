from typing import Any, Dict, Optional
import httpx

from app.core.settings import settings


class JikanClient:
    def __init__(self, base_url: str | None = None) -> None:
        self.base_url = base_url or settings.jikan_base_url

    async def search_anime(self, q: str, page: int = 1, limit: int = 12) -> Dict[str, Any]:
        params = {"q": q, "page": page, "limit": limit}
        async with httpx.AsyncClient(timeout=15.0) as client:
            r = await client.get(f"{self.base_url}/anime", params=params)
            r.raise_for_status()
            return r.json()

    async def get_anime(self, mal_id: int) -> Dict[str, Any]:
        async with httpx.AsyncClient(timeout=15.0) as client:
            r = await client.get(f"{self.base_url}/anime/{mal_id}/full")
            r.raise_for_status()
            return r.json()

    async def top_anime(self, page: int = 1, limit: int = 12, filter_: Optional[str] = None) -> Dict[str, Any]:
        params: Dict[str, Any] = {"page": page, "limit": limit}
        if filter_:
            params["filter"] = filter_
        async with httpx.AsyncClient(timeout=15.0) as client:
            r = await client.get(f"{self.base_url}/top/anime", params=params)
            r.raise_for_status()
            return r.json()
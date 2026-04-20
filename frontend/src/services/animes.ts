import { api } from "../api/client";
import type { AnimeListItem, AnimeSearchResponse } from "../types/anime";

export async function getTopAnimes(page = 1, limit = 12): Promise<AnimeSearchResponse> {
  const response = await api.get("/animes/top/list", {
    params: { page, limit },
  });

  return response.data;
}

export async function searchAnimes(
  q: string,
  page = 1,
  limit = 12,
): Promise<AnimeSearchResponse> {
  const response = await api.get("/animes/search", {
    params: { q, page, limit },
  });

  return response.data;
}

export async function getAnimeDetail(
  id: number,
): Promise<{ anime: AnimeListItem; cacheStatus?: string }> {
  const response = await api.get(`/animes/${id}`);
  return {
    anime: response.data,
    cacheStatus: response.headers["x-cache"],
  };
}
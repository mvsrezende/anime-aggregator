import { api } from "../api/client";
import type { AnimeListItem, Favorite } from "../types/anime";

export async function listFavorites(): Promise<Favorite[]> {
  const response = await api.get("/favorites");
  return response.data;
}

export async function createFavorite(anime: AnimeListItem): Promise<Favorite> {
  const response = await api.post("/favorites", {
    anime_id: anime.id,
    anime_source: anime.source,
    title: anime.title,
    title_japanese: anime.title_japanese,
    image: anime.image,
    score: anime.score,
    anime_url: anime.url,
  });

  return response.data;
}

export async function deleteFavorite(favoriteId: number): Promise<void> {
  await api.delete(`/favorites/${favoriteId}`);
}
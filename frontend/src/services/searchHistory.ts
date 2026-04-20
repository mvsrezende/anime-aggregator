import { api } from "../api/client";
import type { SearchHistoryItem } from "../types/anime";

export async function listSearchHistory(limit = 20): Promise<SearchHistoryItem[]> {
  const response = await api.get("/search-history", {
    params: { limit },
  });

  return response.data;
}

export async function deleteSearchHistoryItem(historyId: number): Promise<void> {
  await api.delete(`/search-history/${historyId}`);
}
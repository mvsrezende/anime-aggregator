export interface AnimeListItem {
  source: string;
  id: number;
  title: string;
  title_japanese?: string | null;
  url?: string | null;
  image?: string | null;
  score?: number | null;
  year?: number | null;
  episodes?: number | null;
  status?: string | null;
  synopsis?: string | null;
  genres: string[];
}

export interface PageMeta {
  page: number;
  per_page: number;
  has_next_page: boolean;
}

export interface AnimeSearchResponse {
  meta: PageMeta;
  items: AnimeListItem[];
}

export interface Favorite {
  id: number;
  user_id: number;
  anime_id: number;
  anime_source: string;
  title: string;
  title_japanese?: string | null;
  image?: string | null;
  score?: number | null;
  anime_url?: string | null;
  created_at: string;
}

export interface SearchHistoryItem {
  id: number;
  user_id: number;
  query: string;
  created_at: string;
}
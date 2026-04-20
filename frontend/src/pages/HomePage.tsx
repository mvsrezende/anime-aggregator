import { useEffect, useState } from "react";
import { AnimeCard } from "../components/AnimeCard";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { Loading } from "../components/Loading";
import { getTopAnimes } from "../services/animes";
import type { AnimeListItem } from "../types/anime";

export function HomePage() {
  const [items, setItems] = useState<AnimeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getTopAnimes(1, 12);
        setItems(data.items);
      } catch {
        setError("Não foi possível carregar os top animes.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;
  if (!items.length) return <EmptyState message="Nenhum anime encontrado." />;

  return (
    <section>
      <h1>Top Animes</h1>
      <div className="grid">
        {items.map((anime) => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>
    </section>
  );
}
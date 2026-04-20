import { useEffect, useState } from "react";
import { AnimeCard } from "../components/AnimeCard";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { Loading } from "../components/Loading";
import { deleteFavorite, listFavorites } from "../services/favorites";
import type { Favorite } from "../types/anime";

export function FavoritesPage() {
  const [items, setItems] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadFavorites() {
    try {
      setLoading(true);
      setError("");
      const data = await listFavorites();
      setItems(data);
    } catch {
      setError("Não foi possível carregar os favoritos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFavorites();
  }, []);

  async function handleRemove(favoriteId: number) {
    try {
      await deleteFavorite(favoriteId);
      setItems((current) => current.filter((item) => item.id !== favoriteId));
    } catch {
      setError("Não foi possível remover o favorito.");
    }
  }

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;
  if (!items.length) return <EmptyState message="Você ainda não possui favoritos." />;

  return (
    <section>
      <h1>Favoritos</h1>

      <div className="grid">
        {items.map((favorite) => (
          <div key={favorite.id}>
            <AnimeCard anime={favorite} />
            <button
              className="button danger full"
              onClick={() => handleRemove(favorite.id)}
            >
              Remover
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
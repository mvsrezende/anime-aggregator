import { useEffect, useState } from "react";
import { AnimeCard } from "../components/AnimeCard";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { Loading } from "../components/Loading";
import { StatusAlert } from "../components/StatusAlert";
import { deleteFavorite, listFavorites } from "../services/favorites";
import type { Favorite } from "../types/anime";

type ActionFeedback = {
  type: "success" | "error";
  message: string;
} | null;

export function FavoritesPage() {
  const [items, setItems] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<ActionFeedback>(null);

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

  async function handleRemove(favoriteId: number, title: string) {
    try {
      setRemovingId(favoriteId);
      setFeedback(null);
      await deleteFavorite(favoriteId);
      setItems((current) => current.filter((item) => item.id !== favoriteId));
      setFeedback({
        type: "success",
        message: `"${title}" foi removido dos favoritos.`,
      });
    } catch {
      setFeedback({
        type: "error",
        message: "Não foi possível remover o favorito.",
      });
    } finally {
      setRemovingId(null);
    }
  }

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;

  return (
    <section>
      <h1>Favoritos</h1>

      {feedback && (
        <StatusAlert variant={feedback.type} message={feedback.message} />
      )}

      {!items.length ? (
        <EmptyState message="Você ainda não possui favoritos." />
      ) : (
        <div className="grid">
          {items.map((favorite) => (
            <div key={favorite.id}>
              <AnimeCard anime={favorite} />
              <button
                className="button danger full"
                onClick={() => handleRemove(favorite.id, favorite.title)}
                disabled={removingId === favorite.id}
              >
                {removingId === favorite.id ? "Removendo..." : "Remover"}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
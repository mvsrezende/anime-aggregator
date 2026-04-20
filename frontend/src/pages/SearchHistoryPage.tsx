import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { Loading } from "../components/Loading";
import { deleteSearchHistoryItem, listSearchHistory } from "../services/searchHistory";
import type { SearchHistoryItem } from "../types/anime";

export function SearchHistoryPage() {
  const [items, setItems] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadHistory() {
    try {
      setLoading(true);
      setError("");
      const data = await listSearchHistory(20);
      setItems(data);
    } catch {
      setError("Não foi possível carregar o histórico de buscas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  async function handleDelete(historyId: number) {
    try {
      await deleteSearchHistoryItem(historyId);
      setItems((current) => current.filter((item) => item.id !== historyId));
    } catch {
      setError("Não foi possível remover o item do histórico.");
    }
  }

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;
  if (!items.length) return <EmptyState message="Nenhum histórico de busca encontrado." />;

  return (
    <section>
      <h1>Histórico de Busca</h1>

      <div className="list">
        {items.map((item) => (
          <div className="list-item" key={item.id}>
            <div>
              <strong>{item.query}</strong>
              <p>{new Date(item.created_at).toLocaleString("pt-BR")}</p>
            </div>

            <div className="actions">
              <Link className="button secondary" to={`/search?q=${encodeURIComponent(item.query)}&page=1`}>
                Buscar novamente
              </Link>
              <button className="button danger" onClick={() => handleDelete(item.id)}>
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
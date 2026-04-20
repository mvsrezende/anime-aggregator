import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimeCard } from "../components/AnimeCard";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { Loading } from "../components/Loading";
import { SearchBar } from "../components/SearchBar";
import { searchAnimes } from "../services/animes";
import type { AnimeListItem } from "../types/anime";

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const page = Number(searchParams.get("page") ?? "1");

  const [items, setItems] = useState<AnimeListItem[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) return;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await searchAnimes(query, page, 12);
        setItems(data.items);
        setHasNextPage(data.meta.has_next_page);
      } catch {
        setError("Não foi possível realizar a busca.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [query, page]);

  function handleSearch(newQuery: string) {
    setSearchParams({ q: newQuery, page: "1" });
  }

  function goToPage(nextPage: number) {
    setSearchParams({ q: query, page: String(nextPage) });
  }

  return (
    <section>
      <h1>Busca de Animes</h1>
      <SearchBar initialValue={query} onSearch={handleSearch} />

      {!query && <EmptyState message="Digite um termo para buscar animes." />}
      {loading && <Loading />}
      {error && <ErrorState message={error} />}

      {!loading && !error && query && items.length > 0 && (
        <>
          <div className="grid">
            {items.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>

          <div className="pagination">
            <button
              className="button secondary"
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}
            >
              Anterior
            </button>

            <span>Página {page}</span>

            <button
              className="button secondary"
              disabled={!hasNextPage}
              onClick={() => goToPage(page + 1)}
            >
              Próxima
            </button>
          </div>
        </>
      )}

      {!loading && !error && query && items.length === 0 && (
        <EmptyState message="Nenhum anime encontrado para essa busca." />
      )}
    </section>
  );
}
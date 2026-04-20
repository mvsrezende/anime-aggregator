import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { Loading } from "../components/Loading";
import { getAnimeDetail } from "../services/animes";
import { createFavorite } from "../services/favorites";
import type { AnimeListItem } from "../types/anime";

export function AnimeDetailPage() {
  const { id } = useParams();
  const animeId = Number(id);

  const [anime, setAnime] = useState<AnimeListItem | null>(null);
  const [cacheStatus, setCacheStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favoriteMessage, setFavoriteMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await getAnimeDetail(animeId);
        setAnime(data.anime);
        setCacheStatus(data.cacheStatus ?? "");
      } catch {
        setError("Não foi possível carregar os detalhes do anime.");
      } finally {
        setLoading(false);
      }
    }

    if (!Number.isNaN(animeId)) {
      load();
    }
  }, [animeId]);

  async function handleFavorite() {
    if (!anime) return;

    try {
      await createFavorite(anime);
      setFavoriteMessage("Anime adicionado aos favoritos com sucesso.");
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      setFavoriteMessage(detail ?? "Não foi possível adicionar aos favoritos.");
    }
  }

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;
  if (!anime) return <EmptyState message="Anime não encontrado." />;

  return (
    <section className="detail">
      <div className="detail-image-wrapper">
        {anime.image ? (
          <img src={anime.image} alt={anime.title} className="detail-image" />
        ) : (
          <div className="detail-image placeholder">Sem imagem</div>
        )}
      </div>

      <div className="detail-content">
        <h1>{anime.title}</h1>
        {anime.title_japanese && <p><strong>Título japonês:</strong> {anime.title_japanese}</p>}
        {anime.score && <p><strong>Score:</strong> {anime.score}</p>}
        {anime.year && <p><strong>Ano:</strong> {anime.year}</p>}
        {anime.episodes && <p><strong>Episódios:</strong> {anime.episodes}</p>}
        {anime.status && <p><strong>Status:</strong> {anime.status}</p>}
        {cacheStatus && <p><strong>Cache:</strong> {cacheStatus}</p>}

        {anime.genres.length > 0 && (
          <p>
            <strong>Gêneros:</strong> {anime.genres.join(", ")}
          </p>
        )}

        {anime.synopsis && (
          <div>
            <strong>Sinopse:</strong>
            <p>{anime.synopsis}</p>
          </div>
        )}

        <div className="actions">
          <button className="button" onClick={handleFavorite}>
            Adicionar aos favoritos
          </button>

          {anime.url && (
            <a className="button secondary" href={anime.url} target="_blank" rel="noreferrer">
              Ver no MyAnimeList
            </a>
          )}
        </div>

        {favoriteMessage && <p className="feedback">{favoriteMessage}</p>}
      </div>
    </section>
  );
}
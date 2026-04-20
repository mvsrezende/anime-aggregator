import { Link } from "react-router-dom";
import type { AnimeListItem, Favorite } from "../types/anime";

type AnimeCardProps = {
  anime: AnimeListItem | Favorite;
};

export function AnimeCard({ anime }: AnimeCardProps) {
  const animeId = "anime_id" in anime ? anime.anime_id : anime.id;
  const image = anime.image ?? "";
  const score = anime.score ?? "N/A";

  return (
    <article className="card">
      <Link to={`/anime/${animeId}`} className="card-image-link">
        {image ? (
          <img src={image} alt={anime.title} className="card-image" />
        ) : (
          <div className="card-image placeholder">Sem imagem</div>
        )}
      </Link>

      <div className="card-body">
        <h3 className="card-title">
          <Link to={`/anime/${animeId}`}>{anime.title}</Link>
        </h3>

        <p className="card-score">⭐ Score: {score}</p>
      </div>
    </article>
  );
}
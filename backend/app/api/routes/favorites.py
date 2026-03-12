from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.api.deps import DbSession, get_current_user
from app.models.favorite import FavoriteAnime
from app.models.user import User
from app.schemas.favorite import FavoriteCreate, FavoriteResponse

router = APIRouter(prefix="/favorites", tags=["favorites"])


@router.post("", response_model=FavoriteResponse, status_code=status.HTTP_201_CREATED)
def create_favorite(
    payload: FavoriteCreate,
    db: DbSession,
    current_user: User = Depends(get_current_user),
):
    favorite = FavoriteAnime(
        user_id=current_user.id,
        anime_id=payload.anime_id,
        anime_source=payload.anime_source,
        title=payload.title,
        title_japanese=payload.title_japanese,
        image=payload.image,
        score=payload.score,
        anime_url=payload.anime_url,
    )

    db.add(favorite)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Anime já está favoritado para este usuário.",
        )

    db.refresh(favorite)
    return favorite


@router.get("", response_model=list[FavoriteResponse])
def list_favorites(
    db: DbSession,
    current_user: User = Depends(get_current_user),
):
    favorites = db.scalars(
        select(FavoriteAnime)
        .where(FavoriteAnime.user_id == current_user.id)
        .order_by(FavoriteAnime.created_at.desc())
    ).all()

    return list(favorites)


@router.delete("/{favorite_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_favorite(
    favorite_id: int,
    db: DbSession,
    current_user: User = Depends(get_current_user),
):
    favorite = db.scalar(
        select(FavoriteAnime).where(
            FavoriteAnime.id == favorite_id,
            FavoriteAnime.user_id == current_user.id,
        )
    )

    if not favorite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Favorito não encontrado.",
        )

    db.delete(favorite)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)
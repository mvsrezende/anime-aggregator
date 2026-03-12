from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import select

from app.api.deps import DbSession, get_current_user
from app.models.search_history import SearchHistory
from app.models.user import User
from app.schemas.search_history import SearchHistoryResponse

router = APIRouter(prefix="/search-history", tags=["search-history"])


@router.get("", response_model=list[SearchHistoryResponse])
def list_search_history(
    db: DbSession,
    current_user: User = Depends(get_current_user),
    limit: int = Query(default=20, ge=1, le=100),
):
    history = db.scalars(
        select(SearchHistory)
        .where(SearchHistory.user_id == current_user.id)
        .order_by(SearchHistory.created_at.desc())
        .limit(limit)
    ).all()

    return list(history)


@router.delete("/{history_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_search_history_item(
    history_id: int,
    db: DbSession,
    current_user: User = Depends(get_current_user),
):
    history_item = db.scalar(
        select(SearchHistory).where(
            SearchHistory.id == history_id,
            SearchHistory.user_id == current_user.id,
        )
    )

    if not history_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item do histórico não encontrado.",
        )

    db.delete(history_item)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)
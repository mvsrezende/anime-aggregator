from typing import Annotated

from fastapi import Depends, Header
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.settings import settings
from app.database.session import get_db
from app.models.user import User


DbSession = Annotated[Session, Depends(get_db)]


def get_current_user(
    db: DbSession,
    x_user_email: Annotated[str | None, Header(alias="X-User-Email")] = None,
) -> User:
    email = x_user_email or settings.default_user_email

    user = db.scalar(select(User).where(User.email == email))
    if user:
        return user

    user = User(email=email)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
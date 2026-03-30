from datetime import datetime, timezone
from typing import Any

from sqlalchemy import DateTime, Float, Integer, JSON, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class AnimeCache(Base):
    __tablename__ = "anime_cache"
    __table_args__ = (
        UniqueConstraint("source", "anime_id", name="uq_anime_cache_source_anime"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    source: Mapped[str] = mapped_column(String(50), nullable=False, default="jikan")
    anime_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    title_japanese: Mapped[str | None] = mapped_column(String(255), nullable=True)
    image: Mapped[str | None] = mapped_column(String(500), nullable=True)
    score: Mapped[float | None] = mapped_column(Float, nullable=True)
    synopsis: Mapped[str | None] = mapped_column(String, nullable=True)
    anime_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    payload_json: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)

    cached_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        index=True,
    )
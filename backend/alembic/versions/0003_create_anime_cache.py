"""create anime_cache table

Revision ID: 0003_create_anime_cache
Revises: 0002_create_search_history
Create Date: 2026-03-12 01:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0003_create_anime_cache"
down_revision: Union[str, None] = "0002_create_search_history"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "anime_cache",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("source", sa.String(length=50), nullable=False),
        sa.Column("anime_id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("title_japanese", sa.String(length=255), nullable=True),
        sa.Column("image", sa.String(length=500), nullable=True),
        sa.Column("score", sa.Float(), nullable=True),
        sa.Column("synopsis", sa.String(), nullable=True),
        sa.Column("anime_url", sa.String(length=500), nullable=True),
        sa.Column("payload_json", sa.JSON(), nullable=False),
        sa.Column("cached_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("source", "anime_id", name="uq_anime_cache_source_anime"),
    )
    op.create_index("ix_anime_cache_id", "anime_cache", ["id"], unique=False)
    op.create_index("ix_anime_cache_anime_id", "anime_cache", ["anime_id"], unique=False)
    op.create_index("ix_anime_cache_expires_at", "anime_cache", ["expires_at"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_anime_cache_expires_at", table_name="anime_cache")
    op.drop_index("ix_anime_cache_anime_id", table_name="anime_cache")
    op.drop_index("ix_anime_cache_id", table_name="anime_cache")
    op.drop_table("anime_cache")
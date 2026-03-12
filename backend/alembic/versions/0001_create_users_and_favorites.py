"""create users and favorites tables

Revision ID: 0001_create_users_and_favorites
Revises:
Create Date: 2026-03-12 00:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "0001_create_users_and_favorites"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_users_id", "users", ["id"], unique=False)
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "favorite_animes",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("anime_source", sa.String(length=50), nullable=False),
        sa.Column("anime_id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("title_japanese", sa.String(length=255), nullable=True),
        sa.Column("image", sa.String(length=500), nullable=True),
        sa.Column("score", sa.Float(), nullable=True),
        sa.Column("anime_url", sa.String(length=500), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("user_id", "anime_source", "anime_id", name="uq_user_anime_favorite"),
    )
    op.create_index("ix_favorite_animes_id", "favorite_animes", ["id"], unique=False)
    op.create_index("ix_favorite_animes_user_id", "favorite_animes", ["user_id"], unique=False)
    op.create_index("ix_favorite_animes_anime_id", "favorite_animes", ["anime_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_favorite_animes_anime_id", table_name="favorite_animes")
    op.drop_index("ix_favorite_animes_user_id", table_name="favorite_animes")
    op.drop_index("ix_favorite_animes_id", table_name="favorite_animes")
    op.drop_table("favorite_animes")

    op.drop_index("ix_users_email", table_name="users")
    op.drop_index("ix_users_id", table_name="users")
    op.drop_table("users")
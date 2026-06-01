"""add password_hash to users

Revision ID: 0004_add_password_hash_to_users
Revises: 0003_create_anime_cache
Create Date: 2026-03-12 02:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0004_add_password_hash_to_users"
down_revision: Union[str, None] = "0003_create_anime_cache"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("password_hash", sa.String(length=255), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("users", "password_hash")
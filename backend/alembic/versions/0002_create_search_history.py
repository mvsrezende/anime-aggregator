"""create search_history table

Revision ID: 0002_create_search_history
Revises: 0001_create_users_and_favorites
Create Date: 2026-03-12 00:30:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0002_create_search_history"
down_revision: Union[str, None] = "0001_create_users_and_favorites"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "search_history",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("query", sa.String(length=255), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_search_history_id", "search_history", ["id"], unique=False)
    op.create_index("ix_search_history_user_id", "search_history", ["user_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_search_history_user_id", table_name="search_history")
    op.drop_index("ix_search_history_id", table_name="search_history")
    op.drop_table("search_history")
"""add_mau_sac_to_chitietgiohang

Revision ID: 90db450c1e59
Revises: f19ce69bf2ef
Create Date: 2026-02-03 10:30:39.098354

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '90db450c1e59'
down_revision: Union[str, Sequence[str], None] = 'f19ce69bf2ef'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('chitietgiohang', sa.Column('mau_sac', sa.String(length=50), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('chitietgiohang', 'mau_sac')

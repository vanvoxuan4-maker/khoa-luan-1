"""add phi_ship to donhang

Revision ID: 9e36484899b5
Revises: add_vnpay_fields
Create Date: 2026-02-28 21:26:28.227483

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9e36484899b5'
down_revision: Union[str, Sequence[str], None] = 'add_vnpay_fields'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('donhang', sa.Column('phi_ship', sa.Float(), nullable=True, server_default='0.0'))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('donhang', 'phi_ship')

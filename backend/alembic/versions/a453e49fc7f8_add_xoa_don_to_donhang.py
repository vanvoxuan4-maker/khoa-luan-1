"""add_xoa_don_to_donhang

Revision ID: a453e49fc7f8
Revises: 9e36484899b5
Create Date: 2026-03-02 23:13:47.651676

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a453e49fc7f8'
down_revision: Union[str, Sequence[str], None] = '9e36484899b5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Thêm cột xoa_don vào bảng donhang (soft delete cho user)."""
    op.add_column(
        'donhang',
        sa.Column('xoa_don', sa.Boolean(), nullable=False, server_default='false')
    )


def downgrade() -> None:
    """Xóa cột xoa_don khỏi bảng donhang."""
    op.drop_column('donhang', 'xoa_don')

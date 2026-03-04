"""add transaction fields to thanhtoan

Revision ID: add_vnpay_fields
Revises: 
Create Date: 2026-02-04 18:15:00

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_vnpay_fields'
down_revision = '90db450c1e59'  # Previous migration
branch_labels = None
depends_on = None


def upgrade():
    # Add transaction_id column
    op.add_column('thanhtoan', 
        sa.Column('transaction_id', sa.String(length=100), nullable=True)
    )
    
    # Add bank_code column
    op.add_column('thanhtoan', 
        sa.Column('bank_code', sa.String(length=50), nullable=True)
    )


def downgrade():
    # Remove columns if rolling back
    op.drop_column('thanhtoan', 'bank_code')
    op.drop_column('thanhtoan', 'transaction_id')

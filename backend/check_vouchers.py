import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.marketing import Makhuyenmai
from app.core.config import settings

def check_db():
    print(f"Connecting to: {settings.SQLALCHEMY_DATABASE_URL}")
    engine = create_engine(settings.SQLALCHEMY_DATABASE_URL)
    Session = sessionmaker(bind=engine)
    db = Session()
    try:
        vs = db.query(Makhuyenmai).all()
        print(f"Total Vouchers: {len(vs)}")
        for v in vs:
            print(f"- ID: {v.ma_khuyenmai}, Code: {v.ma_giamgia}, Value: {v.giatrigiam}, Active: {v.is_active}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_db()

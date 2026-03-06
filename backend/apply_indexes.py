from sqlalchemy import text
from app.db.session import SessionLocal

def apply_indexes():
    db = SessionLocal()
    try:
        print("Đang khởi tạo các index mới cho bảng 'donhang'...")
        
        # 1. Index cho ma_user
        db.execute(text("CREATE INDEX IF NOT EXISTS ix_donhang_user ON donhang (ma_user);"))
        
        # 2. Index cho trang_thai
        db.execute(text("CREATE INDEX IF NOT EXISTS ix_donhang_status ON donhang (trang_thai);"))
        
        # 3. Index cho ngay_dat
        db.execute(text("CREATE INDEX IF NOT EXISTS ix_donhang_date ON donhang (ngay_dat);"))
        
        # 4. Composite Index cho ma_user và trang_thai (cho query lọc đơn của user theo trạng thái)
        db.execute(text("CREATE INDEX IF NOT EXISTS ix_donhang_user_status ON donhang (ma_user, trang_thai);"))
        
        db.commit()
        print("✅ Đã tạo thành công 4 index cho bảng 'donhang'.")
    except Exception as e:
        print(f"❌ Lỗi khi tạo index: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    apply_indexes()

# backend/app/db/migrate_addresses.py

import os
import sys

# Thêm thư mục gốc vào path để có thể import các module của app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from sqlalchemy import text
from app.db.session import engine, SessionLocal

def migrate_addresses():
    db = SessionLocal()
    try:
        print("🚀 Bắt đầu quá trình di cư dữ liệu địa chỉ (Sử dụng Raw SQL)...")
        
        # 1. Lấy dữ liệu cũ từ bảng users
        # ma_user, hovaten, ten_user, sdt, diachi
        query_users = text("SELECT ma_user, hovaten, ten_user, sdt, diachi FROM users WHERE diachi IS NOT NULL AND diachi != ''")
        result = db.execute(query_users).fetchall()

        if not result:
            print("ℹ️ Không tìm thấy địa chỉ cũ nào cần di cư.")
            return

        print(f"📦 Tìm thấy {len(result)} người dùng có địa chỉ cũ. Đang xử lý...")

        count = 0
        for row in result:
            ma_user, hovaten, ten_user, sdt, diachi_cu = row
            
            # Kiểm tra xem user này đã có bản ghi trong bảng dia_chi chưa
            check_query = text("SELECT 1 FROM dia_chi WHERE ma_user = :ma_user LIMIT 1")
            exists = db.execute(check_query, {"ma_user": ma_user}).fetchone()
            
            if exists:
                print(f"⏭️ User #{ma_user} ({ten_user}) đã có địa chỉ trong bảng mới. Bỏ qua.")
                continue

            # Insert vào bảng dia_chi
            insert_query = text("""
                INSERT INTO dia_chi (ma_user, ten_nguoi_nhan, sdt_nguoi_nhan, dia_chi, tinh_thanh, is_mac_dinh, ngay_tao, cap_nhat_ngay)
                VALUES (:ma_user, :ten_nguoi_nhan, :sdt_nguoi_nhan, :dia_chi, :tinh_thanh, :is_mac_dinh, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            """)
            
            db.execute(insert_query, {
                "ma_user": ma_user,
                "ten_nguoi_nhan": hovaten or ten_user,
                "sdt_nguoi_nhan": sdt or "0000000000",
                "dia_chi": diachi_cu,
                "tinh_thanh": "Chưa cập nhật",
                "is_mac_dinh": True
            })
            count += 1
            print(f"✅ Đã chuyển địa chỉ cho User #{ma_user} ({ten_user})")
        
        db.commit()
        print(f"🎉 HOÀN TẤT! Đã di cư thành công {count} bản ghi địa chỉ.")
        
    except Exception as e:
        db.rollback()
        print(f"💥 Lỗi nghiêm trọng: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    migrate_addresses()

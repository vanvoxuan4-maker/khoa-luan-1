-- ==========================================
-- 1. TẠO TẤT CẢ ENUM TYPES (Idempotent)
-- ==========================================
DO $$ BEGIN
    -- Quyền người dùng
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quyen') THEN
        CREATE TYPE quyen AS ENUM ('customer', 'admin');
    END IF;
    -- Trạng thái người dùng
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'trang_thai_user') THEN
        CREATE TYPE trang_thai_user AS ENUM ('active', 'inactive', 'banned');
    END IF;
    -- Trạng thái đơn hàng
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'trang_thai_order') THEN
        CREATE TYPE trang_thai_order AS ENUM ('pending', 'confirmed', 'shipping', 'completed', 'cancelled');
    END IF;
    -- Trạng thái thanh toán
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'trang_thai_payment') THEN
        CREATE TYPE trang_thai_payment AS ENUM ('pending', 'paid', 'failed');
    END IF;
    -- Phương thức thanh toán
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'phuong_thuc_payment') THEN
        CREATE TYPE phuong_thuc_payment AS ENUM ('cod', 'banking', 'credit_card');
    END IF;
    -- Trạng thái đánh giá
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'trang_thai_review') THEN
        CREATE TYPE trang_thai_review AS ENUM ('pending', 'approved', 'rejected');
    END IF;
    -- Kiểu giảm giá
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'kieu_giam_gia') THEN
        CREATE TYPE kieu_giam_gia AS ENUM ('percentage', 'fixed_amount');
    END IF;
    -- Chi tiết trạng thái thanh toán
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'chitiet_thanhtoan') THEN
        CREATE TYPE chitiet_thanhtoan AS ENUM ('pending', 'success', 'failed', 'refunded');
    END IF;
END $$;

-- ==========================================
-- 2. RÀNG BUỘC KIỂM TRA & TRIGGER (An toàn)
-- ==========================================
CREATE OR REPLACE FUNCTION update_inventory_after_checkout()
RETURNS TRIGGER AS $$
DECLARE
    current_stock INTEGER;
BEGIN
    SELECT ton_kho INTO current_stock FROM sanpham WHERE ma_sanpham = NEW.ma_sanpham FOR UPDATE;
    IF current_stock < NEW.so_luong THEN
        RAISE EXCEPTION 'Sản phẩm ID % không đủ tồn kho (Cần %, Hiện có %)', NEW.ma_sanpham, NEW.so_luong, current_stock;
    END IF;
    UPDATE sanpham SET ton_kho = ton_kho - NEW.so_luong WHERE ma_sanpham = NEW.ma_sanpham;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
    -- Chỉ tạo Constraint nếu bảng sanpham đã tồn tại
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sanpham') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.constraint_column_usage WHERE constraint_name = 'chk_ton_kho_nonnegative') THEN
            ALTER TABLE sanpham ADD CONSTRAINT chk_ton_kho_nonnegative CHECK (ton_kho >= 0);
        END IF;
    END IF;

    -- Chỉ tạo Trigger/Index nếu bảng chitietdonhang đã tồn tại
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chitietdonhang') THEN
        DROP TRIGGER IF EXISTS trg_update_inventory ON chitietdonhang;
        CREATE TRIGGER trg_update_inventory BEFORE INSERT ON chitietdonhang FOR EACH ROW EXECUTE FUNCTION update_inventory_after_checkout();
        
        IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'idx_chitietdonhang_sanpham') THEN
            CREATE INDEX idx_chitietdonhang_sanpham ON chitietdonhang(ma_sanpham);
        END IF;
    END IF;
END $$;
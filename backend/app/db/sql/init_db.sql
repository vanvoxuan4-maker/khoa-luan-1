-- =============================================================================
-- ĐỒ ÁN THỰC TẬP TỐT NGHIỆP
-- HỆ THỐNG QUẢN LÝ CỬA HÀNG XE ĐẠP
-- FILE: init_db.sql (truy xuất từ cơ sở dữ liệu PostgreSQL)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- PHẦN 1: CẤU HÌNH MÔI TRƯỜNG & HỆ THỐNG
-- -----------------------------------------------------------------------------

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- -----------------------------------------------------------------------------
-- PHẦN 2: DỌN DẸP CƠ SỞ DỮ LIỆU CŨ (CLEANUP & DROP)
-- Lưu ý: Phần này giúp dọn dẹp các ràng buộc và bảng cũ để tránh lỗi khi chạy lại file.
-- Nếu cài đặt mới lần đầu trên database trống, các lệnh này sẽ tự động được bỏ qua.
-- -----------------------------------------------------------------------------

ALTER TABLE IF EXISTS ONLY public.thanhtoan DROP CONSTRAINT IF EXISTS thanhtoan_ma_don_hang_fkey;
ALTER TABLE IF EXISTS ONLY public.sanpham DROP CONSTRAINT IF EXISTS sanpham_ma_thuonghieu_fkey;
ALTER TABLE IF EXISTS ONLY public.sanpham DROP CONSTRAINT IF EXISTS sanpham_ma_danhmuc_fkey;
ALTER TABLE IF EXISTS ONLY public.lichsuchat DROP CONSTRAINT IF EXISTS lichsuchat_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.hinhanh DROP CONSTRAINT IF EXISTS hinhanh_ma_sanpham_fkey;
ALTER TABLE IF EXISTS ONLY public.giohang DROP CONSTRAINT IF EXISTS giohang_ma_user_fkey;
ALTER TABLE IF EXISTS ONLY public.lichsu_donhang DROP CONSTRAINT IF EXISTS fk_don_hang;
ALTER TABLE IF EXISTS ONLY public.dsyeuthich DROP CONSTRAINT IF EXISTS dsyeuthich_ma_user_fkey;
ALTER TABLE IF EXISTS ONLY public.dsyeuthich DROP CONSTRAINT IF EXISTS dsyeuthich_ma_sanpham_fkey;
ALTER TABLE IF EXISTS ONLY public.donhang DROP CONSTRAINT IF EXISTS donhang_ma_user_fkey;
ALTER TABLE IF EXISTS ONLY public.donhang DROP CONSTRAINT IF EXISTS donhang_ma_khuyenmai_fkey;
ALTER TABLE IF EXISTS ONLY public.dia_chi DROP CONSTRAINT IF EXISTS dia_chi_ma_user_fkey;
ALTER TABLE IF EXISTS ONLY public.danhgia DROP CONSTRAINT IF EXISTS danhgia_ma_user_fkey;
ALTER TABLE IF EXISTS ONLY public.danhgia DROP CONSTRAINT IF EXISTS danhgia_ma_sanpham_fkey;
ALTER TABLE IF EXISTS ONLY public.chitietgiohang DROP CONSTRAINT IF EXISTS chitietgiohang_ma_sanpham_fkey;
ALTER TABLE IF EXISTS ONLY public.chitietgiohang DROP CONSTRAINT IF EXISTS chitietgiohang_ma_gio_fkey;
ALTER TABLE IF EXISTS ONLY public.chitietdonhang DROP CONSTRAINT IF EXISTS chitietdonhang_ma_sanpham_fkey;
ALTER TABLE IF EXISTS ONLY public.chitietdonhang DROP CONSTRAINT IF EXISTS chitietdonhang_ma_don_hang_fkey;
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_ma_nguoidung_fkey;
DROP TRIGGER IF EXISTS users_cap_nhat_ngay_trigger ON public.users;
DROP TRIGGER IF EXISTS trigger_update_diem_danh_gia ON public.danhgia;
DROP TRIGGER IF EXISTS trg_update_inventory ON public.chitietdonhang;
DROP INDEX IF EXISTS public.ix_users_ma_user;
DROP INDEX IF EXISTS public.ix_users_email;
DROP INDEX IF EXISTS public.ix_thuonghieu_ma_thuonghieu;
DROP INDEX IF EXISTS public.ix_thanhtoan_ma_thanhtoan;
DROP INDEX IF EXISTS public.ix_sanpham_ngay_lap;
DROP INDEX IF EXISTS public.ix_sanpham_ma_thuonghieu;
DROP INDEX IF EXISTS public.ix_sanpham_ma_sanpham;
DROP INDEX IF EXISTS public.ix_sanpham_ma_danhmuc;
DROP INDEX IF EXISTS public.ix_sanpham_is_active;
DROP INDEX IF EXISTS public.ix_ma_khuyenmai_ma_khuyenmai;
DROP INDEX IF EXISTS public.ix_lichsuchat_id_chat;
DROP INDEX IF EXISTS public.ix_hinhanh_ma_anh;
DROP INDEX IF EXISTS public.ix_giohang_ma_gio;
DROP INDEX IF EXISTS public.ix_dsyeuthich_ma_dsyeuthich;
DROP INDEX IF EXISTS public.ix_donhang_user_status;
DROP INDEX IF EXISTS public.ix_donhang_user;
DROP INDEX IF EXISTS public.ix_donhang_status;
DROP INDEX IF EXISTS public.ix_donhang_ma_don_hang;
DROP INDEX IF EXISTS public.ix_donhang_date;
DROP INDEX IF EXISTS public.ix_dia_chi_ma_dia_chi;
DROP INDEX IF EXISTS public.ix_danhmuc_ma_danhmuc;
DROP INDEX IF EXISTS public.ix_danhgia_ma_danhgia;
DROP INDEX IF EXISTS public.ix_chitietgiohang_ma_ctgh;
DROP INDEX IF EXISTS public.ix_chitietdonhang_ma_ctdh;
DROP INDEX IF EXISTS public.ix_audit_logs_timestamp;
DROP INDEX IF EXISTS public.ix_audit_logs_resource_type;
DROP INDEX IF EXISTS public.ix_audit_logs_ma_nguoidung;
DROP INDEX IF EXISTS public.ix_audit_logs_ma_log;
DROP INDEX IF EXISTS public.ix_audit_logs_action;
DROP INDEX IF EXISTS public.idx_chitietdonhang_sanpham;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_ten_user_key;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS unique_sdt;
ALTER TABLE IF EXISTS ONLY public.thuonghieu DROP CONSTRAINT IF EXISTS thuonghieu_ten_thuonghieu_key;
ALTER TABLE IF EXISTS ONLY public.thuonghieu DROP CONSTRAINT IF EXISTS thuonghieu_pkey;
ALTER TABLE IF EXISTS ONLY public.thanhtoan DROP CONSTRAINT IF EXISTS thanhtoan_pkey;
ALTER TABLE IF EXISTS ONLY public.sanpham DROP CONSTRAINT IF EXISTS sanpham_sanpham_code_key;
ALTER TABLE IF EXISTS ONLY public.sanpham DROP CONSTRAINT IF EXISTS sanpham_pkey;
ALTER TABLE IF EXISTS ONLY public.ma_khuyenmai DROP CONSTRAINT IF EXISTS ma_khuyenmai_pkey;
ALTER TABLE IF EXISTS ONLY public.ma_khuyenmai DROP CONSTRAINT IF EXISTS ma_khuyenmai_ma_giamgia_key;
ALTER TABLE IF EXISTS ONLY public.lichsuchat DROP CONSTRAINT IF EXISTS lichsuchat_pkey;
ALTER TABLE IF EXISTS ONLY public.lichsu_donhang DROP CONSTRAINT IF EXISTS lichsu_donhang_pkey;
ALTER TABLE IF EXISTS ONLY public.hinhanh DROP CONSTRAINT IF EXISTS hinhanh_pkey;
ALTER TABLE IF EXISTS ONLY public.giohang DROP CONSTRAINT IF EXISTS giohang_pkey;
ALTER TABLE IF EXISTS ONLY public.giohang DROP CONSTRAINT IF EXISTS giohang_ma_user_key;
ALTER TABLE IF EXISTS ONLY public.dsyeuthich DROP CONSTRAINT IF EXISTS dsyeuthich_pkey;
ALTER TABLE IF EXISTS ONLY public.donhang DROP CONSTRAINT IF EXISTS donhang_pkey;
ALTER TABLE IF EXISTS ONLY public.dia_chi DROP CONSTRAINT IF EXISTS dia_chi_pkey;
ALTER TABLE IF EXISTS ONLY public.danhmuc DROP CONSTRAINT IF EXISTS danhmuc_ten_danhmuc_key;
ALTER TABLE IF EXISTS ONLY public.danhmuc DROP CONSTRAINT IF EXISTS danhmuc_pkey;
ALTER TABLE IF EXISTS ONLY public.danhgia DROP CONSTRAINT IF EXISTS danhgia_pkey;
ALTER TABLE IF EXISTS ONLY public.chitietgiohang DROP CONSTRAINT IF EXISTS chitietgiohang_pkey;
ALTER TABLE IF EXISTS ONLY public.chitietdonhang DROP CONSTRAINT IF EXISTS chitietdonhang_pkey;
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.alembic_version DROP CONSTRAINT IF EXISTS alembic_version_pkc;
ALTER TABLE IF EXISTS public.users ALTER COLUMN ma_user DROP DEFAULT;
ALTER TABLE IF EXISTS public.thuonghieu ALTER COLUMN ma_thuonghieu DROP DEFAULT;
ALTER TABLE IF EXISTS public.thanhtoan ALTER COLUMN ma_thanhtoan DROP DEFAULT;
ALTER TABLE IF EXISTS public.sanpham ALTER COLUMN ma_sanpham DROP DEFAULT;
ALTER TABLE IF EXISTS public.ma_khuyenmai ALTER COLUMN ma_khuyenmai DROP DEFAULT;
ALTER TABLE IF EXISTS public.lichsuchat ALTER COLUMN id_chat DROP DEFAULT;
ALTER TABLE IF EXISTS public.lichsu_donhang ALTER COLUMN ma_lichsu DROP DEFAULT;
ALTER TABLE IF EXISTS public.hinhanh ALTER COLUMN ma_anh DROP DEFAULT;
ALTER TABLE IF EXISTS public.giohang ALTER COLUMN ma_gio DROP DEFAULT;
ALTER TABLE IF EXISTS public.dsyeuthich ALTER COLUMN ma_dsyeuthich DROP DEFAULT;
ALTER TABLE IF EXISTS public.donhang ALTER COLUMN ma_don_hang DROP DEFAULT;
ALTER TABLE IF EXISTS public.dia_chi ALTER COLUMN ma_dia_chi DROP DEFAULT;
ALTER TABLE IF EXISTS public.danhmuc ALTER COLUMN ma_danhmuc DROP DEFAULT;
ALTER TABLE IF EXISTS public.danhgia ALTER COLUMN ma_danhgia DROP DEFAULT;
ALTER TABLE IF EXISTS public.chitietgiohang ALTER COLUMN ma_ctgh DROP DEFAULT;
ALTER TABLE IF EXISTS public.chitietdonhang ALTER COLUMN ma_ctdh DROP DEFAULT;
ALTER TABLE IF EXISTS public.audit_logs ALTER COLUMN ma_log DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.users_ma_user_seq;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.thuonghieu_ma_thuonghieu_seq;
DROP TABLE IF EXISTS public.thuonghieu;
DROP SEQUENCE IF EXISTS public.thanhtoan_ma_thanhtoan_seq;
DROP TABLE IF EXISTS public.thanhtoan;
DROP SEQUENCE IF EXISTS public.sanpham_ma_sanpham_seq;
DROP TABLE IF EXISTS public.sanpham;
DROP SEQUENCE IF EXISTS public.ma_khuyenmai_ma_khuyenmai_seq;
DROP TABLE IF EXISTS public.ma_khuyenmai;
DROP SEQUENCE IF EXISTS public.lichsuchat_id_chat_seq;
DROP TABLE IF EXISTS public.lichsuchat;
DROP SEQUENCE IF EXISTS public.lichsu_donhang_ma_lichsu_seq;
DROP TABLE IF EXISTS public.lichsu_donhang;
DROP SEQUENCE IF EXISTS public.hinhanh_ma_anh_seq;
DROP TABLE IF EXISTS public.hinhanh;
DROP SEQUENCE IF EXISTS public.giohang_ma_gio_seq;
DROP TABLE IF EXISTS public.giohang;
DROP SEQUENCE IF EXISTS public.dsyeuthich_ma_dsyeuthich_seq;
DROP TABLE IF EXISTS public.dsyeuthich;
DROP SEQUENCE IF EXISTS public.donhang_ma_don_hang_seq;
DROP TABLE IF EXISTS public.donhang;
DROP SEQUENCE IF EXISTS public.dia_chi_ma_dia_chi_seq;
DROP TABLE IF EXISTS public.dia_chi;
DROP SEQUENCE IF EXISTS public.danhmuc_ma_danhmuc_seq;
DROP TABLE IF EXISTS public.danhmuc;
DROP SEQUENCE IF EXISTS public.danhgia_ma_danhgia_seq;
DROP TABLE IF EXISTS public.danhgia;
DROP SEQUENCE IF EXISTS public.chitietgiohang_ma_ctgh_seq;
DROP TABLE IF EXISTS public.chitietgiohang;
DROP SEQUENCE IF EXISTS public.chitietdonhang_ma_ctdh_seq;
DROP TABLE IF EXISTS public.chitietdonhang;
DROP SEQUENCE IF EXISTS public.audit_logs_ma_log_seq;
DROP TABLE IF EXISTS public.audit_logs;
DROP TABLE IF EXISTS public.alembic_version;
DROP FUNCTION IF EXISTS public.update_inventory_after_checkout();
DROP FUNCTION IF EXISTS public.update_diem_danh_gia_sanpham();
DROP FUNCTION IF EXISTS public.update_cap_nhat_ngay_column();
DROP TYPE IF EXISTS public.trang_thai_user;
DROP TYPE IF EXISTS public.trang_thai_review;
DROP TYPE IF EXISTS public.trang_thai_payment;
DROP TYPE IF EXISTS public.trang_thai_order;
DROP TYPE IF EXISTS public.quyen;
DROP TYPE IF EXISTS public.phuong_thuc_payment;
DROP TYPE IF EXISTS public.paymentstatus;
DROP TYPE IF EXISTS public.paymentmethod;
DROP TYPE IF EXISTS public.kieu_giam_gia;
DROP TYPE IF EXISTS public.chitiet_thanhtoan;

COMMENT ON SCHEMA public IS '';

-- -----------------------------------------------------------------------------
-- PHẦN 3: ĐỊNH NGHĨA CÁC KIỂU DỮ LIỆU TÙY CHỈNH (ENUMS/TYPES)
-- -----------------------------------------------------------------------------

-- Trạng thái chi tiết của giao dịch thanh toán
CREATE TYPE public.chitiet_thanhtoan AS ENUM (
    'pending',
    'success',
    'failed',
    'refunded'
);

-- Loại hình giảm giá (Theo phần trăm hoặc Số tiền cố định)
CREATE TYPE public.kieu_giam_gia AS ENUM (
    'percentage',
    'fixed_amount'
);

-- Các phương thức thanh toán tích hợp
CREATE TYPE public.paymentmethod AS ENUM (
    'MOMO',
    'VNPAY',
    'COD',
    'BANKING'
);

-- Tình trạng xử lý giao dịch thanh toán
CREATE TYPE public.paymentstatus AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED',
    'REFUNDED'
);

-- Phương thức thanh toán của đơn hàng
CREATE TYPE public.phuong_thuc_payment AS ENUM (
    'cod',
    'banking',
    'credit_card'
);

-- Phân quyền vai trò người dùng trong hệ thống
CREATE TYPE public.quyen AS ENUM (
    'customer',
    'admin'
);

-- Các giai đoạn xử lý của một đơn hàng
CREATE TYPE public.trang_thai_order AS ENUM (
    'pending',
    'confirmed',
    'shipping',
    'completed',
    'cancelled'
);

-- Tình trạng thanh toán của hóa đơn
CREATE TYPE public.trang_thai_payment AS ENUM (
    'pending',
    'paid',
    'failed'
);

-- Trạng thái kiểm duyệt đánh giá sản phẩm
CREATE TYPE public.trang_thai_review AS ENUM (
    'pending',
    'approved',
    'rejected'
);

-- Trạng thái hoạt động của tài khoản người dùng
CREATE TYPE public.trang_thai_user AS ENUM (
    'active',
    'inactive',
    'banned'
);

-- Hàm tự động cập nhật thời gian (Timestamp) khi có thay đổi dữ liệu
CREATE FUNCTION public.update_cap_nhat_ngay_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.cap_nhat_ngay = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Hàm tự động tính toán lại điểm đánh giá trung bình cho sản phẩm
CREATE FUNCTION public.update_diem_danh_gia_sanpham() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE sanpham
    SET diem_danh_gia = (
        SELECT COALESCE(AVG(diem_danhgia), 0)
        FROM danhgia
        WHERE ma_sanpham = NEW.ma_sanpham AND trang_thai = 'approved'
    )
    WHERE ma_sanpham = NEW.ma_sanpham;
    RETURN NEW;
END;
$$;

-- Hàm tự động trừ số lượng tồn kho và kiểm tra kho khi đặt hàng
CREATE FUNCTION public.update_inventory_after_checkout() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;

SET default_tablespace = ''; -- Sử dụng không gian lưu trữ mặc định
SET default_table_access_method = heap; -- Phương thức lưu trữ bảng tiêu chuẩn

-- -----------------------------------------------------------------------------
-- PHẦN 4: KHỞI TẠO CẤU TRÚC CÁC BẢNG (TABLES)
-- -----------------------------------------------------------------------------

-- Bảng lưu trữ phiên bản migration của hệ thống
CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);

-- Bảng nhật ký hệ thống (Audit Logs)
CREATE TABLE public.audit_logs (
    ma_log integer NOT NULL,
    ma_nguoidung integer NOT NULL,
    action character varying(50) NOT NULL,
    resource_type character varying(50),
    resource_id integer,
    description text NOT NULL,
    details json,
    ip_address character varying(45),
    user_agent text,
    "timestamp" timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE public.audit_logs_ma_log_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.audit_logs_ma_log_seq OWNED BY public.audit_logs.ma_log;

-- Bảng chi tiết các sản phẩm trong đơn hàng
CREATE TABLE public.chitietdonhang (
    ma_ctdh integer NOT NULL,
    ma_don_hang integer NOT NULL,
    ma_sanpham integer,
    ten_sanpham character varying(255),
    so_luong integer NOT NULL,
    gia_mua double precision NOT NULL,
    thanh_tien double precision,
    mau_sac character varying(50)
);

CREATE SEQUENCE public.chitietdonhang_ma_ctdh_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.chitietdonhang_ma_ctdh_seq OWNED BY public.chitietdonhang.ma_ctdh;

-- Bảng chi tiết các sản phẩm trong giỏ hàng
CREATE TABLE public.chitietgiohang (
    ma_ctgh integer NOT NULL,
    ma_gio integer NOT NULL,
    ma_sanpham integer NOT NULL,
    so_luong integer DEFAULT 1,
    gia_hien_tai double precision NOT NULL,
    mau_sac character varying(50)
);

CREATE SEQUENCE public.chitietgiohang_ma_ctgh_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.chitietgiohang_ma_ctgh_seq OWNED BY public.chitietgiohang.ma_ctgh;

-- Bảng lưu trữ các đánh giá của khách hàng
CREATE TABLE public.danhgia (
    ma_danhgia integer NOT NULL,
    ma_sanpham integer NOT NULL,
    ma_user integer NOT NULL,
    diem_danhgia integer NOT NULL,
    tieu_de character varying(150),
    viet_danhgia text,
    trang_thai character varying(50) DEFAULT 'pending'::character varying,
    ngay_lap timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT danhgia_diem_danhgia_check CHECK (((diem_danhgia >= 1) AND (diem_danhgia <= 5)))
);

CREATE SEQUENCE public.danhgia_ma_danhgia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.danhgia_ma_danhgia_seq OWNED BY public.danhgia.ma_danhgia;

-- Bảng danh mục sản phẩm
CREATE TABLE public.danhmuc (
    ma_danhmuc integer NOT NULL,
    ten_danhmuc character varying(100) NOT NULL,
    mo_ta text,
    is_active boolean DEFAULT true,
    hinh_anh character varying(500)
);

CREATE SEQUENCE public.danhmuc_ma_danhmuc_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.danhmuc_ma_danhmuc_seq OWNED BY public.danhmuc.ma_danhmuc;

-- Bảng sổ địa chỉ của người dùng
CREATE TABLE public.dia_chi (
    ma_dia_chi integer NOT NULL,
    ma_user integer NOT NULL,
    ten_nguoi_nhan character varying(100) NOT NULL,
    sdt_nguoi_nhan character varying(20) NOT NULL,
    dia_chi character varying(255) NOT NULL,
    tinh_thanh character varying(100) NOT NULL,
    is_mac_dinh boolean,
    ngay_tao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cap_nhat_ngay timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE public.dia_chi_ma_dia_chi_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.dia_chi_ma_dia_chi_seq OWNED BY public.dia_chi.ma_dia_chi;

-- Bảng quản lý đơn hàng
CREATE TABLE public.donhang (
    ma_don_hang integer NOT NULL,
    ma_user integer NOT NULL,
    ngay_dat timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    trang_thai character varying(50) DEFAULT 'pending'::character varying,
    tong_tien double precision NOT NULL,
    phuong_thuc character varying(50) DEFAULT 'cod'::character varying,
    trangthai_thanhtoan character varying(50) DEFAULT 'pending'::character varying,
    dia_chi_giao character varying(255),
    sdt_nguoi_nhan character varying(20),
    ten_nguoi_nhan character varying(100),
    ma_khuyenmai integer,
    ngay_giao_du_kien timestamp with time zone,
    ngay_giao_thuc_te timestamp with time zone,
    phi_ship double precision DEFAULT 0.0,
    xoa_don boolean DEFAULT false NOT NULL
);

CREATE SEQUENCE public.donhang_ma_don_hang_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.donhang_ma_don_hang_seq OWNED BY public.donhang.ma_don_hang;

-- Bảng danh sách sản phẩm yêu thích
CREATE TABLE public.dsyeuthich (
    ma_dsyeuthich integer NOT NULL,
    ma_user integer NOT NULL,
    ma_sanpham integer NOT NULL,
    ngay_lap timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE public.dsyeuthich_ma_dsyeuthich_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.dsyeuthich_ma_dsyeuthich_seq OWNED BY public.dsyeuthich.ma_dsyeuthich;

-- Bảng thông tin giỏ hàng
CREATE TABLE public.giohang (
    ma_gio integer NOT NULL,
    ma_user integer NOT NULL,
    ngay_tao timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE public.giohang_ma_gio_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.giohang_ma_gio_seq OWNED BY public.giohang.ma_gio;

-- Bảng thư viện hình ảnh sản phẩm
CREATE TABLE public.hinhanh (
    ma_anh integer NOT NULL,
    ma_sanpham integer NOT NULL,
    image_url character varying(255) NOT NULL,
    is_main boolean DEFAULT false,
    mau character varying(50)
);

CREATE SEQUENCE public.hinhanh_ma_anh_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.hinhanh_ma_anh_seq OWNED BY public.hinhanh.ma_anh;

-- Bảng lịch sử thay đổi trạng thái đơn hàng
CREATE TABLE public.lichsu_donhang (
    ma_lichsu integer NOT NULL,
    ma_don_hang integer NOT NULL,
    trang_thai character varying(50) NOT NULL,
    mo_ta text,
    thoi_gian timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE public.lichsu_donhang_ma_lichsu_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.lichsu_donhang_ma_lichsu_seq OWNED BY public.lichsu_donhang.ma_lichsu;

-- Bảng lịch sử trò chuyện với AI
CREATE TABLE public.lichsuchat (
    id_chat integer NOT NULL,
    user_id integer,
    role character varying(20),
    message text,
    context_type character varying(50) DEFAULT 'admin_ai'::character varying,
    thoi_gian timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE public.lichsuchat_id_chat_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.lichsuchat_id_chat_seq OWNED BY public.lichsuchat.id_chat;

-- Bảng quản lý mã giảm giá (Voucher)
CREATE TABLE public.ma_khuyenmai (
    ma_khuyenmai integer NOT NULL,
    ma_giamgia character varying(50) NOT NULL,
    kieu_giamgia public.kieu_giam_gia NOT NULL,
    giatrigiam numeric(10,2) NOT NULL,
    don_toithieu numeric(10,2) DEFAULT 0,
    solandung integer,
    solan_hientai integer DEFAULT 0,
    ngay_batdau timestamp without time zone NOT NULL,
    ngay_ketthuc timestamp without time zone NOT NULL,
    is_active boolean DEFAULT true
);

CREATE SEQUENCE public.ma_khuyenmai_ma_khuyenmai_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.ma_khuyenmai_ma_khuyenmai_seq OWNED BY public.ma_khuyenmai.ma_khuyenmai;

-- Bảng danh mục sản phẩm (Xe đạp)
CREATE TABLE public.sanpham (
    ma_sanpham integer NOT NULL,
    ten_sanpham character varying(150) NOT NULL,
    sanpham_code character varying(50),
    ma_danhmuc integer NOT NULL,
    ma_thuonghieu integer NOT NULL,
    mo_ta text,
    gia double precision NOT NULL,
    kieu_giam_gia public.kieu_giam_gia DEFAULT 'percentage'::public.kieu_giam_gia,
    gia_tri_giam double precision DEFAULT 0,
    ton_kho integer DEFAULT 0,
    size_banh_xe integer,
    size_khung character varying(50),
    mau character varying(50),
    diem_danh_gia double precision DEFAULT 0,
    is_active boolean DEFAULT true,
    ngay_lap timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    thong_so_ky_thuat json,
    CONSTRAINT check_ton_kho_max CHECK ((ton_kho <= 1000)),
    CONSTRAINT chk_ton_kho_nonnegative CHECK ((ton_kho >= 0))
);

CREATE SEQUENCE public.sanpham_ma_sanpham_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.sanpham_ma_sanpham_seq OWNED BY public.sanpham.ma_sanpham;

-- Bảng thông tin giao dịch thanh toán
CREATE TABLE public.thanhtoan (
    ma_thanhtoan integer NOT NULL,
    ma_don_hang integer,
    ngay_thanhtoan timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    thanh_tien numeric(15,2) NOT NULL,
    pt_thanhtoan character varying(50) DEFAULT 'cod'::character varying NOT NULL,
    ma_giamgia character varying(50),
    trang_thai character varying(50) DEFAULT 'pending'::character varying NOT NULL,
    transaction_id character varying(100),
    bank_code character varying(50)
);

CREATE SEQUENCE public.thanhtoan_ma_thanhtoan_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.thanhtoan_ma_thanhtoan_seq OWNED BY public.thanhtoan.ma_thanhtoan;

-- Bảng thông tin thương hiệu/hãng xe
CREATE TABLE public.thuonghieu (
    ma_thuonghieu integer NOT NULL,
    ten_thuonghieu character varying(100) NOT NULL,
    mo_ta text,
    is_active boolean DEFAULT true,
    logo character varying(500),
    xuat_xu character varying(100)
);

CREATE SEQUENCE public.thuonghieu_ma_thuonghieu_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.thuonghieu_ma_thuonghieu_seq OWNED BY public.thuonghieu.ma_thuonghieu;

-- Bảng quản lý thông tin người dùng và tài khoản
CREATE TABLE public.users (
    ma_user integer NOT NULL,
    ten_user character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    hovaten character varying(100),
    sdt character varying(20),
    quyen public.quyen DEFAULT 'customer'::public.quyen,
    status public.trang_thai_user DEFAULT 'active'::public.trang_thai_user,
    ngay_lap timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cap_nhat_ngay timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE public.users_ma_user_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.users_ma_user_seq OWNED BY public.users.ma_user;


-- PHẦN THIẾT LẬP TỰ ĐỘNG TĂNG ID (AUTO-INCREMENT)
-- Liên kết các cột khóa chính với Sequence để tự động sinh số thứ tự

ALTER TABLE ONLY public.audit_logs ALTER COLUMN ma_log SET DEFAULT nextval('public.audit_logs_ma_log_seq'::regclass);

ALTER TABLE ONLY public.chitietdonhang ALTER COLUMN ma_ctdh SET DEFAULT nextval('public.chitietdonhang_ma_ctdh_seq'::regclass);

ALTER TABLE ONLY public.chitietgiohang ALTER COLUMN ma_ctgh SET DEFAULT nextval('public.chitietgiohang_ma_ctgh_seq'::regclass);

ALTER TABLE ONLY public.danhgia ALTER COLUMN ma_danhgia SET DEFAULT nextval('public.danhgia_ma_danhgia_seq'::regclass);

ALTER TABLE ONLY public.danhmuc ALTER COLUMN ma_danhmuc SET DEFAULT nextval('public.danhmuc_ma_danhmuc_seq'::regclass);

ALTER TABLE ONLY public.dia_chi ALTER COLUMN ma_dia_chi SET DEFAULT nextval('public.dia_chi_ma_dia_chi_seq'::regclass);

ALTER TABLE ONLY public.donhang ALTER COLUMN ma_don_hang SET DEFAULT nextval('public.donhang_ma_don_hang_seq'::regclass);

ALTER TABLE ONLY public.dsyeuthich ALTER COLUMN ma_dsyeuthich SET DEFAULT nextval('public.dsyeuthich_ma_dsyeuthich_seq'::regclass);

ALTER TABLE ONLY public.giohang ALTER COLUMN ma_gio SET DEFAULT nextval('public.giohang_ma_gio_seq'::regclass);

ALTER TABLE ONLY public.hinhanh ALTER COLUMN ma_anh SET DEFAULT nextval('public.hinhanh_ma_anh_seq'::regclass);

ALTER TABLE ONLY public.lichsu_donhang ALTER COLUMN ma_lichsu SET DEFAULT nextval('public.lichsu_donhang_ma_lichsu_seq'::regclass);

ALTER TABLE ONLY public.lichsuchat ALTER COLUMN id_chat SET DEFAULT nextval('public.lichsuchat_id_chat_seq'::regclass);

ALTER TABLE ONLY public.ma_khuyenmai ALTER COLUMN ma_khuyenmai SET DEFAULT nextval('public.ma_khuyenmai_ma_khuyenmai_seq'::regclass);

ALTER TABLE ONLY public.sanpham ALTER COLUMN ma_sanpham SET DEFAULT nextval('public.sanpham_ma_sanpham_seq'::regclass);

ALTER TABLE ONLY public.thanhtoan ALTER COLUMN ma_thanhtoan SET DEFAULT nextval('public.thanhtoan_ma_thanhtoan_seq'::regclass);

ALTER TABLE ONLY public.thuonghieu ALTER COLUMN ma_thuonghieu SET DEFAULT nextval('public.thuonghieu_ma_thuonghieu_seq'::regclass);

ALTER TABLE ONLY public.users ALTER COLUMN ma_user SET DEFAULT nextval('public.users_ma_user_seq'::regclass);

-- -----------------------------------------------------------------------------
-- PHẦN 5: NẠP DỮ LIỆU MẪU (DATA SEEDING / COPY)
-- -----------------------------------------------------------------------------

COPY public.alembic_version (version_num) FROM stdin;
a453e49fc7f8
\.

COPY public.audit_logs (ma_log, ma_nguoidung, action, resource_type, resource_id, description, details, ip_address, user_agent, "timestamp") FROM stdin;
1	1	update	order	6	Cập nhật trạng thái đơn #6: confirmed → cancelled	{"old_status": "confirmed", "new_status": "cancelled"}	\N	\N	2026-03-02 23:19:20.698781+07
2	1	update	order	7	Cập nhật trạng thái đơn #7: pending → confirmed	{"old_status": "pending", "new_status": "confirmed"}	\N	\N	2026-03-03 09:39:53.88344+07
3	1	update	order	4	Hoàn tiền đơn #4	{"old_payment_status": "paid", "new_payment_status": "refunded"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-03 09:48:39.36266+07
4	1	update	order	5	Cập nhật trạng thái đơn #5: shipping → delivered	{"old_status": "shipping", "new_status": "delivered"}	\N	\N	2026-03-03 09:54:51.660253+07
5	1	update	product	60	Cập nhật sản phẩm: Xe Đạp Địa Hình MTB GIANT XTC 800 – Phanh Đĩa, Bánh 27 Inches	{"product_code": "MGX-827"}	\N	\N	2026-03-03 10:11:42.454283+07
\.

COPY public.chitietdonhang (ma_ctdh, ma_don_hang, ma_sanpham, ten_sanpham, so_luong, gia_mua, thanh_tien, mau_sac) FROM stdin;
2	1	66	Xe Đạp Nữ Đường Phố Touring LIV Alight 4 Disc - Phanh Đĩa, Bánh 700C - 2025	1	10034700	10034700	cam
3	2	42	Xe Đạp Trẻ Em Youth TRINX Princess – Bánh 18 Inches	1	1213900	1213900	hồng trắng
4	3	65	Xe Đạp Nữ Đường Phố Touring LIV Alight 2 Disc - Phanh Đĩa, Bánh 700C - 2025	1	14790000	14790000	XANH XÁM
5	3	69	Xe Đạp Nữ Đường Phố Touring LIV Alight 2 DD City Disc - Phanh Đĩa, Bánh 700C - 2022	1	13990000	13990000	xanh lục nhạt
6	4	69	Xe Đạp Nữ Đường Phố Touring LIV Alight 2 DD City Disc - Phanh Đĩa, Bánh 700C - 2022	1	13990000	13990000	
\.

COPY public.chitietgiohang (ma_ctgh, ma_gio, ma_sanpham, so_luong, gia_hien_tai, mau_sac) FROM stdin;
154	5	69	1	13990000	xanh lục nhạt
\.

COPY public.danhgia (ma_danhgia, ma_sanpham, ma_user, diem_danhgia, tieu_de, viet_danhgia, trang_thai, ngay_lap) FROM stdin;
2	2	2	5	Xe đẹp xuất sắc	Tôi rất hài lòng về sản phẩm này. Đây là lần mua thứ 2 của tôi, shop làm ăn rất uy tín 	approved	2026-02-06 21:00:42.11177
3	1	2	3	Xe tạm được	Tôi đã mua chiếc xe này về cho em trai của tôi. Xe đẹp nhưng giao hàng chậm quá nên cho 3 sao thôi	approved	2026-02-06 21:17:54.250663
4	5	3	5	Sản phẩm tuyệt vời	Tôi rất thích xe đạp này, đi êm và trọng lượng nhẹ, kiểu dáng đẹp mắt phù hợp với mọi lứa tuổi. Đặc biệt giao hàng nhanh và chủ shop tư vấn nhiệt tình. Cho điểm tuyệt đối	approved	2026-02-07 10:02:03.778626
6	4	3	2	Xe đẹp mà mắt quá	Tôi rất thấy ưng ý chiếc xe này nhưng shop lại không có chức năng trả ghóp nên tôi chỉ cho shop 2 điểm.	approved	2026-02-07 11:20:26.956249
9	23	3	5	SẢN PHẨM CHẤT LƯỢNG	Tôi rất thích chiếc xe này và quá trình giao hàng nhanh nữa nên cho điểm tối đa	approved	2026-02-26 15:54:22.345145
\.

COPY public.danhmuc (ma_danhmuc, ten_danhmuc, mo_ta, is_active, hinh_anh) FROM stdin;
4	XE ĐẠP NỮ	Xe đạp nữ là biểu tượng của sự thanh lịch và lối sống hiện đại, mang đến sự cân bằng hoàn hảo giữa nhu cầu rèn luyện sức khỏe và gu thẩm mỹ tinh tế của phái đẹp. Những dòng xe trong danh mục này được đặc biệt ưu tiên thiết kế với cấu trúc khung võng thấp giúp người dùng dễ dàng lên xuống xe một cách duyên dáng ngay cả khi diện những bộ trang phục nhẹ nhàng hay váy dài. Trọng lượng xe thường được tối ưu hóa nhờ chất liệu hợp kim nhẹ, kết hợp cùng hệ thống phanh nhạy bén và ghi-đông uốn lượn giúp việc điều khiển trở nên linh hoạt, an toàn và ít tốn sức hơn. Không chỉ chú trọng vào khả năng vận hành êm ái để bảo vệ cột sống và vóc dáng, xe đạp nữ còn tích hợp nhiều tiện ích thực tế như giỏ xe thời trang, chắn bùn sạch sẽ và gác-ba-ga chắc chắn, đáp ứng trọn vẹn mọi nhu cầu từ đi làm, đi dạo phố đến mua sắm hàng ngày. Đây chính là người bạn đồng hành lý tưởng để phái đẹp tận hưởng cảm giác tự do, cải thiện sự dẻo dai và khẳng định phong cách sống năng động nhưng không kém phần dịu dàng.	t	https://api.xedap.vn/products/RAPTOR/eva-4-mauvebrown.jpg
5	XE ĐẠP GẤP	Xe đạp gấp là giải pháp di chuyển thông minh và linh hoạt dành riêng cho nhịp sống đô thị hiện đại, nơi sự tối ưu hóa không gian luôn được ưu tiên hàng đầu. Với thiết kế đột phá cho phép thu gọn kích thước chỉ trong vài giây, dòng xe này dễ dàng được cất giữ gọn gàng trong những căn hộ nhỏ, dưới gầm bàn làm việc hoặc mang theo thuận tiện trong cốp xe ô tô và các phương tiện công cộng. Dù sở hữu ngoại hình nhỏ nhắn, xe đạp gấp vẫn đảm bảo hiệu suất vận hành ấn tượng nhờ cấu trúc khung sườn vững chắc cùng hệ thống khớp nối an toàn, bền bỉ và bộ truyền động linh hoạt. Khả năng điều chỉnh độ cao yên và tay lái linh hoạt giúp chiếc xe trở thành lựa chọn lý tưởng cho mọi thành viên trong gia đình, từ người lớn đến thanh thiếu niên. Đây không chỉ là phương tiện di chuyển xanh, tiết kiệm mà còn là người bạn đồng hành hoàn hảo cho những chuyến dã ngoại hay những hành trình kết hợp đầy tiện nghi.	t	https://api.xedap.vn/products/JAVA/neo-9-s-white.jpg
1	XE ĐẠP TRẺ EM	Xe đạp trẻ em không chỉ là món đồ chơi giải trí mà còn là người bạn đồng hành quan trọng giúp bé phát triển thể chất, rèn luyện kỹ năng thăng bằng và xây dựng tinh thần tự lập ngay từ nhỏ. Danh mục xe đạp trẻ em mang đến sự lựa chọn đa dạng về kích thước từ 12 đến 20 inches, phù hợp với mọi độ tuổi và chiều cao của bé. Mỗi sản phẩm đều được chú trọng đặc biệt đến yếu tố an toàn với khung sườn chịu lực chắc chắn, hệ thống phanh nhạy bén, hộp xích bảo vệ kín đáo và các vật liệu thân thiện với sức khỏe. Đây chính là giải pháp hoàn hảo để khuyến khích trẻ vận động ngoài trời, rời xa các thiết bị điện tử và tự tin khám phá thế giới xung quanh một cách lành mạnh.	t	https://api.xedap.vn/products/RAPTOR/simba-4-orangeblack.jpg
7	XE ĐẠP FIXED GEAR	Gemini đã nói\nXe đạp Fixed Gear (hay còn gọi là xe đạp fixel) là biểu tượng của sự tối giản và cá tính mạnh mẽ trong cộng đồng yêu xe đạp đô thị. Điểm khác biệt lớn nhất của dòng xe này nằm ở hệ thống truyền động trực tiếp với phần líp được bắt chết vào đùm xe, khiến bàn đạp luôn chuyển động đồng nhất với bánh sau, cho phép người lái có thể đi lùi hoặc phanh xe bằng chính sức nặng của đôi chân. Với việc loại bỏ tối đa các chi tiết phức tạp như bộ biến tốc hay dây phanh rườm rà, xe không chỉ sở hữu trọng lượng siêu nhẹ mà còn có độ bền vượt trội và cực kỳ ít hỏng hóc vặt. Không chỉ dừng lại ở một phương tiện thể thao, xe đạp Fixed Gear còn là một phong cách sống, nơi người chơi tự do thể hiện bản sắc cá nhân qua những bản phối màu sắc rực rỡ và tận hưởng cảm giác "làm chủ" hoàn toàn mọi chuyển động trên đường phố.	t	https://api.xedap.vn/wp-content/uploads/2024/04/Maximus_Green-1.jpg
2	XE ĐẠP ĐỊA HÌNH	Xe đạp địa hình là dòng xe được thiết kế chuyên biệt để chinh phục những cung đường gồ ghề, hiểm trở và đầy thử thách, mang lại trải nghiệm mạnh mẽ cho những người yêu thích phiêu lưu. Với cấu trúc khung sườn siêu bền từ hợp kim nhôm hoặc thép cường lực, dòng xe này đảm bảo sự chắc chắn tuyệt đối và khả năng chịu va đập cực tốt trong mọi điều kiện địa hình. Điểm nhấn quan trọng nhất chính là hệ thống phuộc nhún giảm xóc hiện đại giúp hấp thụ xung lực hiệu quả, kết hợp cùng đôi lốp bản rộng có gai lớn giúp tăng cường độ bám đường và sự ổn định trên các bề mặt trơn trượt hay bùn lầy. Bên cạnh đó, việc trang bị bộ truyền động nhiều cấp độ linh hoạt giúp người lái dễ dàng điều chỉnh lực đạp khi leo dốc hay tăng tốc, trong khi hệ thống phanh đĩa nhạy bén đảm bảo an toàn tối ưu trong những tình huống xử lý khẩn cấp. Đây không chỉ là phương tiện rèn luyện thể lực bền bỉ mà còn là biểu tượng của tinh thần phóng khoáng, sẵn sàng vượt qua mọi giới hạn để khám phá thiên nhiên.	t	https://api.xedap.vn/products/RAPTOR/rally-1-b-grey.jpg
\.

COPY public.dia_chi (ma_dia_chi, ma_user, ten_nguoi_nhan, sdt_nguoi_nhan, dia_chi, tinh_thanh, is_mac_dinh, ngay_tao, cap_nhat_ngay) FROM stdin;
7	7	Nguyễn Văn VInh	09633890365	tổ 6, thôn Xuân Tây, xã Phú Thuận	TP. Đà Nẵng	t	2026-03-05 13:24:48.860079	2026-03-05 21:04:29.633848
10	24	Nguyễn Ngọc Khế	8366587368	xa Hài Đông, TP. Hải Phòng	TP. Hải Phòng	f	2026-03-05 15:22:31.903119	2026-03-06 15:57:06.374571
11	24	Nguyễn Ngọc Thạch	989859385	xã Sơn Hà, tỉnh Sơn La	Sơn La	f	2026-03-06 15:56:56.321631	2026-03-06 15:57:06.374571
5	24	Nguyễn Ngọc Khế	0388257891	xã Thăng Bình. TP. Đà Nẵng	TP. Đà Nẵng	t	2026-03-05 13:24:48.860079	2026-03-06 15:57:06.375733
3	3	Bùi Minh Quân	0339886769	thôn An Hòa, xã Tây Hồ, TP. Đà Nẵng	Đà Nẵng	t	2026-03-05 13:24:48.860079	2026-03-05 14:12:41.036078
\.

COPY public.donhang (ma_don_hang, ma_user, ngay_dat, trang_thai, tong_tien, phuong_thuc, trangthai_thanhtoan, dia_chi_giao, sdt_nguoi_nhan, ten_nguoi_nhan, ma_khuyenmai, ngay_giao_du_kien, ngay_giao_thuc_te, phi_ship, xoa_don) FROM stdin;
7	26	2026-03-04 16:51:06.835333+07	delivered	13990000	cod	paid	Xã Duy Xuyên, tỉnh Bình Thuận	0978865928	Trần Thanh Hưng	6	2026-03-07 16:51:06.84383+07	2026-03-06 16:08:36.82449+07	100000	f
3	24	2026-03-04 06:20:55.975488+07	cancelled	28780000	vnpay	refunded	xã Thăng Bình, TP. Đà Nẵng	0388257891	Nguyễn Ngọc Khế	\N	2026-03-07 06:20:56.01325+07	\N	0	t
10	24	2026-03-09 15:47:01.295744+07	confirmed	7090000	cod	pending	xa Hài Đông, TP. Hải Phòng	8366587368	Nguyễn Ngọc Khế	\N	2026-03-12 15:47:01.314954+07	\N	100000	f
9	24	2026-03-06 15:57:42.001552+07	shipping	14090000	vnpay	paid	xa Hài Đông, TP. Hải Phòng	8366587368	Nguyễn Ngọc Khế	\N	2026-03-09 15:57:42.017328+07	\N	100000	f
4	24	2026-03-04 10:29:45.368099+07	delivered	16194100	vnpay	paid	xã Thăng Bình, TP. Đà Nẵng	0388257891	Nguyễn Ngọc Khế	\N	2026-03-07 10:29:45.387049+07	2026-03-04 17:00:19.161455+07	0	f
\.

COPY public.dsyeuthich (ma_dsyeuthich, ma_user, ma_sanpham, ngay_lap) FROM stdin;
17	3	69	2026-02-28 12:19:33.325227
\.

COPY public.giohang (ma_gio, ma_user, ngay_tao) FROM stdin;
1	3	2026-02-03 10:11:36.491675+07
2	2	2026-02-04 17:39:51.885072+07
5	6	2026-02-06 17:33:49.418415+07
6	7	2026-02-27 14:29:32.979192+07
9	24	2026-03-03 11:04:27.625182+07
\.

COPY public.hinhanh (ma_anh, ma_sanpham, image_url, is_main, mau) FROM stdin;
254	73	/static/images/73_3eb6ae_gear_while.jpg	t	TRẮNG
67	19	/static/images/19_818aad_2026-fastroadadvar-1-a-white_2.jpg	t	TRẮNG
105	33	/static/images/33_625eca_esla-2-purple.jpg	t	tím
107	34	/static/images/34_2dc08d_helen-pink.jpg	t	HỒNG
39	10	/static/images/10_ae7564_esla-2-pinkwhite.jpg	t	HỒNG
\.

COPY public.lichsu_donhang (ma_lichsu, ma_don_hang, trang_thai, mo_ta, thoi_gian) FROM stdin;
1	7	confirmed	Đơn hàng của bạn đã được xác nhận.	2026-03-05 08:57:46.717435
2	7	shipping	đơn hàng đang được giao đến Hưng	2026-03-05 08:58:40.800657
3	6	shipping	Đơn hàng đang được giao đến bạn.	2026-03-05 09:02:44.885023
4	5	delivered	Đã giao hàng thành công.	2026-03-05 09:03:05.285635
5	6	delivered	Đã giao hàng thành công.	2026-03-05 09:04:31.601482
\.

COPY public.lichsuchat (id_chat, user_id, role, message, context_type, thoi_gian) FROM stdin;
1	1	user	Sản phẩm nào bán chạy nhất?	admin_ai	2026-02-16 20:50:21.211684
2	1	assistant	🔧 Xin lỗi, AI tạm thời gặp sự cố kỹ thuật.\n\nVui lòng thử lại sau hoặc liên hệ kỹ thuật nếu lỗi vẫn tiếp diễn.	admin_ai	2026-02-16 20:50:21.732829
3	1	user	doanh thu	admin_ai	2026-02-16 20:50:32.013257
4	1	assistant	🔧 Xin lỗi, AI tạm thời gặp sự cố kỹ thuật.\n\nVui lòng thử lại sau hoặc liên hệ kỹ thuật nếu lỗi vẫn tiếp diễn.	admin_ai	2026-02-16 20:50:32.167512
5	1	user	doanh thu	admin_ai	2026-02-16 20:52:48.172959
\.

COPY public.ma_khuyenmai (ma_khuyenmai, ma_giamgia, kieu_giamgia, giatrigiam, don_toithieu, solandung, solan_hientai, ngay_batdau, ngay_ketthuc, is_active) FROM stdin;
6	SALE T3	fixed_amount	100000.00	10000000.00	15	11	2026-02-26 14:44:59.614078	2026-03-05 23:59:59	t
5	TET2026	percentage	14.00	1000000.00	5	3	2026-02-18 09:16:18.770546	2026-03-05 23:59:59	t
\.

COPY public.sanpham (ma_sanpham, ten_sanpham, sanpham_code, ma_danhmuc, ma_thuonghieu, mo_ta, gia, kieu_giam_gia, gia_tri_giam, ton_kho, size_banh_xe, size_khung, mau, diem_danh_gia, is_active, ngay_lap, thong_so_ky_thuat) FROM stdin;
73	Xe đạp Fixed Gear Magicbros CX7	SP9KEKFKDF	7	12	**Xe Fixed gear Magicbros CX7**\n  \n   Nếu như bạn đang muốn kiếm cho mình một chiếc xe đạp fixed gear đúng chuẩn Fixed khung nhôm ngon, bền , rẻ thì Magicbros CX7 lac sự lựa chọn không thể bỏ qua . \n  Với thiết kế bản dẹt chém gió giúp bạn cải thiện được lực cản gió, giúp tốc độ cải thiênn hơn. Khung sườn được sản xuất từ nhôm 6061 siêu bền .\n  Không giống như các loại xe khác, fixed gear là dòng xe rất phá xe.  để cấu thành một chiếc xe ngon thì yếu tố khung sườn , linh kiện gắn trên xe vô cùng quan trọng đối với fixed gear . Nhìn trên ảnh thì có vẻ giống nhau nhưng giữa xe tốt và xe rẻ nó khác nhau ở linh kiện trên xe.\n   Ngoài khung sườn được làm từ nhôm 6061 cao cấp ra, hub xe được hãng trang bị của Legend siêu nhẹ, siêu trớn, trục giữa nhập khẩu, chén cổ bạc đạn là sự khác biệt của magicbros với các loại fixed gear giá rẻ, nhái trên thị trường .\n   Hiện nay fixed gear rẻ nhái rất nhiều trên thị trường, hãy là người tiêu dùng thông thái.Đừng có suy nghĩ mua tạm rẻ rồi nâng cấp dần, vì khi nâng cấp tốn rất nhiều tiền mà xe chưa thể ngon được đâu ah.\nCâu nói tiền nào của ý luôn luôn đúng ạ 	5150000	percentage	2	18	30	nhôm cao cấp 6061	XANH LAM, XÁM XANH, TRẮNG, ĐEN	0	t	2026-03-08 21:14:55.564485+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "S"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "Xanh lam, x\\u00e1m xanh, tr\\u1eafng, \\u0111en"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Khung nh\\u00f4m cao c\\u1ea5p 6061 kh\\u00f4ng m\\u1ed1i h\\u00e0n"}, {"ten": " C\\u00c0NG", "gia_tri": " Nh\\u00f4m MAGICBROS 700c"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "V\\u00e0nh nh\\u00f4m tr\\u01b0\\u1edbc 4cm, sau 6cm MAGICBROS PRO"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": " LEGEND 32 l\\u1ed7 si\\u00eau tr\\u1edbn"}, {"ten": " TR\\u1ee4C GI\\u1eeeA", "gia_tri": "Neco bi v\\u00f2ng"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Compass 700*23C/25C"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": " Nh\\u00f4m 31.8mm"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": " Nh\\u00f4m 31.8mm"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "Nh\\u00f4m MAGICBROS b\\u1ea3n d\\u1eb9t"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "h\\u1ea1t \\u0111\\u1eadu "}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": " \\u0110\\u00f9i nh\\u00f4m 5 ch\\u1ea5u 46T"}, {"ten": "PH\\u00d9 H\\u1ee2P", "gia_tri": "Ph\\u00f9 h\\u1ee3p v\\u1edbi ng\\u01b0\\u1eddi cao t\\u1eeb 1,52-1,8m"}]
19	Xe Đạp Đường Phố Touring GIANT Fastroad AR Advanced 1-Asia - Phanh Đĩa, Bánh 700C - 2026	SPHJSN3834	9	2	**Xe Đạp Đường Phố Touring GIANT **Fastroad AR Advanced 1-Asia – Phanh Đĩa, Bánh 700C – 2026\nMang tốc độ của Roadbike, sự thoải mái của City Touring, và phong thái đỉnh cao của một chiến mã đường phố – đó chính là Fastroad AR Advanced 1-Asia 2026. Chiếc xe carbon cao cấp này được tạo ra cho những ai yêu cảm giác lướt nhanh – đạp mượt – sống phong cách trên mọi cung đường.\n\n**Những điểm nổi bật của GIANT Fastroad AR Advanced 1-Asia 2026**\nThiết kế tối giản hiện đại và khí động học cao\nPhiên bản mới với màu Icicle White mang vẻ ngoài tinh tế và sang trọng, kết hợp khung touring lai road mảnh mai nhưng chắc chắn. Ghi đông phẳng giúp người lái duy trì tư thế thoải mái khi di chuyển đường dài hoặc đạp phố, phù hợp với phong cách “sport touring” đặc trưng của dòng Fastroad.\n\n**Khung sườn carbon cao cấp, siêu nhẹ và cứng cáp**\nSử dụng vật liệu Advanced-grade composite, Fastroad AR Advanced 1 có độ cứng vững vượt trội nhưng vẫn duy trì trọng lượng nhẹ. Hệ thống trục 12x142mm thru-axle cho khả năng chịu tải và ổn định tốt hơn, đảm bảo cảm giác lái chắc chắn ngay cả khi vào cua hoặc tăng tốc mạnh.\n\n**Phuộc carbon hấp thụ rung chấn hiệu quả**\nPhuộc Advanced composite OverDrive steerer giúp giảm rung động truyền lên tay lái, mang lại trải nghiệm êm ái và kiểm soát tốt hơn trên những cung đường gồ\nghề hoặc dài hơi.\n\n**Phanh dầu kiểm soát an toàn tuyệt đối**\nHệ thống phanh dầu mang lại lực phanh ổn định, nhạy và dễ điều chỉnh trong mọi điều kiện – dù trời mưa hay đường trơn. Đây là điểm cộng lớn khi so sánh với phanh cơ thông thường, đặc biệt hữu ích cho những người thường xuyên đạp xa hoặc ở tốc độ cao.\n\n**xe đạp GIANT touring đi làm hàng ngày**\n\nBánh xe cân bằng giữa tốc độ và êm ái\nCặp bánh Giant P-R2 Disc kết hợp lốp Giant Gavia Fondo 2 Tubeless 700x32C cho khả năng bám đường tốt, vận hành mượt và giảm thiểu nguy cơ thủng bánh. Độ rộng 32C giúp tăng độ ổn định mà vẫn duy trì tốc độ đặc trưng của dòng xe đường phố cao cấp.\n\n**Yên xe và cốt yên D-Fuse – thoải mái và giảm chấn tối đa**\nBộ yên Giant ErgoContact cùng cốt yên D-Fuse composite thiết kế đặc biệt để hấp thụ rung động, giảm áp lực lên cột sống và mang lại cảm giác dễ chịu khi đạp lâu.\n\n**Ai nên chọn GIANT Fastroad AR Advanced 1-Asia 2026?**\nNgười yêu thích đạp tốc độ nhưng vẫn muốn sự thoải mái của touring.\n \nNgười thường xuyên đạp đường dài, đường đô thị hoặc hỗn hợp.\n \nNgười muốn sở hữu chiếc xe carbon cao cấp, nhẹ và hiệu năng cao nhưng không cần tư thế roadbike quá chúi.\n \nPhù hợp với người cao từ 1m65 – 1m85, chọn size S hoặc M tùy thể hình.\n \nGIANT Fastroad AR Advanced 1-Asia 2026 không chỉ là một chiếc xe – mà là biểu tượng của phong cách sống năng động, nơi tốc độ gặp sự thoải mái và hiệu suất hòa cùng đẳng cấp. Nếu bạn đang tìm một người bạn đồng hành cho cả hành trình tập luyện lẫn di chuyển hằng ngày, đây chính là lựa chọn đáng giá để sở hữu ngay hôm nay.\n\n	48790000	percentage	0	8	30	cacbon Advanced-grade composite	trắng	0	t	2026-02-08 16:30:10.149053+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "S"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "Tr\\u1eafng"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "cacbon Advanced-grade composite"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Advanced-grade composite, composite OverDrive steerer, 12x100mm thru-axle, disc"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "Giant Sport Flat, 31.8"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "Giant Contact,alloy"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "Giant D-Fuse, composite"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Giant ErgoContact"}, {"ten": "BA\\u0300N \\u0110A\\u0323P/PEDALS", "gia_tri": "Giant G-Base"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "Shimano 105 SL-RS700 2X11 Speed"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "Shimano 105"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "Shimano 105 2x11S"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Tektro HD-R280"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "Shimano 105 CS-HG700,11-34T"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "KMC X11"}, {"ten": "GI\\u00d2 DI\\u0303A/CRANKSET", "gia_tri": "FSA Omega, 32/48"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "Giant P-R2 Disc"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Giant Gavia Fondo 2, 60tpi 700X32C, Wirebead, Tubless"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "12mm Thru Axles"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "24H"}, {"ten": "TAY TH\\u1eaeNG/BRAKE LEVERS", "gia_tri": "Tektro HD-R280"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "FSA BB-AL86"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
4	Xe Đạp Đua Đường Trường Road GIANT TCR Advanced 2 Pro Compact - Phanh Đĩa, Bánh 700C 	SPB69BLYE4	3	2	Xe Đạp Đua Đường Trường GIANT TCR Advanced 2 Pro Compact 2026 – Hiệu suất cao, kiểm soát vượt trội\nGIANT TCR Advanced 2 Pro Compact 2026 là mẫu xe đạp đua đường trường hướng đến người chơi road nghiêm túc, cần một chiếc xe nhẹ, cứng cáp và phản hồi chính xác để tập luyện cường độ cao và thi đấu phong trào. Thiết kế khí động học cùng phanh đĩa giúp xe vận hành ổn định và an toàn ở tốc độ cao.\n\nKhung xe Advanced-grade Composite kết hợp trục xuyên 12x142mm mang lại khả năng truyền lực hiệu quả và độ ổn định cao khi vào cua. Phuộc trước full-composite với cổ lái OverDrive tăng độ cứng phần đầu xe, giúp tay lái chính xác và tự tin hơn trong những tình huống xử lý nhanh.\n\nXe được trang bị bộ bánh Giant P-R1 Disc với profile 30mm giúp cải thiện khí động học, giảm lực cản lăn, giúp người đạp dễ dàng đạt được tốc độ cao mà không tốn quá nhiều sức. Lốp Giant Gavia Course 0 tubeless 700x28c cho khả năng bám đường xuất sắc, giảm lực cản và mang lại cảm giác đạp êm hơn khi đi đường dài hoặc mặt đường xấu.\n\nTư thế đạp được tối ưu với ghi đông Giant Contact, pô tăng Contact AeroLight và cốt yên composite Giant Variant có khả năng điều chỉnh offset, giúp người đạp dễ dàng tinh chỉnh dáng ngồi phù hợp với mục tiêu hiệu suất hoặc sự thoải mái.\n\nGIANT TCR Advanced 2 Pro Compact 2026 sử dụng bộ truyền động Shimano 105 2X12 cho ra 24 tốc độ, nổi tiếng với độ bền cao, sang số chính xác và khả năng vận hành ổn định trong thời gian dài. Dải líp 11–34 kết hợp giò đĩa compact 36/52 giúp xe linh hoạt khi leo dốc nhưng vẫn giữ được tốc độ tốt trên đường bằng.\n\nHệ thống phanh đĩa dầu Shimano 105 với đĩa trước 160mm và sau 140mm mang lại lực phanh mạnh, kiểm soát tốt và ổn định trong mọi điều kiện thời tiết, đặc biệt khi xuống dốc hoặc phanh gấp ở tốc độ cao.\n\nTổng thể, GIANT TCR Advanced 2 Pro Compact 2026 là lựa chọn lý tưởng cho người chơi road đang tìm kiếm một chiếc xe hiệu suất cao, công nghệ hiện đại và khả năng kiểm soát vượt trội, phù hợp cho tập luyện nghiêm túc và thi đấu phong trào.	62990000	percentage	50	31	30	Cacbon Advanced-grade Composite	Xanh Capri, Xám đen	2	t	2026-02-05 17:23:46.96277+07	[{"ten": "K\\u00edch c\\u1ee1/Sizes", "gia_tri": "M, S, XS"}, {"ten": "M\\u00e0u s\\u1eafc/Colors", "gia_tri": "Xanh Capri, X\\u00e1m \\u0111en"}, {"ten": "Ch\\u1ea5t li\\u1ec7u khung/Frame", "gia_tri": "Advanced-grade Composite, 12x142mm thru-axle, disc"}, {"ten": "Phu\\u1ed9c/Fork", "gia_tri": "Advanced-grade Composite, full-composite OverDrive steerer, 12x100mm thru-axle, disc"}, {"ten": "V\\u00e0nh xe/Rims", "gia_tri": "Giant P-R1 Disc wheelset, alloy, [F]30mm, [R]30mm"}, {"ten": "\\u0110\\u00f9m/Hubs", "gia_tri": "Giant alloy, 12mm thru-axle"}, {"ten": "C\\u0103m/Spokes", "gia_tri": "stainless"}, {"ten": "L\\u1ed1p xe/Tires", "gia_tri": "Giant Gavia Course 0, tubeless, 700x28c (28mm), folding"}, {"ten": "Ghi \\u0111\\u00f4ng/Handlebar", "gia_tri": "Giant Contact"}, {"ten": "P\\u00f4 t\\u0103ng/Stem", "gia_tri": "Giant Contact AeroLight"}, {"ten": "C\\u1ed1t y\\u00ean/Seatpost", "gia_tri": "Giant Variant, composite, -5/+15mm offset"}, {"ten": "Y\\u00ean/Saddle", "gia_tri": "Giant Approach"}, {"ten": "Ba\\u0300n \\u0111a\\u0323p/Pedals", "gia_tri": "Giant G-Base"}, {"ten": "Tay \\u0111\\u1ec1/Shifters", "gia_tri": "Shimano 105"}, {"ten": "Chuy\\u1ec3n \\u0111\\u0129a/Front Derailleur", "gia_tri": "Shimano 105"}, {"ten": "Chuy\\u1ec3n l\\u00edp/Rear Derailleur", "gia_tri": "Shimano 105"}, {"ten": "B\\u1ed9 th\\u1eafng/Brakes", "gia_tri": "Shimano 105 hydraulic, Shimano SM-RT64 rotors [F]160mm, [R]140mm"}, {"ten": "Tay th\\u1eafng/Brake Levers", "gia_tri": "Shimano 105"}, {"ten": "B\\u1ed9 l\\u00edp/Cassette", "gia_tri": "Shimano 105, 12-speed, 11x34"}, {"ten": "S\\u00ean xe/Chain", "gia_tri": "KMC X12L-1"}, {"ten": "Gi\\u00f2 di\\u0303a/Crankset", "gia_tri": "Shimano 105, 36/52"}, {"ten": "B.B/Bottom Bracket", "gia_tri": "Shimano, press fit"}, {"ten": "Tr\\u1ecdng l\\u01b0\\u1ee3ng/Weight", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n. R\\u00fat g\\u1ecdn"}]
21	Xe Đạp Nữ Đường Phố Youth RAPTOR Eva 3 - Bánh 24 Inch	SPLLO8LP9K	4	1	**Xe Đạp Đường Phố Youth RAPTOR Eva 3** – Đơn giản, dễ đạp, phù hợp cho trẻ em\nRAPTOR Eva 3 là mẫu xe đạp đường phố dành cho trẻ em và thiếu niên, phù hợp cho việc đi học, vui chơi hoặc di chuyển hằng ngày với cường độ vừa phải. Thiết kế xe hướng đến sự an toàn, dễ sử dụng và dễ làm quen cho các em nhỏ.\n\n**Khung xe Raptor STL 24** bằng thép mang lại độ chắc chắn cao, giúp xe ổn định và bền bỉ trong quá trình sử dụng. Phuộc thép Raptor giúp xe vận hành êm ái hơn khi đi trên các đoạn đường gồ ghề, vỉa hè hoặc sân chơi.\n\nXe sử dụng **bánh 24 inch** với vành nhôm 36 lỗ, giúp bánh xe nhẹ và bền, hạn chế cong vênh khi sử dụng hằng ngày. **Lốp 24x1⅜** cho khả năng lăn nhẹ, dễ đạp, phù hợp với thể trạng và sức đạp của trẻ em.\n\nTư thế ngồi được thiết kế thoải mái với ghi đông thép 560mm, pô tăng nhôm và cốt yên thép, giúp trẻ dễ kiểm soát tay lái và giữ thăng bằng tốt khi di chuyển. Yên xe Raptor kết hợp bàn đạp bản lớn hỗ trợ đạp chắc chân và an toàn hơn.\n\nRAPTOR Eva 3 sử dụng cấu hình single speed với bộ líp 18T và giò đĩa 32T, giúp xe đơn giản, ít hỏng vặt và rất dễ sử dụng. Thiết kế này đặc biệt phù hợp cho trẻ mới làm quen với xe đạp, không cần thao tác sang số phức tạp.\n\nHệ thống phanh gồm U-Brake phía trước và Band Brake phía sau, đáp ứng tốt nhu cầu phanh dừng cơ bản, giúp phụ huynh yên tâm hơn khi trẻ di chuyển trong khu vực dân cư hoặc khuôn viên trường học.\n\nTổng thể, RAPTOR Eva 3 là mẫu xe đạp dễ đạp, bền bỉ, chi phí hợp lý, phù hợp cho trẻ em trong giai đoạn làm quen và rèn luyện kỹ năng đi xe đạp mỗi ngày	2890000	percentage	10	15	24	thép Raptor STL 24	hồng, xanh, hồng cà	0	t	2026-02-08 20:06:42.241145+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One Size (24\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "H\\u1ed3ng, Xanh, H\\u1ed3ng c\\u00e0"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Raptor STL 24"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Raptor STL"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "25.4x560mm STL"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "25.4 ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "25.4x250mm STL"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Raptor"}, {"ten": "BA\\u0300N \\u0110A\\u0323P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Front: U-Brake Rear: Band Brake"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "18T, Single Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "Single Speed"}, {"ten": "GI\\u00d2 DI\\u0303A/CRANKSET", "gia_tri": "Raptor 32x170mm STL"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU, 36H, Scharder Valve"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "24x1\\u215c"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "Bi c\\u00f4n STL"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "36H"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
72	 Xe đạp gấp Java Neo Italy- Bánh 20 inches-2025	SPKUITAA09	5	3	**Xe đạp gấp Java NEO là xe đạp gấp siêu nhẹ dòng bánh 20 inch**. Được thiết kế tại Ý – đất nước có nền công nghiệp sản xuất xe đạp hàng đầu Châu Âu, Java Neo tiếp tục gây ấn tượng với những người đi xe đạp. Là một bước tiến mới đánh dấu sự phát triển vượt bậc về thiết kế cũng như chất lượng của nền công nghiệp sản xuất xe đạp tại Ý.\nĐược thiết kế tỉ mỉ trong từng chi tiết, nghiêng về tính thể thao nhưng không kém phần thời trang, tinh tế trong từng đường nét. Mạnh mẽ nhờ phụ tùng cao cấp của các thương hiệu nổi tiếng.\n\nThiết kế cực kỳ tiện ích với khả năng gấp gọn cũng như trọng lượng siêu nhẹ, siêu bền, đẹp giúp bạn dễ dàng mang theo trong mỗi chuyến đi của mình.\n\nĐiểm nổi bật mà xe đạp gấp Java Neo có?\n– Bộ tem cực chuẩn của thương hiệu Java ôm trọn khung càng trước và sau của xe. Phần thân xe logo “Neo” màu xanh được điểm nổi bật trên nền trắng.\nTại sao Xe đạp gấp Java Neo được coi là xe đạp thể thao?\nXe đạp gấp Java Neo được trang bị 11 tốc độ, chuyển tốc linh hoạt khi đi trong nội thành.\nChất liệu cao cấp: carbon giúp tổng trọng lượng xe nhẹ hơn. Kết hợp với phụ tùng cao cấp để tối ưu về tốc độ\nPhụ tùng mang nhãn hiệu nổi tiếng được sản xuất tại Italia và Nhật Bản. Được kiểm định theo tiêu chuẩn khắt khe nhất của hãng.\nCơ chế gấp 3 khúc, vuông và gọn hơn.  Khác biệt so với các dòng sản phẩm xe đạp gấp cũ.\nAi là người phù hợp với Java Neo?\nĐối tượng mà nhà sản xuất hướng tới là dân thể thao, dân công sở, những người bận rộn với công việc không có thời gian tập thể dục.\nHay những người yêu thích công nghệ, thời trang, yêu cái đẹp, tinh tế.\nKhi nào và ở đâu nên dùng xe đạp gấp siêu nhẹ Java Neo?\nVới phong cách thiết kế hiện đại, trẻ trung nên xe có thể dùng để đi học, đi làm, đi thể dục,…tiết kiệm phần nào chi phí xăng xe, chi phí tập cho các phòng tập Gym.\nDu lịch một chuyến bằng xe đạp gấp, ắt hẳn sẽ đem lại cho bạn rất nhiều trải nghiệm thú vị.\nĐặc biệt trong khi nhà bạn ở trong nội thành các khu dân cư chật hẹp, giao thông đông đúc.\nTại sao nên chọn Java Neo?\nXe đạp gấp Java Neo – Siêu xe đạp thể thao giúp bạn vượt mọi chặng đường xa, đường dốc một cách dễ dàng\nĐạp xe giúp tăng cường sức khỏe, duy trì sự dẻo dai và vóc dáng của con người. Xe đạp gấp Java Neo đem lại cuộc sống tiện nghi hơn, lành mạnh hơn.\nTiết kiệm phần nào chi phí xăng xe, bảo dưỡng, phí gửi xe phải chi cho những chiếc xe tay ga, xe ô tô.\nThời trang, phong cách, kiểu dáng thể thao lôi cuốn khiến cánh mày râu và phái đẹp bị thu hút ngay từ cái nhìn đầu tiên.\nĐược test thử miễn phí tại hệ thống showroom của Papilo\nChế độ bảo hành định kỳ 3 tháng miễn phí	40000000	percentage	3	10	20	 khung carbon	trắng xanh	3	t	2026-03-04 17:16:26.15299+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One Size (20\\u2033)"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "Tr\\u1eafng xanh"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Carbon"}, {"ten": "TH\\u01af\\u01a0NG HI\\u1ec6U", "gia_tri": "Java Probike (Italy)"}, {"ten": "MODEL", "gia_tri": "Neo"}, {"ten": "T\\u1ed0C \\u0110\\u1ed8", "gia_tri": "11 t\\u1ed1c \\u0111\\u1ed9, Shimano 105"}, {"ten": "V\\u00c0NH XE", "gia_tri": "Deca, ch\\u1ea5t li\\u1ec7u carbon, thi\\u1ebft k\\u1ebf kh\\u00ed \\u0111\\u1ed9ng h\\u1ecdc"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Maxxis 20\\u2033x1,35"}, {"ten": "PEDAL", "gia_tri": "Decaf nh\\u00f4m, ch\\u1ed1ng tr\\u01a1n tr\\u01b0\\u1ee3t"}, {"ten": "TAY G\\u1ea0T \\u0110\\u1ec0", "gia_tri": "Shimano Avid, ki\\u1ec3u c\\u00f2 s\\u00fang"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG", "gia_tri": "8kg"}]
\.

COPY public.thanhtoan (ma_thanhtoan, ma_don_hang, ngay_thanhtoan, thanh_tien, pt_thanhtoan, ma_giamgia, trang_thai, transaction_id, bank_code) FROM stdin;
2	1	2026-03-03 11:13:12.529789+07	10084700.00	cod	\N	refunded	\N	\N
4	3	2026-03-04 06:20:56.166243+07	28780000.00	vnpay	\N	refunded	15437584	NCB
5	4	2026-03-04 11:43:45.440549+07	16194100.00	vnpay	\N	success	15437790	NCB
3	2	2026-03-04 11:43:59.60641+07	1263900.00	cod	\N	refunded	\N	\N
6	5	2026-03-05 09:03:05.310106+07	502205600.00	cod	\N	success	\N	\N
\.

COPY public.thuonghieu (ma_thuonghieu, ten_thuonghieu, mo_ta, is_active, logo, xuat_xu) FROM stdin;
4	TRINX	Khám phá dòng xe đạp Trinx – sự kết hợp tuyệt vời giữa hiệu suất và giá thành. Được trang bị bộ truyền động Shimano danh tiếng và khung hợp kim nhôm siêu nhẹ, các mẫu xe Trinx mang lại cảm giác lái mượt mà, bền bỉ qua thời gian. Đây là giải pháp di chuyển kinh tế nhưng vẫn đảm bảo tính thời trang và độ an toàn cao cho người sử dụng.	t	https://api.xedap.vn/wp-content/uploads/2023/06/trinx.png	\N
5	LIV	Sự kết hợp hoàn mỹ giữa nghệ thuật thiết kế và kỹ thuật cơ khí đỉnh cao. Xe đạp Liv nổi bật với màu sắc tinh tế, trọng lượng siêu nhẹ và khả năng vận hành linh hoạt. Dù bạn là người mới bắt đầu hay một vận động viên lão luyện, Liv mang đến sự tự tin trên từng vòng đạp với hệ thống linh kiện cao cấp và tư thế lái được tối ưu hóa hoàn toàn cho phái nữ.	t	https://api.xedap.vn/wp-content/uploads/2023/06/liv.png	\N
6	MISAKI	Misaki là thương hiệu xe đạp lấy cảm hứng từ sự tỉ mỉ và tiêu chuẩn chất lượng khắt khe của Nhật Bản. Với triết lý lấy người dùng làm trung tâm, mỗi chiếc xe Misaki không chỉ là phương tiện di chuyển mà còn là một tác phẩm nghệ thuật về cơ khí.	t	https://api.xedap.vn/products/LOGO/misaki.png	\N
1	RAPTOR	Raptor là thương hiệu xe đạp danh tiếng chuyên dòng địa hình và thể thao. Tập trung vào phân khúc hiệu năng cao với mức giá hợp lý, Raptor kết hợp hoàn hảo giữa thiết kế khí động học hiện đại và sự bền bỉ của linh kiện cao cấp. Từ các dòng xe trẻ em đến xe địa hình chuyên nghiệp, Raptor luôn ưu tiên sự an toàn và trải nghiệm lái tối ưu cho người dùng.	f	https://api.xedap.vn/products/LOGO/raptor.png	\N
8	BIRDY	"Sự giao thoa giữa kỹ thuật Đức và sự linh hoạt đô thị."	t	https://www.pacific-cycles.com/storage/system/logo/logo2.webp	\N
\.

COPY public.users (ma_user, ten_user, email, password_hash, hovaten, sdt, quyen, status, ngay_lap, cap_nhat_ngay) FROM stdin;
7	vinh	vinh@gmail.com	$2b$12$5AAc3Oq5hkYEed9K8zv/oO7Lt5PRlkWbDo5bGZpq6UTmKySVAWGKe	Nguyễn Văn Vinh	09633890365	customer	active	2026-02-27 13:37:54.531354	2026-03-05 22:36:07.786517
3	quan	quan@gmail.com	$2b$12$9ejtRgmAxcMr1sMDIWueRu9mNLScV.TkTjUx1ZOEGgw6gnrhqyOpC	Bùi Minh Quân	0339886769	customer	active	2026-01-30 09:19:26.745622	2026-03-05 22:51:59.464681
2	trang	trang@gmail.com	$2b$12$3GWFgc2bdwY.TAm6.cWbw.svb8FrMRdVnARkvvLFfCSKg3rW0C0zy	Trần Thị Huyền Trang	0392032243	customer	active	2026-01-30 08:43:33.45075	2026-03-05 22:52:10.18704
24	khe	khe@gmail.com	$2b$12$dsvBmXKVYRAkiaV3l5ago.LdQgBsWoJ6lpN1wGYvFOQ7sLG8q6tb6	Nguyễn Ngọc Khế	0388257891	customer	active	2026-03-03 11:03:54.531102	2026-03-06 09:37:33.676676
6	tien	tien@gmail.com	$2b$12$L4mhUk1YFQjgjSsBObpBpu7xtQHqSl.kFWYSSrQKNF2sWbUROUrkm	Lê Công Tiến 	083294752	customer	active	2026-02-06 16:19:50.392339	2026-03-05 15:48:49.080848
\.

SELECT pg_catalog.setval('public.audit_logs_ma_log_seq', 399, true);

SELECT pg_catalog.setval('public.chitietdonhang_ma_ctdh_seq', 13, true);

SELECT pg_catalog.setval('public.chitietgiohang_ma_ctgh_seq', 192, true);

SELECT pg_catalog.setval('public.danhgia_ma_danhgia_seq', 15, true);

SELECT pg_catalog.setval('public.danhmuc_ma_danhmuc_seq', 9, true);

SELECT pg_catalog.setval('public.dia_chi_ma_dia_chi_seq', 11, true);

SELECT pg_catalog.setval('public.donhang_ma_don_hang_seq', 10, true);

SELECT pg_catalog.setval('public.dsyeuthich_ma_dsyeuthich_seq', 28, true);

SELECT pg_catalog.setval('public.giohang_ma_gio_seq', 10, true);

SELECT pg_catalog.setval('public.hinhanh_ma_anh_seq', 262, true);

SELECT pg_catalog.setval('public.lichsu_donhang_ma_lichsu_seq', 15, true);

SELECT pg_catalog.setval('public.lichsuchat_id_chat_seq', 14, true);

SELECT pg_catalog.setval('public.ma_khuyenmai_ma_khuyenmai_seq', 6, true);

SELECT pg_catalog.setval('public.sanpham_ma_sanpham_seq', 76, true);

SELECT pg_catalog.setval('public.thanhtoan_ma_thanhtoan_seq', 11, true);

SELECT pg_catalog.setval('public.thuonghieu_ma_thuonghieu_seq', 13, true);

SELECT pg_catalog.setval('public.users_ma_user_seq', 26, true);

-- -----------------------------------------------------------------------------
-- PHẦN 6: THIẾT LẬP RÀNG BUỘC VÀ CHỈ MỤC (KEYS & INDEXES)
-- -----------------------------------------------------------------------------

-- Thêm khóa chính (Primary Key)
ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (ma_log);

ALTER TABLE ONLY public.chitietdonhang
    ADD CONSTRAINT chitietdonhang_pkey PRIMARY KEY (ma_ctdh);

ALTER TABLE ONLY public.chitietgiohang
    ADD CONSTRAINT chitietgiohang_pkey PRIMARY KEY (ma_ctgh);

ALTER TABLE ONLY public.danhgia
    ADD CONSTRAINT danhgia_pkey PRIMARY KEY (ma_danhgia);

ALTER TABLE ONLY public.danhmuc
    ADD CONSTRAINT danhmuc_pkey PRIMARY KEY (ma_danhmuc);

ALTER TABLE ONLY public.danhmuc
    ADD CONSTRAINT danhmuc_ten_danhmuc_key UNIQUE (ten_danhmuc);

ALTER TABLE ONLY public.dia_chi
    ADD CONSTRAINT dia_chi_pkey PRIMARY KEY (ma_dia_chi);

ALTER TABLE ONLY public.donhang
    ADD CONSTRAINT donhang_pkey PRIMARY KEY (ma_don_hang);

ALTER TABLE ONLY public.dsyeuthich
    ADD CONSTRAINT dsyeuthich_pkey PRIMARY KEY (ma_dsyeuthich);

ALTER TABLE ONLY public.giohang
    ADD CONSTRAINT giohang_ma_user_key UNIQUE (ma_user);

ALTER TABLE ONLY public.giohang
    ADD CONSTRAINT giohang_pkey PRIMARY KEY (ma_gio);

ALTER TABLE ONLY public.hinhanh
    ADD CONSTRAINT hinhanh_pkey PRIMARY KEY (ma_anh);

ALTER TABLE ONLY public.lichsu_donhang
    ADD CONSTRAINT lichsu_donhang_pkey PRIMARY KEY (ma_lichsu);

ALTER TABLE ONLY public.lichsuchat
    ADD CONSTRAINT lichsuchat_pkey PRIMARY KEY (id_chat);

ALTER TABLE ONLY public.ma_khuyenmai
    ADD CONSTRAINT ma_khuyenmai_ma_giamgia_key UNIQUE (ma_giamgia);

ALTER TABLE ONLY public.ma_khuyenmai
    ADD CONSTRAINT ma_khuyenmai_pkey PRIMARY KEY (ma_khuyenmai);

ALTER TABLE ONLY public.sanpham
    ADD CONSTRAINT sanpham_pkey PRIMARY KEY (ma_sanpham);

ALTER TABLE ONLY public.sanpham
    ADD CONSTRAINT sanpham_sanpham_code_key UNIQUE (sanpham_code);

ALTER TABLE ONLY public.thanhtoan
    ADD CONSTRAINT thanhtoan_pkey PRIMARY KEY (ma_thanhtoan);

ALTER TABLE ONLY public.thuonghieu
    ADD CONSTRAINT thuonghieu_pkey PRIMARY KEY (ma_thuonghieu);

ALTER TABLE ONLY public.thuonghieu
    ADD CONSTRAINT thuonghieu_ten_thuonghieu_key UNIQUE (ten_thuonghieu);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_sdt UNIQUE (sdt);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (ma_user);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_ten_user_key UNIQUE (ten_user);

-- ============================================================================
-- TẠO INDEX (TỐI ƯU HIỆU NĂNG QUERY)
-- ============================================================================

CREATE INDEX idx_chitietdonhang_sanpham ON public.chitietdonhang USING btree (ma_sanpham);

CREATE INDEX ix_audit_logs_action ON public.audit_logs USING btree (action);

CREATE INDEX ix_audit_logs_ma_log ON public.audit_logs USING btree (ma_log);

CREATE INDEX ix_audit_logs_ma_nguoidung ON public.audit_logs USING btree (ma_nguoidung);

CREATE INDEX ix_audit_logs_resource_type ON public.audit_logs USING btree (resource_type);

CREATE INDEX ix_audit_logs_timestamp ON public.audit_logs USING btree ("timestamp");

CREATE INDEX ix_chitietdonhang_ma_ctdh ON public.chitietdonhang USING btree (ma_ctdh);

CREATE INDEX ix_chitietgiohang_ma_ctgh ON public.chitietgiohang USING btree (ma_ctgh);

CREATE INDEX ix_danhgia_ma_danhgia ON public.danhgia USING btree (ma_danhgia);

CREATE INDEX ix_danhmuc_ma_danhmuc ON public.danhmuc USING btree (ma_danhmuc);

CREATE INDEX ix_dia_chi_ma_dia_chi ON public.dia_chi USING btree (ma_dia_chi);

CREATE INDEX ix_donhang_date ON public.donhang USING btree (ngay_dat);

CREATE INDEX ix_donhang_ma_don_hang ON public.donhang USING btree (ma_don_hang);

CREATE INDEX ix_donhang_status ON public.donhang USING btree (trang_thai);

CREATE INDEX ix_donhang_user ON public.donhang USING btree (ma_user);

CREATE INDEX ix_donhang_user_status ON public.donhang USING btree (ma_user, trang_thai);

CREATE INDEX ix_dsyeuthich_ma_dsyeuthich ON public.dsyeuthich USING btree (ma_dsyeuthich);

CREATE INDEX ix_giohang_ma_gio ON public.giohang USING btree (ma_gio);

CREATE INDEX ix_hinhanh_ma_anh ON public.hinhanh USING btree (ma_anh);

CREATE INDEX ix_lichsuchat_id_chat ON public.lichsuchat USING btree (id_chat);

CREATE INDEX ix_ma_khuyenmai_ma_khuyenmai ON public.ma_khuyenmai USING btree (ma_khuyenmai);

CREATE INDEX ix_sanpham_is_active ON public.sanpham USING btree (is_active);

CREATE INDEX ix_sanpham_ma_danhmuc ON public.sanpham USING btree (ma_danhmuc);

CREATE INDEX ix_sanpham_ma_sanpham ON public.sanpham USING btree (ma_sanpham);

CREATE INDEX ix_sanpham_ma_thuonghieu ON public.sanpham USING btree (ma_thuonghieu);

CREATE INDEX ix_sanpham_ngay_lap ON public.sanpham USING btree (ngay_lap);

CREATE INDEX ix_thanhtoan_ma_thanhtoan ON public.thanhtoan USING btree (ma_thanhtoan);

CREATE INDEX ix_thuonghieu_ma_thuonghieu ON public.thuonghieu USING btree (ma_thuonghieu);

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);

CREATE INDEX ix_users_ma_user ON public.users USING btree (ma_user);

-- Trigger: Cập nhật tồn kho ngay sau khi thêm chi tiết đơn hàng mới
CREATE TRIGGER trg_update_inventory BEFORE INSERT ON public.chitietdonhang FOR EACH ROW EXECUTE FUNCTION public.update_inventory_after_checkout();

-- Trigger: Tính lại điểm đánh giá khi người dùng gửi/sửa/xóa đánh giá
CREATE TRIGGER trigger_update_diem_danh_gia AFTER INSERT OR DELETE OR UPDATE ON public.danhgia FOR EACH ROW EXECUTE FUNCTION public.update_diem_danh_gia_sanpham();

-- Trigger: Cập nhật ngày chỉnh sửa cho bảng người dùng
CREATE TRIGGER users_cap_nhat_ngay_trigger BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_cap_nhat_ngay_column();

-- THÊM KHÓA NGOẠI (FOREIGN KEYS)
ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_ma_nguoidung_fkey FOREIGN KEY (ma_nguoidung) REFERENCES public.users(ma_user);

ALTER TABLE ONLY public.chitietdonhang
    ADD CONSTRAINT chitietdonhang_ma_don_hang_fkey FOREIGN KEY (ma_don_hang) REFERENCES public.donhang(ma_don_hang);

ALTER TABLE ONLY public.chitietdonhang
    ADD CONSTRAINT chitietdonhang_ma_sanpham_fkey FOREIGN KEY (ma_sanpham) REFERENCES public.sanpham(ma_sanpham);

ALTER TABLE ONLY public.chitietgiohang
    ADD CONSTRAINT chitietgiohang_ma_gio_fkey FOREIGN KEY (ma_gio) REFERENCES public.giohang(ma_gio) ON DELETE CASCADE;

ALTER TABLE ONLY public.chitietgiohang
    ADD CONSTRAINT chitietgiohang_ma_sanpham_fkey FOREIGN KEY (ma_sanpham) REFERENCES public.sanpham(ma_sanpham) ON DELETE CASCADE;

ALTER TABLE ONLY public.danhgia
    ADD CONSTRAINT danhgia_ma_sanpham_fkey FOREIGN KEY (ma_sanpham) REFERENCES public.sanpham(ma_sanpham) ON DELETE CASCADE;

ALTER TABLE ONLY public.danhgia
    ADD CONSTRAINT danhgia_ma_user_fkey FOREIGN KEY (ma_user) REFERENCES public.users(ma_user) ON DELETE CASCADE;

ALTER TABLE ONLY public.dia_chi
    ADD CONSTRAINT dia_chi_ma_user_fkey FOREIGN KEY (ma_user) REFERENCES public.users(ma_user);

ALTER TABLE ONLY public.donhang
    ADD CONSTRAINT donhang_ma_khuyenmai_fkey FOREIGN KEY (ma_khuyenmai) REFERENCES public.ma_khuyenmai(ma_khuyenmai);

ALTER TABLE ONLY public.donhang
    ADD CONSTRAINT donhang_ma_user_fkey FOREIGN KEY (ma_user) REFERENCES public.users(ma_user);

ALTER TABLE ONLY public.dsyeuthich
    ADD CONSTRAINT dsyeuthich_ma_sanpham_fkey FOREIGN KEY (ma_sanpham) REFERENCES public.sanpham(ma_sanpham) ON DELETE CASCADE;

ALTER TABLE ONLY public.dsyeuthich
    ADD CONSTRAINT dsyeuthich_ma_user_fkey FOREIGN KEY (ma_user) REFERENCES public.users(ma_user) ON DELETE CASCADE;

ALTER TABLE ONLY public.lichsu_donhang
    ADD CONSTRAINT fk_don_hang FOREIGN KEY (ma_don_hang) REFERENCES public.donhang(ma_don_hang) ON DELETE CASCADE;

ALTER TABLE ONLY public.giohang
    ADD CONSTRAINT giohang_ma_user_fkey FOREIGN KEY (ma_user) REFERENCES public.users(ma_user);

ALTER TABLE ONLY public.hinhanh
    ADD CONSTRAINT hinhanh_ma_sanpham_fkey FOREIGN KEY (ma_sanpham) REFERENCES public.sanpham(ma_sanpham) ON DELETE CASCADE;

ALTER TABLE ONLY public.lichsuchat
    ADD CONSTRAINT lichsuchat_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(ma_user);

ALTER TABLE ONLY public.sanpham
    ADD CONSTRAINT sanpham_ma_danhmuc_fkey FOREIGN KEY (ma_danhmuc) REFERENCES public.danhmuc(ma_danhmuc);

ALTER TABLE ONLY public.sanpham
    ADD CONSTRAINT sanpham_ma_thuonghieu_fkey FOREIGN KEY (ma_thuonghieu) REFERENCES public.thuonghieu(ma_thuonghieu);

ALTER TABLE ONLY public.thanhtoan
    ADD CONSTRAINT thanhtoan_ma_don_hang_fkey FOREIGN KEY (ma_don_hang) REFERENCES public.donhang(ma_don_hang);

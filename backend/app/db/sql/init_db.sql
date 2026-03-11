--
-- PostgreSQL database dump
--

\restrict iPa6xZ4Xmb1Al90Rjj2noNOdo07qafIKLhPIDxlQxAb3mdeFD9RhAjh7euDYLZT

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

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
-- *not* dropping schema, since initdb creates it
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- Name: chitiet_thanhtoan; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.chitiet_thanhtoan AS ENUM (
    'pending',
    'success',
    'failed',
    'refunded'
);


--
-- Name: kieu_giam_gia; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.kieu_giam_gia AS ENUM (
    'percentage',
    'fixed_amount'
);


--
-- Name: paymentmethod; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.paymentmethod AS ENUM (
    'MOMO',
    'VNPAY',
    'COD',
    'BANKING'
);


--
-- Name: paymentstatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.paymentstatus AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED',
    'REFUNDED'
);


--
-- Name: phuong_thuc_payment; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.phuong_thuc_payment AS ENUM (
    'cod',
    'banking',
    'credit_card'
);


--
-- Name: quyen; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.quyen AS ENUM (
    'customer',
    'admin'
);


--
-- Name: trang_thai_order; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.trang_thai_order AS ENUM (
    'pending',
    'confirmed',
    'shipping',
    'completed',
    'cancelled'
);


--
-- Name: trang_thai_payment; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.trang_thai_payment AS ENUM (
    'pending',
    'paid',
    'failed'
);


--
-- Name: trang_thai_review; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.trang_thai_review AS ENUM (
    'pending',
    'approved',
    'rejected'
);


--
-- Name: trang_thai_user; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.trang_thai_user AS ENUM (
    'active',
    'inactive',
    'banned'
);


--
-- Name: update_cap_nhat_ngay_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_cap_nhat_ngay_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.cap_nhat_ngay = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


--
-- Name: update_diem_danh_gia_sanpham(); Type: FUNCTION; Schema: public; Owner: -
--

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


--
-- Name: update_inventory_after_checkout(); Type: FUNCTION; Schema: public; Owner: -
--

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


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: audit_logs_ma_log_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.audit_logs_ma_log_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: audit_logs_ma_log_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.audit_logs_ma_log_seq OWNED BY public.audit_logs.ma_log;


--
-- Name: chitietdonhang; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: chitietdonhang_ma_ctdh_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chitietdonhang_ma_ctdh_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chitietdonhang_ma_ctdh_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chitietdonhang_ma_ctdh_seq OWNED BY public.chitietdonhang.ma_ctdh;


--
-- Name: chitietgiohang; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chitietgiohang (
    ma_ctgh integer NOT NULL,
    ma_gio integer NOT NULL,
    ma_sanpham integer NOT NULL,
    so_luong integer DEFAULT 1,
    gia_hien_tai double precision NOT NULL,
    mau_sac character varying(50)
);


--
-- Name: chitietgiohang_ma_ctgh_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chitietgiohang_ma_ctgh_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chitietgiohang_ma_ctgh_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chitietgiohang_ma_ctgh_seq OWNED BY public.chitietgiohang.ma_ctgh;


--
-- Name: danhgia; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: danhgia_ma_danhgia_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.danhgia_ma_danhgia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: danhgia_ma_danhgia_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.danhgia_ma_danhgia_seq OWNED BY public.danhgia.ma_danhgia;


--
-- Name: danhmuc; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.danhmuc (
    ma_danhmuc integer NOT NULL,
    ten_danhmuc character varying(100) NOT NULL,
    mo_ta text,
    is_active boolean DEFAULT true,
    hinh_anh character varying(500)
);


--
-- Name: danhmuc_ma_danhmuc_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.danhmuc_ma_danhmuc_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: danhmuc_ma_danhmuc_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.danhmuc_ma_danhmuc_seq OWNED BY public.danhmuc.ma_danhmuc;


--
-- Name: dia_chi; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: dia_chi_ma_dia_chi_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dia_chi_ma_dia_chi_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dia_chi_ma_dia_chi_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dia_chi_ma_dia_chi_seq OWNED BY public.dia_chi.ma_dia_chi;


--
-- Name: donhang; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: donhang_ma_don_hang_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.donhang_ma_don_hang_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: donhang_ma_don_hang_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.donhang_ma_don_hang_seq OWNED BY public.donhang.ma_don_hang;


--
-- Name: dsyeuthich; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dsyeuthich (
    ma_dsyeuthich integer NOT NULL,
    ma_user integer NOT NULL,
    ma_sanpham integer NOT NULL,
    ngay_lap timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: dsyeuthich_ma_dsyeuthich_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dsyeuthich_ma_dsyeuthich_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dsyeuthich_ma_dsyeuthich_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dsyeuthich_ma_dsyeuthich_seq OWNED BY public.dsyeuthich.ma_dsyeuthich;


--
-- Name: giohang; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.giohang (
    ma_gio integer NOT NULL,
    ma_user integer NOT NULL,
    ngay_tao timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: giohang_ma_gio_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.giohang_ma_gio_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: giohang_ma_gio_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.giohang_ma_gio_seq OWNED BY public.giohang.ma_gio;


--
-- Name: hinhanh; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hinhanh (
    ma_anh integer NOT NULL,
    ma_sanpham integer NOT NULL,
    image_url character varying(255) NOT NULL,
    is_main boolean DEFAULT false,
    mau character varying(50)
);


--
-- Name: hinhanh_ma_anh_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hinhanh_ma_anh_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hinhanh_ma_anh_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hinhanh_ma_anh_seq OWNED BY public.hinhanh.ma_anh;


--
-- Name: lichsu_donhang; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lichsu_donhang (
    ma_lichsu integer NOT NULL,
    ma_don_hang integer NOT NULL,
    trang_thai character varying(50) NOT NULL,
    mo_ta text,
    thoi_gian timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: lichsu_donhang_ma_lichsu_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lichsu_donhang_ma_lichsu_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: lichsu_donhang_ma_lichsu_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lichsu_donhang_ma_lichsu_seq OWNED BY public.lichsu_donhang.ma_lichsu;


--
-- Name: lichsuchat; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lichsuchat (
    id_chat integer NOT NULL,
    user_id integer,
    role character varying(20),
    message text,
    context_type character varying(50) DEFAULT 'admin_ai'::character varying,
    thoi_gian timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: lichsuchat_id_chat_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lichsuchat_id_chat_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: lichsuchat_id_chat_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lichsuchat_id_chat_seq OWNED BY public.lichsuchat.id_chat;


--
-- Name: ma_khuyenmai; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: ma_khuyenmai_ma_khuyenmai_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ma_khuyenmai_ma_khuyenmai_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ma_khuyenmai_ma_khuyenmai_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ma_khuyenmai_ma_khuyenmai_seq OWNED BY public.ma_khuyenmai.ma_khuyenmai;


--
-- Name: sanpham; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: sanpham_ma_sanpham_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sanpham_ma_sanpham_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sanpham_ma_sanpham_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sanpham_ma_sanpham_seq OWNED BY public.sanpham.ma_sanpham;


--
-- Name: thanhtoan; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: thanhtoan_ma_thanhtoan_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.thanhtoan_ma_thanhtoan_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: thanhtoan_ma_thanhtoan_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.thanhtoan_ma_thanhtoan_seq OWNED BY public.thanhtoan.ma_thanhtoan;


--
-- Name: thuonghieu; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.thuonghieu (
    ma_thuonghieu integer NOT NULL,
    ten_thuonghieu character varying(100) NOT NULL,
    mo_ta text,
    is_active boolean DEFAULT true,
    logo character varying(500),
    xuat_xu character varying(100)
);


--
-- Name: thuonghieu_ma_thuonghieu_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.thuonghieu_ma_thuonghieu_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: thuonghieu_ma_thuonghieu_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.thuonghieu_ma_thuonghieu_seq OWNED BY public.thuonghieu.ma_thuonghieu;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: users_ma_user_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_ma_user_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_ma_user_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_ma_user_seq OWNED BY public.users.ma_user;


--
-- Name: audit_logs ma_log; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN ma_log SET DEFAULT nextval('public.audit_logs_ma_log_seq'::regclass);


--
-- Name: chitietdonhang ma_ctdh; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chitietdonhang ALTER COLUMN ma_ctdh SET DEFAULT nextval('public.chitietdonhang_ma_ctdh_seq'::regclass);


--
-- Name: chitietgiohang ma_ctgh; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chitietgiohang ALTER COLUMN ma_ctgh SET DEFAULT nextval('public.chitietgiohang_ma_ctgh_seq'::regclass);


--
-- Name: danhgia ma_danhgia; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.danhgia ALTER COLUMN ma_danhgia SET DEFAULT nextval('public.danhgia_ma_danhgia_seq'::regclass);


--
-- Name: danhmuc ma_danhmuc; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.danhmuc ALTER COLUMN ma_danhmuc SET DEFAULT nextval('public.danhmuc_ma_danhmuc_seq'::regclass);


--
-- Name: dia_chi ma_dia_chi; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dia_chi ALTER COLUMN ma_dia_chi SET DEFAULT nextval('public.dia_chi_ma_dia_chi_seq'::regclass);


--
-- Name: donhang ma_don_hang; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.donhang ALTER COLUMN ma_don_hang SET DEFAULT nextval('public.donhang_ma_don_hang_seq'::regclass);


--
-- Name: dsyeuthich ma_dsyeuthich; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dsyeuthich ALTER COLUMN ma_dsyeuthich SET DEFAULT nextval('public.dsyeuthich_ma_dsyeuthich_seq'::regclass);


--
-- Name: giohang ma_gio; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.giohang ALTER COLUMN ma_gio SET DEFAULT nextval('public.giohang_ma_gio_seq'::regclass);


--
-- Name: hinhanh ma_anh; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hinhanh ALTER COLUMN ma_anh SET DEFAULT nextval('public.hinhanh_ma_anh_seq'::regclass);


--
-- Name: lichsu_donhang ma_lichsu; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lichsu_donhang ALTER COLUMN ma_lichsu SET DEFAULT nextval('public.lichsu_donhang_ma_lichsu_seq'::regclass);


--
-- Name: lichsuchat id_chat; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lichsuchat ALTER COLUMN id_chat SET DEFAULT nextval('public.lichsuchat_id_chat_seq'::regclass);


--
-- Name: ma_khuyenmai ma_khuyenmai; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ma_khuyenmai ALTER COLUMN ma_khuyenmai SET DEFAULT nextval('public.ma_khuyenmai_ma_khuyenmai_seq'::regclass);


--
-- Name: sanpham ma_sanpham; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sanpham ALTER COLUMN ma_sanpham SET DEFAULT nextval('public.sanpham_ma_sanpham_seq'::regclass);


--
-- Name: thanhtoan ma_thanhtoan; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.thanhtoan ALTER COLUMN ma_thanhtoan SET DEFAULT nextval('public.thanhtoan_ma_thanhtoan_seq'::regclass);


--
-- Name: thuonghieu ma_thuonghieu; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.thuonghieu ALTER COLUMN ma_thuonghieu SET DEFAULT nextval('public.thuonghieu_ma_thuonghieu_seq'::regclass);


--
-- Name: users ma_user; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN ma_user SET DEFAULT nextval('public.users_ma_user_seq'::regclass);


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.alembic_version (version_num) FROM stdin;
a453e49fc7f8
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.audit_logs (ma_log, ma_nguoidung, action, resource_type, resource_id, description, details, ip_address, user_agent, "timestamp") FROM stdin;
1	1	update	order	6	Cập nhật trạng thái đơn #6: confirmed → cancelled	{"old_status": "confirmed", "new_status": "cancelled"}	\N	\N	2026-03-02 23:19:20.698781+07
2	1	update	order	7	Cập nhật trạng thái đơn #7: pending → confirmed	{"old_status": "pending", "new_status": "confirmed"}	\N	\N	2026-03-03 09:39:53.88344+07
3	1	update	order	4	Hoàn tiền đơn #4	{"old_payment_status": "paid", "new_payment_status": "refunded"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-03 09:48:39.36266+07
4	1	update	order	5	Cập nhật trạng thái đơn #5: shipping → delivered	{"old_status": "shipping", "new_status": "delivered"}	\N	\N	2026-03-03 09:54:51.660253+07
5	1	update	product	60	Cập nhật sản phẩm: Xe Đạp Địa Hình MTB GIANT XTC 800 – Phanh Đĩa, Bánh 27 Inches	{"product_code": "MGX-827"}	\N	\N	2026-03-03 10:11:42.454283+07
6	1	update	product	60	Cập nhật sản phẩm: Xe Đạp Địa Hình MTB GIANT XTC 800 – Phanh Đĩa, Bánh 27 Inches	{"product_code": "MGX-827"}	\N	\N	2026-03-03 10:27:46.866789+07
7	1	update	product	61	Cập nhật sản phẩm: Xe Đạp Địa Hình MTB TRINX M137 Elite – Phanh Đĩa, Bánh 27 Inches	{"product_code": "MTE-127"}	\N	\N	2026-03-03 10:28:07.306384+07
8	1	update	product	60	Cập nhật sản phẩm: Xe Đạp Địa Hình MTB GIANT XTC 800 – Phanh Đĩa, Bánh 27 Inches	{"product_code": "MGX-827"}	\N	\N	2026-03-03 10:28:14.976746+07
9	1	update	product	68	Cập nhật sản phẩm: Xe Đạp Nữ Đường Phố Touring GIANT Escape 3 Disc - Phanh Đĩa, Bánh 700C - 2025	{"product_code": "TGE-372"}	\N	\N	2026-03-03 10:28:34.287812+07
10	1	update	product	60	Cập nhật sản phẩm: Xe Đạp Địa Hình MTB GIANT XTC 800 – Phanh Đĩa, Bánh 27 Inches	{"product_code": "MGX-827"}	\N	\N	2026-03-03 10:41:22.548826+07
11	1	delete	user	23	admin đã XÓA VĨNH VIỄN tài khoản: #23 (khe - khe@gmail.com)	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-03 10:54:51.42327+07
12	1	update	order	1	Cập nhật trạng thái đơn #1: pending → delivered	{"old_status": "pending", "new_status": "delivered"}	\N	\N	2026-03-03 11:06:32.075928+07
13	1	update	order	1	Hoàn tiền đơn #1	{"old_payment_status": "paid", "new_payment_status": "refunded"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-03 11:06:48.443155+07
14	1	update	order	1	Cập nhật trạng thái đơn #1: returned → pending	{"old_status": "returned", "new_status": "pending"}	\N	\N	2026-03-03 11:09:13.911329+07
15	1	update	order	1	Cập nhật trạng thái đơn #1: pending → confirmed	{"old_status": "pending", "new_status": "confirmed"}	\N	\N	2026-03-03 11:09:19.868944+07
16	1	update	order	1	Cập nhật trạng thái đơn #1: confirmed → shipping	{"old_status": "confirmed", "new_status": "shipping"}	\N	\N	2026-03-03 11:09:21.7958+07
17	1	update	order	1	Cập nhật trạng thái đơn #1: shipping → delivered	{"old_status": "shipping", "new_status": "delivered"}	\N	\N	2026-03-03 11:09:23.854724+07
18	1	update	order	1	Cập nhật trạng thái đơn #1: pending → delivered	{"old_status": "pending", "new_status": "delivered"}	\N	\N	2026-03-03 11:13:12.53846+07
19	1	update	order	1	Hoàn tiền đơn #1	{"old_payment_status": "paid", "new_payment_status": "refunded"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-03 11:16:22.835319+07
20	1	update	order	2	Cập nhật trạng thái đơn #2: pending → delivered	{"old_status": "pending", "new_status": "delivered"}	\N	\N	2026-03-03 20:41:46.8662+07
21	1	update	product	68	Cập nhật sản phẩm: Xe Đạp Nữ Đường Phố Touring GIANT Escape 3 Disc - Phanh Đĩa, Bánh 700C - 2025	{"product_code": "TGE-372"}	\N	\N	2026-03-03 20:52:35.017477+07
22	1	update	product	42	Cập nhật sản phẩm: Xe Đạp Trẻ Em Youth TRINX Princess – Bánh 18 Inches	{"product_code": "YTP-18I"}	\N	\N	2026-03-03 21:13:53.112392+07
23	1	update	product	43	Cập nhật sản phẩm: Xe Đạp Trẻ Em Youth MISAKI Chino 1 – Bánh 12 Inches	{"product_code": "YMC-112"}	\N	\N	2026-03-03 21:20:06.679543+07
24	1	update	order	3	Hoàn tiền đơn #3	{"old_payment_status": "paid", "new_payment_status": "refunded"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 06:24:28.606745+07
25	1	delete	user	22	admin đã XÓA VĨNH VIỄN tài khoản: #22 (testuser123 - testuser@example.com)	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 07:19:18.540173+07
26	1	update	user	6	admin đã cập nhật trạng thái user #6 (tien) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 07:30:47.619391+07
27	1	update	user	6	admin đã cập nhật trạng thái user #6 (tien) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 07:30:53.086471+07
28	1	update	user	2	admin đã cập nhật trạng thái user #2 (trang) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 07:32:16.011036+07
29	1	update	user	2	admin đã cập nhật trạng thái user #2 (trang) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 07:32:23.093478+07
30	1	update	user	3	admin đã cập nhật trạng thái user #3 (quan) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 07:34:21.926786+07
31	1	update	user	3	admin đã cập nhật trạng thái user #3 (quan) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 07:34:32.184001+07
32	1	update	user	24	admin đã cập nhật trạng thái user #24 (khe) thành TrangThaiUserEnum.inactive	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 07:34:40.308446+07
33	1	update	user	24	admin đã cập nhật trạng thái user #24 (khe) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 07:35:04.414649+07
34	1	update	user	6	admin đã cập nhật trạng thái user #6 (tien) thành TrangThaiUserEnum.inactive	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 08:33:25.407762+07
35	1	update	user	6	admin đã cập nhật trạng thái user #6 (tien) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 08:33:43.522587+07
36	1	update	user	6	admin đã cập nhật trạng thái user #6 (tien) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 08:33:47.195697+07
37	1	update	user	24	admin đã cập nhật trạng thái user #24 (khe) thành TrangThaiUserEnum.inactive	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 08:35:14.625829+07
38	1	update	user	24	admin đã cập nhật trạng thái user #24 (khe) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 08:40:21.720077+07
39	1	update	user	24	admin đã cập nhật trạng thái user #24 (khe) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 08:40:33.112856+07
40	1	update	user	24	admin đã cập nhật trạng thái user #24 (khe) thành TrangThaiUserEnum.inactive	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 08:41:19.668036+07
41	1	update	user	24	admin đã cập nhật trạng thái user #24 (khe) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 08:43:43.271869+07
42	1	update	user	24	admin đã cập nhật trạng thái user #24 (khe) thành TrangThaiUserEnum.inactive	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 08:45:35.15167+07
43	1	update	user	24	admin đã cập nhật trạng thái user #24 (khe) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 08:45:59.456421+07
44	1	update	user	24	admin đã cập nhật trạng thái user #24 (khe) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 08:46:07.440558+07
45	1	update	user	24	admin đã cập nhật trạng thái user #24 (khe) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 10:13:59.289477+07
46	1	update	order	4	Cập nhật trạng thái đơn #4: pending → confirmed	{"old_status": "pending", "new_status": "confirmed"}	\N	\N	2026-03-04 10:31:21.199139+07
47	1	update	order	4	Chuyển về chưa thanh toán đơn #4	{"old_payment_status": "paid", "new_payment_status": "pending"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 11:43:26.399711+07
48	1	update	order	4	Xác nhận đã thu tiền đơn #4	{"old_payment_status": "pending", "new_payment_status": "paid"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 11:43:31.909199+07
49	1	update	order	4	Chuyển về chưa thanh toán đơn #4	{"old_payment_status": "paid", "new_payment_status": "pending"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 11:43:44.003252+07
50	1	update	order	4	Xác nhận đã thu tiền đơn #4	{"old_payment_status": "pending", "new_payment_status": "paid"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 11:43:45.459211+07
51	1	update	order	2	Chuyển về chưa thanh toán đơn #2	{"old_payment_status": "paid", "new_payment_status": "pending"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 11:43:57.081393+07
52	1	update	order	2	Xác nhận đã thu tiền đơn #2	{"old_payment_status": "pending", "new_payment_status": "paid"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 11:43:59.617911+07
53	1	update	order	2	Hoàn tiền đơn #2	{"old_payment_status": "paid", "new_payment_status": "refunded"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 11:44:06.594832+07
54	1	update	product	69	Cập nhật sản phẩm: Xe Đạp Nữ Đường Phố Touring LIV Alight 2 DD City Disc - Phanh Đĩa, Bánh 700C - 2022	{"product_code": "TLA-271"}	\N	\N	2026-03-04 11:52:41.20892+07
55	1	update	product	68	Cập nhật sản phẩm: Xe Đạp Nữ Đường Phố Touring GIANT Escape 3 Disc - Phanh Đĩa, Bánh 700C - 2025	{"product_code": "TGE-372"}	\N	\N	2026-03-04 11:52:42.616849+07
56	1	update	product	67	Cập nhật sản phẩm: Xe Đạp Nữ Đường Phố Touring LIV Alight 3 Disc - Phanh Đĩa, Bánh 700C - 2025	{"product_code": "TLA-372"}	\N	\N	2026-03-04 11:52:43.503161+07
57	1	update	product	34	Cập nhật sản phẩm: Xe Đạp Trẻ Em Youth RAPTOR Helen 1 - Bánh 20 Inch	{"product_code": "YRH-120"}	\N	\N	2026-03-04 12:39:39.143999+07
58	1	update	product	33	Cập nhật sản phẩm: Xe Đạp Trẻ Em Youth RAPTOR Elsa 1 - Bánh 12 Inch	{"product_code": "YRE-112"}	\N	\N	2026-03-04 12:39:41.240287+07
59	1	update	product	32	Cập nhật sản phẩm: Xe Đạp Trẻ Em Youth RAPTOR Jubby 2 - Bánh 22 Inch	{"product_code": "YRJ-222"}	\N	\N	2026-03-04 12:39:42.24539+07
60	1	update	product	18	Cập nhật sản phẩm: Xe Đạp Trẻ Em Youth RAPTOR Jubby 1 - Bánh 20 Inch	{"product_code": "YRJ-120"}	\N	\N	2026-03-04 12:39:43.257941+07
61	1	update	product	17	Cập nhật sản phẩm: Xe Đạp Trẻ Em Youth RAPTOR Rock 2 - Bánh 20 Inch	{"product_code": "YRR-220"}	\N	\N	2026-03-04 12:39:44.755077+07
62	1	update	product	10	Cập nhật sản phẩm: Xe Đạp Trẻ Em Youth RAPTOR Elsa 2 - Bánh 14 Inch	{"product_code": "YRE-214"}	\N	\N	2026-03-04 12:40:33.337613+07
63	1	update	product	69	Cập nhật sản phẩm: Xe Đạp Nữ Đường Phố Touring LIV Alight 2 DD City Disc - Phanh Đĩa, Bánh 700C - 2022	{"product_code": "TLA-271"}	\N	\N	2026-03-04 12:44:25.58122+07
64	1	update	product	68	Cập nhật sản phẩm: Xe Đạp Nữ Đường Phố Touring GIANT Escape 3 Disc - Phanh Đĩa, Bánh 700C - 2025	{"product_code": "TGE-372"}	\N	\N	2026-03-04 12:44:45.872016+07
65	1	update	product	68	Cập nhật sản phẩm: Xe Đạp Nữ Đường Phố Touring GIANT Escape 3 Disc - Phanh Đĩa, Bánh 700C - 2025	{"product_code": "TGE-372"}	\N	\N	2026-03-04 12:44:46.600676+07
66	1	update	product	68	Cập nhật sản phẩm: Xe Đạp Nữ Đường Phố Touring GIANT Escape 3 Disc - Phanh Đĩa, Bánh 700C - 2025	{"product_code": "TGE-372"}	\N	\N	2026-03-04 12:44:47.544709+07
67	1	update	product	68	Cập nhật sản phẩm: Xe Đạp Nữ Đường Phố Touring GIANT Escape 3 Disc - Phanh Đĩa, Bánh 700C - 2025	{"product_code": "TGE-372"}	\N	\N	2026-03-04 12:45:04.259348+07
69	1	update	product	63	Cập nhật sản phẩm: Xe Đạp Địa Hình MTB TRINX GT27.5 – Phanh Đĩa, Bánh 27 Inches	{"product_code": "MTG-275"}	\N	\N	2026-03-04 12:47:07.631536+07
71	1	update	product	67	Cập nhật sản phẩm: Xe Đạp Nữ Đường Phố Touring LIV Alight 3 Disc - Phanh Đĩa, Bánh 700C - 2025	{"product_code": "TLA-372"}	\N	\N	2026-03-04 12:47:28.508604+07
74	1	update	product	17	Cập nhật sản phẩm: Xe Đạp Trẻ Em Youth RAPTOR Rock 2 - Bánh 20 Inch	{"product_code": "YRR-220"}	\N	\N	2026-03-04 12:47:41.073253+07
77	1	update	product	33	Cập nhật sản phẩm: Xe Đạp Trẻ Em Youth RAPTOR Elsa 1 - Bánh 12 Inch	{"product_code": "YRE-112"}	\N	\N	2026-03-04 12:47:42.840912+07
68	1	update	product	63	Cập nhật sản phẩm: Xe Đạp Địa Hình MTB TRINX GT27.5 – Phanh Đĩa, Bánh 27 Inches	{"product_code": "MTG-275"}	\N	\N	2026-03-04 12:46:52.408723+07
72	1	update	product	34	Cập nhật sản phẩm: Xe Đạp Trẻ Em Youth RAPTOR Helen 1 - Bánh 20 Inch	{"product_code": "YRH-120"}	\N	\N	2026-03-04 12:47:36.663649+07
75	1	update	product	18	Cập nhật sản phẩm: Xe Đạp Trẻ Em Youth RAPTOR Jubby 1 - Bánh 20 Inch	{"product_code": "YRJ-120"}	\N	\N	2026-03-04 12:47:41.700402+07
70	1	update	product	68	Cập nhật sản phẩm: Xe Đạp Nữ Đường Phố Touring GIANT Escape 3 Disc - Phanh Đĩa, Bánh 700C - 2025	{"product_code": "TGE-372"}	\N	\N	2026-03-04 12:47:27.305929+07
73	1	update	product	10	Cập nhật sản phẩm: Xe Đạp Trẻ Em Youth RAPTOR Elsa 2 - Bánh 14 Inch	{"product_code": "YRE-214"}	\N	\N	2026-03-04 12:47:39.239928+07
76	1	update	product	32	Cập nhật sản phẩm: Xe Đạp Trẻ Em Youth RAPTOR Jubby 2 - Bánh 22 Inch	{"product_code": "YRJ-222"}	\N	\N	2026-03-04 12:47:42.245469+07
78	1	update	order	4	Cập nhật trạng thái đơn #4: confirmed → shipping	{"old_status": "confirmed", "new_status": "shipping"}	\N	\N	2026-03-04 13:27:23.344296+07
79	1	update	user	7	admin đã cập nhật thông tin user #7 (vinh)	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 13:49:45.794545+07
80	1	update	user	24	admin đã cập nhật thông tin user #24 (khe)	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 13:49:55.546585+07
81	24	login	\N	\N	Tài khoản: khe đã đăng nhập vào hệ thống	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 13:50:09.742015+07
82	24	logout	\N	\N	Tài khoản: khe đã đăng xuất khỏi hệ thống	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 13:50:49.020803+07
83	1	login	\N	\N	Tài khoản: admin đã đăng nhập vào hệ thống	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 13:51:16.41175+07
84	1	update	user	24	admin đã cập nhật thông tin user #24 (khe)	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 13:51:45.713594+07
85	1	logout	\N	\N	Tài khoản: admin đã đăng xuất khỏi hệ thống	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 13:51:59.991035+07
86	1	login	\N	\N	Tài khoản: admin đã đăng nhập vào hệ thống	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 13:56:29.559953+07
87	1	login	\N	\N	Tài khoản: admin đã đăng nhập vào hệ thống	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 14:19:37.795234+07
88	1	logout	\N	\N	Tài khoản: admin đã đăng xuất khỏi hệ thống	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 14:19:52.095066+07
89	1	login	\N	\N	Tài khoản: admin đã đăng nhập vào hệ thống	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 14:20:37.296306+07
90	1	login	\N	\N	Tài khoản: admin đã đăng nhập vào hệ thống	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 14:21:34.525038+07
91	1	login	\N	\N	Tài khoản: admin đã đăng nhập vào hệ thống	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 14:25:46.956121+07
92	1	delete	user	25	admin đã XÓA VĨNH VIỄN tài khoản: #25 (hưng  - hung@gmail.com)	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 14:57:33.574775+07
93	1	logout	\N	\N	Tài khoản: admin đã đăng xuất khỏi hệ thống	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 15:34:24.257749+07
94	1	create	product	70	Tạo sản phẩm mới: Xe Đạp Gấp Folding TRINX Life 2.2 – Phanh Đĩa, Bánh 20 Inches	{"product_code": "FTL-220"}	\N	\N	2026-03-04 16:03:10.75408+07
95	1	update	product	70	Cập nhật sản phẩm: Xe Đạp Gấp Folding TRINX Life 2.2 – Phanh Đĩa, Bánh 20 Inches	{"product_code": "FTL-220"}	\N	\N	2026-03-04 16:05:45.348983+07
96	1	update	product	70	Cập nhật sản phẩm: Xe Đạp Gấp Folding TRINX Life 2.2 – Phanh Đĩa, Bánh 20 Inches	{"product_code": "FTL-220"}	\N	\N	2026-03-04 16:07:48.900626+07
97	1	create	product	71	Tạo sản phẩm mới: Xe Đạp Gấp Folding GIANT FD-806 – Bánh 20 Inches – 2022	{"product_code": "FGF-806"}	\N	\N	2026-03-04 16:21:24.922262+07
98	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 16:28:08.359357+07
99	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 16:28:17.723393+07
100	1	update	user	7	admin đã cập nhật thông tin user #7 (vinh)	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-04 16:29:00.578034+07
101	1	update	voucher	5	Cập nhật voucher: TET2026	{"code": "TET2026"}	\N	\N	2026-03-04 16:30:53.660669+07
102	1	update	order	5	Cập nhật trạng thái đơn #5: pending → confirmed	{"old_status": "pending", "new_status": "confirmed"}	\N	\N	2026-03-04 16:37:33.725713+07
103	1	update	voucher	6	Cập nhật voucher: SALE T3	{"code": "SALE T3"}	\N	\N	2026-03-04 16:49:31.197759+07
104	1	update	voucher	6	Cập nhật voucher: SALE T3	{"code": "SALE T3"}	\N	\N	2026-03-04 16:49:38.707709+07
105	1	update	order	7	Cập nhật trạng thái đơn #7: pending → confirmed	{"old_status": "pending", "new_status": "confirmed"}	\N	\N	2026-03-04 17:00:05.841845+07
106	1	update	order	7	Cập nhật trạng thái đơn #7: confirmed → pending	{"old_status": "confirmed", "new_status": "pending"}	\N	\N	2026-03-04 17:00:09.244277+07
107	1	update	order	6	Cập nhật trạng thái đơn #6: pending → confirmed	{"old_status": "pending", "new_status": "confirmed"}	\N	\N	2026-03-04 17:00:10.579189+07
108	1	update	order	5	Cập nhật trạng thái đơn #5: confirmed → shipping	{"old_status": "confirmed", "new_status": "shipping"}	\N	\N	2026-03-04 17:00:13.296724+07
109	1	update	order	4	Cập nhật trạng thái đơn #4: shipping → delivered	{"old_status": "shipping", "new_status": "delivered"}	\N	\N	2026-03-04 17:00:19.172757+07
110	1	create	product	72	Tạo sản phẩm mới:  Xe đạp gấp Java Neo Italy- Bánh 20 inches-2025	{"product_code": "JNI-202"}	\N	\N	2026-03-04 17:16:26.290161+07
111	1	update	order	7	Cập nhật trạng thái đơn #7: pending → confirmed	{"old_status": "pending", "new_status": "confirmed"}	\N	\N	2026-03-05 08:57:46.771837+07
112	1	update	order	7	Cập nhật trạng thái đơn #7: confirmed → shipping	{"old_status": "confirmed", "new_status": "shipping"}	\N	\N	2026-03-05 08:58:40.830961+07
113	1	update	order	6	Cập nhật trạng thái đơn #6: confirmed → shipping	{"old_status": "confirmed", "new_status": "shipping"}	\N	\N	2026-03-05 09:02:44.907369+07
114	1	update	order	5	Cập nhật trạng thái đơn #5: shipping → delivered	{"old_status": "shipping", "new_status": "delivered"}	\N	\N	2026-03-05 09:03:05.333798+07
115	1	update	order	6	Cập nhật trạng thái đơn #6: shipping → delivered	{"old_status": "shipping", "new_status": "delivered"}	\N	\N	2026-03-05 09:04:31.635382+07
116	1	update	product	72	Cập nhật sản phẩm:  Xe đạp gấp Java Neo Italy- Bánh 20 inches-2025	{"product_code": "JNI-202"}	\N	\N	2026-03-05 09:07:10.747485+07
117	1	update	product	72	Cập nhật sản phẩm:  Xe đạp gấp Java Neo Italy- Bánh 20 inches-2025	{"product_code": "JNI-202"}	\N	\N	2026-03-05 09:30:47.740607+07
118	1	update	product	72	Cập nhật sản phẩm:  Xe đạp gấp Java Neo Italy- Bánh 20 inches-2025	{"product_code": "JNI-202"}	\N	\N	2026-03-05 09:33:38.435543+07
119	1	update	order	8	Cập nhật trạng thái đơn #8: pending → confirmed	{"old_status": "pending", "new_status": "confirmed"}	\N	\N	2026-03-05 09:55:35.669024+07
120	1	update	order	8	Cập nhật trạng thái đơn #8: confirmed → shipping	{"old_status": "confirmed", "new_status": "shipping"}	\N	\N	2026-03-05 10:01:31.274238+07
121	1	update	order	8	Cập nhật trạng thái đơn #8: shipping → cancelled	{"old_status": "shipping", "new_status": "cancelled"}	\N	\N	2026-03-05 10:04:17.410689+07
122	1	update	user	2	admin đã cập nhật trạng thái user #2 (trang) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 13:55:16.72876+07
123	1	update	user	2	admin đã cập nhật trạng thái user #2 (trang) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 13:55:19.472286+07
155	1	update	user	6	admin đã cập nhật trạng thái user #6 (tien) thành TrangThaiUserEnum.inactive	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 14:43:57.003174+07
156	1	update	user	6	admin đã cập nhật trạng thái user #6 (tien) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 14:44:00.636993+07
157	1	update	user	6	admin đã cập nhật thông tin user #6 (tien)	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 15:00:15.917438+07
158	1	logout	\N	\N	Tài khoản: admin đã đăng xuất khỏi hệ thống	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 15:00:27.251182+07
159	6	login	\N	\N	Tài khoản: tien đã đăng nhập vào hệ thống	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 15:00:29.750799+07
160	6	update	user	1	tien đã cập nhật thông tin user #1 (admin)	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 15:01:15.515623+07
161	6	logout	\N	\N	Tài khoản: tien đã đăng xuất khỏi hệ thống	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 15:01:20.829756+07
162	1	login	\N	\N	Tài khoản: admin đã đăng nhập vào hệ thống	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 15:01:31.535364+07
163	1	update	user	6	admin đã cập nhật thông tin user #6 (tien)	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 15:01:42.682514+07
164	1	update	user	6	admin đã cập nhật trạng thái user #6 (tien) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 15:02:09.126908+07
165	1	update	user	6	admin đã cập nhật trạng thái user #6 (tien) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 15:07:52.385589+07
166	1	update	user	6	admin đã cập nhật thông tin user #6 (tien)	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 15:07:54.101559+07
167	1	update	user	6	admin đã cập nhật trạng thái user #6 (tien) thành TrangThaiUserEnum.inactive	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 15:08:02.094408+07
168	1	update	user	6	admin đã cập nhật trạng thái user #6 (tien) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 15:08:08.945193+07
169	1	update	user	6	admin đã cập nhật trạng thái user #6 (tien) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 15:14:38.907296+07
170	1	update	user	6	admin đã cập nhật trạng thái user #6 (tien) thành TrangThaiUserEnum.inactive	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 15:14:51.849033+07
171	1	update	user	6	admin đã cập nhật trạng thái user #6 (tien) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 15:14:54.54194+07
172	1	update	user	6	admin đã cập nhật trạng thái user #6 (tien) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 15:16:37.103559+07
173	1	update	user	6	admin đã cập nhật trạng thái user #6 (tien) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 15:42:12.112288+07
174	1	update	user	6	admin đã cập nhật thông tin user #6 (tien)	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 15:48:36.721987+07
175	1	update	user	6	admin đã cập nhật thông tin user #6 (tien)	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 15:48:49.091477+07
176	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 20:50:05.558022+07
177	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 20:50:06.324323+07
178	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 20:50:06.989196+07
179	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 20:50:07.460483+07
180	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:02:35.443298+07
181	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:02:35.966785+07
182	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:02:44.032564+07
183	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:02:44.571324+07
184	1	update	user	24	admin đã cập nhật trạng thái user #24 (khe) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:12:09.675017+07
185	1	update	user	24	admin đã cập nhật trạng thái user #24 (khe) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:12:10.593822+07
186	1	update	user	24	admin đã cập nhật trạng thái user #24 (khe) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:12:11.429973+07
187	1	update	user	24	admin đã cập nhật trạng thái user #24 (khe) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:12:11.911683+07
188	1	update	user	24	admin đã cập nhật trạng thái user #24 (khe) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:12:12.457166+07
189	1	update	user	24	admin đã cập nhật trạng thái user #24 (khe) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:12:12.968059+07
190	1	update	user	24	admin đã cập nhật trạng thái user #24 (khe) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:14:49.051312+07
191	1	update	user	24	admin đã cập nhật trạng thái user #24 (khe) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:14:49.895639+07
192	1	update	user	24	admin đã cập nhật trạng thái user #24 (khe) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:14:54.568937+07
193	1	update	user	24	admin đã cập nhật trạng thái user #24 (khe) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:14:55.05015+07
194	1	update	user	24	admin đã cập nhật trạng thái user #24 (khe) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:14:55.732289+07
195	1	update	user	24	admin đã cập nhật trạng thái user #24 (khe) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:14:56.218811+07
196	1	update	user	24	admin đã cập nhật trạng thái user #24 (khe) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:15:02.974207+07
197	1	update	user	24	admin đã cập nhật trạng thái user #24 (khe) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:15:07.664307+07
198	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:22:34.158184+07
199	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:22:35.129967+07
200	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:22:35.833881+07
201	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:22:36.692729+07
202	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:22:37.954748+07
305	1	update	order	7	Cập nhật trạng thái đơn #7: shipping → delivered	{"old_status": "shipping", "new_status": "delivered"}	\N	\N	2026-03-06 16:08:36.849569+07
203	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:22:38.534446+07
204	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:30:40.249253+07
205	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:30:40.454438+07
206	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:30:41.014271+07
207	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:30:41.584548+07
208	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:30:49.176191+07
209	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:30:49.93318+07
210	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:30:50.613385+07
211	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:30:51.057207+07
212	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:31:42.671125+07
213	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:31:43.011713+07
214	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:31:43.601114+07
215	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:31:44.125883+07
216	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:31:45.309015+07
217	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:31:45.571797+07
218	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:31:46.134442+07
219	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:31:46.826164+07
220	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:31:47.52214+07
221	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:31:48.108837+07
222	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:33:02.683978+07
223	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:33:03.011414+07
224	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:33:03.562513+07
225	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:33:04.093263+07
226	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:38:31.031675+07
227	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.inactive	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:38:32.616529+07
228	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:38:34.213592+07
229	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:38:35.314637+07
306	1	update	order	9	Cập nhật trạng thái đơn #9: pending → confirmed	{"old_status": "pending", "new_status": "confirmed"}	\N	\N	2026-03-06 16:08:52.243915+07
230	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:38:41.863322+07
233	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:01:27.321252+07
237	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.inactive	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:05:33.986452+07
241	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:05:42.339461+07
245	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.inactive	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:08:05.836395+07
248	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.inactive	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:08:35.234705+07
252	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.inactive	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:08:39.89348+07
256	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.inactive	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:08:48.06689+07
260	1	update	user	24	admin đã cập nhật thông tin user #24 (khe)	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:12:48.502443+07
261	1	update	user	24	admin đã cập nhật thông tin user #24 (khe)	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:13:06.788894+07
262	1	update	user	24	admin đã cập nhật thông tin user #24 (khe)	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:13:28.669085+07
263	1	update	user	7	admin đã cập nhật thông tin user #7 (vinh)	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:15:32.15123+07
265	1	update	user	3	admin đã cập nhật trạng thái user #3 (quan) thành TrangThaiUserEnum.inactive	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:18:03.871394+07
274	1	update	user	24	admin đã cập nhật trạng thái user #24 (khe) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:46:54.062006+07
278	1	update	user	3	admin đã cập nhật trạng thái user #3 (quan) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:51:59.471062+07
231	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.inactive	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:40:09.998849+07
232	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 21:40:12.497312+07
234	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.inactive	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:05:30.349651+07
236	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:05:33.04793+07
238	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:05:37.276749+07
240	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:05:40.222973+07
242	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.inactive	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:05:43.406084+07
244	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:08:03.901989+07
247	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:08:34.150324+07
249	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:08:36.224528+07
251	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:08:38.871681+07
253	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:08:40.739064+07
255	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:08:47.307289+07
257	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:08:50.339998+07
259	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:09:06.674602+07
264	1	update	user	3	admin đã cập nhật trạng thái user #3 (quan) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:17:57.448669+07
266	1	update	user	3	admin đã cập nhật trạng thái user #3 (quan) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:18:09.177088+07
268	1	update	user	7	admin đã cập nhật thông tin user #7 (vinh)	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:32:47.792197+07
269	1	update	user	7	admin đã cập nhật thông tin user #7 (vinh)	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:33:04.188352+07
270	1	update	user	24	admin đã cập nhật thông tin user #24 (khe)	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:33:41.168442+07
271	1	update	user	7	admin đã cập nhật thông tin user #7 (vinh)	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:35:57.340837+07
272	1	update	user	7	admin đã cập nhật thông tin user #7 (vinh)	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:36:07.793369+07
275	1	update	user	3	admin đã cập nhật trạng thái user #3 (quan) thành TrangThaiUserEnum.inactive	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:47:01.087759+07
277	1	update	user	24	admin đã cập nhật trạng thái user #24 (khe) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:48:27.815509+07
279	1	update	user	2	admin đã cập nhật trạng thái user #2 (trang) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:52:10.192615+07
235	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:05:31.800958+07
239	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.inactive	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:05:39.189087+07
243	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:08:02.214691+07
246	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:08:33.325858+07
250	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:08:37.997616+07
254	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:08:41.595335+07
258	1	update	user	7	admin đã cập nhật trạng thái user #7 (vinh) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:09:05.529085+07
267	1	update	user	3	admin đã cập nhật thông tin user #3 (quan)	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:18:10.226067+07
273	1	update	user	7	admin đã cập nhật thông tin user #7 (vinh)	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:37:01.276891+07
276	1	update	user	2	admin đã cập nhật trạng thái user #2 (trang) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-05 22:47:11.858455+07
280	1	update	product	72	Cập nhật sản phẩm:  Xe đạp gấp Java Neo Italy- Bánh 20 inches-2025	{"product_code": "JNI-202"}	\N	\N	2026-03-06 08:46:47.436847+07
281	1	update	product	72	Cập nhật sản phẩm:  Xe đạp gấp Java Neo Italy- Bánh 20 inches-2025	{"product_code": "JNI-202"}	\N	\N	2026-03-06 08:46:54.675864+07
282	1	update	product	71	Cập nhật sản phẩm: Xe Đạp Gấp Folding GIANT FD-806 – Bánh 20 Inches – 2022	{"product_code": "FGF-806"}	\N	\N	2026-03-06 08:47:01.751866+07
283	1	update	product	64	Cập nhật sản phẩm: Xe Đạp Nữ Đường Phố Touring RAPTOR Mocha 1 - Phanh Đĩa, Bánh 24 Inch	{"product_code": "TRM-124"}	\N	\N	2026-03-06 08:47:09.026081+07
284	1	update	product	63	Cập nhật sản phẩm: Xe Đạp Địa Hình MTB TRINX GT27.5 – Phanh Đĩa, Bánh 27 Inches	{"product_code": "MTG-275"}	\N	\N	2026-03-06 08:47:18.325706+07
285	1	update	product	63	Cập nhật sản phẩm: Xe Đạp Địa Hình MTB TRINX GT27.5 – Phanh Đĩa, Bánh 27 Inches	{"product_code": "MTG-275"}	\N	\N	2026-03-06 09:08:20.031573+07
286	1	update	product	72	Cập nhật sản phẩm:  Xe đạp gấp Java Neo Italy- Bánh 20 inches-2025	{"product_code": "JNI-202"}	\N	\N	2026-03-06 09:28:26.381592+07
287	1	update	product	72	Cập nhật sản phẩm:  Xe đạp gấp Java Neo Italy- Bánh 20 inches-2025	{"product_code": "JNI-202"}	\N	\N	2026-03-06 09:28:30.376408+07
288	1	update	product	72	Cập nhật sản phẩm:  Xe đạp gấp Java Neo Italy- Bánh 20 inches-2025	{"product_code": "JNI-202"}	\N	\N	2026-03-06 09:28:37.85941+07
289	1	update	product	71	Cập nhật sản phẩm: Xe Đạp Gấp Folding GIANT FD-806 – Bánh 20 Inches – 2022	{"product_code": "FGF-806"}	\N	\N	2026-03-06 09:28:43.801621+07
290	1	update	product	64	Cập nhật sản phẩm: Xe Đạp Nữ Đường Phố Touring RAPTOR Mocha 1 - Phanh Đĩa, Bánh 24 Inch	{"product_code": "TRM-124"}	\N	\N	2026-03-06 09:29:11.222477+07
291	1	update	product	64	Cập nhật sản phẩm: Xe Đạp Nữ Đường Phố Touring RAPTOR Mocha 1 - Phanh Đĩa, Bánh 24 Inch	{"product_code": "TRM-124"}	\N	\N	2026-03-06 09:29:16.666337+07
292	1	update	product	61	Cập nhật sản phẩm: Xe Đạp Địa Hình MTB TRINX M137 Elite – Phanh Đĩa, Bánh 27 Inches	{"product_code": "MTE-127"}	\N	\N	2026-03-06 09:31:40.495612+07
293	1	update	product	28	Cập nhật sản phẩm: Xe Đạp Đua Đường Trường Road GIANT Propel Advanced Pro 0 DI2 - Phanh Đĩa, Bánh 700C - 2026	{"product_code": "RGPA-127"}	\N	\N	2026-03-06 09:31:55.408132+07
294	1	update	user	24	admin đã cập nhật trạng thái user #24 (khe) thành TrangThaiUserEnum.banned	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-06 09:37:28.605331+07
295	1	update	user	24	admin đã cập nhật trạng thái user #24 (khe) thành TrangThaiUserEnum.inactive	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-06 09:37:31.253753+07
296	1	update	user	24	admin đã cập nhật trạng thái user #24 (khe) thành TrangThaiUserEnum.active	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-06 09:37:33.689559+07
297	1	update	user	24	admin đã cập nhật thông tin user #24 (khe)	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-06 09:37:37.404926+07
298	1	update	product	72	Cập nhật sản phẩm:  Xe đạp gấp Java Neo Italy- Bánh 20 inches-2025	{"product_code": "JNI-202"}	\N	\N	2026-03-06 10:11:02.480843+07
299	1	update	product	72	Cập nhật sản phẩm:  Xe đạp gấp Java Neo Italy- Bánh 20 inches-2025	{"product_code": "JNI-202"}	\N	\N	2026-03-06 10:23:30.631475+07
300	1	update	product	71	Cập nhật sản phẩm: Xe Đạp Gấp Folding GIANT FD-806 – Bánh 20 Inches – 2022	{"product_code": "FGF-806"}	\N	\N	2026-03-06 13:59:49.442565+07
301	1	update	product	71	Cập nhật sản phẩm: Xe Đạp Gấp Folding GIANT FD-806 – Bánh 20 Inches – 2022	{"product_code": "FGF-806"}	\N	\N	2026-03-06 13:59:52.293715+07
302	1	update	product	72	Cập nhật sản phẩm:  Xe đạp gấp Java Neo Italy- Bánh 20 inches-2025	{"product_code": "JNI-202"}	\N	\N	2026-03-06 15:06:03.220556+07
303	1	update	product	72	Cập nhật sản phẩm:  Xe đạp gấp Java Neo Italy- Bánh 20 inches-2025	{"product_code": "JNI-202"}	\N	\N	2026-03-06 15:06:49.983548+07
304	1	update	product	72	Cập nhật sản phẩm:  Xe đạp gấp Java Neo Italy- Bánh 20 inches-2025	{"product_code": "JNI-202"}	\N	\N	2026-03-06 16:01:10.014169+07
307	1	login	\N	\N	Tài khoản: admin đã đăng nhập vào hệ thống	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-08 08:49:42.555996+07
308	1	login	\N	\N	Tài khoản: admin đã đăng nhập vào hệ thống	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	2026-03-08 10:16:09.314592+07
309	1	update	product	29	Cập nhật sản phẩm: Xe Đạp Đua Đường Trường Road LIV Enviliv Advanced Pro 1 - Phanh Đĩa, Bánh 700C - 2026	{"product_code": "RLEA-172"}	\N	\N	2026-03-08 11:39:48.818887+07
310	1	update	product	28	Cập nhật sản phẩm: Xe Đạp Đua Đường Trường Road GIANT Propel Advanced Pro 0 DI2 - Phanh Đĩa, Bánh 700C - 2026	{"product_code": "RGPA-127"}	\N	\N	2026-03-08 11:39:53.887256+07
311	1	update	product	72	Cập nhật sản phẩm:  Xe đạp gấp Java Neo Italy- Bánh 20 inches-2025	{"product_code": "SPTFM6VFQF"}	\N	\N	2026-03-08 20:35:53.80659+07
312	1	update	product	71	Cập nhật sản phẩm: Xe Đạp Gấp Folding GIANT FD-806 – Bánh 20 Inches – 2022	{"product_code": "SPGV5RKRVR"}	\N	\N	2026-03-08 20:36:05.456786+07
313	1	update	product	70	Cập nhật sản phẩm: Xe Đạp Gấp Folding TRINX Life 2.2 – Phanh Đĩa, Bánh 20 Inches	{"product_code": "SP5AHAGCM6"}	\N	\N	2026-03-08 20:36:21.764339+07
314	1	update	product	69	Cập nhật sản phẩm: Xe Đạp Nữ Đường Phố Touring LIV Alight 2 DD City Disc - Phanh Đĩa, Bánh 700C - 2022	{"product_code": "SPN6WLO05Q"}	\N	\N	2026-03-08 20:36:37.984625+07
315	1	update	product	68	Cập nhật sản phẩm: Xe Đạp Nữ Đường Phố Touring GIANT Escape 3 Disc - Phanh Đĩa, Bánh 700C - 2025	{"product_code": "SPYPHYMQIA"}	\N	\N	2026-03-08 20:36:51.651218+07
316	1	create	brand	12	Admin tạo thương hiệu mới: MAGICBROS	null	\N	\N	2026-03-08 20:53:31.788747+07
317	1	create	product	73	Tạo sản phẩm mới: Xe đạp Fixed Gear Magicbros CX7	{"product_code": "SP9KEKFKDF"}	\N	\N	2026-03-08 21:14:55.652966+07
318	1	create	product	74	Tạo sản phẩm mới: Xe đạp Fixed Magicbros CX8 plus-2024	{"product_code": "SPGV8IBZ2H"}	\N	\N	2026-03-08 21:28:36.771458+07
319	1	update	product	73	Cập nhật sản phẩm: Xe đạp Fixed Gear Magicbros CX7	{"product_code": "SP9KEKFKDF"}	\N	\N	2026-03-08 21:28:49.536498+07
320	1	create	product	75	Tạo sản phẩm mới: Xe đạp Fixed Gear Magicbros CX6	{"product_code": "SP95B4WUT2"}	\N	\N	2026-03-08 21:38:49.706099+07
321	1	update	product	75	Cập nhật sản phẩm: Xe đạp Fixed Gear Magicbros CX6	{"product_code": "SP95B4WUT2"}	\N	\N	2026-03-08 21:41:02.957332+07
322	1	update	product	75	Cập nhật sản phẩm: Xe đạp Fixed Gear Magicbros CX6	{"product_code": "SP95B4WUT2"}	\N	\N	2026-03-08 21:47:52.645045+07
323	1	update	product	75	Cập nhật sản phẩm: Xe đạp Fixed Gear Magicbros CX6	{"product_code": "SP95B4WUT2"}	\N	\N	2026-03-08 21:48:28.76328+07
324	1	update	product	75	Cập nhật sản phẩm: Xe đạp Fixed Gear Magicbros CX6	{"product_code": "SP95B4WUT2"}	\N	\N	2026-03-08 21:51:27.510897+07
325	1	update	product	74	Cập nhật sản phẩm: Xe đạp Fixed Magicbros CX8 plus-2024	{"product_code": "SPGV8IBZ2H"}	\N	\N	2026-03-08 21:56:10.178926+07
326	1	update	product	73	Cập nhật sản phẩm: Xe đạp Fixed Gear Magicbros CX7	{"product_code": "SP9KEKFKDF"}	\N	\N	2026-03-08 22:21:30.08282+07
327	1	update	product	63	Cập nhật sản phẩm: Xe Đạp Địa Hình MTB TRINX GT27.5 – Phanh Đĩa, Bánh 27 Inches	{"product_code": "SPOIAUD8WK"}	\N	\N	2026-03-08 22:34:01.687229+07
328	1	update	product	60	Cập nhật sản phẩm: Xe Đạp Địa Hình MTB GIANT XTC 800 – Phanh Đĩa, Bánh 27 Inches	{"product_code": "SP0JRBQMMJ"}	\N	\N	2026-03-08 22:34:50.716061+07
329	1	update	product	59	Cập nhật sản phẩm: Xe Đạp Địa Hình MTB GIANT ATX 830 - Phanh Đĩa, Bánh 27 Inches - 2025	{"product_code": "SPSJTABUGW"}	\N	\N	2026-03-08 22:35:32.748776+07
330	1	update	product	53	Cập nhật sản phẩm: Xe Đạp Đua Địa Hình MTB RAPTOR Evo - Phanh Đĩa, Bánh 27 Inch	{"product_code": "SPWYXJLM5F"}	\N	\N	2026-03-08 22:36:34.931912+07
331	1	update	product	52	Cập nhật sản phẩm: Xe Đạp Đua Địa Hình MTB RAPTOR Marlin 3 - Phanh Đĩa, Bánh 29 Inch	{"product_code": "SPIIMPD7G6"}	\N	\N	2026-03-08 22:37:13.813361+07
332	1	update	product	55	Cập nhật sản phẩm: Xe Đạp Địa Hình MTB MEREC Challenger - Phanh Đĩa, Bánh 27 Inches	{"product_code": "SP0NPJ4OGN"}	\N	\N	2026-03-08 22:37:46.1501+07
333	1	update	product	56	Cập nhật sản phẩm: Xe Đạp Địa Hình MTB GIANT Talon 3 - Phanh Đĩa, Bánh 27 Inches 2025	{"product_code": "SPFPZDOG2N"}	\N	\N	2026-03-08 22:38:24.928047+07
334	1	update	product	54	Cập nhật sản phẩm: Xe Đạp Địa Hình MTB MEREC Honour 300 - Phanh Đĩa, Bánh 26 Inches	{"product_code": "SPIDSZTS1Q"}	\N	\N	2026-03-08 22:39:23.708159+07
335	1	update	product	51	Cập nhật sản phẩm: Xe Đạp Đua Địa Hình MTB RAPTOR Epic - Phanh Đĩa, Bánh 26 Inch	{"product_code": "SPJRIHKYAR"}	\N	\N	2026-03-08 22:40:26.289991+07
336	1	update	product	69	Cập nhật sản phẩm: Xe Đạp Nữ Đường Phố Touring LIV Alight 2 DD City Disc - Phanh Đĩa, Bánh 700C - 2022	{"product_code": "SPLRKPDNO8"}	\N	\N	2026-03-09 09:26:35.87987+07
337	1	update	product	68	Cập nhật sản phẩm: Xe Đạp Nữ Đường Phố Touring GIANT Escape 3 Disc - Phanh Đĩa, Bánh 700C - 2025	{"product_code": "SP7ZGO6XYA"}	\N	\N	2026-03-09 09:27:09.356835+07
338	1	update	product	66	Cập nhật sản phẩm: Xe Đạp Nữ Đường Phố Touring LIV Alight 4 Disc - Phanh Đĩa, Bánh 700C - 2025	{"product_code": "SPVKOMNCXQ"}	\N	\N	2026-03-09 09:28:16.392487+07
339	1	update	product	65	Cập nhật sản phẩm: Xe Đạp Nữ Đường Phố Touring LIV Alight 2 Disc - Phanh Đĩa, Bánh 700C - 2025	{"product_code": "SPZDO1IBU6"}	\N	\N	2026-03-09 09:29:12.78924+07
340	1	update	product	65	Cập nhật sản phẩm: Xe Đạp Nữ Đường Phố Touring LIV Alight 2 Disc - Phanh Đĩa, Bánh 700C - 2025	{"product_code": "SPZDO1IBU6"}	\N	\N	2026-03-09 09:29:37.726311+07
341	1	update	product	26	Cập nhật sản phẩm: Xe Đạp Nữ Đương Phố Touring RAPTOR Lily 3 - Bánh 24 Inch	{"product_code": "SPTSUFJ47H"}	\N	\N	2026-03-09 09:31:00.746866+07
342	1	update	product	25	Cập nhật sản phẩm: Xe Đạp Nữ Touring RAPTOR Lily 4 - Bánh 26 Inch	{"product_code": "SP592EJMJ7"}	\N	\N	2026-03-09 09:31:43.802524+07
343	1	update	product	21	Cập nhật sản phẩm: Xe Đạp Nữ Đường Phố Youth RAPTOR Eva 3 - Bánh 24 Inch	{"product_code": "SPLLO8LP9K"}	\N	\N	2026-03-09 09:32:25.063508+07
344	1	update	product	2	Cập nhật sản phẩm: Xe Đạp Nữ Đường Phố Touring RAPTOR Eva 4 - Bánh 26 Inch	{"product_code": "SPOINY33N1"}	\N	\N	2026-03-09 09:33:04.137147+07
345	1	update	product	72	Cập nhật sản phẩm:  Xe đạp gấp Java Neo Italy- Bánh 20 inches-2025	{"product_code": "SPKUITAA09"}	\N	\N	2026-03-09 09:33:42.44168+07
346	1	update	product	71	Cập nhật sản phẩm: Xe Đạp Gấp Folding GIANT FD-806 – Bánh 20 Inches – 2022	{"product_code": "SPHAMHW34Z"}	\N	\N	2026-03-09 09:34:20.738277+07
347	1	update	product	70	Cập nhật sản phẩm: Xe Đạp Gấp Folding TRINX Life 2.2 – Phanh Đĩa, Bánh 20 Inches	{"product_code": "SP1BMMXQIP"}	\N	\N	2026-03-09 09:34:46.142597+07
350	1	update	product	14	Cập nhật sản phẩm: Xe Đạp Gấp Folding JAVA Neo-9SE - Phanh Đĩa, Bánh 16Inch	{"product_code": "SP8BXC72AX"}	\N	\N	2026-03-09 09:36:59.190836+07
351	1	update	product	13	Cập nhật sản phẩm: Xe đạp gấp BIRDY EVO 	{"product_code": "SPEYT9HJ57"}	\N	\N	2026-03-09 09:37:28.929366+07
357	1	update	product	37	Cập nhật sản phẩm: Xe Đạp Trẻ Em Youth RAPTOR Hola 20B - Phanh Đĩa, Bánh 20 Inches	{"product_code": "SPQ78MPJ79"}	\N	\N	2026-03-09 09:45:58.362275+07
348	1	update	product	45	Cập nhật sản phẩm: Xe Đạp Gấp Folding JAVA Volta-7S - Phanh Đĩa, Bánh 16Inch	{"product_code": "SP9GP72DJY"}	\N	\N	2026-03-09 09:35:21.763255+07
359	1	update	product	36	Cập nhật sản phẩm: Xe Đạp Trẻ Em Youth RAPTOR Hola 18 - Phanh Đĩa, Bánh 18 Inches	{"product_code": "SPYAS4RS1M"}	\N	\N	2026-03-09 09:47:18.7128+07
349	1	update	product	31	Cập nhật sản phẩm: Xe Đạp Gấp Folding JAVA X2 16 - Phanh Đĩa, Bánh 16 Inches	{"product_code": "SPQM8VKRCK"}	\N	\N	2026-03-09 09:36:16.671588+07
352	1	update	product	12	Cập nhật sản phẩm: Xe Đạp Gấp Folding JAVA Neo-9S - Phanh Đĩa, Bánh 16Inch	{"product_code": "SPBS7HOLHL"}	\N	\N	2026-03-09 09:37:56.967216+07
353	1	update	product	43	Cập nhật sản phẩm: Xe Đạp Trẻ Em Youth MISAKI Chino 1 – Bánh 12 Inches	{"product_code": "SPC6P4FTO6"}	\N	\N	2026-03-09 09:41:29.881977+07
358	1	logout	\N	\N	Tài khoản: admin đã đăng xuất khỏi hệ thống	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	2026-03-09 09:46:24.121467+07
354	1	update	product	42	Cập nhật sản phẩm: Xe Đạp Trẻ Em Youth TRINX Princess – Bánh 18 Inches	{"product_code": "SP03VQLW7W"}	\N	\N	2026-03-09 09:42:28.255092+07
355	1	update	product	41	Cập nhật sản phẩm: Xe Đạp Trẻ Em Youth MISAKI Chino 2 – Bánh 14 Inches	{"product_code": "SPH6YG582U"}	\N	\N	2026-03-09 09:42:56.921471+07
356	1	update	product	40	Cập nhật sản phẩm: Xe Đạp Trẻ Em Youth MISAKI Kitty 2 - Bánh 14 Inches	{"product_code": "SPCP1AJVED"}	\N	\N	2026-03-09 09:45:20.620966+07
360	1	update	product	33	Cập nhật sản phẩm: Xe Đạp Trẻ Em Youth RAPTOR Elsa 1 - Bánh 12 Inch	{"product_code": "SP1DGLKU9W"}	\N	\N	2026-03-09 09:57:24.791228+07
361	1	update	product	32	Cập nhật sản phẩm: Xe Đạp Trẻ Em Youth RAPTOR Jubby 2 - Bánh 22 Inch	{"product_code": "SPV18FKD5Y"}	\N	\N	2026-03-09 09:57:54.84958+07
362	1	update	product	18	Cập nhật sản phẩm: Xe Đạp Trẻ Em Youth RAPTOR Jubby 1 - Bánh 20 Inch	{"product_code": "SPDH7QIOBY"}	\N	\N	2026-03-09 09:58:27.754879+07
363	1	update	product	17	Cập nhật sản phẩm: Xe Đạp Trẻ Em Youth RAPTOR Rock 2 - Bánh 20 Inch	{"product_code": "SP25IQ6D8G"}	\N	\N	2026-03-09 09:59:27.983559+07
364	1	update	product	17	Cập nhật sản phẩm: Xe Đạp Trẻ Em Youth RAPTOR Rock 2 - Bánh 20 Inch	{"product_code": "SP25IQ6D8G"}	\N	\N	2026-03-09 09:59:53.822946+07
365	1	update	product	17	Cập nhật sản phẩm: Xe Đạp Trẻ Em Youth RAPTOR Rock 2 - Bánh 20 Inch	{"product_code": "SP25IQ6D8G"}	\N	\N	2026-03-09 10:02:43.193925+07
366	1	update	product	16	Cập nhật sản phẩm: Xe Đạp Trẻ Em Youth RAPTOR Mochi 4 - Bánh 18 Inch	{"product_code": "SPLVNZH45V"}	\N	\N	2026-03-09 10:03:14.850076+07
367	1	update	product	16	Cập nhật sản phẩm: Xe Đạp Trẻ Em Youth RAPTOR Mochi 4 - Bánh 18 Inch	{"product_code": "SPLVNZH45V"}	\N	\N	2026-03-09 10:03:40.050426+07
368	1	update	product	11	Cập nhật sản phẩm: Xe Đạp Trẻ Em Youth RAPTOR Bella 1 - Bánh 16 Inch	{"product_code": "SP2R8UAXY9"}	\N	\N	2026-03-09 10:04:27.614922+07
369	1	update	product	10	Cập nhật sản phẩm: Xe Đạp Trẻ Em Youth RAPTOR Elsa 2 - Bánh 14 Inch	{"product_code": "SP94X7HGQC"}	\N	\N	2026-03-09 10:04:57.178574+07
370	1	update	product	1	Cập nhật sản phẩm: Xe Đạp Trẻ Em Youth RAPTOR Simba 4 - Bánh 18 Inch	{"product_code": "SPDOGH3F8L"}	\N	\N	2026-03-09 10:05:29.483406+07
371	1	update	product	50	Cập nhật sản phẩm: Xe Đạp Địa Hình MTB GIANT Talon 29 3 - Phanh Đĩa, Bánh 29 Inches - 2025	{"product_code": "SPV67ODD0S"}	\N	\N	2026-03-09 10:08:17.77793+07
372	1	update	product	49	Cập nhật sản phẩm: Xe Đạp Địa Hình MTB RAPTOR Hunter 4 - Phanh Đĩa, Bánh 29 Inch	{"product_code": "SP8SL2KQ26"}	\N	\N	2026-03-09 10:08:54.127903+07
373	1	update	product	49	Cập nhật sản phẩm: Xe Đạp Địa Hình MTB RAPTOR Hunter 4 - Phanh Đĩa, Bánh 29 Inch	{"product_code": "SP8SL2KQ26"}	\N	\N	2026-03-09 10:09:28.17195+07
374	1	update	product	57	Cập nhật sản phẩm: Xe Đạp Đường Phố TOURING RAPTOR Napa - Phanh Đĩa, Bánh 700C	{"product_code": "SPWJAXW7JO"}	\N	\N	2026-03-09 10:10:06.066306+07
375	1	update	product	48	Cập nhật sản phẩm: Xe Đạp Đường Phố Touring RAPTOR Feliz 2B - Phanh Đĩa, Bánh 700C	{"product_code": "SPCFK7S3V2"}	\N	\N	2026-03-09 10:10:53.231253+07
376	1	update	product	48	Cập nhật sản phẩm: Xe Đạp Đường Phố Touring RAPTOR Feliz 2B - Phanh Đĩa, Bánh 700C	{"product_code": "SPCFK7S3V2"}	\N	\N	2026-03-09 10:11:18.414653+07
377	1	update	product	23	Cập nhật sản phẩm: Xe Đạp Đường Phố Touring RAPTOR Hunter 2B - Phanh Đĩa, Bánh 26 Inch	{"product_code": "SPDG3JLMS7"}	\N	\N	2026-03-09 10:13:01.023679+07
378	1	update	product	20	Cập nhật sản phẩm: Xe Đạp Đường Phố Touring GIANT Roam 4 - Phanh Đĩa, Bánh 700C - 2026	{"product_code": "SP1O2BV5HD"}	\N	\N	2026-03-09 10:13:36.456883+07
379	1	update	product	22	Cập nhật sản phẩm: Xe Đạp Đường Phố Touring JAVA Sequoia-7S-City - Phanh Đĩa, Bánh 700C	{"product_code": "SP9ANBK7HV"}	\N	\N	2026-03-09 10:15:46.512978+07
380	1	update	product	6	Cập nhật sản phẩm: Xe Đạp Đường Phố Touring RAPTOR Rally 3B - Bánh 27 Inch	{"product_code": "SPWVEHLPQD"}	\N	\N	2026-03-09 10:17:02.371814+07
381	1	update	product	3	Cập nhật sản phẩm: Xe Đạp Đường Phố Touring RAPTOR Hunter 3B - Phanh Đĩa, Bánh 27 Inch	{"product_code": "SP1XRK2MBO"}	\N	\N	2026-03-09 10:17:55.022988+07
382	1	update	product	30	Cập nhật sản phẩm: Xe Đạp Đường Trường ROAD RAPTOR TAKA 1 - BÁNH 700C	{"product_code": "SPIK3SIUF5"}	\N	\N	2026-03-09 10:19:05.996136+07
383	1	update	product	29	Cập nhật sản phẩm: Xe Đạp Đua Đường Trường Road LIV Enviliv Advanced Pro 1 - Phanh Đĩa, Bánh 700C - 2026	{"product_code": "SP5A67PARO"}	\N	\N	2026-03-09 10:19:33.686679+07
384	1	update	product	28	Cập nhật sản phẩm: Xe Đạp Đua Đường Trường Road GIANT Propel Advanced Pro 0 DI2 - Phanh Đĩa, Bánh 700C - 2026	{"product_code": "SPBDHXQNYK"}	\N	\N	2026-03-09 10:19:56.072064+07
385	1	update	product	4	Cập nhật sản phẩm: Xe Đạp Đua Đường Trường Road GIANT TCR Advanced 2 Pro Compact - Phanh Đĩa, Bánh 700C 	{"product_code": "SPB69BLYE4"}	\N	\N	2026-03-09 10:20:33.033298+07
386	1	update	product	75	Cập nhật sản phẩm: Xe đạp Fixed Gear Magicbros CX6	{"product_code": "SP95B4WUT2"}	\N	\N	2026-03-09 10:45:42.977598+07
387	1	update	product	75	Cập nhật sản phẩm: Xe đạp Fixed Gear Magicbros CX6	{"product_code": "SP95B4WUT2"}	\N	\N	2026-03-09 10:45:44.199353+07
388	1	update	product	75	Cập nhật sản phẩm: Xe đạp Fixed Gear Magicbros CX6	{"product_code": "SP95B4WUT2"}	\N	\N	2026-03-09 10:49:07.723715+07
389	1	update	product	75	Cập nhật sản phẩm: Xe đạp Fixed Gear Magicbros CX6	{"product_code": "SP95B4WUT2"}	\N	\N	2026-03-09 10:49:23.803888+07
390	1	update	product	75	Cập nhật sản phẩm: Xe đạp Fixed Gear Magicbros CX6	{"product_code": "SP95B4WUT2"}	\N	\N	2026-03-09 15:07:21.729983+07
391	1	update	product	75	Cập nhật sản phẩm: Xe đạp Fixed Gear Magicbros CX6	{"product_code": "SP95B4WUT2"}	\N	\N	2026-03-09 15:07:23.598997+07
392	1	update	product	73	Cập nhật sản phẩm: Xe đạp Fixed Gear Magicbros CX7	{"product_code": "SP9KEKFKDF"}	\N	\N	2026-03-09 15:12:49.616634+07
393	1	update	product	73	Cập nhật sản phẩm: Xe đạp Fixed Gear Magicbros CX7	{"product_code": "SP9KEKFKDF"}	\N	\N	2026-03-09 15:13:20.520412+07
394	1	update	product	74	Cập nhật sản phẩm: Xe đạp Fixed Magicbros CX8 plus-2024	{"product_code": "SPGV8IBZ2H"}	\N	\N	2026-03-09 15:16:38.322328+07
395	1	create	brand	13	Admin tạo thương hiệu mới: VINBIKE	null	\N	\N	2026-03-09 15:34:21.916813+07
396	1	create	product	76	Tạo sản phẩm mới: Xe Đạp Đường Phố Fixed Gear VINBIKE Megatron – Bánh 700C	{"product_code": "SPCSJVGR6I"}	\N	\N	2026-03-09 15:46:02.334057+07
397	1	update	order	10	Cập nhật trạng thái đơn #10: pending → confirmed	{"old_status": "pending", "new_status": "confirmed"}	\N	\N	2026-03-09 15:47:55.13717+07
398	1	update	order	9	Cập nhật trạng thái đơn #9: confirmed → shipping	{"old_status": "confirmed", "new_status": "shipping"}	\N	\N	2026-03-09 15:48:09.436192+07
399	1	update	product	76	Cập nhật sản phẩm: Xe Đạp Đường Phố Fixed Gear VINBIKE Megatron – Bánh 700C	{"product_code": "SPCSJVGR6I"}	\N	\N	2026-03-09 15:50:02.68565+07
\.


--
-- Data for Name: chitietdonhang; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chitietdonhang (ma_ctdh, ma_don_hang, ma_sanpham, ten_sanpham, so_luong, gia_mua, thanh_tien, mau_sac) FROM stdin;
2	1	66	Xe Đạp Nữ Đường Phố Touring LIV Alight 4 Disc - Phanh Đĩa, Bánh 700C - 2025	1	10034700	10034700	cam
3	2	42	Xe Đạp Trẻ Em Youth TRINX Princess – Bánh 18 Inches	1	1213900	1213900	hồng trắng
4	3	65	Xe Đạp Nữ Đường Phố Touring LIV Alight 2 Disc - Phanh Đĩa, Bánh 700C - 2025	1	14790000	14790000	XANH XÁM
5	3	69	Xe Đạp Nữ Đường Phố Touring LIV Alight 2 DD City Disc - Phanh Đĩa, Bánh 700C - 2022	1	13990000	13990000	xanh lục nhạt
6	4	69	Xe Đạp Nữ Đường Phố Touring LIV Alight 2 DD City Disc - Phanh Đĩa, Bánh 700C - 2022	1	13990000	13990000	
7	4	26	Xe Đạp Nữ Đương Phố Touring RAPTOR Lily 3 - Bánh 24 Inch	1	2204100	2204100	hồng cà
8	5	28	Xe Đạp Đua Đường Trường Road GIANT Propel Advanced Pro 0 DI2 - Phanh Đĩa, Bánh 700C - 2026	4	145990000	583960000	đen trắng
9	6	71	Xe Đạp Gấp Folding GIANT FD-806 – Bánh 20 Inches – 2022	2	8350500	16701000	trắng
10	7	69	Xe Đạp Nữ Đường Phố Touring LIV Alight 2 DD City Disc - Phanh Đĩa, Bánh 700C - 2022	1	13990000	13990000	xanh lục nhạt
12	9	69	Xe Đạp Nữ Đường Phố Touring LIV Alight 2 DD City Disc - Phanh Đĩa, Bánh 700C - 2022	1	13990000	13990000	xanh lục nhạt
13	10	76	Xe Đạp Đường Phố Fixed Gear VINBIKE Megatron – Bánh 700C	1	6990000	6990000	xanh đen
\.


--
-- Data for Name: chitietgiohang; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chitietgiohang (ma_ctgh, ma_gio, ma_sanpham, so_luong, gia_hien_tai, mau_sac) FROM stdin;
154	5	69	1	13990000	xanh lục nhạt
\.


--
-- Data for Name: danhgia; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.danhgia (ma_danhgia, ma_sanpham, ma_user, diem_danhgia, tieu_de, viet_danhgia, trang_thai, ngay_lap) FROM stdin;
2	2	2	5	Xe đẹp xuất sắc	Tôi rất hài lòng về sản phẩm này. Đây là lần mua thứ 2 của tôi, shop làm ăn rất uy tín 	approved	2026-02-06 21:00:42.11177
3	1	2	3	Xe tạm được	Tôi đã mua chiếc xe này về cho em trai của tôi. Xe đẹp nhưng giao hàng chậm quá nên cho 3 sao thôi	approved	2026-02-06 21:17:54.250663
4	5	3	5	Sản phẩm tuyệt vời	Tôi rất thích xe đạp này, đi êm và trọng lượng nhẹ, kiểu dáng đẹp mắt phù hợp với mọi lứa tuổi. Đặc biệt giao hàng nhanh và chủ shop tư vấn nhiệt tình. Cho điểm tuyệt đối	approved	2026-02-07 10:02:03.778626
6	4	3	2	Xe đẹp mà mắt quá	Tôi rất thấy ưng ý chiếc xe này nhưng shop lại không có chức năng trả ghóp nên tôi chỉ cho shop 2 điểm.	approved	2026-02-07 11:20:26.956249
9	23	3	5	SẢN PHẨM CHẤT LƯỢNG	Tôi rất thích chiếc xe này và quá trình giao hàng nhanh nữa nên cho điểm tối đa	approved	2026-02-26 15:54:22.345145
7	29	3	2	xe đẹp nhưng mắt 	Shop không có chức năng trả góp nên cho 2 điểm thôi	approved	2026-02-10 15:20:34.131834
10	30	6	5	TỐT	Sản phẩm đẹp và bền rất hợp ý của tôi, Tôi ủng hộ shop 5 sao	approved	2026-03-02 11:15:40.773891
12	42	24	5	Xe good	Xe đạp rất đẹp\n	approved	2026-03-03 20:54:22.859139
11	66	24	2	bad	Xe xấu quá	approved	2026-03-03 11:16:06.298654
13	28	7	5	Xe ngon	Xe đạp chất lượng và ngon quá	approved	2026-03-05 09:04:01.991611
14	69	24	4	GOODDDĐ	Sản phẩm tuyệt vời\n\n	approved	2026-03-05 10:49:49.626793
15	72	24	3	xe xấu	Xe không đẹp và thiếu chuyên nghiêp trong giao hàng	approved	2026-03-06 14:42:32.174525
\.


--
-- Data for Name: danhmuc; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.danhmuc (ma_danhmuc, ten_danhmuc, mo_ta, is_active, hinh_anh) FROM stdin;
4	XE ĐẠP NỮ	Xe đạp nữ là biểu tượng của sự thanh lịch và lối sống hiện đại, mang đến sự cân bằng hoàn hảo giữa nhu cầu rèn luyện sức khỏe và gu thẩm mỹ tinh tế của phái đẹp. Những dòng xe trong danh mục này được đặc biệt ưu tiên thiết kế với cấu trúc khung võng thấp giúp người dùng dễ dàng lên xuống xe một cách duyên dáng ngay cả khi diện những bộ trang phục nhẹ nhàng hay váy dài. Trọng lượng xe thường được tối ưu hóa nhờ chất liệu hợp kim nhẹ, kết hợp cùng hệ thống phanh nhạy bén và ghi-đông uốn lượn giúp việc điều khiển trở nên linh hoạt, an toàn và ít tốn sức hơn. Không chỉ chú trọng vào khả năng vận hành êm ái để bảo vệ cột sống và vóc dáng, xe đạp nữ còn tích hợp nhiều tiện ích thực tế như giỏ xe thời trang, chắn bùn sạch sẽ và gác-ba-ga chắc chắn, đáp ứng trọn vẹn mọi nhu cầu từ đi làm, đi dạo phố đến mua sắm hàng ngày. Đây chính là người bạn đồng hành lý tưởng để phái đẹp tận hưởng cảm giác tự do, cải thiện sự dẻo dai và khẳng định phong cách sống năng động nhưng không kém phần dịu dàng.	t	https://api.xedap.vn/products/RAPTOR/eva-4-mauvebrown.jpg
5	XE ĐẠP GẤP	Xe đạp gấp là giải pháp di chuyển thông minh và linh hoạt dành riêng cho nhịp sống đô thị hiện đại, nơi sự tối ưu hóa không gian luôn được ưu tiên hàng đầu. Với thiết kế đột phá cho phép thu gọn kích thước chỉ trong vài giây, dòng xe này dễ dàng được cất giữ gọn gàng trong những căn hộ nhỏ, dưới gầm bàn làm việc hoặc mang theo thuận tiện trong cốp xe ô tô và các phương tiện công cộng. Dù sở hữu ngoại hình nhỏ nhắn, xe đạp gấp vẫn đảm bảo hiệu suất vận hành ấn tượng nhờ cấu trúc khung sườn vững chắc cùng hệ thống khớp nối an toàn, bền bỉ và bộ truyền động linh hoạt. Khả năng điều chỉnh độ cao yên và tay lái linh hoạt giúp chiếc xe trở thành lựa chọn lý tưởng cho mọi thành viên trong gia đình, từ người lớn đến thanh thiếu niên. Đây không chỉ là phương tiện di chuyển xanh, tiết kiệm mà còn là người bạn đồng hành hoàn hảo cho những chuyến dã ngoại hay những hành trình kết hợp đầy tiện nghi.	t	https://api.xedap.vn/products/JAVA/neo-9-s-white.jpg
1	XE ĐẠP TRẺ EM	Xe đạp trẻ em không chỉ là món đồ chơi giải trí mà còn là người bạn đồng hành quan trọng giúp bé phát triển thể chất, rèn luyện kỹ năng thăng bằng và xây dựng tinh thần tự lập ngay từ nhỏ. Danh mục xe đạp trẻ em mang đến sự lựa chọn đa dạng về kích thước từ 12 đến 20 inches, phù hợp với mọi độ tuổi và chiều cao của bé. Mỗi sản phẩm đều được chú trọng đặc biệt đến yếu tố an toàn với khung sườn chịu lực chắc chắn, hệ thống phanh nhạy bén, hộp xích bảo vệ kín đáo và các vật liệu thân thiện với sức khỏe. Đây chính là giải pháp hoàn hảo để khuyến khích trẻ vận động ngoài trời, rời xa các thiết bị điện tử và tự tin khám phá thế giới xung quanh một cách lành mạnh.	t	https://api.xedap.vn/products/RAPTOR/simba-4-orangeblack.jpg
7	XE ĐẠP FIXED GEAR	Gemini đã nói\nXe đạp Fixed Gear (hay còn gọi là xe đạp fixel) là biểu tượng của sự tối giản và cá tính mạnh mẽ trong cộng đồng yêu xe đạp đô thị. Điểm khác biệt lớn nhất của dòng xe này nằm ở hệ thống truyền động trực tiếp với phần líp được bắt chết vào đùm xe, khiến bàn đạp luôn chuyển động đồng nhất với bánh sau, cho phép người lái có thể đi lùi hoặc phanh xe bằng chính sức nặng của đôi chân. Với việc loại bỏ tối đa các chi tiết phức tạp như bộ biến tốc hay dây phanh rườm rà, xe không chỉ sở hữu trọng lượng siêu nhẹ mà còn có độ bền vượt trội và cực kỳ ít hỏng hóc vặt. Không chỉ dừng lại ở một phương tiện thể thao, xe đạp Fixed Gear còn là một phong cách sống, nơi người chơi tự do thể hiện bản sắc cá nhân qua những bản phối màu sắc rực rỡ và tận hưởng cảm giác "làm chủ" hoàn toàn mọi chuyển động trên đường phố.	t	https://api.xedap.vn/wp-content/uploads/2024/04/Maximus_Green-1.jpg
2	XE ĐẠP ĐỊA HÌNH	Xe đạp địa hình là dòng xe được thiết kế chuyên biệt để chinh phục những cung đường gồ ghề, hiểm trở và đầy thử thách, mang lại trải nghiệm mạnh mẽ cho những người yêu thích phiêu lưu. Với cấu trúc khung sườn siêu bền từ hợp kim nhôm hoặc thép cường lực, dòng xe này đảm bảo sự chắc chắn tuyệt đối và khả năng chịu va đập cực tốt trong mọi điều kiện địa hình. Điểm nhấn quan trọng nhất chính là hệ thống phuộc nhún giảm xóc hiện đại giúp hấp thụ xung lực hiệu quả, kết hợp cùng đôi lốp bản rộng có gai lớn giúp tăng cường độ bám đường và sự ổn định trên các bề mặt trơn trượt hay bùn lầy. Bên cạnh đó, việc trang bị bộ truyền động nhiều cấp độ linh hoạt giúp người lái dễ dàng điều chỉnh lực đạp khi leo dốc hay tăng tốc, trong khi hệ thống phanh đĩa nhạy bén đảm bảo an toàn tối ưu trong những tình huống xử lý khẩn cấp. Đây không chỉ là phương tiện rèn luyện thể lực bền bỉ mà còn là biểu tượng của tinh thần phóng khoáng, sẵn sàng vượt qua mọi giới hạn để khám phá thiên nhiên.	t	https://api.xedap.vn/products/RAPTOR/rally-1-b-grey.jpg
6	XE ĐẠP ĐIỆN	Xe đạp điện là giải pháp di chuyển thông minh, kết hợp hoàn hảo giữa sức mạnh truyền thống và công nghệ hiện đại nhằm mang lại sự tiện lợi tối đa trong nhịp sống đô thị. Được trang bị động cơ điện mạnh mẽ cùng hệ thống pin hoặc ắc quy bền bỉ, dòng xe này giúp người dùng dễ dàng chinh phục những quãng đường dài hay những đoạn dốc cao mà không tốn quá nhiều sức lực, loại bỏ hoàn toàn nỗi lo về mồ hôi hay mệt mỏi khi đi làm, đi học. Thiết kế của xe đạp điện ngày càng được tối ưu hóa với kiểu dáng đa dạng, từ sự nhỏ gọn, năng động cho học sinh đến vẻ thanh lịch, chắc chắn phù hợp với người đi làm và người cao tuổi. Yếu tố an toàn luôn được đặt lên hàng đầu thông qua hệ thống phanh nhạy bén, đèn chiếu sáng thông minh và bộ điều tốc linh hoạt, giúp kiểm soát hành trình một cách dễ dàng. Việc lựa chọn xe đạp điện không chỉ giúp tiết kiệm tối đa chi phí vận hành mà còn góp phần bảo vệ môi trường, khẳng định một phong cách sống xanh, hiện đại và tràn đầy năng lượng.	t	https://thegioixedien.com.vn/datafiles/setone/thumb_1747110043_gx30_result.jpg
9	XE ĐẠP ĐƯỜNG PHỐ	Xe đạp đường phố (City Bike) là người bạn đồng hành lý tưởng cho những hành trình di chuyển hàng ngày trong không gian đô thị sôi động. Được xem là sự giao thoa hoàn hảo giữa tốc độ của xe đạp đua và sự bền bỉ của xe đạp địa hình, dòng xe này sở hữu thiết kế khung thanh mảnh, trọng lượng nhẹ giúp người lái dễ dàng len lỏi qua các con phố hay tăng tốc nhanh chóng trên những đoạn đường bằng phẳng. Điểm đặc trưng của xe đạp đường phố chính là tư thế ngồi thẳng lưng thoải mái, giúp giảm áp lực lên vai và cổ, kết hợp cùng bộ lốp có bề mặt mịn và bản rộng vừa phải để tối ưu hóa tốc độ mà vẫn đảm bảo độ bám đường ổn định. Với tính đa dụng cao, xe thường được tích hợp sẵn các tiện ích như gác-ba-ga, chắn bùn và bộ truyền động linh hoạt, đáp ứng trọn vẹn mọi nhu cầu từ đi làm, đi học cho đến những chuyến dạo chơi thư giãn cuối tuần. Đây không chỉ là một phương tiện giao thông xanh, tiết kiệm mà còn là biểu tượng của lối sống năng động, hiện đại và thân thiện với môi trường.	t	https://api.xedap.vn/products/RAPTOR/rally-2-bn-red_2.jpg
3	XE ĐẠP ĐUA	Xe đạp đua (Road Bike) là dòng xe dành riêng cho những tín đồ của tốc độ và những hành trình dài trên các cung đường nhựa bằng phẳng. Được thiết kế tối ưu với trọng lượng siêu nhẹ nhờ sử dụng các vật liệu cao cấp như sợi carbon hoặc hợp kim nhôm chuyên dụng, dòng xe này cho phép người lái đạt được vận tốc tối đa nhờ cấu trúc khí động học giúp giảm thiểu lực cản gió một cách hiệu quả. Điểm đặc trưng nhất của xe đạp đua là thiết kế ghi-đông cong (drop bar) cho phép thay đổi nhiều tư thế cầm nắm để tối ưu hóa sức mạnh, kết hợp cùng đôi lốp nhỏ, mịn nhằm giảm ma sát tối đa với mặt đường. Với bộ truyền động đa cấp độ có tỉ số truyền cao, xe giúp người lái duy trì guồng chân ổn định và bứt phá mạnh mẽ trong các cuộc đua hay những buổi tập luyện cường độ cao. Đây không chỉ là phương tiện rèn luyện thể lực bền bỉ mà còn là sự lựa chọn hoàn hảo cho những ai khao khát chinh phục những giới hạn mới về tốc độ và thời gian.	t	https://api.xedap.vn/products/GIANT/2026-tcradv-2-pc-capriblue.jpg
\.


--
-- Data for Name: dia_chi; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.dia_chi (ma_dia_chi, ma_user, ten_nguoi_nhan, sdt_nguoi_nhan, dia_chi, tinh_thanh, is_mac_dinh, ngay_tao, cap_nhat_ngay) FROM stdin;
7	7	Nguyễn Văn VInh	09633890365	tổ 6, thôn Xuân Tây, xã Phú Thuận	TP. Đà Nẵng	t	2026-03-05 13:24:48.860079	2026-03-05 21:04:29.633848
10	24	Nguyễn Ngọc Khế	8366587368	xa Hài Đông, TP. Hải Phòng	TP. Hải Phòng	f	2026-03-05 15:22:31.903119	2026-03-06 15:57:06.374571
11	24	Nguyễn Ngọc Thạch	989859385	xã Sơn Hà, tỉnh Sơn La	Sơn La	f	2026-03-06 15:56:56.321631	2026-03-06 15:57:06.374571
5	24	Nguyễn Ngọc Khế	0388257891	xã Thăng Bình. TP. Đà Nẵng	TP. Đà Nẵng	t	2026-03-05 13:24:48.860079	2026-03-06 15:57:06.375733
3	3	Bùi Minh Quân	0339886769	thôn An Hòa, xã Tây Hồ, TP. Đà Nẵng	Đà Nẵng	t	2026-03-05 13:24:48.860079	2026-03-05 14:12:41.036078
2	2	Trần Thị Huyền Trang	0392032243	thôn 15, xã Thượng Đức, TP. Đà Nẵng	Đà Nẵng	t	2026-03-05 13:24:48.860079	2026-03-05 14:17:38.784656
1	1	Võ Xuân Văn	0961178265	thôn Hà Dục Đông, xã Thượng Đức, TP. Đà Nẵng	Đà Nẵng	t	2026-03-05 13:24:48.860079	2026-03-05 14:19:49.687677
4	26	Trần Thanh Hưng	0978865928	Xã Duy Xuyên, TP. Đà Nẵng	Đà Nẵng	t	2026-03-05 13:24:48.860079	2026-03-05 14:21:39.390042
6	6	Lê Công Tiến	083294752	Phường Hội An, TP. Đà Nẵng	Đà Nẵng	f	2026-03-05 13:24:48.860079	2026-03-05 19:57:54.787267
9	6	le cong tien	076854752	xã Hà Thanh, Tỉnh Quảng Ngãi	Quảng Ngãi	t	2026-03-05 14:06:01.819717	2026-03-05 19:57:54.792121
\.


--
-- Data for Name: donhang; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.donhang (ma_don_hang, ma_user, ngay_dat, trang_thai, tong_tien, phuong_thuc, trangthai_thanhtoan, dia_chi_giao, sdt_nguoi_nhan, ten_nguoi_nhan, ma_khuyenmai, ngay_giao_du_kien, ngay_giao_thuc_te, phi_ship, xoa_don) FROM stdin;
7	26	2026-03-04 16:51:06.835333+07	delivered	13990000	cod	paid	Xã Duy Xuyên, tỉnh Bình Thuận	0978865928	Trần Thanh Hưng	6	2026-03-07 16:51:06.84383+07	2026-03-06 16:08:36.82449+07	100000	f
3	24	2026-03-04 06:20:55.975488+07	cancelled	28780000	vnpay	refunded	xã Thăng Bình, TP. Đà Nẵng	0388257891	Nguyễn Ngọc Khế	\N	2026-03-07 06:20:56.01325+07	\N	0	t
10	24	2026-03-09 15:47:01.295744+07	confirmed	7090000	cod	pending	xa Hài Đông, TP. Hải Phòng	8366587368	Nguyễn Ngọc Khế	\N	2026-03-12 15:47:01.314954+07	\N	100000	f
9	24	2026-03-06 15:57:42.001552+07	shipping	14090000	vnpay	paid	xa Hài Đông, TP. Hải Phòng	8366587368	Nguyễn Ngọc Khế	\N	2026-03-09 15:57:42.017328+07	\N	100000	f
4	24	2026-03-04 10:29:45.368099+07	delivered	16194100	vnpay	paid	xã Thăng Bình, TP. Đà Nẵng	0388257891	Nguyễn Ngọc Khế	\N	2026-03-07 10:29:45.387049+07	2026-03-04 17:00:19.161455+07	0	f
5	7	2026-03-04 16:31:51.322383+07	delivered	502205600	cod	paid	tổ 6, thôn Xuân Tây, xã Phú Thuận, TP. Đà Nẵng	09633890365	Nguyễn Văn VInh	5	2026-03-07 16:31:51.332043+07	2026-03-05 09:03:05.292986+07	0	f
6	26	2026-03-04 16:43:09.962282+07	delivered	14412860	cod	paid	Xã Duy Xuyên, TP. Đà Nẵng	0978865928	Trần Thanh Hưng	5	2026-03-07 16:43:09.971286+07	2026-03-05 09:04:31.609606+07	50000	f
1	24	2026-03-03 11:12:48.022307+07	returned	10084700	cod	refunded	xã Thăng Bình, TP. Đà Nẵng	0388257891	Nguyễn Ngọc Khế	\N	2026-03-06 11:12:48.022258+07	2026-03-03 11:13:12.526504+07	50000	t
2	24	2026-03-03 20:40:46.05631+07	returned	1263900	cod	refunded	xã Thăng Bình, TP. Đà Nẵng	0388257891	Nguyễn Ngọc Khế	\N	2026-03-06 20:40:46.0651+07	2026-03-03 20:41:46.842549+07	50000	t
\.


--
-- Data for Name: dsyeuthich; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.dsyeuthich (ma_dsyeuthich, ma_user, ma_sanpham, ngay_lap) FROM stdin;
17	3	69	2026-02-28 12:19:33.325227
\.


--
-- Data for Name: giohang; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.giohang (ma_gio, ma_user, ngay_tao) FROM stdin;
1	3	2026-02-03 10:11:36.491675+07
2	2	2026-02-04 17:39:51.885072+07
5	6	2026-02-06 17:33:49.418415+07
6	7	2026-02-27 14:29:32.979192+07
9	24	2026-03-03 11:04:27.625182+07
10	26	2026-03-04 16:42:45.795535+07
\.


--
-- Data for Name: hinhanh; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hinhanh (ma_anh, ma_sanpham, image_url, is_main, mau) FROM stdin;
254	73	/static/images/73_3eb6ae_gear_while.jpg	t	TRẮNG
67	19	/static/images/19_818aad_2026-fastroadadvar-1-a-white_2.jpg	t	TRẮNG
105	33	/static/images/33_625eca_esla-2-purple.jpg	t	tím
107	34	/static/images/34_2dc08d_helen-pink.jpg	t	HỒNG
39	10	/static/images/10_ae7564_esla-2-pinkwhite.jpg	t	HỒNG
255	74	/static/images/74_1c85a5_fixelgear2.jpg	f	bạc
73	22	/static/images/22_e460f6_sequoia-7-green_2.jpg	f	XÁM TRẮNG
62	13	/static/images/13_8cdd9a_evo1.webp	t	NGỌC LAM
56	16	/static/images/16_ced943_mochi-4-pink_2.jpg	f	HỒNG
100	32	/static/images/32_69013f_18_42f1c1_jubby-1-blackred.jpg	t	đen đỏ
102	32	/static/images/32_3007d9_18_e5efd2_jubby-1-greyorange.jpg	f	xám cam
88	26	/static/images/26_766905_25_f433e8_lily-4-pink.jpg	f	hồng
86	26	/static/images/26_fcab1d_25_4e365e_lily-4-mauvebrown.jpg	t	hồng cà
87	26	/static/images/26_c28514_25_2bbed2_lily-4-beige.jpg	f	vàng kem
85	25	/static/images/25_4e365e_lily-4-mauvebrown.jpg	f	hồng cà
83	25	/static/images/25_f433e8_lily-4-pink.jpg	f	hồng
82	25	/static/images/25_2bbed2_lily-4-beige.jpg	t	vàng kem
70	21	/static/images/21_44fecc_2_9f44b3_2_60f137_eva-4-lightblue.jpg	f	xanh
69	21	/static/images/21_dbe423_2_326a90_2_6d258f_eva-4-pastelorange.jpg	t	hồng
71	21	/static/images/21_8c43e7_2_4ab9fb_6_955c9c_6_3d1c2f_eva-4-mauvebrown.jpg	f	hồng cà
28	2	/static/images/2_fffdcb_2_4ab9fb_6_955c9c_6_3d1c2f_eva-4-mauvebrown.jpg	f	Hồng cà
14	2	/static/images/2_326a90_2_6d258f_eva-4-pastelorange.jpg	f	Hồng
99	31	/static/images/31_1d3d5e_java-blackblue.jpg	f	xanh đen
98	31	/static/images/31_71b34d_java-blackgreen.jpg	f	xanh lá đen
63	13	/static/images/13_b0422b_evo3.webp	f	NÂU MỰC
45	12	/static/images/12_f91efe_751_0065c5cfd80a7a8.jpg	f	bạc
44	12	/static/images/12_e8d12c_750_e1e6888a314fcae.jpg	t	xám
46	12	/static/images/12_f875ba_752_a5a35c9cf712099.jpg	f	xanh
106	33	/static/images/33_1c7b48_33_641171_esla-2-pinkwhite.jpg	f	hồng trắng
101	32	/static/images/32_12e673_18_ba985c_jubby-1-whiteblue.jpg	f	trắng xanh
65	18	/static/images/18_42f1c1_jubby-1-blackred.jpg	f	đen đỏ
64	18	/static/images/18_ba985c_jubby-1-whiteblue.jpg	t	trắng xanh
66	18	/static/images/18_e5efd2_jubby-1-greyorange.jpg	f	xám cam
55	16	/static/images/16_e7eb28_mochi-4-beige_2.jpg	t	hồng nhạt
40	10	/static/images/10_978247_esla-2-purple.jpg	f	TÍM
75	23	/static/images/23_b4b193_3_641605_hunter-4-green.jpg	f	XANH LỤC
77	23	/static/images/23_49e927_3_238070_hunter-4-lightbluegrey.jpg	f	XANH XÁM
74	23	/static/images/23_0beb0b_3_24db93_hunter-4-blackred.jpg	t	ĐỎ ĐEN
68	20	/static/images/20_747240_2026-roam-4-stealthchrome_2.jpg	t	nÂU CHROME
72	22	/static/images/22_5c045c_sequoia-7-grey_2.jpg	t	Xanh đen
38	6	/static/images/6_a94091_rally-2-bn-black_2.jpg	f	Đen Đỏ
35	6	/static/images/6_c0a3d4_rally-3-bn-blackwhite_2.jpg	t	Đen trắng
96	30	/static/images/30_12b51c_taka-1-grey.jpg	f	xám đen
95	30	/static/images/30_fd7685_taka-1-red.jpg	t	đỏ đen
94	29	/static/images/29_ceabb2_liv.jpg	f	xanh nhạt
93	29	/static/images/29_4e1285_liv2.jpg	t	xanh nhạt
92	28	/static/images/28_2b2ae9_2026-propeladvpro-0-di-2-abyssblack.jpg	t	đen trắng
29	4	/static/images/4_45f110_2026-tcradv-2-pc-capriblue.jpg	t	Xanh Capri
30	4	/static/images/4_6aeeeb_2026-tcradv-2-pc-stealthchrome.jpg	f	Xám đen
241	75	/static/images/75_5aa7a3_gear6black.jpg	f	đen
247	75	/static/images/75_208b1a_gear6red.jpg	f	đỏ
111	35	/static/images/35_3b58c4_34_f7f471_helen-lightgreen.jpg	f	XANH
174	54	/static/images/54_736a22_honour-300-black.jpg	f	đen
127	40	/static/images/40_d02a05_38_756482_misaki-green.jpg	t	XANH
128	40	/static/images/40_994948_misaki-grey.jpg	f	XÁM
24	3	/static/images/3_238070_hunter-4-lightbluegrey.jpg	f	XANH
49	14	/static/images/14_069188_neo-9-se-graytitanium.jpg	t	XÁM
50	14	/static/images/14_ad4b81_neo-9-se-graywhite_2.jpg	f	TRẮNG
51	14	/static/images/14_9d1084_neo-9-se-blue.jpg	f	XANH
57	16	/static/images/16_338f94_mochi-4-green_3.jpg	f	XANH
76	23	/static/images/23_8363a6_3_87e946_hunter-4-greywhite.jpg	f	TRẮNG
78	24	/static/images/24_5ede36_5_a87595_rally-2-bn-orange_2.jpg	t	CAM
79	24	/static/images/24_179d97_6_c59da6_rally-2-bn-red_2.jpg	f	ĐỎ
80	24	/static/images/24_f58668_5_ba6a62_rally-2-bn-black_2.jpg	f	ĐEN
81	24	/static/images/24_d64443_6_510f5f_rally-2-bn-grey_2.jpg	f	XÁM
90	27	/static/images/27_71fea6_veloce-16-sr-3-black.jpg	t	ĐEN
91	27	/static/images/27_0bc605_veloce-16-sr-3-white.jpg	f	TRẮNG
123	38	/static/images/38_f0d80f_misaki-grey.jpg	f	XÁM
124	38	/static/images/38_756482_misaki-green.jpg	f	XANH
31	5	/static/images/5_12acb8_rally-2-bn-red_2.jpg	t	ĐỎ
32	5	/static/images/5_ba6a62_rally-2-bn-black_2.jpg	f	ĐEN
33	5	/static/images/5_f70a1d_rally-2-bn-grey_2.jpg	f	XÁM
34	5	/static/images/5_a87595_rally-2-bn-orange_2.jpg	f	CAM
97	31	/static/images/31_92ecfc_java-white.jpg	t	TRẮNG
108	34	/static/images/34_bc476b_helen-white.jpg	f	TRẮNG
109	34	/static/images/34_f7f471_helen-lightgreen.jpg	f	XANH
110	35	/static/images/35_7ab78c_34_bc476b_helen-white.jpg	t	TRẮNG
143	44	/static/images/44_61e143_liv-green.jpg	f	XANH
148	46	/static/images/46_bdaf56_wahoocity-grey.jpg	f	XÁM
149	46	/static/images/46_3eac57_wahoocity-white.jpg	f	TRẮNG
151	47	/static/images/47_992a54_velo-white.jpg	f	TRẮNG
152	47	/static/images/47_dd2f2a_velo-black.jpg	f	ĐEN
154	48	/static/images/48_5400a2_feliz-2-b-black_2.jpg	f	ĐEN
156	48	/static/images/48_af2666_feliz-2-b-grey.jpg	f	XÁM
171	53	/static/images/53_e1766a_evo-orange.jpg	f	CAM
185	58	/static/images/58_97365f_atx-610-glossblack_2.jpg	t	ĐEN
60	17	/static/images/17_c9b16f_rock-2-orange_2.jpg	f	CAM
61	17	/static/images/17_a2b268_rock-2-greyyellow_2.jpg	f	XÁM
192	61	/static/images/61_321de3_Elite_BlackYellowGreen.jpg	f	ĐEN
89	26	/static/images/26_0993da_lily-4-blue.jpg	f	xanh
84	25	/static/images/25_d985bd_lily-4-blue.jpg	f	xanh
27	2	/static/images/2_ca97d3_2_9f44b3_2_60f137_eva-4-lightblue.jpg	t	Xanh
145	45	/static/images/45_571a52_15_ce5361_volta-white.jpg	f	trắng
146	45	/static/images/45_23bc54_volta-black_(1).jpg	f	đen
136	43	/static/images/43_9956a0_41_3cc166_Chino2_Green.jpg	t	xanh
131	41	/static/images/41_3cc166_Chino2_Green.jpg	f	xanh
58	17	/static/images/17_87ab3b_rock-2-lightgrey_2.jpg	t	BẠC
59	17	/static/images/17_87dcf1_rock-2-darkblue_2.jpg	f	XANH đen
43	11	/static/images/11_2e65c2_esla-2-pinkwhite.jpg	f	hồng
41	11	/static/images/11_721091_bella-1-blue_2.jpg	t	xanh
42	11	/static/images/11_164145_bella-1-white_2.jpg	f	trắng
21	1	/static/images/1_7070ed_ares1b-lightgreyred-1.webp	f	Bạc
1	1	/static/images/1_e522ab_2_3710ad_7_0283ca_simba-4-orangeblack.jpg	f	Cam đen
22	1	/static/images/1_854bf2_ares1b-greyyellow.webp	f	Xám
20	1	/static/images/1_9a4bfc_ares1b-orangeblack.webp	t	Cam
184	57	/static/images/57_3da346_raptor-napa-red.jpg	f	đỏ
157	49	/static/images/49_4047ec_hunter-4-greywhite.jpg	t	trắng
159	49	/static/images/49_dcf638_hunter-4-lightbluegrey.jpg	f	xanh
158	49	/static/images/49_72cb32_3_641605_hunter-4-green.jpg	f	xanh lá
183	57	/static/images/57_ce84d7_raptor-napa-grey.jpg	f	xám
182	57	/static/images/57_db1edf_raptor-napa-darkgrey.jpg	t	đen
155	48	/static/images/48_b5ac60_feliz-2-b-white_2.jpg	f	bạc
36	6	/static/images/6_c59da6_rally-2-bn-red_2.jpg	f	Đỏ
37	6	/static/images/6_510f5f_rally-2-bn-grey_2.jpg	f	Xám
25	3	/static/images/3_641605_hunter-4-green.jpg	f	Xanh lá
23	3	/static/images/3_87e946_hunter-4-greywhite.jpg	t	Trắng
26	3	/static/images/3_24db93_hunter-4-blackred.jpg	f	Đỏ
242	75	/static/images/75_cd0e4e_gear6red.jpg	f	đỏ
250	75	/static/images/75_fcebee_gear6gray.jpg	f	đà
258	74	/static/images/74_2172db_fixelgear4.jpg	t	xanh
112	35	/static/images/35_399e87_34_2dc08d_helen-pink.jpg	f	HỒNG
243	75	/static/images/75_21263f_gear6while.jpg	f	bạc
248	75	/static/images/75_92fc59_gear6while.jpg	f	bạc
260	76	/static/images/76_40f70f_vin001.jpg	f	xanh
244	75	/static/images/75_cddc4d_gear6roe.jpg	f	trắng
249	75	/static/images/75_6d02a9_gear6roe.jpg	f	trắng
261	76	/static/images/76_137ee7_vin003.jpg	t	xanh đen
161	50	/static/images/50_c92fa7_talon-293-panther.jpg	t	đen
208	67	/static/images/67_ff1271_alight3-disc-paleolive_2.jpg	f	VÀNG KEM
160	49	/static/images/49_850d97_3_24db93_hunter-4-blackred.jpg	f	đen đỏ
204	65	/static/images/65_7a94f2_alight-2-disc-mineralgreen.jpg	f	XANH LỤC
126	39	/static/images/39_1c1970_lily-beige.jpg	f	\N
203	65	/static/images/65_9b776b_alight-2-disc-frostsilver_2.jpg	t	XANH nhạt
144	45	/static/images/45_8a833c_volta-titanium.jpg	t	bạc
169	52	/static/images/52_f1d00a_marlin-3-blackyellow.jpg	t	đen vàng
153	48	/static/images/48_a21759_feliz-2-b-lightgold.jpg	t	VÀNG KIM
135	42	/static/images/42_ddcb92_Trinx_Princess18_1.jpg	f	HỒNG TRẮNG
129	40	/static/images/40_0eee47_38_94e9d9_misaki-pink.jpg	f	HỒNG
142	44	/static/images/44_dc0a44_liv-violet.jpg	t	\N
122	38	/static/images/38_94e9d9_misaki-pink.jpg	t	HỒNG
202	64	/static/images/64_a68b51_mocha-1-blue_2.jpg	f	XANH LỤC
186	58	/static/images/58_aec7c1_atx-610-latte_2.jpg	f	XÁM
147	46	/static/images/46_69f6c9_wahoocity-sand.jpg	t	\N
197	63	/static/images/63_1e8e6c_GT275N_BlackWhiteBlue.jpg	f	đen xanh
189	60	/static/images/60_b579ba_DM_20241003182344_001.jpg	t	XANH LỤC
150	47	/static/images/47_3855fd_velo-titanium.jpg	t	\N
190	60	/static/images/60_3526a4_DM_20241003182344_002.jpg	f	ĐEN
188	59	/static/images/59_4e87c6_atx-830-mattcharcoalgray_2.jpg	f	xám bạc
187	59	/static/images/59_56248c_atx-830-mattgray_2.jpg	t	trắng
172	53	/static/images/53_ff8afa_evo-blue.jpg	f	xanh dương
170	53	/static/images/53_201f34_evo-grey.jpg	t	trắng
137	43	/static/images/43_26fa68_41_3cf7a8_Chino2_White.jpg	f	trắng xanh
141	43	/static/images/43_1f1fbe_43_798786_41_a0f7d3_Chino2_Grey-1.jpg	f	xám cam
140	43	/static/images/43_f7ead8_Chino2_Beige.jpg	f	vàng nhạt
167	52	/static/images/52_9f6637_marlin-3-blackgreen.jpg	f	đen xanh
168	52	/static/images/52_83119f_marlin-3-blackred.jpg	f	đen đỏ
177	55	/static/images/55_93dacc_challenger-greyorange.jpg	f	xám cam
176	55	/static/images/55_5bbc5e_challenger-blackwhite.jpg	t	đen trắng
178	55	/static/images/55_180319_challenger-blackred.jpg	f	đen đỏ
180	56	/static/images/56_578870_2025-talon3-panther.jpg	f	ĐEN
191	61	/static/images/61_8393c7_Elite_GrayGreen.jpg	t	\N
179	56	/static/images/56_1fd394_2025-talon3-beeswax.jpg	t	VÀNG
181	56	/static/images/56_30a6b2_2025-talon3-frostsilver.jpg	f	XANH
175	54	/static/images/54_c404e6_honour-300-silverwhite.jpg	f	trắng bạc
173	54	/static/images/54_a01128_honour-300-cyan.jpg	t	vàng kem
165	51	/static/images/51_758e85_epic-green.jpg	f	trắng xanh
164	51	/static/images/51_c7f9e7_epic-black.jpg	t	trắng đen
166	51	/static/images/51_fa5357_epic-orange.jpg	f	trắng cam
134	42	/static/images/42_d546c2_Trinx_Princess18.jpg	t	hồng trắng
209	68	/static/images/68_ea1175_escape-3-disc-mineralgreen_2.jpg	f	xanh lục
207	67	/static/images/67_be19ab_alight3-disc-nighthaze.jpg	t	\N
206	66	/static/images/66_e9210e_alight4-disc-asphaltgreen_2.jpg	f	đen
205	66	/static/images/66_1e79af_alight4-disc-balibricks_2.jpg	t	cam
133	41	/static/images/41_a0f7d3_Chino2_Grey-1.jpg	f	xám cam
132	41	/static/images/41_3cf7a8_Chino2_White.jpg	f	trắng xanh
130	41	/static/images/41_50948c_Chino2_Beige.jpg	t	vàng nhạt
119	37	/static/images/37_d0535a_hola-20b-black.jpg	t	cam đen
120	37	/static/images/37_45a283_hola-20b-white.jpg	f	trắng xanh
121	37	/static/images/37_37414a_1_854bf2_ares1b-greyyellow.webp	f	xam vàng
118	36	/static/images/36_66f35c_36_90b5a0_hola-whiteblue.jpg	f	trắng xanh
117	36	/static/images/36_d15052_hola-blackorange.jpg	f	cam đen
116	36	/static/images/36_b01394_hola-greyyellow.jpg	t	vàng xám
162	50	/static/images/50_28a5aa_talon-293-beewax.jpg	f	vàng
163	50	/static/images/50_4e3c12_talon-293-frostsilver_2.jpg	f	xanh
245	75	/static/images/75_c20805_gear6gray.jpg	f	đà
246	75	/static/images/75_7c1063_gear6black.jpg	t	đen
262	76	/static/images/76_18ff66_vin002.jpg	f	đỏ
212	69	/static/images/69_549708_dm-20241111101103-005.jpg	f	xanh lục nhạt
210	68	/static/images/68_a29c8b_escape-3-disc-ultranavy_2.jpg	t	đen
251	73	/static/images/73_f2f91f_gear_lam.jpg	f	XANH LAM
259	74	/static/images/74_ab5795_fixelgear.jpg	f	đen
211	69	/static/images/69_8fcdfb_dm-20241111101103-001.jpg	t	xanh lục nhạt
225	72	/static/images/72_f8fb46_neojava.jpg	f	trắng xanh
226	72	/static/images/72_1855d8_neojava1.jpg	t	trắng xanh
125	39	/static/images/39_8fc90c_lily-green.jpg	t	XANH
215	71	/static/images/71_5b61ed_fd.jpg	t	đen
214	70	/static/images/70_b56e96_Life22_BlackBlue.jpg	f	XANH ĐEN
252	73	/static/images/73_57b3eb_gear_blue.jpg	f	XÁM XANH
257	74	/static/images/74_5d5a22_fixelgear1.jpg	f	xanh lam
193	62	/static/images/62_5fcaff_ps-06-white.jpg	t	TRẮNG
194	62	/static/images/62_326e2d_PS06_Black-1.jpg	f	ĐEN
195	62	/static/images/62_9e60d4_PS06_Grey-1.jpg	f	XÁM
201	64	/static/images/64_fa3df4_mocha-1-white_2.jpg	t	TRẮNG
213	70	/static/images/70_96f32c_Life22_WhiteGolden.jpg	t	TRẮNG
216	71	/static/images/71_e4504e_fd-806-white-fixed-1.jpg	f	TRẮNG
217	71	/static/images/71_bfa7b0_fd-806-blue-fix-1.jpg	f	XANH
196	63	/static/images/63_01ad01_GT275N_BlackGrayRed.jpg	t	đen đỏ
199	63	/static/images/63_f91c41_GT275N_GrayBlackGray.jpg	f	xám
200	63	/static/images/63_dc3c7c_GT275N_GrayBlackWhite.jpg	f	xám trắng
198	63	/static/images/63_a03a1f_GT275N_GrayBlackOrange.jpg	f	xám cam
253	73	/static/images/73_374024_gear_black.jpg	f	ĐEN
256	74	/static/images/74_ae4aaa_fixelgear3.jpg	f	trắng
\.


--
-- Data for Name: lichsu_donhang; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.lichsu_donhang (ma_lichsu, ma_don_hang, trang_thai, mo_ta, thoi_gian) FROM stdin;
1	7	confirmed	Đơn hàng của bạn đã được xác nhận.	2026-03-05 08:57:46.717435
2	7	shipping	đơn hàng đang được giao đến Hưng	2026-03-05 08:58:40.800657
3	6	shipping	Đơn hàng đang được giao đến bạn.	2026-03-05 09:02:44.885023
4	5	delivered	Đã giao hàng thành công.	2026-03-05 09:03:05.285635
5	6	delivered	Đã giao hàng thành công.	2026-03-05 09:04:31.601482
10	9	pending	Đơn hàng đã được khởi tạo thành công.	2026-03-06 15:57:42.035858
11	7	delivered	Đã giao hàng thành công.	2026-03-06 16:08:36.817982
12	9	confirmed	Đơn hàng của bạn đã được xác nhận.	2026-03-06 16:08:52.227423
13	10	pending	Đơn hàng đã được khởi tạo thành công.	2026-03-09 15:47:01.331231
14	10	confirmed	Đơn hàng của bạn đã được xác nhận.	2026-03-09 15:47:55.092674
15	9	shipping	Đơn hàng đang được giao đến bạn.	2026-03-09 15:48:09.412261
\.


--
-- Data for Name: lichsuchat; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.lichsuchat (id_chat, user_id, role, message, context_type, thoi_gian) FROM stdin;
1	1	user	Sản phẩm nào bán chạy nhất?	admin_ai	2026-02-16 20:50:21.211684
2	1	assistant	🔧 Xin lỗi, AI tạm thời gặp sự cố kỹ thuật.\n\nVui lòng thử lại sau hoặc liên hệ kỹ thuật nếu lỗi vẫn tiếp diễn.	admin_ai	2026-02-16 20:50:21.732829
3	1	user	doanh thu	admin_ai	2026-02-16 20:50:32.013257
4	1	assistant	🔧 Xin lỗi, AI tạm thời gặp sự cố kỹ thuật.\n\nVui lòng thử lại sau hoặc liên hệ kỹ thuật nếu lỗi vẫn tiếp diễn.	admin_ai	2026-02-16 20:50:32.167512
5	1	user	doanh thu	admin_ai	2026-02-16 20:52:48.172959
6	1	assistant	💰 Doanh thu ngày 2026-02-16: 0 VND\n📦 Số đơn thành công: 0	admin_ai	2026-02-16 20:52:48.517478
7	1	user	sản phẩm bán chạy	admin_ai	2026-02-16 20:53:01.361135
8	1	assistant	🔥 Top 5 sản phẩm bán chạy:\n1. Xe Đạp Trẻ Em Youth RAPTOR Simba 4 - Bánh 18 Inch - Đã bán: 3\n2. Xe Đạp Đường Phố Touring RAPTOR Eva 4 - Bánh 26 Inch - Đã bán: 2\n3. Xe Đạp Đường Phố Touring RAPTOR Rally 2B - Bánh 26 Inch - Đã bán: 1\n	admin_ai	2026-02-16 20:53:01.498736
9	1	user	tồn kho	admin_ai	2026-02-24 13:49:50.306426
10	1	assistant	⚠️ Cảnh báo tồn kho:\n• Xe Đạp Đua Đường Trường Road GIANT Propel Advanced Pro 0 DI2 - Phanh Đĩa, Bánh 700C - 2026 (Còn: 5)\n• Xe Đạp Đua Đường Trường Road LIV Enviliv Advanced Pro 1 - Phanh Đĩa, Bánh 700C - 2026 (Còn: 5)	admin_ai	2026-02-24 13:49:51.397688
11	1	user	viết mô tả cho thương hiệu merec	admin_ai	2026-02-25 20:08:10.894768
12	1	assistant	📝 Gợi ý mô tả sản phẩm:\n\n🚀 viết thương hiệu merec - Lựa chọn hoàn hảo cho bạn!\n\n✅ Thiết kế hiện đại, chất lượng cao\n✅ Phù hợp mọi độ tuổi và nhu cầu\n✅ Giá cả cạnh tranh, bảo hành chính hãng\n\n👉 Liên hệ ngay để nhận ưu đãi đặc biệt!\n\n⚠️ Lưu ý: AI đang tạm nghỉ, đây là gợi ý cơ bản. Hãy chỉnh sửa cho phù hợp!	admin_ai	2026-02-25 20:08:11.798136
13	1	user	MÔ TẢ THƯƠNG HIỆU JEEP	admin_ai	2026-02-26 10:20:30.032392
14	1	assistant	📝 Gợi ý mô tả sản phẩm:\n\n🚀 THƯƠNG HIỆU JEEP - Lựa chọn hoàn hảo cho bạn!\n\n✅ Thiết kế hiện đại, chất lượng cao\n✅ Phù hợp mọi độ tuổi và nhu cầu\n✅ Giá cả cạnh tranh, bảo hành chính hãng\n\n👉 Liên hệ ngay để nhận ưu đãi đặc biệt!\n\n⚠️ Lưu ý: AI đang tạm nghỉ, đây là gợi ý cơ bản. Hãy chỉnh sửa cho phù hợp!	admin_ai	2026-02-26 10:20:30.902818
\.


--
-- Data for Name: ma_khuyenmai; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ma_khuyenmai (ma_khuyenmai, ma_giamgia, kieu_giamgia, giatrigiam, don_toithieu, solandung, solan_hientai, ngay_batdau, ngay_ketthuc, is_active) FROM stdin;
6	SALE T3	fixed_amount	100000.00	10000000.00	15	11	2026-02-26 14:44:59.614078	2026-03-05 23:59:59	t
5	TET2026	percentage	14.00	1000000.00	5	3	2026-02-18 09:16:18.770546	2026-03-05 23:59:59	t
\.


--
-- Data for Name: sanpham; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sanpham (ma_sanpham, ten_sanpham, sanpham_code, ma_danhmuc, ma_thuonghieu, mo_ta, gia, kieu_giam_gia, gia_tri_giam, ton_kho, size_banh_xe, size_khung, mau, diem_danh_gia, is_active, ngay_lap, thong_so_ky_thuat) FROM stdin;
73	Xe đạp Fixed Gear Magicbros CX7	SP9KEKFKDF	7	12	**Xe Fixed gear Magicbros CX7**\n  \n   Nếu như bạn đang muốn kiếm cho mình một chiếc xe đạp fixed gear đúng chuẩn Fixed khung nhôm ngon, bền , rẻ thì Magicbros CX7 lac sự lựa chọn không thể bỏ qua . \n  Với thiết kế bản dẹt chém gió giúp bạn cải thiện được lực cản gió, giúp tốc độ cải thiênn hơn. Khung sườn được sản xuất từ nhôm 6061 siêu bền .\n  Không giống như các loại xe khác, fixed gear là dòng xe rất phá xe.  để cấu thành một chiếc xe ngon thì yếu tố khung sườn , linh kiện gắn trên xe vô cùng quan trọng đối với fixed gear . Nhìn trên ảnh thì có vẻ giống nhau nhưng giữa xe tốt và xe rẻ nó khác nhau ở linh kiện trên xe.\n   Ngoài khung sườn được làm từ nhôm 6061 cao cấp ra, hub xe được hãng trang bị của Legend siêu nhẹ, siêu trớn, trục giữa nhập khẩu, chén cổ bạc đạn là sự khác biệt của magicbros với các loại fixed gear giá rẻ, nhái trên thị trường .\n   Hiện nay fixed gear rẻ nhái rất nhiều trên thị trường, hãy là người tiêu dùng thông thái.Đừng có suy nghĩ mua tạm rẻ rồi nâng cấp dần, vì khi nâng cấp tốn rất nhiều tiền mà xe chưa thể ngon được đâu ah.\nCâu nói tiền nào của ý luôn luôn đúng ạ 	5150000	percentage	2	18	30	nhôm cao cấp 6061	XANH LAM, XÁM XANH, TRẮNG, ĐEN	0	t	2026-03-08 21:14:55.564485+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "S"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "Xanh lam, x\\u00e1m xanh, tr\\u1eafng, \\u0111en"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Khung nh\\u00f4m cao c\\u1ea5p 6061 kh\\u00f4ng m\\u1ed1i h\\u00e0n"}, {"ten": " C\\u00c0NG", "gia_tri": " Nh\\u00f4m MAGICBROS 700c"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "V\\u00e0nh nh\\u00f4m tr\\u01b0\\u1edbc 4cm, sau 6cm MAGICBROS PRO"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": " LEGEND 32 l\\u1ed7 si\\u00eau tr\\u1edbn"}, {"ten": " TR\\u1ee4C GI\\u1eeeA", "gia_tri": "Neco bi v\\u00f2ng"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Compass 700*23C/25C"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": " Nh\\u00f4m 31.8mm"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": " Nh\\u00f4m 31.8mm"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "Nh\\u00f4m MAGICBROS b\\u1ea3n d\\u1eb9t"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "h\\u1ea1t \\u0111\\u1eadu "}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": " \\u0110\\u00f9i nh\\u00f4m 5 ch\\u1ea5u 46T"}, {"ten": "PH\\u00d9 H\\u1ee2P", "gia_tri": "Ph\\u00f9 h\\u1ee3p v\\u1edbi ng\\u01b0\\u1eddi cao t\\u1eeb 1,52-1,8m"}]
19	Xe Đạp Đường Phố Touring GIANT Fastroad AR Advanced 1-Asia - Phanh Đĩa, Bánh 700C - 2026	SPHJSN3834	9	2	**Xe Đạp Đường Phố Touring GIANT **Fastroad AR Advanced 1-Asia – Phanh Đĩa, Bánh 700C – 2026\nMang tốc độ của Roadbike, sự thoải mái của City Touring, và phong thái đỉnh cao của một chiến mã đường phố – đó chính là Fastroad AR Advanced 1-Asia 2026. Chiếc xe carbon cao cấp này được tạo ra cho những ai yêu cảm giác lướt nhanh – đạp mượt – sống phong cách trên mọi cung đường.\n\n**Những điểm nổi bật của GIANT Fastroad AR Advanced 1-Asia 2026**\nThiết kế tối giản hiện đại và khí động học cao\nPhiên bản mới với màu Icicle White mang vẻ ngoài tinh tế và sang trọng, kết hợp khung touring lai road mảnh mai nhưng chắc chắn. Ghi đông phẳng giúp người lái duy trì tư thế thoải mái khi di chuyển đường dài hoặc đạp phố, phù hợp với phong cách “sport touring” đặc trưng của dòng Fastroad.\n\n**Khung sườn carbon cao cấp, siêu nhẹ và cứng cáp**\nSử dụng vật liệu Advanced-grade composite, Fastroad AR Advanced 1 có độ cứng vững vượt trội nhưng vẫn duy trì trọng lượng nhẹ. Hệ thống trục 12x142mm thru-axle cho khả năng chịu tải và ổn định tốt hơn, đảm bảo cảm giác lái chắc chắn ngay cả khi vào cua hoặc tăng tốc mạnh.\n\n**Phuộc carbon hấp thụ rung chấn hiệu quả**\nPhuộc Advanced composite OverDrive steerer giúp giảm rung động truyền lên tay lái, mang lại trải nghiệm êm ái và kiểm soát tốt hơn trên những cung đường gồ\nghề hoặc dài hơi.\n\n**Phanh dầu kiểm soát an toàn tuyệt đối**\nHệ thống phanh dầu mang lại lực phanh ổn định, nhạy và dễ điều chỉnh trong mọi điều kiện – dù trời mưa hay đường trơn. Đây là điểm cộng lớn khi so sánh với phanh cơ thông thường, đặc biệt hữu ích cho những người thường xuyên đạp xa hoặc ở tốc độ cao.\n\n**xe đạp GIANT touring đi làm hàng ngày**\n\nBánh xe cân bằng giữa tốc độ và êm ái\nCặp bánh Giant P-R2 Disc kết hợp lốp Giant Gavia Fondo 2 Tubeless 700x32C cho khả năng bám đường tốt, vận hành mượt và giảm thiểu nguy cơ thủng bánh. Độ rộng 32C giúp tăng độ ổn định mà vẫn duy trì tốc độ đặc trưng của dòng xe đường phố cao cấp.\n\n**Yên xe và cốt yên D-Fuse – thoải mái và giảm chấn tối đa**\nBộ yên Giant ErgoContact cùng cốt yên D-Fuse composite thiết kế đặc biệt để hấp thụ rung động, giảm áp lực lên cột sống và mang lại cảm giác dễ chịu khi đạp lâu.\n\n**Ai nên chọn GIANT Fastroad AR Advanced 1-Asia 2026?**\nNgười yêu thích đạp tốc độ nhưng vẫn muốn sự thoải mái của touring.\n \nNgười thường xuyên đạp đường dài, đường đô thị hoặc hỗn hợp.\n \nNgười muốn sở hữu chiếc xe carbon cao cấp, nhẹ và hiệu năng cao nhưng không cần tư thế roadbike quá chúi.\n \nPhù hợp với người cao từ 1m65 – 1m85, chọn size S hoặc M tùy thể hình.\n \nGIANT Fastroad AR Advanced 1-Asia 2026 không chỉ là một chiếc xe – mà là biểu tượng của phong cách sống năng động, nơi tốc độ gặp sự thoải mái và hiệu suất hòa cùng đẳng cấp. Nếu bạn đang tìm một người bạn đồng hành cho cả hành trình tập luyện lẫn di chuyển hằng ngày, đây chính là lựa chọn đáng giá để sở hữu ngay hôm nay.\n\n	48790000	percentage	0	8	30	cacbon Advanced-grade composite	trắng	0	t	2026-02-08 16:30:10.149053+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "S"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "Tr\\u1eafng"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "cacbon Advanced-grade composite"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Advanced-grade composite, composite OverDrive steerer, 12x100mm thru-axle, disc"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "Giant Sport Flat, 31.8"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "Giant Contact,alloy"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "Giant D-Fuse, composite"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Giant ErgoContact"}, {"ten": "BA\\u0300N \\u0110A\\u0323P/PEDALS", "gia_tri": "Giant G-Base"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "Shimano 105 SL-RS700 2X11 Speed"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "Shimano 105"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "Shimano 105 2x11S"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Tektro HD-R280"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "Shimano 105 CS-HG700,11-34T"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "KMC X11"}, {"ten": "GI\\u00d2 DI\\u0303A/CRANKSET", "gia_tri": "FSA Omega, 32/48"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "Giant P-R2 Disc"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Giant Gavia Fondo 2, 60tpi 700X32C, Wirebead, Tubless"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "12mm Thru Axles"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "24H"}, {"ten": "TAY TH\\u1eaeNG/BRAKE LEVERS", "gia_tri": "Tektro HD-R280"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "FSA BB-AL86"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
4	Xe Đạp Đua Đường Trường Road GIANT TCR Advanced 2 Pro Compact - Phanh Đĩa, Bánh 700C 	SPB69BLYE4	3	2	Xe Đạp Đua Đường Trường GIANT TCR Advanced 2 Pro Compact 2026 – Hiệu suất cao, kiểm soát vượt trội\nGIANT TCR Advanced 2 Pro Compact 2026 là mẫu xe đạp đua đường trường hướng đến người chơi road nghiêm túc, cần một chiếc xe nhẹ, cứng cáp và phản hồi chính xác để tập luyện cường độ cao và thi đấu phong trào. Thiết kế khí động học cùng phanh đĩa giúp xe vận hành ổn định và an toàn ở tốc độ cao.\n\nKhung xe Advanced-grade Composite kết hợp trục xuyên 12x142mm mang lại khả năng truyền lực hiệu quả và độ ổn định cao khi vào cua. Phuộc trước full-composite với cổ lái OverDrive tăng độ cứng phần đầu xe, giúp tay lái chính xác và tự tin hơn trong những tình huống xử lý nhanh.\n\nXe được trang bị bộ bánh Giant P-R1 Disc với profile 30mm giúp cải thiện khí động học, giảm lực cản lăn, giúp người đạp dễ dàng đạt được tốc độ cao mà không tốn quá nhiều sức. Lốp Giant Gavia Course 0 tubeless 700x28c cho khả năng bám đường xuất sắc, giảm lực cản và mang lại cảm giác đạp êm hơn khi đi đường dài hoặc mặt đường xấu.\n\nTư thế đạp được tối ưu với ghi đông Giant Contact, pô tăng Contact AeroLight và cốt yên composite Giant Variant có khả năng điều chỉnh offset, giúp người đạp dễ dàng tinh chỉnh dáng ngồi phù hợp với mục tiêu hiệu suất hoặc sự thoải mái.\n\nGIANT TCR Advanced 2 Pro Compact 2026 sử dụng bộ truyền động Shimano 105 2X12 cho ra 24 tốc độ, nổi tiếng với độ bền cao, sang số chính xác và khả năng vận hành ổn định trong thời gian dài. Dải líp 11–34 kết hợp giò đĩa compact 36/52 giúp xe linh hoạt khi leo dốc nhưng vẫn giữ được tốc độ tốt trên đường bằng.\n\nHệ thống phanh đĩa dầu Shimano 105 với đĩa trước 160mm và sau 140mm mang lại lực phanh mạnh, kiểm soát tốt và ổn định trong mọi điều kiện thời tiết, đặc biệt khi xuống dốc hoặc phanh gấp ở tốc độ cao.\n\nTổng thể, GIANT TCR Advanced 2 Pro Compact 2026 là lựa chọn lý tưởng cho người chơi road đang tìm kiếm một chiếc xe hiệu suất cao, công nghệ hiện đại và khả năng kiểm soát vượt trội, phù hợp cho tập luyện nghiêm túc và thi đấu phong trào.	62990000	percentage	50	31	30	Cacbon Advanced-grade Composite	Xanh Capri, Xám đen	2	t	2026-02-05 17:23:46.96277+07	[{"ten": "K\\u00edch c\\u1ee1/Sizes", "gia_tri": "M, S, XS"}, {"ten": "M\\u00e0u s\\u1eafc/Colors", "gia_tri": "Xanh Capri, X\\u00e1m \\u0111en"}, {"ten": "Ch\\u1ea5t li\\u1ec7u khung/Frame", "gia_tri": "Advanced-grade Composite, 12x142mm thru-axle, disc"}, {"ten": "Phu\\u1ed9c/Fork", "gia_tri": "Advanced-grade Composite, full-composite OverDrive steerer, 12x100mm thru-axle, disc"}, {"ten": "V\\u00e0nh xe/Rims", "gia_tri": "Giant P-R1 Disc wheelset, alloy, [F]30mm, [R]30mm"}, {"ten": "\\u0110\\u00f9m/Hubs", "gia_tri": "Giant alloy, 12mm thru-axle"}, {"ten": "C\\u0103m/Spokes", "gia_tri": "stainless"}, {"ten": "L\\u1ed1p xe/Tires", "gia_tri": "Giant Gavia Course 0, tubeless, 700x28c (28mm), folding"}, {"ten": "Ghi \\u0111\\u00f4ng/Handlebar", "gia_tri": "Giant Contact"}, {"ten": "P\\u00f4 t\\u0103ng/Stem", "gia_tri": "Giant Contact AeroLight"}, {"ten": "C\\u1ed1t y\\u00ean/Seatpost", "gia_tri": "Giant Variant, composite, -5/+15mm offset"}, {"ten": "Y\\u00ean/Saddle", "gia_tri": "Giant Approach"}, {"ten": "Ba\\u0300n \\u0111a\\u0323p/Pedals", "gia_tri": "Giant G-Base"}, {"ten": "Tay \\u0111\\u1ec1/Shifters", "gia_tri": "Shimano 105"}, {"ten": "Chuy\\u1ec3n \\u0111\\u0129a/Front Derailleur", "gia_tri": "Shimano 105"}, {"ten": "Chuy\\u1ec3n l\\u00edp/Rear Derailleur", "gia_tri": "Shimano 105"}, {"ten": "B\\u1ed9 th\\u1eafng/Brakes", "gia_tri": "Shimano 105 hydraulic, Shimano SM-RT64 rotors [F]160mm, [R]140mm"}, {"ten": "Tay th\\u1eafng/Brake Levers", "gia_tri": "Shimano 105"}, {"ten": "B\\u1ed9 l\\u00edp/Cassette", "gia_tri": "Shimano 105, 12-speed, 11x34"}, {"ten": "S\\u00ean xe/Chain", "gia_tri": "KMC X12L-1"}, {"ten": "Gi\\u00f2 di\\u0303a/Crankset", "gia_tri": "Shimano 105, 36/52"}, {"ten": "B.B/Bottom Bracket", "gia_tri": "Shimano, press fit"}, {"ten": "Tr\\u1ecdng l\\u01b0\\u1ee3ng/Weight", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n. R\\u00fat g\\u1ecdn"}]
21	Xe Đạp Nữ Đường Phố Youth RAPTOR Eva 3 - Bánh 24 Inch	SPLLO8LP9K	4	1	**Xe Đạp Đường Phố Youth RAPTOR Eva 3** – Đơn giản, dễ đạp, phù hợp cho trẻ em\nRAPTOR Eva 3 là mẫu xe đạp đường phố dành cho trẻ em và thiếu niên, phù hợp cho việc đi học, vui chơi hoặc di chuyển hằng ngày với cường độ vừa phải. Thiết kế xe hướng đến sự an toàn, dễ sử dụng và dễ làm quen cho các em nhỏ.\n\n**Khung xe Raptor STL 24** bằng thép mang lại độ chắc chắn cao, giúp xe ổn định và bền bỉ trong quá trình sử dụng. Phuộc thép Raptor giúp xe vận hành êm ái hơn khi đi trên các đoạn đường gồ ghề, vỉa hè hoặc sân chơi.\n\nXe sử dụng **bánh 24 inch** với vành nhôm 36 lỗ, giúp bánh xe nhẹ và bền, hạn chế cong vênh khi sử dụng hằng ngày. **Lốp 24x1⅜** cho khả năng lăn nhẹ, dễ đạp, phù hợp với thể trạng và sức đạp của trẻ em.\n\nTư thế ngồi được thiết kế thoải mái với ghi đông thép 560mm, pô tăng nhôm và cốt yên thép, giúp trẻ dễ kiểm soát tay lái và giữ thăng bằng tốt khi di chuyển. Yên xe Raptor kết hợp bàn đạp bản lớn hỗ trợ đạp chắc chân và an toàn hơn.\n\nRAPTOR Eva 3 sử dụng cấu hình single speed với bộ líp 18T và giò đĩa 32T, giúp xe đơn giản, ít hỏng vặt và rất dễ sử dụng. Thiết kế này đặc biệt phù hợp cho trẻ mới làm quen với xe đạp, không cần thao tác sang số phức tạp.\n\nHệ thống phanh gồm U-Brake phía trước và Band Brake phía sau, đáp ứng tốt nhu cầu phanh dừng cơ bản, giúp phụ huynh yên tâm hơn khi trẻ di chuyển trong khu vực dân cư hoặc khuôn viên trường học.\n\nTổng thể, RAPTOR Eva 3 là mẫu xe đạp dễ đạp, bền bỉ, chi phí hợp lý, phù hợp cho trẻ em trong giai đoạn làm quen và rèn luyện kỹ năng đi xe đạp mỗi ngày	2890000	percentage	10	15	24	thép Raptor STL 24	hồng, xanh, hồng cà	0	t	2026-02-08 20:06:42.241145+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One Size (24\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "H\\u1ed3ng, Xanh, H\\u1ed3ng c\\u00e0"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Raptor STL 24"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Raptor STL"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "25.4x560mm STL"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "25.4 ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "25.4x250mm STL"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Raptor"}, {"ten": "BA\\u0300N \\u0110A\\u0323P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Front: U-Brake Rear: Band Brake"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "18T, Single Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "Single Speed"}, {"ten": "GI\\u00d2 DI\\u0303A/CRANKSET", "gia_tri": "Raptor 32x170mm STL"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU, 36H, Scharder Valve"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "24x1\\u215c"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "Bi c\\u00f4n STL"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "36H"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
72	 Xe đạp gấp Java Neo Italy- Bánh 20 inches-2025	SPKUITAA09	5	3	**Xe đạp gấp Java NEO là xe đạp gấp siêu nhẹ dòng bánh 20 inch**. Được thiết kế tại Ý – đất nước có nền công nghiệp sản xuất xe đạp hàng đầu Châu Âu, Java Neo tiếp tục gây ấn tượng với những người đi xe đạp. Là một bước tiến mới đánh dấu sự phát triển vượt bậc về thiết kế cũng như chất lượng của nền công nghiệp sản xuất xe đạp tại Ý.\nĐược thiết kế tỉ mỉ trong từng chi tiết, nghiêng về tính thể thao nhưng không kém phần thời trang, tinh tế trong từng đường nét. Mạnh mẽ nhờ phụ tùng cao cấp của các thương hiệu nổi tiếng.\n\nThiết kế cực kỳ tiện ích với khả năng gấp gọn cũng như trọng lượng siêu nhẹ, siêu bền, đẹp giúp bạn dễ dàng mang theo trong mỗi chuyến đi của mình.\n\nĐiểm nổi bật mà xe đạp gấp Java Neo có?\n– Bộ tem cực chuẩn của thương hiệu Java ôm trọn khung càng trước và sau của xe. Phần thân xe logo “Neo” màu xanh được điểm nổi bật trên nền trắng.\nTại sao Xe đạp gấp Java Neo được coi là xe đạp thể thao?\nXe đạp gấp Java Neo được trang bị 11 tốc độ, chuyển tốc linh hoạt khi đi trong nội thành.\nChất liệu cao cấp: carbon giúp tổng trọng lượng xe nhẹ hơn. Kết hợp với phụ tùng cao cấp để tối ưu về tốc độ\nPhụ tùng mang nhãn hiệu nổi tiếng được sản xuất tại Italia và Nhật Bản. Được kiểm định theo tiêu chuẩn khắt khe nhất của hãng.\nCơ chế gấp 3 khúc, vuông và gọn hơn.  Khác biệt so với các dòng sản phẩm xe đạp gấp cũ.\nAi là người phù hợp với Java Neo?\nĐối tượng mà nhà sản xuất hướng tới là dân thể thao, dân công sở, những người bận rộn với công việc không có thời gian tập thể dục.\nHay những người yêu thích công nghệ, thời trang, yêu cái đẹp, tinh tế.\nKhi nào và ở đâu nên dùng xe đạp gấp siêu nhẹ Java Neo?\nVới phong cách thiết kế hiện đại, trẻ trung nên xe có thể dùng để đi học, đi làm, đi thể dục,…tiết kiệm phần nào chi phí xăng xe, chi phí tập cho các phòng tập Gym.\nDu lịch một chuyến bằng xe đạp gấp, ắt hẳn sẽ đem lại cho bạn rất nhiều trải nghiệm thú vị.\nĐặc biệt trong khi nhà bạn ở trong nội thành các khu dân cư chật hẹp, giao thông đông đúc.\nTại sao nên chọn Java Neo?\nXe đạp gấp Java Neo – Siêu xe đạp thể thao giúp bạn vượt mọi chặng đường xa, đường dốc một cách dễ dàng\nĐạp xe giúp tăng cường sức khỏe, duy trì sự dẻo dai và vóc dáng của con người. Xe đạp gấp Java Neo đem lại cuộc sống tiện nghi hơn, lành mạnh hơn.\nTiết kiệm phần nào chi phí xăng xe, bảo dưỡng, phí gửi xe phải chi cho những chiếc xe tay ga, xe ô tô.\nThời trang, phong cách, kiểu dáng thể thao lôi cuốn khiến cánh mày râu và phái đẹp bị thu hút ngay từ cái nhìn đầu tiên.\nĐược test thử miễn phí tại hệ thống showroom của Papilo\nChế độ bảo hành định kỳ 3 tháng miễn phí	40000000	percentage	3	10	20	 khung carbon	trắng xanh	3	t	2026-03-04 17:16:26.15299+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One Size (20\\u2033)"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "Tr\\u1eafng xanh"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Carbon"}, {"ten": "TH\\u01af\\u01a0NG HI\\u1ec6U", "gia_tri": "Java Probike (Italy)"}, {"ten": "MODEL", "gia_tri": "Neo"}, {"ten": "T\\u1ed0C \\u0110\\u1ed8", "gia_tri": "11 t\\u1ed1c \\u0111\\u1ed9, Shimano 105"}, {"ten": "V\\u00c0NH XE", "gia_tri": "Deca, ch\\u1ea5t li\\u1ec7u carbon, thi\\u1ebft k\\u1ebf kh\\u00ed \\u0111\\u1ed9ng h\\u1ecdc"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Maxxis 20\\u2033x1,35"}, {"ten": "PEDAL", "gia_tri": "Decaf nh\\u00f4m, ch\\u1ed1ng tr\\u01a1n tr\\u01b0\\u1ee3t"}, {"ten": "TAY G\\u1ea0T \\u0110\\u1ec0", "gia_tri": "Shimano Avid, ki\\u1ec3u c\\u00f2 s\\u00fang"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG", "gia_tri": "8kg"}]
1	Xe Đạp Trẻ Em Youth RAPTOR Simba 4 - Bánh 18 Inch	SPDOGH3F8L	1	1	RAPTOR Simba 4 – bánh 18 inch là mẫu xe đạp trẻ em được thiết kế dành cho các bé đang trong giai đoạn làm quen và hoàn thiện kỹ năng đạp xe, với tiêu chí an toàn, dễ kiểm soát và hỗ trợ phát triển thể chất một cách tự nhiên.\n\nKhung Raptor STL 18 chắc chắn, kích thước phù hợp với thể trạng của trẻ, giúp bé dễ dàng bước lên xuống xe và giữ thăng bằng tốt hơn khi tập đạp. Phuộc Raptor STL đồng bộ với khung mang lại cảm giác lái ổn định, giúp bé tự tin điều khiển xe trên những đoạn đường bằng hoặc sân chơi hằng ngày.\n\nBộ bánh 18 inch sử dụng vành ALU Double Wall nhẹ và bền, kết hợp lốp 18x2.125 có bản rộng, giúp tăng độ bám đường và hạn chế trơn trượt. Nhờ đó, bé có thể giữ thăng bằng tốt hơn và cảm thấy an tâm khi tập chạy xe, kể cả khi mới làm quen. Đùm bạc đạn giúp bánh xe quay trơn tru, giảm lực cản, hỗ trợ bé đạp nhẹ nhàng hơn mà không tốn quá nhiều sức.\n\nGhi đông 22.2x520mm và pô tăng kích thước vừa phải giúp bé dễ cầm nắm và điều khiển hướng đi chính xác. Cốt yên 25.4x180mm cho phép điều chỉnh độ cao yên linh hoạt, phù hợp với chiều cao của bé trong từng giai đoạn phát triển, giúp tư thế ngồi đạp luôn thoải mái và đúng cách. Yên Raptor được thiết kế êm ái, hỗ trợ bé ngồi lâu mà không bị khó chịu.\n\nXe sử dụng cấu hình 1 tốc độ (Single Speed) với giò đĩa 28T và bộ líp 16T, giúp thao tác đạp trở nên đơn giản, dễ hiểu và hạn chế rối khi sử dụng. Điều này rất quan trọng để bé tập trung vào việc giữ thăng bằng, phối hợp tay – chân và hình thành kỹ năng đạp xe cơ bản một cách tự nhiên.\n\nHệ thống phanh gồm U-Brake phía trước và Band Brake phía sau được thiết kế nhẹ tay, dễ bóp, giúp bé làm quen với việc giảm tốc và dừng xe an toàn. Cách bố trí này hỗ trợ bé học phản xạ phanh đúng cách mà không gây giật hay mất kiểm soát.\n\nTổng thể, Xe Đạp Trẻ Em RAPTOR Simba 4 – 18 Inch là lựa chọn phù hợp cho các bé đang học đạp xe, giúp phát triển khả năng vận động, tăng cường sức khỏe và sự tự tin, đồng thời mang đến trải nghiệm vui chơi an toàn và lành mạnh mỗi ngày	1690000	percentage	15	30	18	hợp kim thép Raptor STL 18	Cam đen, Cam, Bạc, Xám	3	t	2026-02-02 18:31:34.470968+07	[{"ten": "Phu\\u1ed9c/Fork", "gia_tri": "H\\u1ee3p kim th\\u00e9p Raptor STL"}, {"ten": "V\\u00e0nh xe/Rims", "gia_tri": "ALU, Double Wall, 28H, Scharder Valve"}, {"ten": "\\u0110\\u00f9m/Hubs", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "C\\u0103m/Spokes", "gia_tri": "28H"}, {"ten": "Y\\u00ean/Saddle", "gia_tri": "Raptor"}, {"ten": "Ba\\u0300n \\u0111a\\u0323p/Pedals", "gia_tri": "Black PP Platform"}, {"ten": "B\\u1ed9 th\\u1eafng/Brakes", "gia_tri": "Front: U-Brake Rear: Band Brake"}, {"ten": "B\\u1ed9 l\\u00edp/Cassette", "gia_tri": "16T, Single Speed"}, {"ten": "S\\u00ean xe/Chain", "gia_tri": "Single Speed"}, {"ten": "B.B/Bottom Bracket", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "Tr\\u1ecdng l\\u01b0\\u1ee3ng/Weight", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}, {"ten": "K\\u00edch c\\u1ee1/Sizes", "gia_tri": "One size (18\\")"}, {"ten": "L\\u1ed1p xe/Tires", "gia_tri": "18x2.125"}, {"ten": "Ghi \\u0111\\u00f4ng/Handlebar", "gia_tri": "22.2x520mm STL"}, {"ten": "P\\u00f4 t\\u0103ng/Stem", "gia_tri": "22.2x60mm STL"}, {"ten": "C\\u1ed1t y\\u00ean/Seatpost\\t", "gia_tri": "25.4x180mm STL"}, {"ten": "Gi\\u00f2 di\\u0303a/Crankset", "gia_tri": "28Tx110mm STL"}]
6	Xe Đạp Đường Phố Touring RAPTOR Rally 3B - Bánh 27 Inch	SPWVEHLPQD	9	1	Xe Đạp Đường Phố Touring RAPTOR Rally 2B – Bền bỉ, dễ đạp, linh hoạt mỗi ngày\nRAPTOR Rally #B là mẫu xe đạp đường phố – touring hướng đến nhu cầu di chuyển hằng ngày, phù hợp cho đi học, đi làm hoặc dạo phố. Thiết kế đơn giản, dễ sử dụng, kết hợp bánh 27.5 inch và phanh đĩa giúp xe vận hành ổn định và an toàn trong môi trường đô thị.\n\nKhung xe Raptor STL 27.5 bằng thép mang lại độ chắc chắn cao, chịu tải tốt và phù hợp với người dùng phổ thông. Phuộc thép Raptor STL 27.5x100mm giúp xe ổn định hơn khi di chuyển qua đường gồ ghề, vỉa hè hoặc mặt đường không bằng phẳng.\n\nXe sử dụng bộ bánh 27.5 inch với vành nhôm double wall 36 lỗ, giúp tăng độ bền và hạn chế cong vênh trong quá trình sử dụng hằng ngày. Lốp 27.5x2.125 bản to cho khả năng bám đường tốt, chạy êm và tự tin hơn khi đi trên nhiều điều kiện mặt đường khác nhau.\n\nTư thế đạp của RAPTOR Rally 3B được thiết kế thoải mái với ghi đông rộng 660mm, pô tăng nhôm và cốt yên thép chắc chắn. Yên xe Raptor cùng bàn đạp bản lớn giúp người đạp giữ thăng bằng tốt, phù hợp cho những ai thường xuyên di chuyển quãng ngắn đến trung bình.\n\nXe được trang bị bộ truyền động 21 tốc độ với tay đề, chuyển đĩa và chuyển líp Raptor, kết hợp giò đĩa 3 tầng 24/34/42T. Cấu hình này cho phép người dùng dễ dàng thay đổi tốc độ, phù hợp khi đi đường bằng, leo dốc nhẹ hoặc chở thêm đồ cá nhân.\n\nHệ thống phanh đĩa cơ Tolan giúp xe có lực phanh ổn định, dễ kiểm soát và an toàn hơn so với phanh vành truyền thống, đặc biệt khi di chuyển trong điều kiện đường trơn hoặc mưa nhẹ.\n\nTổng thể, RAPTOR Rally 2B là lựa chọn phù hợp cho người đang tìm kiếm một chiếc xe đạp bền bỉ, dễ sử dụng, chi phí hợp lý, đáp ứng tốt nhu cầu đi lại và vận động hằng ngày.	4390000	percentage	27	20	27	Thép  Raptor STL 27.5	Đen trắng, Đỏ, Xám, Đen Đỏ	0	t	2026-02-05 18:05:57.210554+07	[{"ten": "K\\u00edch c\\u1ee1/Sizes", "gia_tri": "One size (27\\")"}, {"ten": "M\\u00e0u s\\u1eafc/Colors", "gia_tri": "\\u0110en tr\\u1eafng, \\u0110\\u1ecf, X\\u00e1m, \\u0110en \\u0110\\u1ecf"}, {"ten": "Ch\\u1ea5t li\\u1ec7u khung/Frame", "gia_tri": "Th\\u00e9p  Raptor STL 27.5"}, {"ten": "Phu\\u1ed9c/Fork", "gia_tri": "Raptor STL 27.5x100mm"}, {"ten": "V\\u00e0nh xe/Rims", "gia_tri": "Raptor ALU, Double Wall, 36H, Schrader valve"}, {"ten": "\\u0110\\u00f9m/Hubs", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "C\\u0103m/Spokes", "gia_tri": "36H"}, {"ten": "L\\u1ed1p xe/Tires", "gia_tri": "27.5x2.125"}, {"ten": "Ghi \\u0111\\u00f4ng/Handlebar", "gia_tri": "31.8x660mm STL"}, {"ten": "P\\u00f4 t\\u0103ng/Stem", "gia_tri": "31.8x70mm ALU"}, {"ten": "C\\u1ed1t y\\u00ean/Seatpost", "gia_tri": "28.6x350mm STL"}, {"ten": "Y\\u00ean/Saddle", "gia_tri": "Raptor"}, {"ten": "Ba\\u0300n \\u0111a\\u0323p/Pedals", "gia_tri": "Black PP Platform"}, {"ten": "Tay \\u0111\\u1ec1/Shifters", "gia_tri": "Raptor 21 Speed"}, {"ten": "Chuy\\u1ec3n \\u0111\\u0129a/Front Derailleur", "gia_tri": "Raptor 3 Speed"}, {"ten": "Chuy\\u1ec3n l\\u00edp/Rear Derailleur", "gia_tri": "Raptor 7 Speed"}, {"ten": "B\\u1ed9 th\\u1eafng/Brakes", "gia_tri": "Tolan Mechanical Disc"}, {"ten": "B\\u1ed9 l\\u00edp/Cassette", "gia_tri": "14-28T, 7 Speed"}, {"ten": "S\\u00ean xe/Chain", "gia_tri": "7 Speed"}, {"ten": "Gi\\u00f2 di\\u0303a/Crankset", "gia_tri": "24/34/42Tx170mm STL"}, {"ten": "B.B/Bottom Bracket", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "Tr\\u1ecdng l\\u01b0\\u1ee3ng/Weight", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
74	Xe đạp Fixed Magicbros CX8 plus-2024	SPGV8IBZ2H	7	12	**Xe đạp Fixed Gear Magicbros CX8 Plus** (phiên bản 2024) với nâng cấp vành 3 đao trước là sự kết hợp hoàn hảo giữa tốc độ, kỹ thuật và phong cách urban cực chất. Đây là mẫu xe không chỉ gây ấn tượng mạnh về thị giác mà còn mang lại hiệu suất đạp vượt trội cho những tín đồ Fixed Gear.\n\n**Dưới đây là mô tả chi tiết cho siêu phẩm này:**\n\nNâng cấp "đáng tiền" nhất: Vành nhôm 3 đao\nĐiểm nhấn khác biệt lớn nhất chính là bộ bánh trước được trang bị vành nhôm 3 đao đúc liền khối. Thiết kế này không chỉ tạo nên vẻ ngoài cực kỳ hầm hố, đậm chất xe đua chuyên nghiệp mà còn giúp tối ưu hóa khí động học, giảm sức cản của gió và duy trì sự ổn định ở tốc độ cao. Kết hợp với đó là bánh sau nan hoa bản cao 6cm, giúp xe giữ trớn cực tốt.\n\n**Khung sườn và Kỹ thuật hoàn thiện**\nKhung nhôm AL6061 cao cấp: Sử dụng hợp kim nhôm siêu nhẹ, bền bỉ với thiết kế khung bản dẹt cổ loa không mối hàn. Lớp sơn tĩnh điện sắc sảo giúp xe luôn bền màu và chống trầy xước hiệu quả.\n\n**Hệ thống trục rỗng CNC:** Xe được trang bị đùi đĩa nhôm CNC 5 chấu (46T) kết hợp với trục giữa cốt rỗng. Cải tiến này không chỉ giảm trọng lượng tổng thể mà còn giúp lực đạp trở nên mượt mà, bứt tốc mạnh mẽ hơn hẳn các dòng trục đặc thông thường.\n\n**Cọc yên khí động học:** Thiết kế cọc yên bản dẹt đồng bộ với khung xe, giúp giảm lực cản gió và tăng tính thẩm mỹ hiện đại.\n\nTrải nghiệm vận hành linh hoạt\nHub Legend siêu trớn: Bộ đùm (hub) Legend 32 lỗ nổi tiếng với độ "trớn" cao, giúp bạn lướt phố nhẹ nhàng mà không tốn quá nhiều sức.\n\n**Cấu hình an toàn:** Xe sử dụng lốp Compass 700x23C bám đường tốt và xích hạt đậu chịu lực cao, đảm bảo an toàn cho những pha "skid" (phanh bằng bàn đạp) mượt mà.\n\n**Ghi đông sừng dê (Drop bar):** Mang đến tư thế lái khí động học, phù hợp cho cả nhu cầu đi phố lẫn tập luyện thể thao tốc độ.\n\nThông số tóm tắt:\n\nKhung/Càng: Nhôm 6061 không mối hàn.\n\nVành: Trước 3 đao nhôm, Sau nhôm bản cao 6cm.\n\nĐùi đĩa: Nhôm CNC trục rỗng 46T.\n\nLốp: Compass 700x23C.\n\nMàu sắc: Đen, Trắng, Bạc, Xám, Xanh đậm.	7490000	percentage	7	20	30	 nhôm AL6061	xanh, trắng, bạc, xanh lam, đen	0	t	2026-03-08 21:28:36.688885+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "M"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "Xanh, tr\\u1eafng, b\\u1ea1c, xanh lam, \\u0111en"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Khung nh\\u00f4m AL6061 b\\u1ea3n d\\u1eb9t c\\u1ed5 loa"}, {"ten": "C\\u00c0NG", "gia_tri": "Nh\\u00f4m MAGICBROS 700c"}, {"ten": "\\u0110\\u00d9I \\u0110\\u0128A", "gia_tri": "\\u0110\\u00f9i nh\\u00f4m CNC tr\\u1ee5c r\\u1ed7ng MAGICBROS 5 ch\\u1ea5u 46T"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "B\\u1ed9 hub LEGEND 32 l\\u1ed7 si\\u00eau tr\\u1edbn"}, {"ten": "TR\\u1ee4C GI\\u1eeeA", "gia_tri": " Neco bi v\\u00f2ng"}, {"ten": "V\\u00c0NH", "gia_tri": "V\\u00e0nh nh\\u00f4m 3 \\u0111ao tr\\u01b0\\u1edbc, sau 6cm"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "Nh\\u00f4m 31.8mm"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "Nh\\u00f4m 31.8mm"}, {"ten": "L\\u1ed0P", "gia_tri": "Compass 700*23C"}, {"ten": "C\\u1eccC Y\\u00caN", "gia_tri": "Nh\\u00f4m MAGICBROS b\\u1ea3n d\\u1eb9t"}, {"ten": "Y\\u00caN", "gia_tri": "Da tr\\u1ee5c r\\u1ed7ng Magicbros"}, {"ten": "PEDAL", "gia_tri": "\\u0110\\u1ea1n b\\u1ea1c x\\u1ecf \\u0111\\u01b0\\u1ee3c strap"}, {"ten": "PH\\u1ee4 KI\\u1ec6N", "gia_tri": "Strap 2 c\\u00e1i, b\\u01a1m mini, b\\u1ed9 tool l\\u1eafp xe"}, {"ten": "PH\\u00d9 H\\u1ee2P ", "gia_tri": "Ng\\u01b0\\u1eddi cao t\\u1eeb 1,52-1,8m"}, {"ten": "X\\u00cdCH", "gia_tri": "h\\u1ea1t \\u0111\\u1eadu"}]
3	Xe Đạp Đường Phố Touring RAPTOR Hunter 3B - Phanh Đĩa, Bánh 27 Inch	SP1XRK2MBO	9	1	Xe Đạp Địa Hình MTB RAPTOR Hunter 4 - Phanh Đĩa, Bánh 29 Inch\n\nĐừng để hành trình của bạn bị giới hạn bởi mặt đường. Với Raptor Hunter 4, bạn có thể tự tin băng qua phố xá đông đúc hay lăn bánh trên những lối mòn đầy thử thách một cách mạnh mẽ, ổn định và tràn đầy hứng khởi để chuyến đi thêm phần trọn vẹn.\n\nNhững điểm nổi bật của RAPTOR Hunter 4\n\nThiết kế thể thao, mạnh mẽ và hiện đại\n\nHunter 4 mang phong cách MTB cứng cáp, khỏe khoắn với 4 gu màu đầy chất chơi: Red/Black, Grey/White, Green, Light Blue/Grey. Khung xe one-size 29 inch phù hợp cho người cao từ 1m65 – 1m85, kết hợp ghi đông ngang 660mm, mang lại tư thế lái ổn định và kiểm soát tốt trong nhiều tình huống.\nKhung nhôm bền vững và chắc chắn\n\nSử dụng hợp kim nhôm Raptor ALU, Hunter 4 vừa cứng cáp, vừa đảm bảo độ bền và khả năng chịu lực tốt khi đi trên đường gồ ghề. Đây là nền tảng lý tưởng cho một chiếc MTB cân bằng giữa hiệu suất và độ bền. Ngoài ra, chính vì sử dụng hợp kim nhôm để làm khung cho xe nên trọng lượng của xe được giảm đáng kể so với việc sử dụng khung thép giúp việc di chuyển xe trở nên nhẹ nhàng hơn.\nPhuộc nhún 100mm – kiểm soát trên địa hình\n\nPhuộc Raptor STL hành trình 100mm giúp hấp thụ xung lực và rung chấn từ mặt đường sỏi đá hoặc mòn nhẹ, hỗ trợ người lái duy trì sự thoải mái và an toàn trong suốt hành trình.\nHệ truyền động 24 tốc độ linh hoạt\n\nHunter 4 được trang bị hệ thống truyền động 3x8 (24 tốc độ). Bộ số này cho phép chuyển tốc mượt mà, đáp ứng nhu cầu đa dạng từ chạy nhanh trên đường bằng đến leo dốc nhẹ nhàng. Kết hợp bộ líp 13-28T và giò dĩa 170mm 14/87/42T, xe mang lại sự cân bằng giữa khả năng leo dốc, tăng tốc và duy trì tốc độ cao.\nBánh xe 29 inch – tốc độ và ổn định\n\nCặp bánh 29x2.125 inch lớn giúp Hunter 4 vượt chướng ngại vật dễ dàng hơn, giữ quán tính lăn tốt và cho cảm giác lái ổn định hơn so với bánh 26 hoặc 27.5 inch. Đây là lợi thế lớn với những ai thường đạp đường dài hoặc thích sự vững vàng khi di chuyển.\nPhanh đĩa cơ an toàn và dễ bảo trì\n\nHệ thống phanh đĩa cơ đảm bảo khả năng kiểm soát tốc độ ổn định, đặc biệt trong điều kiện đường phố đông đúc hoặc khi cần phanh gấp. Đồng thời, việc bảo dưỡng và thay thế cũng đơn giản, phù hợp với người dùng phổ thông.\nAi nên chọn Raptor Hunter 4?\n\nNgười đam mê xe đạp địa hình, muốn trải nghiệm tốc độ và sự ổn định từ bánh 29 inch\n \nNgười cao từ 1m65 – 1m85, cần một chiếc MTB phù hợp thể hình\n \nNgười tìm kiếm một chiếc xe đa dụng: vừa đạp thể thao, vừa đi lại hằng ngày\n \nNgười mới bắt đầu chơi MTB nhưng muốn một chiếc xe bền, dễ bảo trì và hiệu quả\nRaptor Hunter 4 là sự kết hợp giữa thiết kế thể thao, khung nhôm bền vững và bánh 29 inch vượt trội. Đây là lựa chọn lý tưởng cho những ai muốn bắt đầu hoặc nâng cấp trải nghiệm xe đạp địa hình, phù hợp cả cho việc luyện tập thể thao lẫn di chuyển trong đời sống hằng ngày.	4970000	percentage	25	20	27	Raptor ALU	Trắng, Xanh, Xanh lá, Đỏ	0	t	2026-02-03 11:39:38.199225+07	[{"ten": "K\\u00edch c\\u1ee1/Sizes", "gia_tri": "One size 27\\""}, {"ten": "M\\u00e0u s\\u1eafc/Colors", "gia_tri": "Tr\\u1eafng, Xanh, Xanh l\\u00e1, \\u0110\\u1ecf"}, {"ten": "Ch\\u1ea5t li\\u1ec7u khung/Frame", "gia_tri": "H\\u1ee3p kim nh\\u00f4m Raptor ALU"}, {"ten": "Phu\\u1ed9c/Fork", "gia_tri": "Raptor STL 100mm"}, {"ten": "V\\u00e0nh xe/Rims", "gia_tri": "ALU, Double Wall, 36H, Scharder Valve"}, {"ten": "\\u0110\\u00f9m/Hubs", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n STL"}, {"ten": "Cam/Spokes", "gia_tri": "36H"}, {"ten": "L\\u1ed1p xe/Tires", "gia_tri": "29x2.125"}, {"ten": "Ghi \\u0111\\u00f4ng/Handlebar", "gia_tri": "660mm STL"}, {"ten": "P\\u00f4 t\\u0103ng/Stem", "gia_tri": "80mm ALU"}, {"ten": "C\\u1ed1t y\\u00ean/Seatpost", "gia_tri": "300mm STL"}, {"ten": "Y\\u00ean/Saddle", "gia_tri": "Raptor"}, {"ten": "Ba\\u0300n \\u0111a\\u0323p/Pedals", "gia_tri": "Black PP Platform"}, {"ten": "Tay \\u0111\\u1ec1/Shifters", "gia_tri": "24 Speed"}, {"ten": "Chuy\\u1ec3n \\u0111\\u0129a/Front Derailleur", "gia_tri": "3 Speed"}, {"ten": "Chuy\\u1ec3n l\\u00edp/Rear Derailleur", "gia_tri": "8 Speed"}, {"ten": "B\\u1ed9 th\\u1eafng/Brakes", "gia_tri": "Mechanical Disc"}, {"ten": "B\\u1ed9 l\\u00edp/Cassette", "gia_tri": "13-28T, 8 Speed"}, {"ten": "S\\u00ean xe/Chain", "gia_tri": "10 Speed"}, {"ten": "Gi\\u00f2 di\\u0303a/Crankset", "gia_tri": "170mm, 14/37/42T, STL"}, {"ten": "B.B/Bottom Bracket", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "Tr\\u1ecdng l\\u01b0\\u1ee3ng/Weight", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
10	Xe Đạp Trẻ Em Youth RAPTOR Elsa 2 - Bánh 14 Inch	SP94X7HGQC	1	1	RAPTOR Elsa 2 – bánh 14 inch là mẫu xe đạp trẻ em được thiết kế dành cho các bé ở giai đoạn đầu làm quen với xe đạp, ưu tiên sự an toàn, dễ điều khiển và hỗ trợ phát triển vận động một cách tự nhiên. Kích thước nhỏ gọn giúp bé nhanh chóng tự tin khi tập đạp và kiểm soát chiếc xe của mình.\n\nKhung Raptor STL 14 có kết cấu chắc chắn, chiều cao thấp và trọng tâm ổn định, giúp bé dễ dàng lên xuống xe cũng như giữ thăng bằng tốt hơn trong quá trình tập lái. Phuộc Raptor STL đồng bộ mang lại cảm giác vững vàng cho đầu xe, hạn chế rung lắc khi bé di chuyển trên các bề mặt sân chơi hoặc đường nội khu.\n\nBộ bánh 14 inch sử dụng vành Single Wall 16H kết hợp lốp 14x2.125 bản rộng, cho độ bám tốt và tăng khả năng ổn định khi chạy chậm. Cấu hình này giúp bé hạn chế trượt bánh, từ đó tự tin hơn trong những vòng đạp đầu tiên.\n\nGhi đông 22.2x480mm được thiết kế vừa tầm tay trẻ, giúp việc cầm nắm và điều hướng trở nên dễ dàng. Pô tăng 22.2x150mm cùng cốt yên 25.4x180mm cho phép điều chỉnh linh hoạt theo chiều cao của bé, hỗ trợ tư thế ngồi đúng và góp phần bảo vệ cột sống trong giai đoạn phát triển.\n\nXe sử dụng hệ truyền động Single Speed với giò đĩa 28T và bộ líp 16T, giúp bé đạp xe nhẹ nhàng mà không cần làm quen với thao tác chuyển số phức tạp. Điều này cho phép trẻ tập trung hoàn toàn vào việc phối hợp chân – tay và giữ thăng bằng, nền tảng quan trọng để học đạp xe hiệu quả.\n\nHệ thống phanh gồm U-Brake phía trước và Band Brake phía sau có lực bóp nhẹ, dễ kiểm soát, giúp bé làm quen với việc giảm tốc và dừng xe an toàn. Tổng thể, Xe Đạp Trẻ Em RAPTOR Elsa 2 – 14 Inch là lựa chọn phù hợp để bé rèn luyện thể chất, tăng khả năng vận động và hình thành thói quen vận động lành mạnh ngay từ nhỏ	1590000	percentage	10	14	14	THÉP Raptor STL 14	HỒNG, TÍM	0	t	2026-02-07 21:09:21.075181+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One size (14\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "H\\u1ed3ng, T\\u00edm"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Th\\u00e9p Raptor STL 14"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Raptor STL"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "Single Wall, 16H, Scharder Valve"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "Bi c\\u00f4n STL"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "16H"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "14x2.125"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "22.2x480mm STL"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "22.2x150mm STL"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "25.4x180mm STL"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Raptor"}, {"ten": "BA\\u0300N \\u0110A\\u0323P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Front: U-Brake Rear: Band Brake"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "16T, Single Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "Single Speed"}, {"ten": "GI\\u00d2 DI\\u0303A/CRANKSET", "gia_tri": "28Tx90mm STL"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
75	Xe đạp Fixed Gear Magicbros CX6	SP95B4WUT2	7	12	**Magicbros CX6 là mẫu xe đạp Fixed Gear** "quốc dân" trong phân khúc tầm trung, nổi tiếng với sự cân bằng hoàn hảo giữa cấu hình mạnh mẽ và mức giá cực kỳ hợp lý. Đây là lựa chọn hàng đầu cho những bạn trẻ mới bắt đầu chơi Fixie nhưng vẫn muốn sở hữu một cỗ máy có hiệu suất tiệm cận dòng cao cấp.\n\nDưới đây là những điểm nổi bật của dòng Magicbros CX6:\n\nThiết kế Khung sườn Khí động học\nChất liệu nhôm 6061: Khung xe được làm từ hợp kim nhôm siêu nhẹ, bền bỉ, giúp giảm trọng lượng tổng thể để người lái dễ dàng thực hiện các kỹ thuật như skid hay track stand.\n\nThiết kế không mối hàn: Các điểm nối được xử lý phẳng mịn (Smooth Welding), tạo cảm giác khung xe đúc liền khối vô cùng tinh tế và cao cấp.\n\nCọc yên dẹt: Không chỉ mang lại vẻ ngoài hầm hố của một chiếc xe đua chuyên nghiệp, thiết kế cọc yên bản dẹt còn giúp tối ưu hóa khí động học, giảm sức cản gió khi di chuyển ở tốc độ cao.\n\nCấu hình Vận hành Vượt trội\nĐùi đĩa nhôm 5 chấu (46T): Bộ đùi đĩa chắc chắn giúp truyền tải lực đạp mạnh mẽ và ổn định.\n\nXích hạt đậu (KMC/Shimano tùy bản): Loại xích chịu lực cao, chuyên dụng cho Fixed Gear, giúp hạn chế tối đa tình trạng đứt xích khi phanh gấp bằng chân.\n\nHub (Đùm) Legend siêu trớn: Đây là linh hồn của chiếc xe, giúp bánh xe quay cực mượt, giữ trớn tốt và mang lại cảm giác lướt phố rất "phiêu".\n\nVành nhôm bản cao 4cm/6cm: Giúp xe trông cứng cáp hơn và tăng khả năng xé gió.\n\nPhong cách Urban trẻ trung\nMagicbros CX6 sở hữu bộ sưu tập màu sắc cực kỳ bắt mắt từ Đen bóng, Trắng sứ đến những tông màu nổi bật như Bạc, Xám xi măng hay Xanh quân đội. Mỗi chiếc xe không chỉ là phương tiện mà còn là phụ kiện thời trang giúp bạn nổi bật giữa phố thị.\n\nThông số kỹ thuật cơ bản:\n\nKhung/Càng: Nhôm 6061 không mối hàn, càng nhôm.\n\nĐùi đĩa: Nhôm 5 chấu 46T.\n\nLốp: Compass 700x23C/25C.\n\nGhi đông: Nhôm (thường là dáng cong - Drop bar).\n\nTrọng lượng: Khoảng 9 - 10kg.	5200000	percentage	4	15	30	nhôm cao cấp 6061	đen, trắng, đà, đỏ, bạc	0	t	2026-03-08 21:38:49.670604+07	[{"ten": "K\\u00cdCH C\\u1ee0", "gia_tri": "S"}, {"ten": "M\\u00c0U S\\u1eaeC", "gia_tri": "\\u0110\\u00e0, tr\\u1eafng, b\\u1ea1c, \\u0111\\u1ecf, \\u0111en"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG", "gia_tri": "Khung nh\\u00f4m cao c\\u1ea5p 6061 kh\\u00f4ng m\\u1ed1i h\\u00e0n"}, {"ten": " C\\u00c0NG", "gia_tri": "Th\\u00e9p MAGICBROS 700c"}, {"ten": "\\u0110\\u00d9I \\u0110\\u0128A", "gia_tri": " \\u0110\\u00f9i nh\\u00f4m 5 ch\\u1ea5u 46T"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": " B\\u1ed9 hub LEGEND 32 l\\u1ed7 si\\u00eau tr\\u1edbn"}, {"ten": "TR\\u1ee4C GI\\u1eeeA", "gia_tri": "Neco bi v\\u00f2ng"}, {"ten": "V\\u00c0NH", "gia_tri": "V\\u00e0nh nh\\u00f4m tr\\u01b0\\u1edbc 4cm, sau 6cm MAGICBROS PRO"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": " Nh\\u00f4m 31.8mm"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "Nh\\u00f4m 31.8mm"}, {"ten": " L\\u1ed0P", "gia_tri": "Compass 700*23C"}, {"ten": "C\\u1ed0T Y\\u00caN", "gia_tri": "Nh\\u00f4m MAGICBROS 27,2mm"}, {"ten": "PH\\u00d9 H\\u1ee2P", "gia_tri": " Ng\\u01b0\\u1eddi cao t\\u1eeb 1,52-1,8m"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "h\\u1ea1t \\u0111\\u1eadu SHIMANO"}]
65	Xe Đạp Nữ Đường Phố Touring LIV Alight 2 Disc - Phanh Đĩa, Bánh 700C - 2025	SPZDO1IBU6	4	5	Xe đạp mới nhập kho	14790000	percentage	0	10	27	HỢP KIM NHÔM ALUXX	XANH nhạt, XANH LỤC	0	t	2026-02-27 21:20:57.44237+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "XS"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "Xanh x\\u00e1m, xanh l\\u1ee5c"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "ALUXX-grade aluminum, disc"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "alloy, disc"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "Giant GX Disc wheelset"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "Giant alloy, QR"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "stainless"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Giant S-X2, puncture protect, 700x38c"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "Giant Sport, flat, 31.8mm, 9-degree backsweep"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "Giant Sport, 31.8"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "Giant D-Fuse, alloy"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "ErgoContact"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "platform"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "Shimano Cues, 2x9"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "Shimano Cues U4010"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "Shimano Cues RD-U3020"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Tektro HD-R280 hydraulic [F]160mm, [R]160mm"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "Shimano CSLG3020, 11x36"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "KMC X11 with Missing Link"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "Forged alloy, 30/46"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "threaded"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}, {"ten": "TAY TH\\u1eaeNG/BRAKE LEVERS", "gia_tri": "Tektro hydraulic"}]
2	Xe Đạp Nữ Đường Phố Touring RAPTOR Eva 4 - Bánh 26 Inch	SPOINY33N1	4	1	Xe Đạp Đường Phố Touring RAPTOR Eva 4 – Gọn nhẹ, đơn giản, dễ sử dụng mỗi ngày\nRAPTOR Eva 4 là mẫu xe đạp đường phố – touring hướng đến sự đơn giản, gọn nhẹ và dễ làm quen, phù hợp cho nhu cầu đi học, đi chợ, dạo phố hoặc di chuyển hằng ngày với cường độ vừa phải.\n\nKhung xe Raptor STL 26 bằng thép mang lại cảm giác chắc chắn, bền bỉ và ổn định khi sử dụng lâu dài. Kết hợp cùng phuộc thép Raptor, xe vận hành êm ái trên các cung đường đô thị, vỉa hè hoặc đường làng quen thuộc.\n\nXe sử dụng bánh 26 inch với vành nhôm 36 lỗ, giúp xe nhẹ hơn so với vành thép truyền thống nhưng vẫn đảm bảo độ cứng và khả năng chịu tải tốt. Lốp 26x1-3/8 cho khả năng lăn nhẹ, dễ đạp, phù hợp với việc di chuyển quãng ngắn và trung bình trong thành phố.\n\nTư thế đạp được thiết kế thoải mái với ghi đông thép 560mm, pô tăng nhôm và cốt yên thép, giúp người đạp giữ dáng ngồi thẳng, dễ kiểm soát xe và hạn chế mỏi khi sử dụng hằng ngày. Yên xe Raptor kết hợp bàn đạp bản lớn mang lại cảm giác ổn định và an toàn cho người mới sử dụng.\n\nRAPTOR Eva 4 sử dụng cấu hình single speed với bộ líp 18T và giò đĩa 32T, giúp xe vận hành đơn giản, ít hỏng vặt và rất dễ bảo dưỡng. Đây là lựa chọn phù hợp cho người không cần sang số phức tạp và ưu tiên sự tiện lợi trong quá trình sử dụng.\n\nHệ thống phanh gồm U-Brake phía trước và Band Brake phía sau, đáp ứng tốt nhu cầu phanh dừng cơ bản trong môi trường đô thị, phù hợp cho người dùng phổ thông và di chuyển với tốc độ vừa phải.\n\nTổng thể, RAPTOR Eva 4 là mẫu xe đạp dễ dùng, bền bỉ, chi phí hợp lý, phù hợp cho học sinh, sinh viên hoặc người cần một chiếc xe đơn giản để di chuyển hằng ngày	2690000	percentage	10	15	26	Hợp kim thép Raptor STL 26	Hồng, Xanh, Hồng cà	4.5	t	2026-02-02 22:27:25.773712+07	[{"ten": "K\\u00edch c\\u1ee1/Sizes", "gia_tri": "One Size (26\\")"}, {"ten": "Ch\\u1ea5t li\\u1ec7u khung/Frame", "gia_tri": "Raptor STL 26"}, {"ten": "Phu\\u1ed9c/Fork", "gia_tri": "Raptor STL"}, {"ten": "V\\u00e0nh xe/Rims", "gia_tri": "ALU, 36H, Scharder Valve"}, {"ten": "\\u0110\\u00f9m/Hubs", "gia_tri": "Bi c\\u00f4n STL"}, {"ten": "C\\u0103m/Spokes", "gia_tri": "36H"}, {"ten": "L\\u1ed1p xe/Tires", "gia_tri": "26x1-3/8"}, {"ten": "Ghi \\u0111\\u00f4ng/Handlebar", "gia_tri": "25.4x560mm STL"}, {"ten": "P\\u00f4 t\\u0103ng/Stem", "gia_tri": "25.4 ALU"}, {"ten": "C\\u1ed1t y\\u00ean/Seatpost", "gia_tri": "25.4x250mm STL"}, {"ten": "Y\\u00ean/Saddle", "gia_tri": "Raptor"}, {"ten": "Ba\\u0300n \\u0111a\\u0323p/Pedals", "gia_tri": "Black PP Platform"}, {"ten": "B\\u1ed9 th\\u1eafng/Brakes", "gia_tri": "Front: U-Brake Rear: Band Brake"}, {"ten": "B\\u1ed9 l\\u00edp/Cassette", "gia_tri": "18T, Single Speed"}, {"ten": "S\\u00ean xe/Chain", "gia_tri": "Single Speed"}, {"ten": "Gi\\u00f2 di\\u0303a/Crankset", "gia_tri": "Raptor 32x170mm STL"}, {"ten": "B.B/Bottom Bracket", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "Tr\\u1ecdng l\\u01b0\\u1ee3ng/Weight", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
11	Xe Đạp Trẻ Em Youth RAPTOR Bella 1 - Bánh 16 Inch	SP2R8UAXY9	1	1	RAPTOR Bella 1 – bánh 16 inch là mẫu xe đạp trẻ em lý tưởng cho các bé đang trong giai đoạn làm quen và học cách đạp xe một cách chủ động. Thiết kế của xe tập trung vào sự an toàn, dễ sử dụng và hỗ trợ bé phát triển khả năng vận động tự nhiên ngay từ những lần đạp đầu tiên.\n\nKhung Raptor STL 16 có kết cấu chắc chắn, kích thước nhỏ gọn và phù hợp với thể trạng của trẻ nhỏ, giúp bé dễ leo lên – xuống xe và giữ thăng bằng tốt hơn. Phuộc Raptor STL đồng bộ mang lại cảm giác ổn định cho đầu xe, giúp bé tự tin điều khiển tay lái khi di chuyển ở tốc độ chậm đến trung bình.\n\nBộ bánh 16 inch sử dụng vành Single Wall 28H kết hợp lốp 16x2.125 bản rộng, cho khả năng bám đường tốt và hạn chế trơn trượt khi bé chạy xe trong sân nhà hoặc khu vui chơi. Đùm bi côn giúp bánh xe quay mượt, hỗ trợ bé đạp nhẹ nhàng hơn và không bị nặng chân.\n\nGhi đông 22.2x480mm được thiết kế vừa tầm tay trẻ, giúp bé cầm nắm thoải mái và kiểm soát hướng đi chính xác. Pô tăng ALU nhẹ giúp giảm trọng lượng phần đầu xe, trong khi cốt yên 25.4x180mm có thể điều chỉnh linh hoạt theo chiều cao, đảm bảo tư thế ngồi đúng và hỗ trợ tốt cho sự phát triển của cột sống.\n\nXe sử dụng cấu hình Single Speed đơn giản với giò đĩa 28T và bộ líp 16T, rất phù hợp cho trẻ mới tập đạp vì không cần ghi nhớ hay thao tác chuyển số. Thiết kế này giúp bé tập trung vào việc phối hợp chân và giữ thăng bằng, từ đó nhanh chóng hình thành kỹ năng đạp xe cơ bản.\n\nHệ thống phanh gồm U-Brake phía trước và Band Brake phía sau có lực bóp nhẹ, dễ kiểm soát, giúp bé làm quen với việc giảm tốc và dừng xe an toàn. Tổng thể, Xe Đạp Trẻ Em RAPTOR Bella 1 – 16 Inch là người bạn đồng hành lý tưởng, giúp bé rèn luyện thể chất, tăng cường sự tự tin và có những trải nghiệm vui chơi vận động an toàn mỗi ngày	1790000	percentage	10	20	16	Thép Raptor STL 16	xanh, trắng, hồng	0	t	2026-02-07 21:24:38.610454+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One size (16\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "Xanh, Tr\\u1eafng, H\\u1ed3ng"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Th\\u00e9p Raptor STL 16"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Raptor STL"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "Single Wall, 28H, Scharder Valve"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "Bi c\\u00f4n STL"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "28H"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "16x2.125"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "22.2x480mm STL"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "22.2x180mm ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "25.4x180mm STL"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Raptor"}, {"ten": "BA\\u0300N \\u0110A\\u0323P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Front: U-Brake Rear: Band Brake"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "16T, Single Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "Single Speed"}, {"ten": "GI\\u00d2 DI\\u0303A/CRANKSET", "gia_tri": "28x100mm STL"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
12	Xe Đạp Gấp Folding JAVA Neo-9S - Phanh Đĩa, Bánh 16Inch	SPBS7HOLHL	5	3	**Java NEO 9S** – Xe đạp gấp 3 khúc siêu gọn 9,6 kg | Thiết kế chuẩn phong cách Ý – hiệu năng mạnh – gấp gọn linh hoạt\nJava NEO 9S là mẫu xe đạp gấp nổi bật của thương hiệu Java – thương hiệu xe đạp Ý nổi tiếng với thiết kế tinh tế, tính thực dụng cao và khả năng vận hành bền bỉ. Xe sở hữu trọng lượng chỉ 9,6 kg, gấp 3 khúc siêu gọn, trang bị bộ **truyền động Shimano Sora 1×9**, phanh dầu Hydraulic và khung nhôm chống gỉ, phù hợp hoàn hảo cho nhu cầu di chuyển trong đô thị hiện đại. \n\n**1. Thiết kế phong cách Ý – nhỏ gọn, đẹp và tinh tế**\nJava NEO 9S được thiết kế theo tinh thần tối giản – hiệu quả đặc trưng của Ý: đẹp, gọn và thông minh. Khung xe bằng nhôm không đắp sơn giúp lộ rõ vẻ đẹp của vật liệu kim loại, mang màu sắc mạnh mẽ, sang trọng và khó bị trầy xước hay phai màu theo thời gian. Từng chi tiết như cổ gấp, bản lề sau, vị trí đặt phanh và dây đề đều được gia công sắc nét, đảm bảo xe vừa đẹp vừa chắc chắn.\n\nBên cạnh thiết kế khung, NEO 9S nổi bật với hai phiên bản màu 2 Tone cực kỳ phong cách. Titanium mang sắc ánh kim champagne sang trọng, tạo chiều sâu khi đi dưới nắng và phù hợp với người thích vẻ đẹp kỹ thuật, mạnh mẽ nhưng không phô trương. White lại cho cảm giác tinh tế, trẻ trung và vô cùng hiện đại. Tông trắng gốm giúp các đường cong của khung xe nổi bật rõ ràng, kết hợp cùng các chi tiết màu đen cho tổng thể thể thao và sạch sẽ.\n\nDáng xe nhỏ gọn gợi nhớ phong cách Brompton, nhưng Java phát triển khung hoàn toàn mới để tăng độ cứng, tương thích phanh đĩa và tối ưu cho người dùng thực tế – đúng tinh thần “đẹp nhưng phải thực dụng” của thiết kế Ý.\n\n**2. Gấp 3 khúc siêu gọn – tiện lợi cho di chuyển đô thị**\nNEO 9S sử dụng cơ chế gấp 3 khúc giúp xe thu gọn nhanh, tiết kiệm diện tích hơn nhiều so với xe gấp truyền thống. Khi gấp lại, bánh trước được khóa cố định nhờ chốt giữ thông minh, cho phép người dùng xách hoặc đẩy xe như vali một cách nhẹ nhàng.\n\nKích thước nhỏ gọn sau khi gấp phù hợp hoàn hảo cho:\n– Đi làm bằng tàu điện metro\n– Mang lên thang máy, văn phòng, chung cư\n– Để vào cốp ô tô, kể cả sedan nhỏ\n– Cất trong không gian hẹp tại gia đình\n\nĐây là lý do NEO 9S trở thành lựa chọn hàng đầu cho người cần một chiếc xe gấp tiện lợi, linh hoạt trong mọi môi trường.\n\n**3. Trọng lượng siêu nhẹ 9,6 kg – ai cũng dễ sử dụng**\nKhung nhôm nguyên bản (không phủ sơn) không chỉ giúp chống gỉ tuyệt đối mà còn giảm trọng lượng tối đa. Với mức 9,6 kg, bất kỳ ai – kể cả người dùng nữ – cũng có thể xách xe lên cầu thang, mang lên metro hoặc cất vào cốp xe dễ dàng.\n\nTrọng lượng nhẹ nhưng vẫn đảm bảo độ cứng nhờ cấu trúc khung được Java gia cố tại các điểm chịu lực chính. Xe giữ được sự chắc chắn, ổn định khi đạp tốc độ cao hoặc di chuyển đường dài.\n\n**4. Vận hành mượt mà – an toàn vượt trội với phanh dầu**\nJava NEO 9S được trang bị bộ truyền động Shimano Sora RD-R3000 9 tốc độ, cho khả năng sang số nhanh và chính xác. Tay đề Shimano SL-M2010 dễ thao tác, phù hợp cả người mới làm quen với xe gấp. Bộ líp Sunshine 11–32T cho lực đạp nhẹ khi leo dốc, đồng thời tăng tốc tốt trên đường bằng.\n\nĐiểm làm NEO 9S vượt trội trong phân khúc chính là phanh dầu Hydraulic. Loại phanh này cho lực phanh mạnh, ổn định và an toàn trong mọi điều kiện – đặc biệt cần thiết với người di chuyển trong đô thị đông đúc, nơi các tình huống dừng đột ngột xảy ra thường xuyên.\n\n**5. Dây âm khung – gọn đẹp và bền hơn**\nToàn bộ dây phanh và dây đề được đi âm trong khung, giúp xe đẹp hơn, tối giản hơn và không bị vướng khi gấp mở. Đây là ưu điểm nổi bật so với nhiều dòng xe gấp dây ngoài, đặc biệt giúp trải nghiệm lâu dài ổn định và giữ ngoại hình xe tinh tế đúng phong cách Ý.\n\n**6. Phụ tùng phổ thông – dễ thay, dễ nâng cấp**\nJava thiết kế NEO 9S với triết lý: dễ sửa – dễ nâng cấp – dễ sử dụng lâu dài. Các linh kiện như líp, sên, phanh, tay đề, bánh xe… đều dùng tiêu chuẩn phổ thông của road/MTB/city bike, giúp việc thay thế hoặc nâng cấp rất dễ dàng và chi phí thấp.\n\nKhông lo linh kiện độc quyền khó tìm – đây là điểm cộng lớn cho người dùng cần tính thực tế cao.\n\n**7. Giá trị vượt trội – chỉ bằng 1/4 Brompton C-Line**\nJava NEO 9S mang tới trải nghiệm cao cấp nhưng ở mức giá dễ tiếp cận hơn nhiều so với Brompton. Với phanh dầu, truyền động thể thao, dây âm khung và trọng lượng siêu nhẹ, NEO 9S mang lại giá trị sử dụng vượt tầm trong phân khúc dưới 20 triệu.\n\n**8. Phân phối chính hãng & bảo hành 6 năm tại Việt Nam**\nXe đạp gấp Java NEO 9S được phân phối chính thức bởi Công ty Cổ phần Vòng Xanh – đơn vị nhập khẩu thương hiệu Java tại Việt Nam. Sản phẩm được bán tại hệ thống Xedap.vn, đảm bảo cấu hình chuẩn, nguồn gốc minh bạch và dịch vụ hậu mãi chuyên nghiệp.\n\nKhi mua tại Xedap.vn, khách hàng được hưởng bảo hành khung sườn đến 6 năm theo tiêu chuẩn Java, cùng dịch vụ bảo trì – bảo dưỡng nhanh chóng và phụ tùng thay thế luôn có sẵn\n\n	14990000	percentage	5	20	16	nhôm Java ALU	xám, bạc, xanh	0	t	2026-02-07 21:43:57.646641+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One Size (16\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "X\\u00e1m, B\\u1ea1c, Xanh"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Java ALU"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Java ALU"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU 30mm, Double Wall, 18H/24H, Presta Valve"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "ALU, b\\u1ea1c \\u0111\\u1ea1n, tr\\u1ee5c r\\u1ed7ng"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "Tr\\u01b0\\u1edbc: 18H / Sau: 24H"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Kenda 16x1*3/8"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "25.4x540mm ALU"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "31.8x550mm ALU"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Java"}, {"ten": "BA\\u0300N \\u0110A\\u0323P/PEDALS", "gia_tri": "Black ALU Platform"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "SL-M2010, 9 Speed"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "1 Speed"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "RD-R3000, 9 Speed"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Hyraudlic Disc"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "Sunshine 11-32T, 9 Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "9 Speed"}, {"ten": "GI\\u00d2 DI\\u0303A/CRANKSET", "gia_tri": "50Tx165mm ALU"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "Tr\\u1ee5c r\\u1ed7ng, b\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "9,6 kg"}]
13	Xe đạp gấp BIRDY EVO 	SPEYT9HJ57	5	8	**Birdy Classic EVO: Sự Trỗi Dậy Của Một Huyền Thoại**\n**Birdy Classic EVO** là sự kết hợp hoàn hảo giữa vẻ đẹp hoài cổ của khung ống tròn nguyên bản và sức mạnh công nghệ hiện đại. Không chỉ dừng lại ở một chiếc xe đạp gấp, EVO (Evolution) là biểu tượng của sự tiến hóa với khả năng chinh phục mọi địa hình từ đường phố bằng phẳng đến những cung đường sỏi đá (Gravel).\n\n**Đặc điểm nổi bật:**\nKhung New Birdy Classic: Thiết kế khung nhôm ống tròn cổ điển nhưng được gia cố độ cứng, mang lại cảm giác lái đầm chắc và bền bỉ.\n\nHệ thống giảm xóc toàn phần: Độc quyền với **giảm xóc trước Leading Link và giảm xóc sau elastomer**, triệt tiêu rung động hiệu quả.\n\nSẵn sàng cho mọi cung đường: Trang bị **lốp Schwalbe Billy Bonkers** bản rộng, giúp bạn tự tin di chuyển trên các bề mặt trơn trượt hoặc không bằng phẳng.\n\nHiệu suất phanh vượt trội: **Phanh đĩa cơ TRP Spyre** với cơ chế tác động kép giúp dừng xe an toàn trong mọi điều kiện thời tiết.	62500000	percentage	34	18	18	cổ điển BIRDY ncf	nGỌC LAM, NÂU MỰC	0	t	2026-02-07 22:06:19.541136+07	[{"ten": "M\\u00c0U/COLOR", "gia_tri": "Ng\\u1ecdc lam, N\\u00e2u m\\u1ef1c"}, {"ten": "T\\u1ea2I TRONG/LOAD", "gia_tri": "110kg"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "11.5kg"}, {"ten": "SIZE", "gia_tri": "75cm(L) x 32cm(W) x 65cm(H)"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Khung M\\u1edbi C\\u1ed5 \\u0110i\\u1ec3n BIRDY"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "BIRDY Phu\\u1ed9c tr\\u01b0\\u1edbc g\\u1eadp c\\u00f3 phanh \\u0111\\u0129a phi\\u00ean b\\u1ea3n v\\u1edbi l\\u00f2 xo treo m\\u00e0u \\u0111en 8,5"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "Shimano RD-4700-GS TIAGRA 10speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "50T chainring (Silver) / 165\\u202fmm crank arms (Black), with BIRDY Logo"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Selle Italia X3 Duro Tek cover FeC Alloy rails"}, {"ten": "BA\\u0300N \\u0110A\\u0323P/PEDALS", "gia_tri": "9/16\\u540b BR BS BLACK CAGE, SILVER BODY"}]
14	Xe Đạp Gấp Folding JAVA Neo-9SE - Phanh Đĩa, Bánh 16Inch	SP8BXC72AX	5	3	**JAVA Neo-9SE: "Quái thú" tí hon cho kỷ nguyên di chuyển mới**\nNếu bạn đang tìm kiếm một chiếc xe đạp gấp không chỉ dừng lại ở sự tiện lợi mà còn phải "ngầu" và tốc độ, thì JAVA Neo-9SE chính là câu trả lời đanh thép nhất. Sở hữu ngôn ngữ thiết kế đậm chất Ý với những đường nét khí động học mạnh mẽ, chiếc xe xóa tan định kiến rằng xe đạp bánh nhỏ thì không thể chạy nhanh. Trái tim của Neo-9SE là bộ khung hợp kim nhôm siêu nhẹ nhưng cực kỳ vững chãi, kết hợp cùng cặp bánh 16 inch giúp xe trở nên vô cùng linh hoạt, dễ dàng luồn lách qua những con phố đông đúc hay những khúc cua ngặt nghèo trong đô thị.\n\nĐiểm nâng cấp đáng giá nhất chính là bộ truyền động 9 tốc độ, mang lại dải tỷ số truyền rộng hơn hẳn các dòng xe phổ thông, cho phép bạn bứt tốc mượt mà trên đường bằng và chinh phục các dốc cầu một cách nhẹ nhàng. Sự an toàn được đặt lên hàng đầu với hệ thống phanh đĩa trước sau, cung cấp lực phanh chính xác và đáng tin cậy ngay cả trong điều kiện thời tiết mưa ướt hay đường trơn trượt. Khi không cần sử dụng, cơ chế gấp gọn thông minh của JAVA cho phép bạn "thu nhỏ" chiếc xe chỉ trong vài giây, dễ dàng đặt vừa vào cốp xe hơi, góc bàn làm việc hay mang theo lên các phương tiện công cộng như tàu điện, xe bus. JAVA Neo-9SE không chỉ là một phương tiện, mà là một món đồ công nghệ nâng tầm phong cách sống năng động và hiện đại của bạn.\n\n**Điểm nhấn kỹ thuật nhanh (Quick Specs):**\nDòng xe: Xe đạp gấp (Folding Bike) hiệu suất cao.\nKích thước bánh: 16 inch – Cân bằng hoàn hảo giữa tính cơ động và tốc độ.\n\nBộ truyền động: 9 tốc độ (Thường là Shimano hoặc bộ Groupset riêng của Java) giúp tối ưu sức mạnh trên nhiều địa hình.\n\nPhanh: Phanh đĩa (Disc Brake) – Hiệu suất dừng vượt trội so với phanh vành truyền thống.\n\nKhung: Hợp kim nhôm siêu nhẹ, công nghệ mối hàn phẳng (Smooth Welding) mang tính thẩm mỹ cao.	15790000	percentage	0	25	16	Nhôm Java ALU	xám, trắng, xanh	0	t	2026-02-07 23:02:34.280977+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One Size (16\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "X\\u00e1m, Tr\\u1eafng, Xanh"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Java ALU"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Java ALU"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU 30mm, Double Wall, 18H/24H, Presta Valve"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "ALU, b\\u1ea1c \\u0111\\u1ea1n, tr\\u1ee5c r\\u1ed7ng"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "Tr\\u01b0\\u1edbc: 18H / Sau: 24H"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Kenda 16x1*3/8"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "25.4x540mm ALU"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "31.8x550mm ALU"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Java"}, {"ten": "BA\\u0300N \\u0110A\\u0323P/PEDALS", "gia_tri": "Black ALU Platform"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "SL-M2010, 9 Speed"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "1 Speed"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "RD-R3000, 9 Speed"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Hyraudlic Disc"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "Sunshine 11-32T, 9 Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "9 Speed"}, {"ten": "GI\\u00d2 DI\\u0303A/CRANKSET", "gia_tri": "50Tx165mm ALU"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "Tr\\u1ee5c r\\u1ed7ng, b\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
16	Xe Đạp Trẻ Em Youth RAPTOR Mochi 4 - Bánh 18 Inch	SPLVNZH45V	1	1	**Xe Đạp Trẻ Em Youth RAPTOR Mochi 4 - Bánh 18 Inch**\nMột chiếc xe nhỏ xinh, tinh tế và đầy cảm hứng cho hành trình đầu đời của bé. **Raptor Mochi 4** là lựa chọn hoàn hảo cho những cô bé, cậu bé yêu thích phong cách nhẹ nhàng, đáng yêu và cảm giác làm chủ tay lái đầu tiên trong đời.\n\n**Những điểm nổi bật của Raptor Mochi 4\nThiết kế tinh tế, màu sắc trang nhã**\n\nRaptor Mochi 4 ghi điểm ngay từ cái nhìn đầu tiên với bảng màu pastel nhẹ nhàng gồm hồng, be và xanh – vừa hiện đại vừa ngọt ngào. Từng chi tiết được chăm chút tỉ mỉ: khung xe bo tròn mềm mại, giỏ xe mây nhựa phía trước tạo điểm nhấn đáng yêu, kết hợp với chắn bùn đồng màu cho tổng thể hài hòa và sạch sẽ.\n\n**Khung sườn thép chắc chắn, bền bỉ theo năm tháng**\n\nXe được trang bị khung thép **Raptor STL**, chịu lực tốt và ổn định, giúp bé tự tin hơn khi tập giữ thăng bằng. Lớp sơn tĩnh điện mịn và bóng bảo vệ khung khỏi trầy xước, tăng độ bền trong suốt quá trình sử dụng.\n\n**Bộ truyền động đơn giản, dễ vận hành**\n\nVới thiết kế 1 tốc độ, Raptor Mochi 4 cho bé thao tác cực kỳ dễ dàng – chỉ cần đạp là xe chạy. Giò dĩa 28T và líp sau 16T giúp xe chuyển động mượt mà, phù hợp cho trẻ đang học đạp hoặc mới chuyển từ xe có bánh phụ sang xe cân bằng.\n\n**Hệ thống phanh an toàn, dễ kiểm soát**\n\nKết hợp phanh U-brake trước và band brake sau, xe đảm bảo lực hãm ổn định, giúp bé dừng xe an toàn trong mọi tình huống. Tay phanh được thiết kế vừa vặn với bàn tay trẻ nhỏ, thao tác nhẹ và nhạy.\n\n**xe đạp trẻ em 18 inch**\n\nBánh xe 18 inch linh hoạt, êm ái trên mọi cung đường\n\n**Bộ bánh 18x2.125** được làm từ chất liệu cao su dày, bám đường tốt và hạn chế trượt. Mâm nhôm ALU single wall nhẹ và bền, kết hợp với bánh phụ cân bằng giúp bé tập luyện an toàn, ổn định hơn khi mới bắt đầu.\n\n**Giỏ xe tiện dụng, điểm nhấn tinh tế**\n\nPhía trước xe được trang bị giỏ nhựa giả mây rộng rãi – nơi bé có thể để bình nước, gấu bông hay món đồ chơi yêu thích. Không chỉ tiện lợi mà còn là chi tiết tạo nên phong cách “điệu đà” và dễ thương đặc trưng của dòng Mochi.\n\n**Ai nên chọn Raptor Mochi 4?**\nBé từ **5 – 8 tuổi**, cao khoảng **110 – 130 cm**.\n \nBé mới tập đạp hoặc chuyển từ xe ba bánh sang xe hai bánh có bánh phụ.\nBé thích phong cách dễ thương, nhẹ nhàng, phối màu pastel.\n \nPhù hợp để đạp xe dạo chơi, tập thể dục hoặc đi học hằng ngày.\nRaptor Mochi 4 – Đáng yêu từng vòng quay, trưởng thành từng bước đạp.\nMột lựa chọn hoàn hảo giúp bé rèn luyện sự tự lập, phát triển thể lực và nuôi dưỡng niềm vui vận động mỗi ngày.	2290000	percentage	17	28	18	thép raptor stl	hồng nhạt, hồng, xanh	0	t	2026-02-08 13:05:39.949252+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One size (18\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "H\\u1ed3ng nh\\u1ea1t, H\\u1ed3ng, Xanh"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Raptor STL 18"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Raptor STL"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "25.4x480mm STL"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "25.4x180mm ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "25.4x180mm STL"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Raptor"}, {"ten": "BA\\u0300N \\u0110A\\u0323P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Front: U-Brake Rear: Band Brake"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "16T, Single Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "Single Speed"}, {"ten": "GI\\u00d2 DI\\u0303A/CRANKSET", "gia_tri": "28x110mm STL"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU, Single Wall, 28H, Scharder Valve"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "18x2.125"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "Bi c\\u00f4n STL"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "28H"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
18	Xe Đạp Trẻ Em Youth RAPTOR Jubby 1 - Bánh 20 Inch	SPDH7QIOBY	1	1	**Xe Đạp Trẻ Em Youth RAPTOR Jubby 1 - Bánh 20 Inch**\n\nBé nhà bạn đang muốn có một chiếc xe đạp để vừa vui chơi, vừa rèn luyện sức khỏe và bạn muốn chiếc xe phải an toàn và dễ sử dụng? Raptor Jubby 1 chính là một trong những lựa chọn lý tưởng đáng để bạn cân nhắc cho những chuyến hành trình tuổi thơ đầy sôi động và đáng nhớ của con bạn cùng người bạn đồng hành đầu tiên của bé.\n\n**Thiết kế phù hợp cho trẻ em**\nJubby 1 có hai tùy chọn bánh 20 inch và 22 inch, phù hợp cho trẻ từ 6–12 tuổi. Kích thước nhỏ gọn, kiểu dáng thể thao khỏe khoắn cùng màu sắc bắt mắt giúp bé thêm hứng thú khi đồng hành cùng chiếc xe mới.\n\n**Khung thép Raptor STL chắc chắn và bền bỉ**\nKhung thép cứng cáp mang đến sự ổn định, an toàn, đồng thời chịu được va chạm trong quá trình trẻ sử dụng. Đây là yếu tố quan trọng giúp phụ huynh yên tâm khi chọn xe cho con.\n\n**Hệ thống phanh U-Brake an toàn, dễ kiểm soát**\nXe được trang bị phanh U-Brake trước sau – kiểu phanh đơn giản, nhạy và dễ bảo dưỡng, đảm bảo an toàn khi trẻ tập luyện hoặc dạo chơi.\n\n**Truyền động đơn giản, dễ đạp**\nVới cấu hình single speed (1 tốc độ), giò dĩa 36 răng kết hợp với líp 18T, Jubby 1 mang lại trải nghiệm đạp xe nhẹ nhàng, mượt mà, vừa sức với trẻ nhỏ. Thiết kế tối giản cũng giúp xe dễ sử dụng và ít cần bảo dưỡng.\n\n**Lốp YIDA bám đường, chống trượt**\nXe đạp Raptor Jubby 1 được trang bị cặp lốp YIDA với 2 kích thước 20 inch và 22 inch, tự do lựa chọn sao cho phù hợp với bé nhất. Cả hai đều được thiết kế với gai bám tốt, mang lại cảm giác an toàn khi di chuyển trên đường phố hoặc những đoạn đường mòn nhẹ.\n\n**Phụ kiện và chi tiết thân thiện**\nXe được lắp thêm yên Raptor êm ái, dễ chịu cho trẻ khi ngồi lâu cùng cốt yên dễ điều chỉnh - cha mẹ có thể nâng hạ độ cao phù hợp với sự phát triển của con. Bàn đạp Black PP Platform chống trượt, giữ chắc chân của bé, nâng cao trải nghiệm đạp xe của con thêm phần vẹn tròn.\n\n**Ai nên chọn Raptor Jubby 1?**\nPhụ huynh muốn tìm một chiếc xe an toàn, chắc chắn cho con.\n \nBé từ 6–12 tuổi yêu thích vận động, thích khám phá và chơi ngoài trời.\n \nGia đình muốn con có một chiếc xe đạp dễ dùng, ít bảo dưỡng.\n \nNhững ai đang tìm một chiếc xe đạp giúp bé rèn luyện sức khỏe, kỹ năng thăng bằng và sự tự tin.\nHãy để Raptor Jubby 1 trở thành người bạn đồng hành đầu tiên của con trên con đường phát triển toàn diện của con đồng thời tô thêm sắc màu vào bức tranh tuổi thơ của bé. Từng cung đường, từng trải nghiệm mà con đi qua sẽ tạo thành một thước phim kí ức tuổi thơ vô giá.	2290000	percentage	17	32	20	thép Raptor STL	trắng xanh, đen đỏ, xám cam	0	t	2026-02-08 16:15:48.750311+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One Size 20\\""}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "Tr\\u1eafng xanh, \\u0111en \\u0111\\u1ecf, x\\u00e1m cam"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Raptor STL 20"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Raptor STL"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "31.8x580mm STL"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "31.8x70mm ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "25.4x250mm STL"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Raptor"}, {"ten": "BA\\u0300N \\u0110A\\u0323P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "U-Brake"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "18T, Single Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "1/2x3/32x104L"}, {"ten": "GI\\u00d2 DI\\u0303A/CRANKSET", "gia_tri": "36x150mm STL"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "Single Wall, 36H, Scharder Valve"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "YIDA 20x2.125"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "Bi c\\u00f4n STL"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "36H"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
22	Xe Đạp Đường Phố Touring JAVA Sequoia-7S-City - Phanh Đĩa, Bánh 700C	SP9ANBK7HV	9	3	**Xe Đạp Đường Phố Touring JAVA Sequoia-7S-City** – Êm ái, linh hoạt cho di chuyển đô thị\n**JAVA Sequoia-7S-City** là mẫu xe đạp đường phố – touring phù hợp cho nhu cầu đi làm, đi học, dạo phố hoặc tập luyện nhẹ mỗi ngày. Thiết kế hiện đại kết hợp bánh 700C và phanh đĩa dầu mang lại trải nghiệm đạp ổn định, an toàn và thoải mái trong môi trường đô thị.\n\n**Khung và phuộc Java ALU** giúp xe có trọng lượng nhẹ, dễ điều khiển và linh hoạt khi di chuyển trong những cung đường đông đúc. Chất liệu nhôm cũng giúp tăng độ bền và hạn chế rỉ sét khi sử dụng lâu dài ngoài trời.\n\nXe được trang bị bộ bánh 700C với vành nhôm double wall 32 lỗ, kết hợp đùm bạc đạn trục rỗng giúp bánh xe lăn êm, tăng độ ổn định và giảm lực cản khi đạp. **Lốp 700x40C** bản to cho khả năng bám đường tốt, giảm rung xóc và tự tin hơn khi đi trên nhiều điều kiện mặt đường khác nhau.\n\nTư thế đạp được tối ưu cho sự thoải mái với ghi đông nhôm rộng 660mm và pô tăng ngắn, giúp người đạp kiểm soát xe tốt và giữ dáng ngồi thẳng khi di chuyển quãng đường dài. Yên Java và bàn đạp bản lớn hỗ trợ đạp chắc chân và ổn định trong quá trình sử dụng hằng ngày.\n\n**JAVA Sequoia-7S-City** sử dụng bộ truyền động 7 tốc độ LTWOO AX2, cho khả năng sang số mượt, dễ sử dụng và phù hợp với nhu cầu di chuyển trong thành phố hoặc leo dốc nhẹ. Giò đĩa nhôm Kohsei 38T giúp đạp nhẹ, tiết kiệm sức và duy trì tốc độ ổn định.\n\nHệ thống phanh đĩa dầu mang lại lực phanh mạnh, phản hồi nhanh và an toàn hơn khi đi mưa hoặc cần phanh gấp trong môi trường đô thị đông đúc.\n\nTổng thể, JAVA Sequoia-7S-City là lựa chọn phù hợp cho người đang tìm kiếm một chiếc xe đạp nhẹ, êm, dễ đạp và an toàn, đáp ứng tốt nhu cầu di chuyển hằng ngày và rèn luyện sức khỏe	6790000	percentage	7	20	30	THÉP Java ALU	Xanh đen, xám trắng	0	t	2026-02-08 20:18:03.234637+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "S"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "Xanh \\u0111en, X\\u00e1m tr\\u1eafng"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": " Java ALU"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Java ALU"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "31.8x660mm ALU"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "31.8x60mm ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "30.6x280mm STL"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Java"}, {"ten": "BA\\u0300N \\u0110A\\u0323P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "LTWOO AX2, 7 Speed"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "LTWOO AX2, 7 Speed"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Hydraulic Disc"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "14-28T, 7 Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "7 Speed"}, {"ten": "GI\\u00d2 DI\\u0303A/CRANKSET", "gia_tri": "Kohsei 38Tx170mm ALU"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU, Double Wall, 32H, Presta Valve"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "700x40C"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n, tr\\u1ee5c r\\u1ed7ng"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "32H"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n, c\\u1ed1t vu\\u00f4ng"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
23	Xe Đạp Đường Phố Touring RAPTOR Hunter 2B - Phanh Đĩa, Bánh 26 Inch	SPDG3JLMS7	9	1	**Xe Đạp Đường Phố Touring RAPTOR Hunter 2B – Phanh Đĩa, Bánh 26 Inch**\n\nBạn muốn tìm một chiếc xe đạp vừa bền bỉ, vừa linh hoạt để đồng hành trong những chuyến đi học, đi làm, hay những buổi dạo chơi cuối tuần? Raptor Hunter 2B chính là lựa chọn đáng cân nhắc. Với thiết kế gọn gàng, hệ truyền động đa dụng cùng cảm giác lái ổn định, chiếc xe này sẽ giúp bạn thoải mái di chuyển trên nhiều cung đường khác nhau – từ phố xá tấp nập đến những con đường dốc nhẹ, sỏi đá.\n\n**Những điểm nổi bật của RAPTOR Hunter 2B**\n\nThiết kế gọn gàng, thể thao và đa dụng\n\nRaptor Hunter 2B có kiểu dáng thể thao đơn giản nhưng không kém phần năng động, với 4 màu sắc nổi bật: Red/Black, Light Blue/Grey, Green, Grey White, dễ dàng phù hợp với nhiều cá tính khác nhau. Khung xe one-size 26 inch phù hợp cho người cao khoảng 1m55 – 1m75, kết hợp với ghi đông ngang 620mm, mang lại tư thế lái thoải mái, ổn định và dễ kiểm soát.\n\n**Khung nhôm Raptor ALU chắc chắn và bền bỉ**\n\nKhung hợp kim nhôm ALU giúp xe vừa chắc chắn, vừa chống gỉ sét, đồng thời giảm trọng lượng đáng kể so với khung thép. Đây là yếu tố quan trọng để xe dễ điều khiển, vận hành linh hoạt trong môi trường đô thị và khi đi xa.\n\n**Phuộc nhún 100mm hấp thụ chấn động**\n\nXe được trang bị phuộc nhún Raptor STL 100mm, giúp giảm chấn động từ mặt đường gồ ghề hoặc vỉa hè, mang lại trải nghiệm êm ái hơn. Dù không có giảm xóc sau, Hunter 2B vẫn đủ khả năng đem lại sự ổn định trên các chuyến đi thường ngày.\n\n**Hệ truyền động 24 tốc độ đa năng**\n\nHunter 2B sở hữu hệ truyền động 24 tốc độ - Gạt đĩa 3 tầng cùng gạt líp 8 tầng mang đến dải số 3x8 tốc độ, cho phép người lái vận hành mượt mà, dễ dàng thay đổi tốc độ tùy theo địa hình, từ đường phố bằng phẳng cho đến leo dốc một cách nhẹ nhàng, thoải mái.\n​​​\n**Bánh xe 26 inch – linh hoạt và bám đường tốt**\n\nXe trang bị lốp 26x2.125 inch, cân bằng giữa độ êm ái và khả năng bám đường. Với kích thước bánh nhỏ hơn so với Hunter 3B, Hunter 2B mang lại sự linh hoạt hơn khi di chuyển trong các con đường đô thị hẹp hoặc đông đúc.\n​​​​​​\n**Phanh đĩa cơ an toàn và ổn định**\n\nPhanh đĩa cơ đảm bảo khả năng phanh chính xác, kiểm soát tốc độ hiệu quả ngay cả khi đường trơn ướt, đồng thời dễ bảo dưỡng và sửa chữa khi cần.\n​​​​​​\n**Ai nên chọn Raptor Hunter 2B?**\n\n Học sinh, sinh viên cần một chiếc xe gọn gàng, dễ đi, phù hợp di chuyển hằng ngày\n Người đi làm tìm kiếm phương tiện nhẹ, tiết kiệm và an toàn trong đô thị\n Người mới bắt đầu tập luyện xe đạp thể thao, muốn một lựa chọn dễ sử dụng và ít bảo trì\n Người yêu thích phong cách đơn giản, thể thao nhưng vẫn đa dụng\nRaptor Hunter 2B mang lại sự kết hợp giữa thiết kế MTB năng động, khung nhôm bền bỉ và hệ truyền động Shimano mượt mà. Đây là lựa chọn lý tưởng cho những ai muốn bắt đầu trải nghiệm xe đạp địa hình, với một mức giá dễ tiếp cận mà vẫn đảm bảo chất lượng vận hành.	4390000	percentage	22	21	26	THÉP RAPTOR ALU	ĐỎ ĐEN, XANH LỤC, TRẮNG, XANH XÁM	5	t	2026-02-08 20:38:00.454196+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One Size 26\\""}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "\\u0110\\u1ecf \\u0111en, xanh l\\u1ee5c, tr\\u1eafng, xanh x\\u00e1m"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Raptor ALU"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Raptor STL 100mm"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "620mm STL"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "80mm ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "300mm STL"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Raptor"}, {"ten": "BA\\u0300N \\u0110A\\u0323P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "24 Speed"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "3 Speed"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "8 Speed"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Mechanical Disc"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "13-28T, 8 Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "8 Speed"}, {"ten": "GI\\u00d2 DI\\u0303A/CRANKSET", "gia_tri": "170mm, 14/37/42T, STL"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU, Double Wall, 36H, Scharder Valve"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "26x2.125"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n STL"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "36H"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
24	Xe Đạp Đường Phố Touring RAPTOR Rally 1B - Phanh Đĩa, Bánh 24 Inch	SPWVL1EQ5H	9	1	**Xe Đạp Đường Phố Touring RAPTOR Rally 1B - Phanh Đĩa, Bánh 24 Inch**\n\nĐược thiết kế cho những ai yêu thích khám phá và muốn chinh phục nhiều địa hình khác nhau, Raptor Rally 1B mang đến sự cân bằng giữa sức mạnh, độ bền và sự linh hoạt. Với thiết kế thể thao, chắc chắn cùng hệ truyền động 21 tốc độ, đây là lựa chọn lý tưởng cho cả những chuyến dạo phố lẫn hành trình thử thách trên đường mòn.\n\nNhững điểm nổi bật của Raptor Rally 1B\nThiết kế thể thao, năng động\n**Khung thép Raptor STL** khỏe khoắn với kích cỡ **bánh 24 inch** giúp người lái dễ dàng kiểm soát và di chuyển linh hoạt. Kết hợp cùng 4 tùy chọn màu sắc cá tính: Grey, Black, Red, Orange – Rally 1B không chỉ là phương tiện di chuyển mà còn thể hiện phong cách riêng.\n\n**Khung thép cứng cáp, bền bỉ**\n\nKhung xe được chế tạo bằng thép Raptor STL chắc chắn, chịu lực tốt, mang lại sự ổn định tốt mỗi khi di chuyển cho đù ở bất kì địa hình nào. Đây là lựa chọn phù hợp dành cho những người đam mê vượt địa hình nhưng lại muốn chiếc xe tuổi thọ cao và độ cứng cáp tốt.  \n\n**Phuộc nhún 100mm ổn định**\n\nGặp phải ổ gà, đường gồ ghề hay những đoạn mấp mô nhẹ thì cũng chớ lo vì Raptor Rally 1B đã được trang bị phuộc trước Raptor STL với hành trình 100mm giúp xe hấp thụ chấn động hiệu quả và đem lại sự thoải mái khi di chuyển cho người đạp.\n\n**Hệ truyền động 21 tốc độ linh hoạt**\n\nĐược trang bị tay đề 21 tốc độ với bộ chuyển líp 7 tầng và gạt đĩa 3 tầng, Rally 1B mang đến dải số 3x7 linh hoạt. Người lái có thể dễ dàng chuyển đổi giữa nhiều địa hình khác nhau, từ phố xá bằng phẳng đến những con dốc nhẹ. ​​​​​​​\n\n**Bánh xe 24x2.125 – bám đường tốt**\nCặp bánh 24 inch cùng lốp rộng 2.125 inch mang lại khả năng bám đường ổn định, thích hợp cho nhiều điều kiện di chuyển. Thiết kế gai lốp hỗ trợ tăng độ ma sát, vừa tối ưu tốc độ vừa giữ an toàn mang lại tâm lí thoải mái cho người dùng mỗi khi đạp xe.\n​​\n**Phanh đĩa cơ – kiểm soát an toàn**\nHệ thống phanh đĩa cơ mang lại lực phanh ổn định, giúp người lái dễ dàng kiểm soát tốc độ trong cả môi trường đô thị đông đúc hay những chuyến đi trên địa hình phức tạp.\n​​​​​​\n**Ai nên chọn Raptor Rally 1B?**\nNgười mới bắt đầu làm quen với xe đạp địa hình, muốn một chiếc xe dễ điều khiển.\n \nNgười yêu thích trải nghiệm cả trong phố lẫn trên đường mòn nhẹ.\n \nNgười tìm kiếm một chiếc MTB bền bỉ, giá hợp lý nhưng vẫn đủ mạnh mẽ cho tập luyện và phiêu lưu cuối tuần.\n \nRaptor Rally 1B chính là sự kết hợp giữa sức bền, tính tiện dụng và phong cách thể thao – một người bạn đồng hành đáng tin cậy để bạn thỏa sức thể hiện cá tính mạnh mẽ và năng động trên hành trình chinh phục mọi cung đường.\n\n	3990000	percentage	27	24	24	thép Raptor STL	cam, đỏ, đen, xám	0	t	2026-02-08 21:12:23.89443+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One size 24\\""}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "Cam, \\u0111\\u1ecf, \\u0111en, x\\u00e1m"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Raptor STL"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Raptor STL 100mm"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "620mm STL"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "80mm ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "300mm STL"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Raptor"}, {"ten": "BA\\u0300N \\u0110A\\u0323P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "21 Speed"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "3 Speed"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "7 Speed"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Mechanical Disc"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "14-28T, 7 Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "7 Speed"}, {"ten": "GI\\u00d2 DI\\u0303A/CRANKSET", "gia_tri": "170mm, 24-34-42T STL"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU, Double Wall, 36H, Scharder Valve"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "24x2.125"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n STL"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "36H"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
25	Xe Đạp Nữ Touring RAPTOR Lily 4 - Bánh 26 Inch	SP592EJMJ7	4	1	**Xe Đạp Đường Phố Touring RAPTOR Lily 4 - Bánh 26 Inch**\n\nPhố xá rợp nắng, gió khẽ qua vai và sự êm ái, nhẹ nhàng trên từng cung đường cùng chiếc xe đạp mang lại cảm giác trẻ trung, thanh lịch mỗi khi bạn ngồi lên. Đó chính là cảm giác mà Raptor Lily 4 đem đến - đơn giản nhưng đầy phong cách, nhấn mạnh vẻ đẹp tao nhã của phái đẹp.\nKhung thép Raptor STL chắc chắn và bền bỉ\n\nKhung xe bằng thép mang lại cảm giác ổn định, an toàn trong quá trình sử dụng. Tuy trọng lượng không được nhẹ nhưng lại có ưu điểm chịu lực tốt và bền theo thời gian, vô cùng phù hợp với nhu cầu đi lại hàng ngày trong môi trường thành thị.\n​​​​​\n**Hệ truyền động Single Speed đơn giản và dễ dùng**\n\nKhông cần lo lắng về việc sang số phức tạp, Raptor Lily 4 sử dụng hệ truyền động 1 tốc độ (single speed). Với bộ giò đĩa 36 răng kết hợp cùng líp 16T, xe mang lại cảm giác đạp nhẹ nhàng, trơn tru – lý tưởng cho đường phố bằng phẳng và những chuyến đi dạo nhẹ nhàng. Đồng thời, cấu trúc đơn giản giúp xe dễ chăm sóc và không cần phải bảo dưỡng nhiều.​​​​​​​\n\n**Bánh xe 26 inch gọn nhẹ, tối ưu cho đô thị**\n\nTrang bị bộ bánh 26x1.75, Raptor Lily 4 giữ cho xe nhanh nhẹn và dễ kiểm soát. Lốp mảnh vừa đủ để tăng tốc độ, vừa đảm bảo độ bám đường an toàn khi di chuyển trong nội thành.\n​​​​​\n**Hệ thống phanh an toàn và ổn định**\n\nXe sử dụng phanh trước U-Brake và phanh sau Band Brake – bộ đôi phanh cơ bản nhưng đáng tin cậy. Đây là giải pháp phanh thường thấy ở city bike, giúp kiểm soát tốc độ tốt trong đường phố đông đúc, đồng thời dễ bảo trì.\n​​​​​​\n**Ai nên chọn Raptor Lily 4?**\n\nNgười cần một chiếc xe đạp đi học, đi làm hoặc đi chợ hằng ngày.\nPhái đẹp thích phong cách thanh lịch, tao nhã, nhẹ nhàng.\nNgười mới bắt đầu đi xe đạp, ưu tiên dễ dùng, dễ bảo dưỡng.\nNgười cần một chiếc xe gọn nhẹ cho đô thị, phù hợp với quãng đường ngắn đến trung bình.\n \n Raptor Lily 4 là sự kết hợp giữa sự tiện dụng, bền bỉ và thiết kế tinh tế, hứa hẹn mang đến cho bạn những trải nghiệm đạp xe đơn giản nhưng tràn đầy cảm hứng mỗi ngày và thỏa sức thể hiện vẻ đẹp nhẹ nhàng của bạn.	2890000	percentage	20	16	26	thép raptor stl	vàng kem, hồng, xanh, hồng cà	0	t	2026-02-08 21:23:36.26312+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One size 26\\""}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "V\\u00e0ng kem, h\\u1ed3ng, xanh, h\\u1ed3ng c\\u00e0"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Raptor STL"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Raptor STL"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "22.2x560mm STL"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "22.2x300mm STL"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "25.4x250mm STL"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Raptor"}, {"ten": "BA\\u0300N \\u0110A\\u0323P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Front: U-Brake Rear: Band Brake"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "16T, Single Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "Single Speed"}, {"ten": "GI\\u00d2 DI\\u0303A/CRANKSET", "gia_tri": "36x160mm STL"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU, Single Wall, 28H, Scharder Valve"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Kylin 26x1.75"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
76	Xe Đạp Đường Phố Fixed Gear VINBIKE Megatron – Bánh 700C	SPCSJVGR6I	7	13	**Xe Đạp Đường Phố Touring VINBIKE Megatron** là một tác phẩm FIXED GEAR nghệ thuật đầy cá tính, được chăm chút tỉ mỉ từng chi tiết. Đây là mẫu xe fixed gear đầu tiên của Xedap.vn, mang đậm tính đổi mới và sáng tạo.\n\nVới thiết kế độc đáo và phá cách, Xe Đạp Đường Phố Touring VINBIKE Megatron không chỉ là phương tiện di chuyển, mà còn là chiếc Fixed Gear biểu tượng của sự tự do và cá tính. Bánh xe 700C cùng với hệ thống fixed gear tạo ra trải nghiệm đạp xe mạnh mẽ và thú vị, phù hợp với những người yêu thích tốc độ và đam mê đường phố.\n\nĐặc biệt, Megatron là lựa chọn hoàn hảo cho những người yêu thích khám phá và phiêu lưu. Với khả năng vận hành linh hoạt và ổn định, chiếc xe này sẽ là người bạn đồng hành tin cậy trên mọi cuộc hành trình, từ đường phố đô thị đến những cung đường ngoại ô hoang sơ.\n\nXe Đạp Đường Phố Touring VINBIKE Megatronhứa hẹn sẽ là người bạn đồng hành đáng tin cậy cho những chuyến đi đầy mạo hiểm và thú vị.	6990000	percentage	5	14	30	nhôm Vinbike ALU	xanh, đỏ, xanh đen	0	t	2026-03-09 15:46:02.196219+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One Size (30\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "Xanh, \\u0111\\u1ecf, xanh \\u0111en"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Vinbike ALU"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Vinbike STL"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU 60mm, Double Wall, 32H, Fresta Valve"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Chaoyang 700x25C"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "31.8x420mm ALU"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "31.8x80mm ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "300mm ALU"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Vinbike"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Black ALU Platform"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "19T, Single Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "1/2\\u00d71/8x98L"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "Sulane 48Tx170mm ALU"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
26	Xe Đạp Nữ Đương Phố Touring RAPTOR Lily 3 - Bánh 24 Inch	SPTSUFJ47H	4	1	**Xe Đạp Đường phố Touring RAPTOR Lily 3 – Bánh 24 Inch**\nPhong cách – Linh hoạt – An toàn cho bé gái năng động\n\nChiếc xe đạp RAPTOR Lily 3 là lựa chọn lý tưởng dành cho các bé gái từ 8 đến 12 tuổi. Với thiết kế hiện đại, màu sắc đẹp mắt và khả năng vận hành ổn định, chiếc xe không chỉ là phương tiện di chuyển hàng ngày mà còn là người bạn đồng hành trong những buổi đi học, dạo phố hay vui chơi cùng bạn bè.\n\n**Thiết kế xinh xắn, phù hợp với trẻ em**\n\nRAPTOR Lily 3 được thiết kế nổi bật với hai phiên bản màu sắc là xanh dương tươi sáng và hồng dịu dàng, mang đến cảm giác trẻ trung, nữ tính nhưng không kém phần năng động cho các bé gái. \nKích thước bánh xe 24 inch phù hợp với trẻ có chiều cao từ 1m25 đến 1m45, đảm bảo tư thế lái vững vàng và dễ chịu khi di chuyển. Khung xe được làm từ thép hợp kim Raptor STL chắc chắn, mang lại độ bền cao và khả năng sử dụng lâu dài, phù hợp với nhu cầu vận động thường ngày của trẻ.\n\n**Vận hành ổn định, dễ điều khiển**\n\nĐược trang bị phuộc trước Raptor STL, chiếc xe giúp giảm chấn tốt khi di chuyển qua các đoạn đường không bằng phẳng, mang lại cảm giác lái êm ái và ổn định. Bộ lốp Kylin 24×1.75 có độ bám cao, hỗ trợ bé di chuyển an toàn trên nhiều loại mặt đường khác nhau. \n\nHệ thống truyền động đơn tốc độ (single speed) với giò đạp 36×160mm, líp sau 16T và sên xe dạng đơn giản giúp bé đạp xe dễ dàng mà không cần chuyển số, rất lý tưởng cho trẻ em đang học cách làm quen với xe đạp bánh lớn.\n\n**An toàn cho bé trên mọi hành trình**\n\nHệ thống phanh của RAPTOR Lily 3 được tối ưu để phù hợp với lực tay của trẻ. Phanh trước U-Brake có thiết kế gọn nhẹ, dễ kiểm soát, còn phanh sau Band Brake thì hoạt động ổn định và nhẹ nhàng, giúp bé dễ dàng dừng lại khi cần thiết. Bàn đạp xe được làm từ nhựa Black PP chống trượt, giúp chân bé bám chắc hơn khi đạp, từ đó tăng cường độ an toàn trong quá trình sử dụng.\n**Tư thế ngồi thoải mái, hỗ trợ vóc dáng học sinh**\n\nVới ghi đông rộng 600mm, bé có thể dễ dàng điều khiển xe trong tư thế cân bằng và linh hoạt. Pô tăng 300mm và cốt yên 250mm được thiết kế để phù hợp với chiều cao và thể trạng của trẻ, giúp bé giữ được tư thế ngồi đúng và không bị mỏi trong suốt quá trình sử dụng. \n\n**Lý do nên chọn RAPTOR Lily 3**\n\nRAPTOR Lily 3 là sự kết hợp hoàn hảo giữa thiết kế đẹp mắt, khung xe bền bỉ, vận hành ổn định và tính an toàn cao. Xe đặc biệt phù hợp với các bé gái từ 8 đến 12 tuổi đang tìm kiếm một chiếc xe vừa dễ điều khiển vừa phù hợp với phong cách riêng. Màu sắc tươi sáng, phanh nhẹ dễ dùng, yên xe thoải mái và khả năng vận hành êm ái giúp bé tự tin đạp xe đi học, thể dục hay vui chơi mỗi ngày.\n\nXe đạp RAPTOR Lily 3 không chỉ là phương tiện giúp bé di chuyển mà còn là người bạn đồng hành giúp bé tự tin khám phá thế giới xung quanh. Với thiết kế an toàn, thân thiện và dễ sử dụng, chiếc xe sẽ mang đến cho bé những trải nghiệm vận động tuyệt vời, góp phần tạo nên một tuổi thơ năng động và đáng nhớ.	2790000	percentage	21	18	24	thép hợp kim Raptor STL	hồng cà, vàng kem, hồng, xanh	0	t	2026-02-08 22:00:35.48714+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One size (24\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "H\\u1ed3ng c\\u00e0, v\\u00e0ng kem, h\\u1ed3ng, xanh"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Raptor STL"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Raptor STL"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "22.2x600mm STL"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "22.2x300mm STL"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "25.4x250mm STL"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Raptor"}, {"ten": "BA\\u0300N \\u0110A\\u0323P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Front: U-Brake Rear: Band Brake"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "16T, Single Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "Single Speed"}, {"ten": "GI\\u00d2 DI\\u0303A/CRANKSET", "gia_tri": "36x160mm STL"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU, Single Wall, 36H, Scharder Valve"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Kylin 24x1.75"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
27	Xe Đạp Đường Trường Road JAVA Veloce-16S-R3 - Phanh Đĩa, Bánh 700C	SPQ4ZDZHC5	3	3	**Xe Đạp Đường Trường Road JAVA Veloce-16S-R3 – Sự Lựa Chọn Hoàn Hảo Cho Người Mới Bắt Đầu**\nJAVA Veloce-16S-R3 là mẫu xe đạp đua (Road Bike) phân khúc nhập môn nhưng sở hữu thiết kế đậm chất khí động học từ Ý. Với cấu hình 16 tốc độ, phanh đĩa an toàn và khung hợp kim nhôm siêu nhẹ, đây là người bạn đồng hành lý tưởng cho những ai muốn bắt đầu hành trình chinh phục tốc độ hoặc rèn luyện sức khỏe hàng ngày.\n\n**Những điểm nổi bật không thể bỏ qua:**\nKhung hợp kim nhôm ALU siêu nhẹ: Áp dụng công nghệ Smooth Welding (mối hàn phẳng), giúp khung xe trông mượt mà như carbon, vừa tăng tính thẩm mỹ vừa đảm bảo độ cứng cáp và tối ưu trọng lượng.\n\nHệ thống truyền động 16 tốc độ: Sự kết hợp nhịp nhàng giữa 2 đĩa trước và 8 líp sau cho phép người lái linh hoạt thay đổi tốc độ, dễ dàng leo dốc hay bứt tốc trên đường bằng.\n\nPhanh đĩa (Disc Brake) an toàn: Khác với phanh vành truyền thống, phanh đĩa trên Veloce mang lại hiệu suất dừng chính xác và ổn định ngay cả trong điều kiện đường ướt hoặc thời tiết xấu.\n\nThiết kế khí động học: Ghi đông cong (Drop bar) giúp người lái tối ưu tư thế núp gió, giảm lực cản để đạt tốc độ cao nhất với ít sức lực nhất.\n\nBánh bộ 700C tiêu chuẩn: Vành nhôm 2 lớp kết hợp cùng lốp bản nhỏ giúp giảm ma sát mặt đường, cho cảm giác lướt đi cực kỳ nhẹ nhàng.\n\n**Tại sao bạn nên chọn JAVA Veloce-16S-R3?**\nNếu bạn đang tìm kiếm một chiếc xe đạp có ngoại hình "sang chảnh" như các dòng xe cao cấp nhưng mức giá lại cực kỳ dễ tiếp cận, thì JAVA Veloce chính là câu trả lời. Chiếc xe không chỉ đáp ứng tốt nhu cầu tập luyện thể thao mà còn là phương tiện di chuyển phong cách trong thành phố.\n\n**Lưu ý:** Sản phẩm có nhiều kích cỡ (Size) phù hợp với chiều cao từ 1m55 đến 1m80. Đừng quên kiểm tra bảng size để chọn được chiếc xe vừa vặn nhất với mình nhé!	9990000	percentage	0	13	30	HỢP KIM NHÔM JAVA ALU	ĐEN, TRẮNG	0	t	2026-02-09 09:34:39.726594+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "S"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "\\u0110en, tr\\u1eafng"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "JAVA ALU"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Java ALU"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "31.8x400mm ALU"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "31.8x80mm ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "30.6x280mm ALU"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Java"}, {"ten": "BA\\u0300N \\u0110A\\u0323P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "LTWOO R3, 16 Speed"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "LTWOO R3, 2 Speed"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "LTWOO R3, 8 Speed"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "LTWOO R3 Hyraudlic Disc"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "11-28T, 8 Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "16 Speed"}, {"ten": "GI\\u00d2 DI\\u0303A/CRANKSET", "gia_tri": "Decaf 34/50Tx170mm ALU"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU, Double Wall, 32H, Presta Valve"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Compass 700x25C"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n, tr\\u1ee5c r\\u1ed7ng"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "32H"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n, c\\u1ed1t vu\\u00f4ng"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
38	Xe Đạp Trẻ Em Youth MISAKI Kitty 4 - Bánh 18 Inches	SPSS6F9B0H	1	6	**Xe Đạp Trẻ Em Youth MISAKI Kitty 4 – Bánh 18 Inches** \nYouth MISAKI Kitty 4 – Bánh 18” - dòng xe đạp lý tưởng cho bé trong giai đoạn phát triển. Đây chính là lựa chọn hoàn hảo cho các bé đang ở độ tuổi chuyển tiếp từ xe bánh phụ sang xe hai bánh thực thụ. Với kích cỡ phù hợp, thiết kế chắc chắn và khả năng vận hành ổn định, đây là chiếc xe đạp giúp trẻ phát triển kỹ năng vận động, giữ thăng bằng và rèn luyện sự tự tin mỗi ngày.\n\n**Khung xe thép MISAKI – chắc chắn và an toàn**\nKhung xe được chế tạo từ thép Misaki STL 18 cao cấp, giúp xe cứng cáp, chịu lực tốt mà vẫn giữ được trọng lượng vừa phải để bé dễ dàng điều khiển. Với các màu sắc tươi sáng như hồng, xám và xanh lá, MISAKI Kitty 4 mang lại cảm giác năng động, đáng yêu và phù hợp với nhiều sở thích khác nhau của trẻ.\n\n**Bánh xe 18 inch – kích cỡ phù hợp cho bé 5-8 tuổi**\nLốp xe bản rộng 18x2.125 không chỉ giúp tăng khả năng bám đường mà còn tạo sự êm ái khi di chuyển, nhất là trên bề mặt không bằng phẳng như công viên, đường làng hay sân chơi trường học. Vành nhôm Single Wall 28H nhẹ, bền và không bị han gỉ – một điểm cộng lớn khi sử dụng lâu dài.\n\n**Tư thế ngồi khoa học, dễ điều khiển**\nXe được trang bị ghi đông rộng 520mm và pô tăng 150mm cho tư thế ngồi vững chắc và kiểm soát tốt tay lái. Cốt yên 180mm cho phép điều chỉnh độ cao linh hoạt theo chiều cao của trẻ, giúp bé giữ tư thế ngồi đúng và thoải mái hơn trong suốt quá trình sử dụng.\n\n*Hệ thống phanh kép – đảm bảo an toàn**\nMISAKI Kitty 4 sử dụng phanh U ở bánh trước và phanh band ở bánh sau – hai loại phanh cơ học phổ biến, độ bền cao và dễ kiểm soát. Thiết kế này rất phù hợp với trẻ nhỏ, giúp bé học cách kiểm soát tốc độ an toàn trong môi trường quen thuộc như sân nhà hay công viên.\n\nPhụ huynh nên lựa chọn MISAKI Kitty 4 cho bé vì đây là mẫu xe đạp sở hữu thiết kế an toàn, thân thiện với trẻ nhỏ nhờ các chi tiết được bo tròn, không góc cạnh, hạn chế tối đa trầy xước và va chạm. Xe dễ sử dụng và bảo trì với hệ thống truyền động đơn giản, không dùng số, không rối dây, giúp trẻ tự tin đạp xe mà bố mẹ cũng an tâm hơn. \n\nVới kích cỡ bánh 18 inch, chiếc xe phù hợp cho trẻ cao từ 1m10 đến 1m25 – đúng vào giai đoạn lý tưởng để bé rèn luyện khả năng giữ thăng bằng và phát triển kỹ năng vận động. Ngoài ra, MISAKI Kitty 4 còn có thể đồng hành cùng bé trong nhiều hoạt động hàng ngày như đi học, đi chơi hay tập thể dục, giúp tăng cường vận động thể chất và giảm thời gian sử dụng thiết bị điện tử.\n\nNếu bạn đang tìm kiếm một chiếc xe đạp trẻ em vừa bền, đẹp lại an toàn cho bé yêu – MISAKI Kitty 4 chính là lựa chọn tuyệt vời.	2190000	percentage	22	16	18	thép misaki stl	hồng, xám, xanh	0	t	2026-02-11 15:52:13.293937+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One Size (18\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "H\\u1ed3ng, x\\u00e1m, xanh"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Misaki STL 27.5"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Misaki STL"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU, Single Wall, 28H, Scharder Valve"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "Th\\u00e9p, bi c\\u00f4n"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "18x2.125"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "22.2x520mm STL"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "22.2x150mm ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "25.4x180mm STL"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Misaki"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Front: U-Brake Rear: Band Brake"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "18T, Single Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "1/2x1/8x78L"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "28Tx110mm STL"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
28	Xe Đạp Đua Đường Trường Road GIANT Propel Advanced Pro 0 DI2 - Phanh Đĩa, Bánh 700C - 2026	SPBDHXQNYK	3	2	**GIANT Propel Advanced Pro 0 Di2 – 2026** là phiên bản cao cấp nhất trong dòng aero road của Giant, được phát triển dành cho những tay đua thực thụ và người chơi xe chuyên sâu, nơi từng chi tiết đều hướng đến tốc độ tối đa, hiệu quả khí động học và khả năng kiểm soát tuyệt đối ở vận tốc cao.\n\nNền tảng của xe là **khung Advanced-grade Composite** được tối ưu toàn diện về khí động học với chuẩn trục xuyên 12x142mm và phanh đĩa. Các ống khung được thiết kế theo nguyên lý CFD, giúp giảm tối đa lực cản gió khi duy trì tốc độ cao hoặc nước rút. **Phuộc Advanced SL-grade Composite kết hợp ống lái OverDrive Aero** liền khối không chỉ giúp luồng gió đi qua phần đầu xe mượt mà hơn mà còn tăng đáng kể độ cứng xoắn, mang lại cảm giác lái cực kỳ chính xác và ổn định trong các tình huống đua tốc độ cao.\n\nBộ bánh Giant SLR 1 50 Carbon Disc WheelSystem là điểm nhấn lớn về hiệu suất. Vành carbon cao 50mm được tối ưu cho khí động học, giúp giữ tốc tốt và tiết kiệm sức lực rõ rệt khi chạy đường bằng hoặc kéo đoàn. Đùm Giant Low Friction Hub với cơ chế 30T ratchet driver ở bánh sau cho khả năng ăn khớp nhanh, truyền lực gần như tức thì khi tăng tốc hoặc bứt phá. Căm Sapim cao cấp đảm bảo độ căng đồng đều, độ bền và khả năng chịu tải cao trong điều kiện vận hành cường độ lớn.\n\nXe được trang bị lốp CADEX Road Race GC tubeless 700x28c, dòng lốp đua cao cấp của Giant, tập trung vào lực cản lăn thấp, độ bám vượt trội và khả năng duy trì tốc độ cao ổn định. Cấu hình tubeless cho phép sử dụng áp suất thấp hơn, cải thiện độ êm và độ kiểm soát trên mặt đường không bằng phẳng, đồng thời tăng sự tự tin khi vào cua ở tốc độ cao.\n\nHệ thống cockpit gồm Giant Contact SLR Aero và pô tăng Contact SL Aero được thiết kế đồng bộ, giúp giảm đáng kể lực cản gió ở khu vực tay lái – yếu tố then chốt trong tổng hiệu suất khí động học của xe. Cốt yên Giant Vector composite với khả năng điều chỉnh offset linh hoạt cho phép tối ưu tư thế đạp theo mục tiêu khí động học và hiệu suất cá nhân, trong khi yên Giant Fleet SL hỗ trợ tốt tư thế đua và sự ổn định khi đạp cường độ cao trong thời gian dài.\n\nVề truyền động, Shimano Ultegra Di2 12-speed mang lại trải nghiệm sang số điện tử đỉnh cao với tốc độ, độ chính xác và sự ổn định gần như tuyệt đối, ngay cả khi đạp dưới tải lớn. Dải líp 11–30T kết hợp giò đĩa 36/52 hướng đến hiệu suất đua thuần túy, tối ưu cho tốc độ cao và nhịp đạp mạnh. Điểm đặc biệt trên phiên bản này là Giant Power Pro power meter tích hợp trên giò đĩa, cho phép đo công suất chính xác, hỗ trợ người dùng theo dõi, phân tích và tối ưu hóa quá trình tập luyện cũng như thi đấu.\n\nHệ thống phanh đĩa dầu Shimano Ultegra Di2 hydraulic với rotor RT-CL800 mang lại lực phanh mạnh, ổn định và khả năng kiểm soát vượt trội trong mọi điều kiện thời tiết, giúp người lái tự tin vào cua nhanh, giảm tốc gấp hoặc đổ đèo ở vận tốc cao.\n\nTổng thể, GIANT Propel Advanced Pro 0 Di2 – 2026 là chiếc aero road đỉnh cao dành cho những tay đua và người chơi xe chuyên nghiệp, những người muốn khai thác tối đa lợi thế khí động học, bánh carbon sâu, truyền động điện tử cao cấp và power meter tích hợp để đạt hiệu suất tối ưu trong cả tập luyện lẫn thi đấu	145990000	percentage	0	9	50	cacbon Advanced-grade Composite	đen trắng	5	t	2026-02-09 10:00:30.272734+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "XS"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "\\u0110en tr\\u1eafng"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Advanced-grade Composite"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Advanced SL-grade Composite, full-composite OverDrive Aero steerer, 12x100mm thru-axle, disc"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "Giant Contact SLR Aero"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "Giant Contact SL Aero"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "Giant Vector, composite, -5/+15mm offset"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Giant Fleet SL"}, {"ten": "TAY TH\\u1eaeNG/BRAKE LEVERS", "gia_tri": "Shimano Ultegra Di2 hydraulic"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "Shimano Ultegra Di2 ST-R8170"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "Shimano Ultegra Di2 FD-R8150"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "Shimano Ultegra Di2 RD-R8150"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Shimano Ultegra Di2 hydraulic, Shimano RT-CL800 rotors"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "Shimano Ultegra, 12-speed, 11x30"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "Shimano Ultegra, CN-M8100"}, {"ten": "GI\\u00d2 DI\\u0303A/CRANKSET", "gia_tri": "Shimano Ultegra, 36/52, with Giant Power Pro power meter"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "Giant SLR 1 50 Carbon Disc WheelSystem, [F]50mm, [R]50mm"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "CADEX Road Race GC, tubeless, 700x28c, folding"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "[F] Giant Low Friction Hub, CenterLock, [R] Giant Low Friction Hub, 30T ratchet driver, CenterLock, 12mm thru-axle"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "Sapim"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "Shimano, press fit"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
31	Xe Đạp Gấp Folding JAVA X2 16 - Phanh Đĩa, Bánh 16 Inches	SPQM8VKRCK	5	3	**Xe Đạp Gấp Folding JAVA X2 16 - Phanh Đĩa, Bánh 16 Inches.**\n\n**Xe Đạp Gấp JAVA X2 16 **– Gọn nhẹ, mạnh mẽ, linh hoạt trong từng chuyển động\n\nJAVA X2 16 là mẫu xe đạp gấp cao cấp sở hữu thiết kế hiện đại, khung sườn chắc chắn và khả năng vận hành linh hoạt, phù hợp với nhu cầu di chuyển tại khu vực đô thị. Cấu tạo gấp gọn giúp tiết kiệm diện tích, dễ dàng mang theo trên phương tiện công cộng hoặc cất giữ trong không gian nhỏ.\n\n**Thiết Kế Gấp Gọn Tiện Lợi: **\nKhả năng gấp siêu nhanh và kích thước nhỏ gọn khi gấp, JAVA X2 16 inch là người bạn đồng hành lý tưởng trên các phương tiện công cộng, trong cốp xe ô tô hay cất giữ tại những không gian nhỏ hẹp.\n\n**Khung nhôm Java ALU **– Bền nhẹ, chống gỉ vượt trội\nKhung và phuộc trước sử dụng chất liệu nhôm ALU cao cấp, giúp giảm trọng lượng tổng thể mà vẫn đảm bảo độ cứng cáp cần thiết. Thiết kế này hỗ trợ quá trình di chuyển nhẹ nhàng hơn, đặc biệt trong các khu vực đông đúc hoặc đường phố hẹp.\n\n**Hiệu suất vận hành tối ưu với 9 tốc độ**\nXe được trang bị bộ chuyển số LTWOO R5 9 tốc độ kết hợp cùng giò đĩa Prowheel 52T và líp 13-32T, mang lại khả năng tăng tốc và leo dốc hiệu quả. Việc sang số mượt mà giúp tối ưu trải nghiệm khi di chuyển trên nhiều dạng địa hình khác nhau.\n\n**An toàn với hệ thống phanh đĩa cơ**\n Hệ thống phanh đĩa cơ giúp tăng lực hãm, đảm bảo an toàn trong quá trình vận hành, đặc biệt trong điều kiện đường trơn hoặc khi dừng khẩn cấp. Sự ổn định và độ tin cậy cao mang lại cảm giác an tâm trong mỗi hành trình.\n\n**Trang bị bánh xe 16 inch linh hoạt và êm ái**\nLốp Kenda 16x1.35 inch kết hợp vành nhôm 2 lớp 30mm cho khả năng bám đường tốt, giảm thiểu chấn động và nâng cao độ bền khi di chuyển. Kích thước bánh nhỏ gọn giúp xe linh hoạt trong không gian hẹp, phù hợp với nhu cầu đi lại trong nội đô.\n\nThiết kế tiện dụng – Phù hợp nhiều đối tượng sử dụng\n Xe sử dụng tay lái rộng 25.4x540mm, cốt yên nhôm 33.9x550mm và yên Java êm ái, mang lại tư thế ngồi thoải mái và hỗ trợ đạp xe trong thời gian dài. Tùy chọn màu sắc gồm: Trắng thanh lịch, Đen Xanh thể thao và Đen Lá năng động, phù hợp với đa dạng phong cách cá nhân.\n\n**JAVA X2 16 – Lựa chọn thông minh cho cuộc sống di chuyển tiện nghi**\n\nKết hợp giữa hiệu suất và tính di động, JAVA X2 16 đáp ứng hoàn hảo nhu cầu di chuyển hằng ngày, tập thể dục nhẹ nhàng hoặc đơn giản là đồng hành trong các chuyến đi ngắn cuối tuần. Mẫu xe phù hợp cho sinh viên, nhân viên văn phòng, người sống tại khu vực thành thị và yêu thích phong cách sống tối giản.	6390000	percentage	0	13	16	nhôm java alu	trắng, xanh lá đen, xanh đen	0	t	2026-02-11 14:07:27.187803+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One size (16\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "Tr\\u1eafng, xanh l\\u00e0 \\u0111en, xanh \\u0111en"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Nh\\u00f4m JAVA ALU"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "JAVA ALU"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU 30mm, Double Wall, 20H, Presta Valve"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Kenda 16x1.35"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "25.4x540mm ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "33.9x550mm ALU"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Java"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "LTWOO R5, 9 Speed"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "LTWOO R5, 9 Speed"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Mechanical Disc"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "13-32T, 9 Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "Mava 104L 9 Speed"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "Prowheel 52Tx160mm ALU"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
5	Xe Đạp Đường Phố Touring RAPTOR Rally 2B - Bánh 26 Inch	SPXDFN1O68	9	1	Xe Đạp Đường Phố Touring RAPTOR Rally 2B – Bền bỉ, dễ đạp, linh hoạt mỗi ngày\nRAPTOR Rally 2B là mẫu xe đạp đường phố – touring hướng đến nhu cầu di chuyển hằng ngày, phù hợp cho đi học, đi làm hoặc dạo phố. Thiết kế đơn giản, dễ sử dụng, kết hợp bánh 26 inch và phanh đĩa giúp xe vận hành ổn định và an toàn trong môi trường đô thị.\n\nKhung xe Raptor STL 26 bằng thép mang lại độ chắc chắn cao, chịu tải tốt và phù hợp với người dùng phổ thông. Phuộc thép Raptor STL 26x100mm giúp xe ổn định hơn khi di chuyển qua đường gồ ghề, vỉa hè hoặc mặt đường không bằng phẳng.\n\nXe sử dụng bộ bánh 26 inch với vành nhôm double wall 36 lỗ, giúp tăng độ bền và hạn chế cong vênh trong quá trình sử dụng hằng ngày. Lốp 26x2.125 bản to cho khả năng bám đường tốt, chạy êm và tự tin hơn khi đi trên nhiều điều kiện mặt đường khác nhau.\n\nTư thế đạp của RAPTOR Rally 2B được thiết kế thoải mái với ghi đông rộng 620mm, pô tăng nhôm và cốt yên thép chắc chắn. Yên xe Raptor cùng bàn đạp bản lớn giúp người đạp giữ thăng bằng tốt, phù hợp cho những ai thường xuyên di chuyển quãng ngắn đến trung bình.\n\nXe được trang bị bộ truyền động 21 tốc độ với tay đề, chuyển đĩa và chuyển líp Raptor, kết hợp giò đĩa 3 tầng 24/34/42T. Cấu hình này cho phép người dùng dễ dàng thay đổi tốc độ, phù hợp khi đi đường bằng, leo dốc nhẹ hoặc chở thêm đồ cá nhân.\n\nHệ thống phanh đĩa cơ Tolan giúp xe có lực phanh ổn định, dễ kiểm soát và an toàn hơn so với phanh vành truyền thống, đặc biệt khi di chuyển trong điều kiện đường trơn hoặc mưa nhẹ.\n\nTổng thể, RAPTOR Rally 2B là lựa chọn phù hợp cho người đang tìm kiếm một chiếc xe đạp bền bỉ, dễ sử dụng, chi phí hợp lý, đáp ứng tốt nhu cầu đi lại và vận động hằng ngày	4190000	percentage	26	31	26	Thép Raptor STL 26	Đỏ, Đen, Xám, Cam	5	t	2026-02-05 17:53:14.541944+07	[{"ten": "K\\u00edch c\\u1ee1/Sizes", "gia_tri": "One size (26\\")"}, {"ten": "M\\u00e0u s\\u1eafc/Colors", "gia_tri": "\\u0110\\u1ecf, \\u0110en, X\\u00e1m, Cam"}, {"ten": "Ch\\u1ea5t li\\u1ec7u khung/Frame", "gia_tri": "Th\\u00e9p Raptor STL 26"}, {"ten": "Phu\\u1ed9c/Fork", "gia_tri": "Raptor STL 26x100mm"}, {"ten": "V\\u00e0nh xe/Rims", "gia_tri": "Raptor ALU, Double Wall, 36H, Schrader valve"}, {"ten": "\\u0110\\u00f9m/Hubs", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "C\\u0103m/Spokes", "gia_tri": "36H"}, {"ten": "L\\u1ed1p xe/Tires", "gia_tri": "26x2.125"}, {"ten": "Ghi \\u0111\\u00f4ng/Handlebar", "gia_tri": "31.8x620mm STL"}, {"ten": "P\\u00f4 t\\u0103ng/Stem", "gia_tri": "31.8x70mm ALU"}, {"ten": "C\\u1ed1t y\\u00ean/Seatpost\\t", "gia_tri": "28.6x350mm STL"}, {"ten": "Y\\u00ean/Saddle", "gia_tri": "Raptor"}, {"ten": "Ba\\u0300n \\u0111a\\u0323p/Pedals", "gia_tri": "Black PP Platform"}, {"ten": "Tay \\u0111\\u1ec1/Shifters", "gia_tri": "Raptor 21 Speed"}, {"ten": "Chuy\\u1ec3n \\u0111\\u0129a/Front Derailleur", "gia_tri": "Raptor 3 Speed"}, {"ten": "Chuy\\u1ec3n l\\u00edp/Rear Derailleur", "gia_tri": "Raptor 7 Speed"}, {"ten": "B\\u1ed9 th\\u1eafng/Brakes", "gia_tri": "Tolan Mechanical Disc"}, {"ten": "B\\u1ed9 l\\u00edp/Cassette", "gia_tri": "14-28T, 7 Speed"}, {"ten": "S\\u00ean xe/Chain", "gia_tri": "7 Speed"}, {"ten": "Gi\\u00f2 di\\u0303a/Crankset", "gia_tri": "24/34/42Tx170mm STL"}, {"ten": "B.B/Bottom Bracket", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "Tr\\u1ecdng l\\u01b0\\u1ee3ng/Weight", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
32	Xe Đạp Trẻ Em Youth RAPTOR Jubby 2 - Bánh 22 Inch	SPV18FKD5Y	1	1	**Xe Đạp Trẻ Em Youth RAPTOR Jubby 2 - Bánh 22 Inch**\n\nTuổi thơ đóng một vai trò rất lớn trong quá trình phát triển toàn diện của trẻ em, vì thế một chiếc xe đạp không chỉ là một phương tiện di chuyển mà còn là một người bạn đồng hành đem đến một khoảng trời kí ức vẹn toàn cho bé. Chính bởi điều này mà Raptor Jubby 2 đã được tạo ra để đáp ứng các nhu cầu ấy của bé cũng như của bố mẹ, không chỉ nằm ở thiết kế bắt mắt mà còn ở sự an toàn giúp bố mẹ yên tâm hơn.\n\n**Những điểm nổi bật của RAPTOR Jubby 2*\n\n**Thiết kế năng động, khỏe khoắn**\n Jubby 2 mang kiểu dáng thể thao, mạnh mẽ với nhiều màu sắc bắt mắt, phù hợp cho các bé yêu thích sự cá tính và năng động. Kích thước bánh 22 inch phù hợp với trẻ đang lớn, giúp bé dễ dàng kiểm soát xe.\n\n**Khung thép cứng cáp, chắc chắn **\n\nKhung xe được làm từ thép Raptor STL cứng cắp và chắc chắn, khả năng chịu lực tốt và đảm bảo độ bền cho quá trình sử dụng hằng ngày. Kèm với đó chính là ghi đông thẳng 31.8x580mm STL giúp bé dễ điều khiển và giữ thăng bằng.\n\n**Phuộc trước ổn định**\n\nPhuộc thép Raptor STL tăng độ vững chắc, độ ổn định cho xe khi di chuyển, đặc biệt trên các bề mặt đường gồ ghề hoặc đường trong khu dân cư. Vì xe không được trang bị thiết bị giảm xóc nên trọng lượng xe đã được tối giản giúp bé dễ đi hơn.\n\n**Hệ truyền động đơn giản – Single Speed**\n\n Trang bị bộ líp 18T 1 tốc độ kết hợp với giò dĩa 36x150mm, Jubby 2 giúp bé làm quen với đạp xe dễ dàng, không phải thao tác sang số phức tạp, an toàn và phù hợp với trẻ mới tập hoặc trẻ ở độ tuổi tiểu học.\n\n**Phanh U-Brake an toàn**\n\nHệ thống phanh U-Brake trên xe giúp kiểm soát tốc độ tốt, dễ sử dụng và dễ bảo dưỡng - mang lại sự an tâm cho phụ huynh khi bé di chuyển trên mọi cung đường. \n\n**Bánh xe và lốp bám đường tốt**\n\nCặp bánh 22 inch kết hợp lốp YIDA 22x2.125 không chỉ mang lại sự an toàn trên nhiều mặt đường nhờ khả năng bám đường ổn định, chống trượt mà còn cho bé thơ có được nhiều trải nghiệm vui đùa trên những chiếc bánh lăn trong từng hành trình.\n\n**Ai nên chọn Raptor Jubby 2?**\nPhụ huynh tìm một chiếc xe đạp an toàn – dễ sử dụng – bền bỉ cho con.\n \nTrẻ em từ 8–12 tuổi, cần một chiếc xe để đi học, vui chơi, vận động ngoài trời.\n \nBé yêu thích phong cách thể thao, khỏe khoắn và năng động.\n \nRaptor Jubby 2 không chỉ là một chiếc xe đạp mà còn là một chiến mã đầu đời của trẻ thơ, giúp cho các bé có được những trải nghiệm đạp xe thú vị, đem lại sự tự tin trên mỗi hành trình khám phá tuổi thơ. Ngoài ra còn giúp phụ huynh an tâm hơn vì sự chắc chắn và an toàn mà Jubby 2 mang lại.	2390000	percentage	16	22	22	thép raptor stl	đen đỏ, trắng xanh, xám cam	0	t	2026-02-11 14:23:53.3136+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One size (22\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "\\u0110en \\u0111\\u1ecf, tr\\u1eafng xanh, x\\u00e1m cam"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Th\\u00e9p Raptor STL 22"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Raptor STL"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "Single Wall, 36H, Scharder Valve valve"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "Bi c\\u00f4n STL"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "36H"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "YIDA 22x2.125"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "31.8x660mm STL"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "31.8x70mm ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "25.4x250mm STL"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Raptor"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "U-Brake"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "18T, Single Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "1/2x3/32x104L"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "36x150mm STL"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
33	Xe Đạp Trẻ Em Youth RAPTOR Elsa 1 - Bánh 12 Inch	SP1DGLKU9W	1	1	**RAPTOR Elsa 1 – bánh 12 inch** là mẫu xe đạp trẻ em được thiết kế dành cho các bé ở độ tuổi rất nhỏ, giai đoạn bắt đầu làm quen với việc giữ thăng bằng và đạp xe. Kích thước 12 inch nhỏ gọn giúp bé dễ kiểm soát, tạo cảm giác an toàn và tự tin ngay từ những lần tập đạp đầu tiên.\n\n**Khung Raptor STL 12** có kết cấu chắc chắn, chiều cao thấp, phù hợp với thể trạng của trẻ nhỏ. Thiết kế này giúp bé dễ dàng chống chân, lên xuống xe và hạn chế cảm giác chông chênh khi mới tập lái. Phuộc Raptor STL đồng bộ mang lại sự ổn định cho phần đầu xe, hỗ trợ bé giữ hướng đi thẳng và cân bằng tốt hơn.\n\n**Bộ bánh 12 inch** sử dụng vành Single Wall 16H kết hợp lốp 12x2.125 bản rộng, giúp tăng độ bám đường và giảm rung lắc khi di chuyển chậm. Nhờ đó, bé có thể làm quen với cảm giác đạp xe một cách nhẹ nhàng và an toàn trên sân nhà hoặc khu vui chơi.\n\n**Ghi đông 22.2x480mm** được thiết kế vừa tầm tay, giúp bé dễ cầm nắm và xoay lái. Pô tăng 22.2x150mm cùng cốt yên 25.4x180mm cho phép điều chỉnh phù hợp với chiều cao của bé, hỗ trợ tư thế ngồi thoải mái và góp phần giúp cột sống phát triển tự nhiên.\n\nXe sử dụng hệ truyền động Single Speed đơn giản với giò đĩa 28T và bộ líp 16T, giúp việc đạp xe trở nên nhẹ nhàng, không gây mỏi chân. Cấu hình này cho phép bé tập trung hoàn toàn vào việc phối hợp chân và giữ thăng bằng, thay vì phải làm quen với nhiều thao tác phức tạp.\n\nHệ thống phanh gồm U-Brake phía trước và Band Brake phía sau có lực bóp nhẹ, dễ kiểm soát, giúp bé học cách giảm tốc và dừng xe an toàn. Tổng thể, Xe Đạp Trẻ Em RAPTOR Elsa 1 – 12 Inch là lựa chọn lý tưởng để bé rèn luyện vận động, phát triển thể chất và hình thành thói quen vận động lành mạnh ngay từ những năm đầu đời	1490000	percentage	0	18	12	thep raptor stl	tím, hồng trắng	0	t	2026-02-11 14:31:02.904693+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One size (12\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "T\\u00edm, h\\u1ed3ng tr\\u1eafng"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Th\\u00e9p Raptor STL 12"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Raptor STL"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "Single Wall, 16H, Scharder Valve"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "Bi c\\u00f4n STL"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "16H"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "12x2.125"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "22.2x480mm STL"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "22.2x150mm STL"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "25.4x180mm STL"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Raptor"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Front: U-Brake Rear: Band Brake"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "16T, Single Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "Single Speed"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "28Tx80mm STL"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
20	Xe Đạp Đường Phố Touring GIANT Roam 4 - Phanh Đĩa, Bánh 700C - 2026	SP1O2BV5HD	9	2	**Xe Đạp Đường Phố Touring GIANT Roam 4 - Phanh Đĩa, Bánh 700C - 2026**\nKhi nói đến dòng xe đa năng, Giant Roam 4 2026 chính là “con át chủ bài” mới nhất từ Giant – sự kết hợp hoàn hảo giữa sức mạnh địa hình và sự linh hoạt của xe touring. Mẫu xe này được sinh ra cho những ai muốn khám phá mọi cung đường – từ phố xá đô thị đến lối mòn phiêu lưu cuối tuần.\n\n**Những điểm nổi bật của Giant Roam 4 2026**\nThiết kế thể thao mạnh mẽ và đa năng\nPhiên bản Stealth Chrome mang vẻ ngoài trung tính nhưng hiện đại, kết hợp cùng kiểu dáng touring lai MTB cho tư thế ngồi thoải mái, cân bằng giữa tốc độ và kiểm soát. Đây là lựa chọn hoàn hảo cho người muốn một chiếc xe vừa đi làm, vừa có thể đi phượt nhẹ cuối tuần.\n\n**Khung hợp kim nhôm siêu bền nhẹ và ổn định**\nSử dụng công nghệ độc quyền ALUXX-grade aluminum, Roam 4 2026 mang đến độ cứng vững vượt trội trong khi vẫn giữ trọng lượng nhẹ. Hệ khung hỗ trợ phanh đĩa giúp xe hoạt động tốt trong mọi điều kiện thời tiết, đồng thời mang lại độ chính xác cao khi xử lý.\n\n**Phuộc hành trình 63mm hấp thụ xung lực êm ái**\nPhuộc trước SR Suntour NEX với hành trình 63mm giúp xe dễ dàng vượt qua ổ gà, mặt đường xấu hoặc sỏi đá nhẹ. Người dùng có thể yên tâm di chuyển dài mà không lo mỏi tay hay mất kiểm soát.\n\n**Bộ truyền động đem lại sự linh hoạt và bền bỉ**\nTrang bị bộ chuyển tốc Shimano Altus 2x8 cùng giò dĩa 30/46T và líp 11–34T, Roam 4 mang đến khả năng vận hành linh hoạt – từ leo dốc nhẹ nhàng đến tăng tốc mạnh trên đường bằng. Toàn bộ hệ thống hoạt động mượt mà, dễ bảo dưỡng, phù hợp cho cả người mới lẫn người đã có kinh nghiệm.\n\n**Phanh dầu đem lại sự an toàn tối ưu và lực bóp nhẹ**\nHệ thống phanh dầu Tektro TKD-143 mang lại lực hãm ổn định, dễ kiểm soát trong mọi tình huống, kể cả khi xuống dốc hay đường trơn. Đây là trang bị không thể thiếu giúp đảm bảo an toàn tuyệt đối cho người lái.\n\n**Bánh 700x42C cân bằng giữa tốc độ và độ bám đường**\nCặp bánh 700x42C đi kèm lốp Giant CrossCut chống đinh thủng mang lại cảm giác lái mượt, tốc độ tốt và độ bền cao. Thiết kế lốp bản rộng cho khả năng bám đường ổn định, tự tin khi vào cua hoặc đi địa hình nhẹ.\n\n**Yên đệm êm ái cho trải nghiệm thoải mái trọn vẹn**\nKết hợp giữa yên ErgoContact và cốt yên Giant D-Fuse, hệ thống này giúp giảm rung chấn đáng kể khi đi đường dài, mang lại cảm giác thoải mái và hạn chế tê mỏi vùng hông – yếu tố cực kỳ quan trọng với người thường xuyên đạp xe.\n\n**Ai nên chọn Giant Roam 4 2026?**\n\nNgười yêu thích sự linh hoạt – có thể đạp đi làm, đi chơi hoặc dã ngoại cuối tuần.\n \nPhù hợp với người mới bắt đầu chơi xe touring hoặc muốn nâng cấp từ dòng city bike cơ bản.\n \nNgười có chiều cao từ 1m65–1m85, chọn size S hoặc M tùy thể hình.\n \nGiant Roam 4 2026 là lựa chọn hoàn hảo cho ai muốn một chiếc xe “làm được mọi thứ” – đạp nhẹ nhàng trong phố, ổn định khi phượt xa và đủ khỏe để chinh phục cung đường sỏi đá.\nSở hữu ngay hôm nay để bắt đầu hành trình khám phá mới với Giant Roam 4 2026 – đa năng, mạnh mẽ và đáng tin cậy.\n\n	12790000	percentage	5	9	30	cacbon Advanced-grade composite	nÂU CHROME	0	t	2026-02-08 16:49:08.336024+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "S"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "N\\u00e2u chrome"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "cacbon Advanced-grade composite"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "SR Suntour NEX 700C, 63mm"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "Giant Sport XC, 31.8mm"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "Giant Contact, 8-degree"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "Giant D-Fuse, alloy, 350mm"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "ErgoContact"}, {"ten": "BA\\u0300N \\u0110A\\u0323P/PEDALS", "gia_tri": "platform"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "Shimano Altus, 2x8"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "Shimano Tourney FD-TY606"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "Shimano Altus RD-M310"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Tektro TKD-143 hydraulic"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "Shimano Hyperglide HG, 11x34"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "KMC Z7"}, {"ten": "GI\\u00d2 DI\\u0303A/CRANKSET", "gia_tri": "forged alloy, 30/46"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "Giant double wall aluminum"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Giant CrossCut, anti-puncture, 700x42c"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "alloy, 32h"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "stainless, 14g"}, {"ten": "TAY TH\\u1eaeNG/BRAKE LEVERS", "gia_tri": "Tektro TKD-143"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "threaded"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
34	Xe Đạp Trẻ Em Youth RAPTOR Helen 1 - Bánh 20 Inch	SPHIU0T6SR	1	1	**Xe Đạp Trẻ Em Youth RAPTOR Helen 1 - Bánh 20 Inch**\nNgười bạn đồng hành phong cách cho bé yêu thích khám phá\n\nChiếc xe đạp Youth RAPTOR Helen 1 là món quà lý tưởng dành cho các bé từ 6 đến 9 tuổi, đặc biệt phù hợp với những bạn nhỏ thích vận động, khám phá và tận hưởng các chuyến đi cùng bạn bè hay gia đình với \n\n**Phong cách nổi bật, thiết kế cho trẻ năng động**\n\nVới bánh xe kích thước 20 inch, Helen 1 mang đến khả năng vận hành linh hoạt, giúp bé dễ dàng điều khiển dù là đi học, đi chơi hay dạo quanh khu phố. Xe có 3 màu sắc tươi sáng để lựa chọn: Hồng nhạt (Pastel Pink), Trắng (White), và Xanh Lá Nhạt (Light Green). Mỗi màu đều mang lại nét cá tính riêng, giúp bé tự tin thể hiện phong cách.\n\n**Cấu tạo chắc chắn - Bé đạp khỏe, ba mẹ yên tâm**\n\nKhung xe được làm từ thép hợp kim Raptor STL 22 – bền bỉ, chịu lực tốt, hạn chế cong vênh. Phuộc trước cũng sử dụng chất liệu Raptor STL, giúp hấp thụ xung động hiệu quả khi di chuyển trên địa hình gồ ghề hoặc không bằng phẳng.\n\n**Lốp chắc – Vành bền – Di chuyển nhẹ nhàng**\n\nXe được trang bị vành nhôm ALU, loại Single Wall 28H, vừa nhẹ vừa chắc chắn. Kết hợp với lốp xe 20 x 1.75, bé có thể di chuyển linh hoạt và bám đường tốt hơn. Van Schrader giúp dễ dàng bơm hơi bằng các dụng cụ thông thường.\n\n**An toàn là ưu tiên hàng đầu**\n\nHelen 1 sử dụng hệ thống phanh kép: phanh trước dạng U-Brake và phanh sau Band Brake. Đây là sự kết hợp tối ưu cho khả năng kiểm soát tốc độ và dừng xe an toàn. Bàn đạp nhựa Black PP Platform có bề mặt chống trượt, đảm bảo đôi chân bé luôn vững vàng mỗi khi đạp.\n\n**Thiết kế chuẩn dáng bé – Tư thế ngồi thoải mái**\n\nGhi đông kích thước 22.2×580mm STL kết hợp với pô tăng 22.2×300mm ALU được thiết kế vừa vặn với vóc dáng trẻ nhỏ. Cốt yên 25.4×250mm STL và yên Raptor bọc đệm êm ái giúp bé luôn cảm thấy dễ chịu ngay cả khi đạp xe trong thời gian dài.\n\n**Dễ sử dụng – Phù hợp với trẻ mới làm quen xe đạp**\n\nHelen 1 sử dụng hệ thống truyền động đơn giản: bộ líp 16T, giò đạp 36×160mm STL và sên Single Speed. Thiết kế này giúp bé dễ dàng điều khiển mà không cần lo lắng về sang số, rất phù hợp cho những bé mới bắt đầu làm quen với xe đạp.\n\n**Vì sao nên chọn RAPTOR Helen 1**\n\nThiết kế chắc chắn, dễ điều khiển\nMàu sắc tươi sáng, phong cách\nAn toàn và thoải mái khi sử dụng\nPhù hợp cho cả đi học, đi chơi và vận động thể thao nhẹ nhàng\nHãy để chiếc xe đạp Youth RAPTOR Helen 1 đồng hành cùng bé trên hành trình tuổi thơ, giúp con rèn luyện thể lực, phát triển sự tự tin và lưu giữ những kỷ niệm đáng nhớ mỗi ngày.\n\n 	2590000	percentage	27	18	20	thép raptor stl 20	hồng, trắng, xanh	0	t	2026-02-11 14:42:03.28234+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One size (20\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "H\\u1ed3ng, tr\\u1eafng, xanh"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Raptor STL 20"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Raptor STL"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU, Single Wall, 28H, Scharder Valve"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "20x1.75"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "22.2x580mm STL"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "22.2x300mm ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "25.4x250mm STL"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Raptor"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Front: U-Brake Rear: Band Brake"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "16T, Single Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "Single Speed"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "36x160mm STL"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
35	Xe Đạp Trẻ Em Youth RAPTOR Helen 2 - Bánh 22 Inch	SP3DXGABLJ	1	1	**Xe Đạp Trẻ Em Youth RAPTOR Helen 2 - Bánh 22 Inch**\nNgười bạn đồng hành phong cách cho bé yêu thích khám phá\n\nChiếc xe đạp Youth RAPTOR Helen 2 là món quà lý tưởng dành cho các bé từ 8 đến 11 tuổi, đặc biệt phù hợp với những bạn nhỏ thích vận động, khám phá và tận hưởng các chuyến đi cùng bạn bè hay gia đình.\n\n**Phong cách nổi bật, thiết kế cho trẻ năng động**\n\nVới bánh xe kích thước 22 inch, Helen 2 mang đến khả năng vận hành linh hoạt, giúp bé dễ dàng điều khiển dù là đi học, đi chơi hay dạo quanh khu phố. Xe có 3 màu sắc tươi sáng để lựa chọn: Hồng nhạt (Pastel Pink), Trắng (White), và Xanh Lá Nhạt (Light Green). Mỗi màu đều mang lại nét cá tính riêng, giúp bé tự tin thể hiện phong cách.\n\n**Cấu tạo chắc chắn - Bé đạp khỏe, ba mẹ yên tâm**\nKhung xe được làm từ thép hợp kim Raptor STL 22 – bền bỉ, chịu lực tốt, hạn chế cong vênh. Phuộc trước cũng sử dụng chất liệu Raptor STL, giúp hấp thụ xung động hiệu quả khi di chuyển trên địa hình gồ ghề hoặc không bằng phẳng.\n\n**Lốp chắc – Vành bền – Di chuyển nhẹ nhàng**\nXe được trang bị vành nhôm ALU, loại Single Wall 28H, vừa nhẹ vừa chắc chắn. Kết hợp với lốp xe 22 x 1.75, bé có thể di chuyển linh hoạt và bám đường tốt hơn. Van Schrader giúp dễ dàng bơm hơi bằng các dụng cụ thông thường.\n\n**An toàn là ưu tiên hàng đầu**\nHelen 2 sử dụng hệ thống phanh kép: phanh trước dạng U-Brake và phanh sau Band Brake. Đây là sự kết hợp tối ưu cho khả năng kiểm soát tốc độ và dừng xe an toàn. Bàn đạp nhựa Black PP Platform có bề mặt chống trượt, đảm bảo đôi chân bé luôn vững vàng mỗi khi đạp.\n\n**Thiết kế chuẩn dáng bé – Tư thế ngồi thoải mái**\nGhi đông kích thước 22.2×580mm STL kết hợp với pô tăng 22.2×300mm ALU được thiết kế vừa vặn với vóc dáng trẻ nhỏ. Cốt yên 25.4×250mm STL và yên Raptor bọc đệm êm ái giúp bé luôn cảm thấy dễ chịu ngay cả khi đạp xe trong thời gian dài.\n\n**Dễ sử dụng – Phù hợp với trẻ mới làm quen xe đạp**\n\nHelen 2 sử dụng hệ thống truyền động đơn giản: bộ líp 16T, giò đạp 36×160mm STL và sên Single Speed. Thiết kế này giúp bé dễ dàng điều khiển mà không cần lo lắng về sang số, rất phù hợp cho những bé mới bắt đầu làm quen với xe đạp.\n\n**Vì sao nên chọn RAPTOR Helen 2**\n \nThiết kế chắc chắn, dễ điều khiển\nMàu sắc tươi sáng, phong cách\nAn toàn và thoải mái khi sử dụng\nPhù hợp cho cả đi học, đi chơi và vận động thể thao nhẹ nhàng\n \nHãy để chiếc xe đạp Youth RAPTOR Helen 2 đồng hành cùng bé trên hành trình tuổi thơ, giúp con rèn luyện thể lực, phát triển sự tự tin và lưu giữ những kỷ niệm đáng nhớ mỗi ngày.	2690000	percentage	26	19	22	thép raptor stl 22	trắng, xanh, hồng	0	t	2026-02-11 15:22:13.348449+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One size (22\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "Tr\\u1eafng, xanh, h\\u1ed3ng"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Raptor STL 22"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Raptor STL"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU, Single Wall, 28H, Scharder Valve"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "22x1.75"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "22.2x580mm STL"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "22.2x300mm ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "25.4x250mm STL"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Raptor"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Front: U-Brake Rear: Band Brake"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "16T, Single Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "Single Speed"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "36x160mm STL"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
36	Xe Đạp Trẻ Em Youth RAPTOR Hola 18 - Phanh Đĩa, Bánh 18 Inches	SPYAS4RS1M	1	1	**Xe Đạp Trẻ Em Youth RAPTOR Hola 18 - Phanh Đĩa, Bánh 18 Inches**\n\nKhi lựa chọn một chiếc xe đạp phù hợp cho con, phụ huynh không chỉ tìm kiếm sự an toàn mà còn mong muốn khơi dậy tinh thần khám phá và phát triển thể chất cho trẻ. Xe đạp trẻ em RAPTOR Hola 18 là sự kết hợp hoàn hảo giữa thiết kế hiện đại, chất lượng vượt trội và màu sắc trẻ trung, hứa hẹn sẽ là người bạn đồng hành lý tưởng cho bé trong hành trình khám phá thế giới xung quanh.\n\n**THIẾT KẾ HIỆN ĐẠI, PHÙ HỢP VỚI TRẺ TỪ 5 – 8 TUỔI**\n\nRAPTOR Hola 18 được thiết kế dành cho trẻ từ 5 đến 8 tuổi, với chiều cao từ 110cm đến 130cm. Khung xe được làm từ thép cao cấp, đảm bảo độ bền và khả năng chịu lực tốt, giúp bé yên tâm khi sử dụng. Bánh xe 18 inch cùng lốp cao su 18x2.125 mang lại sự ổn định và êm ái trên mọi địa hình, từ đường phố đến công viên.\n\n**AN TOÀN TUYỆT ĐỐI VỚI HỆ THỐNG PHANH ĐĨA CƠ**\n\nAn toàn luôn là ưu tiên hàng đầu khi chọn xe đạp cho trẻ. RAPTOR Hola 18 được trang bị hệ thống phanh đĩa cơ, giúp bé dễ dàng kiểm soát tốc độ và dừng xe một cách an toàn. Tay phanh được thiết kế phù hợp với bàn tay nhỏ của trẻ, giúp bé sử dụng dễ dàng và hiệu quả.\n\n**MÀU SẮC TRẺ TRUNG, KHƠI DẬY NIỀM VUI ĐẠP XE**\n\nVới ba lựa chọn màu sắc: Trắng Xanh, Đen Cam và Xám Vàng, RAPTOR Hola 18 không chỉ là phương tiện di chuyển mà còn là món đồ chơi yêu thích của bé. Màu sắc tươi sáng, bắt mắt giúp bé tự tin và hứng thú hơn khi đạp xe, từ đó khuyến khích bé vận động và phát triển thể chất.\n\n**THIẾT KẾ THÂN THIỆN, HỖ TRỢ PHÁT TRIỂN TƯ THẾ ĐÚNG**\n\nGhi đông và yên xe được thiết kế theo chuẩn công thái học, giúp bé có tư thế ngồi đúng, hỗ trợ phát triển cột sống và chiều cao. Yên xe có thể điều chỉnh độ cao, phù hợp với sự phát triển của bé qua từng giai đoạn.\n\n**DỄ DÀNG LẮP RÁP VÀ BẢO DƯỠNG**\n\nRAPTOR Hola 18 được thiết kế để phụ huynh có thể dễ dàng lắp ráp và bảo dưỡng. Các bộ phận như bánh xe, yên xe và ghi đông có thể điều chỉnh linh hoạt, giúp xe luôn phù hợp với bé trong suốt quá trình phát triển.\n\nNếu bạn đang tìm kiếm một chiếc xe đạp vừa an toàn, bền bỉ, lại mang thiết kế hiện đại và màu sắc bắt mắt cho bé yêu, thì RAPTOR Hola 18 chính là lựa chọn hoàn hảo. Hãy để bé yêu của bạn trải nghiệm cảm giác đạp xe mượt mà, tăng tốc nhanh và phanh chắc tay cùng RAPTOR Hola 18 ngay hôm nay. \n\nHiện nay, mẫu Xe Đạp Trẻ Em Youth RAPTOR Hola 18 – Phanh Đĩa, Bánh 18 Inches đang được bày bán tại hệ thống cửa hàng Xedap.vn, với mức giá tốt và nhiều ưu đãi hấp dẫn. Để sở hữu chiếc xe đạp tuyệt vời này, bạn hãy truy cập ngay website https://xedap.vn/ hoặc liên hệ qua số Hotline 18009473 để được tư vấn và đặt mua sản phẩm.	2690000	percentage	18	20	18	thép raptor stl 18	vàng xám, cam đen, trắng xanh	0	t	2026-02-11 15:31:02.623896+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One size (18\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "V\\u00e0ng x\\u00e1m, cam \\u0111en, tr\\u1eafng xanh"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Th\\u00e9p Raptor STL18"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Raptor STL 18x80mm"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "Single Wall, 28H, Scharder Valve"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "Bi c\\u00f4n"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "28H"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "18x2.125"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "31.8x580mm STL"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "31.8x50mm ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "28.6x250mm STL"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Raptor"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Mechanical Disc"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "16T, Single Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "1/2x3/32x104L"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "36x140mm STL"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
29	Xe Đạp Đua Đường Trường Road LIV Enviliv Advanced Pro 1 - Phanh Đĩa, Bánh 700C - 2026	SP5A67PARO	3	5	**Xe Đạp Đua Đường Trường LIV Enviliv Advanced Pro 1 (2026) – Nữ Hoàng Tốc Độ Thế Hệ Mới**\nLIV Enviliv Advanced Pro 1 không chỉ là một chiếc xe đạp, đó là một tuyên ngôn về tốc độ và sức mạnh dành riêng cho phái đẹp. Được thiết kế với triết lý "Liv’s 3F" (Fit, Form, Function), phiên bản 2026 mang đến sự cân bằng hoàn hảo giữa trọng lượng siêu nhẹ, độ cứng vượt trội và khả năng xé gió đỉnh cao.\n\n**Những đặc điểm đột phá trên phiên bản 2026:**\nKhung Advanced-grade Composite: Sử dụng vật liệu carbon cao cấp giúp tối ưu hóa tỷ lệ độ cứng trên trọng lượng. Khung xe được thiết kế theo công nghệ AeroSystem Shaping, giúp giảm thiểu tối đa lực cản không khí ở mọi góc độ.\n\nHệ thống truyền động điện tử: Trang bị bộ truyền động Shimano Ultegra Di2 12-speed (hoặc tương đương tùy phiên bản), mang lại khả năng chuyển số chính xác tuyệt đối, nhanh chóng chỉ với một lần chạm nhẹ.\n\nCông nghệ điều khiển OverDrive Aero: Hệ thống ống đầu và phuộc carbon được thiết kế đồng bộ, không chỉ giúp xe đi dây âm toàn phần cực kỳ gọn gàng mà còn tăng độ chính xác khi vào cua ở tốc độ cao.\n\nBánh bộ Carbon Giant SLR 1 50: Cặp bánh carbon với độ cao vành 50mm giúp duy trì đà tốc độ tốt trên đường bằng, đồng thời vẫn đủ nhẹ để bạn không gặp khó khăn khi gặp những con dốc dài.\n\nThiết kế dành riêng cho nữ giới: Từ yên xe Liv Sylvia đến chiều rộng ghi-đông và chiều dài đùi đĩa, tất cả đều được tính toán dựa trên dữ liệu giải phẫu học của phụ nữ, mang lại sự thoải mái tối đa trong những chặng đua dài.\n\n**Tại sao phái đẹp nên chọn LIV Enviliv Advanced Pro 1?**\nNếu bạn là một nữ cua-rơ đang tìm kiếm sự hoàn hảo để chinh phục các giải đấu Triathlon hay các chặng đua đường trường tốc độ cao, Enviliv Advanced Pro 1 chính là người đồng hành không thể thay thế. Với màu sắc thời thượng của năm 2026 và công nghệ hàng đầu, chiếc xe này sẽ giúp bạn bứt phá mọi giới hạn cá nhân.\n\n**Gợi ý từ bike store: **Dòng xe này thường có số lượng giới hạn tại thị trường Việt Nam. Hãy liên hệ ngay để được tư vấn chọn Size (XXS, XS, S, M) phù hợp nhất với chiều cao của bạn.	111990000	percentage	0	9	50	cacbon Advanced-grade Composite	xanh nhạt	2	t	2026-02-09 10:21:54.21906+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "XS"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "Xanh nh\\u1ea1t"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Advanced-grade composite, 12x142mm thru-axle, disc"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Advanced SL-grade Composite, full-composite OverDrive Aero steerer, 12x100mm thru-axle, disc"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "Liv Contact SLR Aero"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "Giant Contact SL Aero, OverDrive Aero"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "Giant Vector, composite, -5/+15mm offset"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Liv Alacra SL"}, {"ten": "TAY TH\\u1eaeNG/BRAKE LEVERS", "gia_tri": "Shimano 105 Di2"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "Shimano 105 Di2"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "Shimano 105 Di2 FD-R7150"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "Shimano 105 Di2 RD-R7150"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Shimano 105 Di2 hydraulic, Shimano RT-CL700 rotors, [F] 160mm, [R]140mm"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "Shimano 105, 12-speed, 11x34"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "KMC X12L-1"}, {"ten": "GI\\u00d2 DI\\u0303A/CRANKSET", "gia_tri": "Shimano 105, 36/52 with Giant Power Pro power meter"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "Giant SLR 1 50 Carbon Disc WheelSystem, [F] 50mm, [R] 50mm"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "CADEX Classic ho\\u1eb7c Giant Gavia Course 0, 700x25C, Tubeless"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "[F] Giant Low Friction Hub, CenterLock, 12mm thru-axle, [R] Giant Low Friction Hub, 30T ratchet driver, CenterLock, 12mm thru-axle"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "SAPIM CX-Ray"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "Shimano, press fit"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
37	Xe Đạp Trẻ Em Youth RAPTOR Hola 20B - Phanh Đĩa, Bánh 20 Inches	SPQ78MPJ79	1	1	**Xe Đạp Trẻ Em Youth RAPTOR Hola 20B - Phanh Đĩa, Bánh 20 Inches.**\n\nYouth RAPTOR Hola 20B là mẫu xe đạp trẻ em lý tưởng dành cho các bé trong độ tuổi từ 6 đến 10, sở hữu thiết kế hiện đại, khung chắc chắn và phanh đĩa an toàn. Với bánh 20 inches tiêu chuẩn và khung thép Raptor STL cứng cáp, xe mang lại trải nghiệm lái mượt mà và ổn định trên nhiều dạng địa hình khác nhau.\n\nXe được trang bị phuộc trước Raptor STL 20x80mm giúp hấp thụ chấn động nhẹ hiệu quả, nâng cao độ êm ái khi di chuyển. Bộ vành xe dạng Single Wall 28H kết hợp với lốp xe 20x2.125 mang lại khả năng bám đường tốt, phù hợp cho cả các con đường trong khu dân cư lẫn công viên.\n\n\n\nHệ thống phanh đĩa cơ được trang bị cho cả bánh trước và sau, đảm bảo lực hãm mạnh và chính xác, tăng cường sự an toàn trong quá trình điều khiển xe. Xe sử dụng bạc đạn cho cả đùm và trục giữa , giúp bánh xe quay nhẹ và bền bỉ theo thời gian.\n\n\n\nXe được thiết kế đơn giản với bộ truyền động single speed gồm giò dĩa 36 răng, chiều dài tay dên 155mm cùng líp sau 16T, phù hợp với thể lực của trẻ em, giúp bé dễ dàng điều khiển mà không cần thao tác chuyển số phức tạp.\n\n\n\nPhần ghi đông kích thước 31.8x580mm kết hợp với pô tăng 31.8x50mm bằng nhôm và cốt yên 28.6x250mm bằng thép, tạo nên tư thế ngồi thoải mái, hỗ trợ tối đa cho quá trình học đạp và luyện tập lâu dài. Bộ yên RAPTOR thiết kế ôm sát giúp trẻ ngồi chắc chắn và không bị trượt khi đạp xe.\n\nYouth RAPTOR Hola 20B hiện có 3 màu sắc nổi bật: White Blue, Grey Yellow và Black Orange, dễ dàng lựa chọn theo sở thích của bé. \n\nNếu bạn đang tìm kiếm một chiếc xe đạp trẻ em thực sự đáng tin cậy, thiết kế đẹp, chất lượng cao và an toàn cho bé? RAPTOR Hola 20B chính là món quà tuyệt vời nhất để bắt đầu hành trình khám phá của con bạn. Hiện nay, mẫu Xe Đạp Trẻ Em Youth RAPTOR Hola 20B - Phanh Đĩa, Bánh 20 Inches đang được bày bán tại hệ thống cửa hàng Xedap.vn, với mức giá tốt và vô vàn ưu đãi hấp dẫn. Để sở hữu chiếc xe đạp cực “ngầu” này cho bé yêu, \n	2890000	percentage	20	20	20	thép raptor stl 20	cam đen, trắng xanh, xam vàng	0	t	2026-02-11 15:40:29.186938+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One size (20\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "Cam \\u0111en, tr\\u1eafng xanh, xam v\\u00e0ng"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Th\\u00e9p Raptor STL 20"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Raptor STL 20x80mm"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "Single Wall, 28H, Scharder Valve"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "28H"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "20x2.125"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "31.8x580mm STL"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "31.8x50mm ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "31.8x50mm ALU"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Raptor"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Mechanical Disc"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "16T, Single Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "1/2x3/32x104L"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "36x155mm STL"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
39	Xe Đạp Trẻ Em Youth RAPTOR Lily - Bánh 20 Inches	SPM67F9ACP	1	1	**Xe Đạp Trẻ Em Youth RAPTOR Lily – Bánh 20 Inches**\nYouth RAPTOR Lily – Bánh 20” là mẫu xe đạp được thiết kế dành riêng cho các bé trong độ tuổi tiểu học đang phát triển khả năng vận động và bắt đầu khám phá thế giới xung quanh. Với thiết kế tinh tế, cấu hình đơn giản mà hiệu quả, RAPTOR Lily mang đến sự kết hợp hoàn hảo giữa tính thẩm mỹ, độ bền và an toàn cho trẻ em trong giai đoạn năng động nhất.\n\n**Thiết kế xe đạp RAPTOR Lily – Linh hoạt, bền bỉ, thân thiện với trẻ nhỏ**\nKhung xe Raptor STL 20 chắc chắn, được chế tạo từ thép chịu lực tốt, đảm bảo độ ổn định và an toàn khi sử dụng hằng ngày. Xe có hai màu Green và Beige dịu mắt, phù hợp với cả bé trai lẫn bé gái, tạo cảm giác thích thú và tự tin mỗi khi bé ra đường cùng chiếc xe yêu thích của mình.\n\n**Bánh xe 20 inch** – phù hợp độ tuổi tiểu học\nBánh xe OUCYS 20x1.75 có tiết diện vừa đủ để đảm bảo khả năng cân bằng và bám đường tốt, giúp bé di chuyển mượt mà trên các bề mặt đường khác nhau từ công viên đến sân trường. Vành xe hợp kim nhôm Single Wall 28H vừa nhẹ vừa bền, phù hợp với thể lực của trẻ em mà vẫn đảm bảo độ ổn định khi đạp xe lâu.\n\n**Hệ thống phanh an toàn, dễ thao tác**\nXe sử dụng phanh U trước và phanh band phía sau – một lựa chọn an toàn và phổ biến cho trẻ ở độ tuổi tiểu học. Thiết kế này giúp bé dễ dàng kiểm soát tốc độ, đồng thời rèn luyện phản xạ xử lý trong các tình huống đơn giản khi lưu thông trong khu phố hoặc sân chơi.\n\n**Tư thế ngồi thoải mái, hỗ trợ phát triển tư thế chuẩn**\nGhi đông rộng 560mm cho góc đánh lái linh hoạt và dễ điều khiển, trong khi cốt yên dài 250mm dễ dàng điều chỉnh độ cao phù hợp với vóc dáng từng bé. Bộ giò dĩa 36 răng đi kèm líp đơn 16T giúp xe vận hành nhẹ nhàng, ít tốn sức – rất lý tưởng cho những chuyến đi học buổi sáng hoặc dạo chơi cuối tuần.\n\n**Xe Đạp Trẻ Em Youth RAPTOR Lily sẽ là sự lựa chọn tuyệt vời cho:**\n\nTrẻ từ 6 đến 9 tuổi, có chiều cao từ 1m15 – 1m35, đang muốn rèn luyện kỹ năng đi xe đạp một cách thành thạo.\n \nPhụ huynh đang tìm một chiếc xe bền, an toàn và dễ sử dụng cho bé yêu, giúp trẻ vận động lành mạnh, tránh xa thiết bị điện tử.\n \nNhững bé đã làm quen với xe bánh phụ và muốn chuyển sang xe hai bánh thực thụ để đi học hoặc chơi cùng bạn bè.\n\nHãy lựa chọn RAPTOR Lily để bé yêu của bạn thêm yêu thích vận động và phát triển kỹ năng tự lập từ sớm! 	2590000	percentage	23	17	20	thép raptor stl 20	xanh, hồng nhạt	0	t	2026-02-11 16:00:46.671127+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One Size (20\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "Xanh, h\\u1ed3ng nh\\u1ea1t"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Raptor STL 20"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Raptor STL 20x100mm"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU, Single Wall, 28H, Scharder Valve"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "OUCYS 20x1.75"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "22.2x560mm STL"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "22.2x300mm ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "25.4x250mm STL"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Raptor"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Front: U-Brake Rear: Band Brake"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "16T, Single Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "Single Speed"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "36x160mm STL"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
40	Xe Đạp Trẻ Em Youth MISAKI Kitty 2 - Bánh 14 Inches	SPCP1AJVED	1	6	**Xe Đạp Trẻ Em Youth MISAKI Kitty 2 – Bánh 14 Inches**\nYouth MISAKI Kitty 2 – Bánh 14” là mẫu xe đạp lý tưởng dành cho các bé từ 3 đến 5 tuổi đang trong giai đoạn làm quen với việc đạp xe. Với thiết kế dễ thương, khung xe chắc chắn và chiều cao phù hợp, chiếc xe này không chỉ mang đến niềm vui vận động mà còn giúp bé phát triển khả năng giữ thăng bằng và rèn luyện sự tự tin từ những vòng quay đầu tiên.\n\nThiết kế khung thép chắc chắn, phù hợp với trẻ nhỏ\nKhung xe MISAKI STL 14 được thiết kế chuyên biệt cho trẻ nhỏ với kích thước nhỏ gọn và trọng lượng tối ưu, giúp bé dễ dàng điều khiển. Màu sắc tươi tắn gồm Grey, Green, Pink không chỉ phù hợp với sở thích của nhiều bé mà còn giúp xe trở thành món quà lý tưởng cho các dịp sinh nhật hoặc đầu năm học mới.\n\nBánh xe 14 inch – Vừa vặn cho bước khởi đầu\nVới bánh xe kích thước 14x2.125 inches, MISAKI Kitty 2 mang lại khả năng bám đường tốt, ổn định trong quá trình di chuyển. Bộ vành nhôm Single Wall 20H giúp giảm trọng lượng xe, đồng thời đảm bảo độ bền trong quá trình sử dụng thường xuyên.\n\n**Hệ thống phanh an toàn, dễ kiểm soát**\nXe trang bị hệ thống phanh U phía trước và phanh band phía sau, cho lực hãm vừa đủ, giúp bé dễ kiểm soát tốc độ khi di chuyển trong khuôn viên nhà hoặc công viên. Đây là lựa chọn an toàn, phù hợp với lứa tuổi nhỏ đang học cách xử lý tình huống khi lái xe.\n\nCác bộ phận hỗ trợ tối đa sự thoải mái và tư thế ngồi đúng\nGhi đông STL rộng 480mm và yên xe thiết kế êm ái tạo tư thế ngồi thoải mái cho bé trong suốt quá trình sử dụng. Giò dĩa 28T đi kèm hệ thống líp đơn 16T đơn giản, dễ đạp, không gây rối hay khó hiểu với trẻ.\n\nHãy sở hữu ngay mẫu xe đạp trẻ em MISAKI Kitty 2 để bé yêu có những trải nghiệm vui vẻ, năng động và an toàn trong mỗi hành trình đầu đời! 	1990000	percentage	25	13	14	thép Misaki STL 14	xanh, xám, hồng	0	t	2026-02-11 16:08:31.0524+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One Size (14\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "Xanh, x\\u00e1m, h\\u1ed3ng"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Misaki STL 14"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Misaki STL"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU, Single Wall, 20H, Scharder Valve"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "Th\\u00e9p, bi c\\u00f4n"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "14x2.125"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "22.2x480mm STL"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "22.2x150mm ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "25.4x150mm STL"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Misaki"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Front: U-Brake Rear: Band Brake"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "16T, Single Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "1/2x1/8x60L"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "28Tx10mm STL"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
41	Xe Đạp Trẻ Em Youth MISAKI Chino 2 – Bánh 14 Inches	SPH6YG582U	1	6	**Xe đạp trẻ em Youth MISAKI Chino 2** (phiên bản bánh 14 inches) được thiết kế chuyên biệt cho các bé mới bắt đầu tập đi xe, chú trọng vào sự chắc chắn và vẻ ngoài dễ thương.\n\nDưới đây là thông số kỹ thuật chi tiết dựa trên dòng sản phẩm MISAKI Chino dành cho trẻ em:\n\n**Thông số chung**\nKích cỡ bánh: 14 inches.\n\nĐộ tuổi phù hợp: Từ 2 đến 5 tuổi.\n\nĐối tượng: Các bé mới bắt đầu làm quen với việc đạp xe.\n\nChi tiết cấu tạo\nChất liệu khung: Hợp kim thép cao cấp (giúp xe chắc chắn nhưng vẫn đảm bảo trọng lượng phù hợp để bé dễ điều khiển).\n\nHệ thống phanh: Thường trang bị kết hợp phanh chữ U (phía trước) và phanh băng/phanh đùm (phía sau) để đảm bảo an toàn tối đa cho trẻ.\n\nYên xe: Thiết kế mềm mại, có thể điều chỉnh độ cao để phù hợp với sự phát triển chiều cao của bé qua từng giai đoạn.\n\nBánh phụ: Trang bị hai bánh phụ hai bên giúp bé giữ thăng bằng tốt khi mới tập; có thể tháo rời khi bé đã tự tin cầm lái.\n\nTiện ích đi kèm: Thường bao gồm giỏ xe phía trước, chắn bùn trước/sau và ốp bảo vệ sên (xích) để tránh vấy bẩn hoặc kẹt quần áo của bé.\n\nThiết kế\nMàu sắc: Đa dạng với các tông màu tươi tắn (như Teal, hồng, trắng...) kèm họa tiết trang trí ngộ nghĩnh.\n\nTay lái: Thiết kế vừa vặn với tầm tay trẻ em, tích hợp tay nắm chống trượt.\n\nMẫu xe này hiện được phân phối chính hãng bởi các hệ thống như Xedap.vn hoặc AEON Mall, rất phù hợp để làm quà tặng giúp bé phát triển kỹ năng vận động và sự tự tin.	2640000	percentage	47	15	14	hợp kim cao cấp	vàng nhạt, xanh, trắng xanh, xám cam	0	t	2026-02-11 16:26:42.266291+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One size (14\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "V\\u00e0ng nh\\u1ea1t, xanh, tr\\u1eafng xanh, x\\u00e1m cam"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Misaki ALU 14"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Misaki ALU"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU, Single Wall, 28H, Scharder Valve"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "Th\\u00e9p, bi c\\u00f4n"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "28H"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "18x2.125"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "22.2x520mm STL"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "22.2x150mm ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "25.4x180mm STL"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Misaki"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Front: U-Brake Rear: Band Brake"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "18T, Single Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "1/2x1/8x78L"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "28Tx110mm STL"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
43	Xe Đạp Trẻ Em Youth MISAKI Chino 1 – Bánh 12 Inches	SPC6P4FTO6	1	6	Tiếp nối phong cách chuyên nghiệp và bắt mắt, đây là mẫu mô tả sản phẩm cho dòng **Xe Đạp Trẻ Em Youth MISAKI Chino 1 – Bánh 12 Inches.**\n\nDòng xe này mang hơi hướng Nhật Bản với thiết kế thanh lịch, tối giản nhưng cực kỳ bền bỉ, rất phù hợp làm "người bạn đồng hành đầu đời" cho các bé nhỏ.\n\n🚲 **Xe Đạp Trẻ Em Youth MISAKI Chino 1 – Khởi Đầu Vững Chắc Cho Bé Yêu**\nNếu bạn đang tìm kiếm một chiếc xe đạp vừa an toàn, vừa mang nét thẩm mỹ tinh tế cho bé từ 2 - 4 tuổi, thì MISAKI Chino 1 chính là lựa chọn hoàn hảo. Với kích thước bánh 12 inches nhỏ gọn, xe giúp bé dễ dàng làm quen với việc giữ thăng bằng và vận động ngoài trời một cách tự tin nhất.\n\n✨ Những Điểm Nổi Bật Của MISAKI Chino 1\nThiết kế phong cách Nhật Bản: Khác với những dòng xe rực rỡ thông thường, MISAKI Chino 1 mang vẻ đẹp cổ điển, sang trọng với các gam màu trung tính, trang nhã, phù hợp cho cả bé trai và bé gái.\n\nKhung xe hợp kim siêu bền: Được chế tạo từ thép cường lực chịu lực tốt, đảm bảo độ ổn định tuyệt đối khi bé di chuyển. Lớp sơn tĩnh điện cao cấp giúp xe luôn bền màu và chống trầy xước hiệu quả.\n\nHệ thống bánh phụ ổn định: Hai bánh phụ bản rộng, cực kỳ chắc chắn giúp bé hoàn toàn yên tâm khi tập đạp mà không sợ ngã. Ba mẹ có thể dễ dàng tháo rời khi bé đã tự tin thăng bằng.\n\nAn toàn tuyệt đối: * Phanh tay được thiết kế vừa vặn với lực bóp của trẻ nhỏ, giúp bé kiểm soát tốc độ dễ dàng.\n\nHộp xích bao phủ toàn bộ hệ thống truyền động, đảm bảo an toàn tuyệt đối cho đôi chân của bé.\n\nTiện ích đi kèm: Xe trang bị sẵn giỏ nhựa giả mây (hoặc nhựa cao cấp) cực xinh, chắn bùn trước sau sạch sẽ và chuông nhỏ vui nhộn.\n🌟 Tại sao MISAKI Chino 1 là lựa chọn hàng đầu?\nKích thước hoàn hảo: Bánh 12 inches là kích thước nhỏ nhất, giúp các bé ở độ tuổi mầm non dễ dàng chạm chân xuống đất, tạo cảm giác an tâm khi mới tập xe.\n\nĐộ bền vượt trội: Dòng MISAKI được biết đến với độ hoàn thiện cơ khí tốt, ít hỏng hóc vặt, có thể truyền lại cho em nhỏ sử dụng sau này.\n\nKhơi dậy niềm đam mê vận động: Thiết kế đẹp mắt khiến bé yêu thích chiếc xe ngay từ cái nhìn đầu tiên, từ đó khuyến khích bé rời xa điện thoại để ra ngoài vui chơi.\n\nGợi ý: Xe phù hợp nhất cho các bé có chiều cao từ 85cm đến 105cm.	2490000	percentage	0	15	12	thép misaki stl 12	xanh, trắng xanh, vàng nhạt, xám cam	0	t	2026-02-11 16:42:04.9808+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One size (12\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "Xanh, tr\\u1eafng xanh, v\\u00e0ng nh\\u1ea1t, x\\u00e1m cam"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Misaki ALU 12"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Misaki ALU"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU, Single Wall, 28H, Scharder Valve"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "Th\\u00e9p, bi c\\u00f4n"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "24H"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "18x2.125"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "22.2x520mm STL"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "22.2x150mm ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "25.4x180mm STL"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Misaki"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Front: U-Brake Rear: Band Brake"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "18T, Single Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "1/2x1/8x78L"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "28Tx110mm STL"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
44	Xe Đạp Đường Phố Touring LIV Alight 2 DD Disc – Phanh Đĩa, Bánh 700C – 2022	SPVWZ4HBEG	9	5	**LIV Alight 2 DD Disc 2022 – Nhẹ nhàng, linh hoạt cho di chuyển hằng ngày**\nLIV Alight 2 DD Disc 2022 là mẫu xe đạp đường phố – fitness dành cho nữ, phù hợp cho nhu cầu đi làm, đi học, dạo phố hoặc tập luyện nhẹ nhàng mỗi ngày. Thiết kế xe hướng đến sự thoải mái, dễ điều khiển và an toàn khi di chuyển trong đô thị.\n\n**Khung xe sử dụng nhôm ALUXX-Grade Aluminum** cao cấp giúp xe nhẹ, bền và dễ kiểm soát. Kết hợp cùng phuộc nhôm ALUXX hỗ trợ phanh đĩa, xe mang lại cảm giác đạp ổn định, linh hoạt ngay cả khi đi trên đường gồ ghề hoặc vào cua.\n\nXe được trang bị bộ **bánh 700C Giant GX Disc Wheelset cùng lốp Giant S-X2 700x38c** chống đâm thủng, giúp xe lăn êm, bám đường tốt và giảm rung xóc hiệu quả. Đây là lợi thế lớn khi di chuyển trên đường phố hoặc những cung đường có mặt đường không bằng phẳng.\n\nTư thế đạp được tối ưu cho nữ giới với ghi đông, pô tăng và cốt yên Giant Sport, kết hợp yên Ergo Contact êm ái, giúp người đạp giữ dáng ngồi thẳng, hạn chế mỏi lưng, vai và cổ tay khi sử dụng xe trong thời gian dài.\n\nBộ truyền động **Shimano 2x8** tốc độ mang lại khả năng sang số mượt, dễ sử dụng và đáp ứng tốt nhiều điều kiện di chuyển khác nhau, từ đường bằng trong thành phố đến các đoạn dốc nhẹ. Cấu hình này phù hợp cả với người mới tập đạp lẫn người đã quen sử dụng xe đạp.\n\nTrang bị phanh đĩa dầu Tektro HD-R280 giúp xe có lực phanh mạnh, ổn định và an toàn hơn trong mọi điều kiện thời tiết, đặc biệt khi đi mưa hoặc cần phanh gấp trong môi trường đô thị đông xe.\n\nNhìn chung, **LIV Alight 2 DD Disc 2022** là lựa chọn lý tưởng cho nữ giới đang tìm kiếm một chiếc xe đạp nhẹ, dễ đạp, an toàn và bền bỉ, phù hợp cho việc di chuyển và rèn luyện sức khỏe mỗi ngày.	12590000	percentage	0	10	30	nhôm ALUXX-Grade Aluminum	tím, xanh	0	t	2026-02-11 17:06:29.076672+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "XS"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "T\\u00edm, xanh"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "ALUXX-Grade Aluminum"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "ALUXX-Grade Aluminum fork, disc"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "Giant GX Disc Wheelset"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "Alloy disc, 32h"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "Stainless, 14g"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Giant S-X2, puncture protect, 700x38c"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "Giant Sport, 31.8mm"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "Giant Sport, 7 degree, alloy"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "Giant Sport, 27.2mm"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Ergo Contact"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Urban fitness"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "Shimano SL-M315 2\\u00d78"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "Shimano Tourney 2-speed"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "Shimano Altus 8-speed"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Tektro HD-R280 hydraulic disc"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "Shimano Hyperglide HG, 11\\u00d734, 8-speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "KMC Z8"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "Forged alloy, 30/46, 2-speed"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "Cartridge"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}, {"ten": "TAY TH\\u1eaeNG/BRAKE LEVERS", "gia_tri": "Tektro, hydraulic"}]
45	Xe Đạp Gấp Folding JAVA Volta-7S - Phanh Đĩa, Bánh 16Inch	SP9GP72DJY	5	3	**Xe Đạp Gấp Folding JAVA Volta-7S** – Gọn nhẹ, linh hoạt cho di chuyển đô thị\nJAVA Volta-7S là mẫu xe đạp gấp hướng đến nhu cầu di chuyển linh hoạt trong đô thị, phù hợp cho người đi làm, sinh viên hoặc người cần một chiếc xe nhỏ gọn để mang theo khi đi xe buýt, ô tô hoặc cất trữ trong không gian hẹp.\n\n**Khung và phuộc Java ALU** giúp xe có trọng lượng nhẹ nhưng vẫn đảm bảo độ cứng và độ bền cần thiết. Thiết kế gấp gọn cho phép người dùng dễ dàng gấp – mở nhanh chóng, thuận tiện khi mang vác hoặc cất giữ tại nhà, văn phòng.\n\nXe sử dụng bánh 16 inch với **vành nhôm Decaf Cativa double wall 30mm**, kết hợp đùm nhôm bạc đạn và căm 24 lỗ, giúp bánh xe chắc chắn, lăn êm và ổn định khi di chuyển trong thành phố. Lốp Innova 16x1-3/8 cho cảm giác nhẹ, dễ tăng tốc, phù hợp với quãng đường ngắn đến trung bình.\n\nTư thế đạp được thiết kế gọn gàng và thoải mái với ghi đông nhôm 540mm, cốt yên nhôm dài giúp điều chỉnh linh hoạt theo chiều cao người dùng. Yên Java và bàn đạp bản lớn mang lại cảm giác ổn định khi đạp xe hằng ngày.\n\n**JAVA Volta-7S** được trang bị bộ truyền động 7 tốc độ với tay đề SL-RV200 và chuyển líp TY-21B, giúp người đạp dễ dàng thay đổi tốc độ khi đi phố, leo dốc nhẹ hoặc tăng tốc trên đoạn đường bằng. Giò đĩa nhôm 52T hỗ trợ đạp nhẹ và duy trì tốc độ ổn định.\n\nHệ thống phanh đĩa dầu mang lại lực phanh mạnh, phản hồi nhanh và an toàn hơn khi di chuyển trong điều kiện đường đông xe hoặc thời tiết không thuận lợi, là điểm nổi bật so với nhiều mẫu xe gấp phổ thông.\n\nTổng thể, JAVA Volta-7S là lựa chọn phù hợp cho người đang tìm kiếm một chiếc xe đạp gấp nhẹ, tiện lợi, dễ sử dụng và an toàn, đáp ứng tốt nhu cầu di chuyển linh hoạt trong đô thị hiện đại	7790000	percentage	10	15	16	hơp kim nhôm Java ALU	bạc, trắng, đen	0	t	2026-02-11 17:18:01.187724+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One size (16\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "B\\u1ea1c, tr\\u1eafng, \\u0111en"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Java ALU"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Java ALU"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "Decaf Cativa ALU 30mm, Double Wall, 24H, Presta Valve"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "ALU, b\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "24H"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Innova 16x1*3/8"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "25.4x540mm ALU"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "31.8x550mm ALU"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Java"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "SL-RV200, 7 Speed"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "1 Speed"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "TY-21B, 7 Speed"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Hyraudlic Disc"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "ATA 14-28T, 7 Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "7 Speed"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "52Tx170mm ALU"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
46	Xe Đạp Đường Phố Touring JAVA Wahoo City - Phanh Đĩa, Bánh 700C	SPY2MGQPGU	9	3	**Xe Đạp Đường Phố Touring JAVA Wahoo City – Phanh Đĩa, Bánh 700C**\nTinh tế – Mạnh mẽ – Linh hoạt trong từng chuyển động\n\n**JAVA Wahoo City** là mẫu xe đạp đường phố được thiết kế dành riêng cho nhu cầu di chuyển hằng ngày trong thành phố – từ đi làm, đi học cho đến luyện tập thể dục. Xe mang kiểu dáng tối giản, hiện đại với ba màu sắc thời thượng: Cát (Sand), Xám (Grey) và Trắng (White) – phù hợp với nhiều phong cách cá nhân.\n\n**Khung xe nhẹ – bền – chống gỉ**\nToàn bộ khung và phuộc xe được làm từ hợp kim nhôm cao cấp Java ALU, giúp xe vừa nhẹ, dễ điều khiển, vừa bền chắc theo thời gian. Thiết kế khung mang lại cảm giác thanh thoát, thoải mái khi di chuyển trong thành phố.\n\n**Bánh xe 700C – Lướt êm, chạy khỏe**\nXe sử dụng lốp Compass 700×32C phù hợp với địa hình đô thị, mang lại cảm giác di chuyển mượt mà và tiết kiệm sức lực. Vành nhôm hai lớp ALU 25mm, kết hợp với van Presta giúp xe vận hành ổn định ở tốc độ cao và dễ dàng bảo dưỡng.\n\n**Phanh đĩa thủy lực – An toàn trong mọi điều kiện thời tiết**\nTrang bị hệ thống phanh đĩa thủy lực (Hydraulic Disc) hiện đại, JAVA Wahoo City mang lại hiệu suất phanh mạnh mẽ, ổn định, kể cả khi đi dưới mưa hoặc đường trơn trượt.\n\n**Thiết kế công thái học – Thoải mái khi sử dụng lâu dài**\nTay lái, pô tăng và cốt yên đều bằng hợp kim nhôm, có kích thước tiêu chuẩn: ghi đông 600mm, pô tăng 80mm, cốt yên 350mm – hỗ trợ người lái có tư thế ngồi cân bằng và thoải mái. \n\nYên xe Java kiểu thể thao được thiết kế để ngồi lâu không mỏi. Bàn đạp dạng Black ALU Platform giúp chống trượt hiệu quả, đặc biệt hữu ích trong điều kiện thời tiết ẩm ướt.\n\n**Bộ truyền động 9 tốc độ – Mượt mà, dễ điều khiển**\nXe được trang bị bộ truyền động LTWOO A5 9 tốc độ, kết hợp cùng giò đĩa Decaf 46T, líp 13-32T và sên T9 – giúp người dùng dễ dàng chuyển số, thích nghi tốt với nhiều dạng địa hình trong thành phố từ bằng phẳng đến dốc nhẹ.\n\n**JAVA Wahoo City** là chiếc xe đạp touring lý tưởng cho cuộc sống năng động mỗi ngày. Nhẹ – bền – linh hoạt, xe sẵn sàng đồng hành cùng bạn trên mọi nẻo đường thành phố, dù là đi học, đi làm hay rèn luyện sức khỏe. Hãy để chiếc xe này nâng tầm trải nghiệm đạp xe của bạn!	7490000	percentage	6	10	30	hợp kim nhôm java alu	vàng cát, xám, trắng	0	t	2026-02-12 06:07:37.201566+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "S"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "v\\u00e0ng c\\u00e1t, x\\u00e1m, tr\\u1eafng"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Java ALU"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Java ALU"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU 25mm, Double Wall, 32H, Presta Valve"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Compass 700x32C"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "31.8x600mm ALU"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "31.8x80mm ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "30.6x350mm ALU"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Java"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Black ALU Platform"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "LTWOO A5, 9 Speed"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "LTWOO A5, 9 Speed"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Hydraulic Disc"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "13-32T, 9 Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "T9 9 Speed"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "Decaf 46Tx170mm ALU"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
47	Xe Đạp Đường Phố Touring JAVA Veloce City - Phanh Đĩa, Bánh 700C	SPLY1E3TDA	9	3	**Xe Đạp Đường Phố Touring JAVA Veloce City - Phanh Đĩa, Bánh 700C**\n\nMột buổi sáng trong lành, bạn lướt qua những con phố dài, cảm nhận sự tự do trong từng vòng bánh – đó chính là cảm giác mà Java Veloce City mang lại. Chiếc xe đạp này không chỉ đơn thuần là phương tiện di chuyển mà còn là một cách để bạn tận hưởng nhịp sống thành thị một cách phong cách, tiện lợi và đầy hứng khởi.\n\n**Những điểm nổi bật của RAPTOR Java ALU Veloce City\nThiết kế hiện đại – tối giản**\nJava ALU mang phong cách thiết kế thanh thoát, tối giản nhưng vẫn toát lên vẻ mạnh mẽ, thể thao. Ba lựa chọn màu sắc White – Black – Titanium mang đến sự tinh tế, dễ phối với nhiều phong cách thời trang khác nhau. Bộ bánh 700C mảnh mai nhưng chắc chắn, tối ưu cho việc lướt phố hoặc đạp đường trường.\n\n**Khung nhôm nhẹ – bền bỉ**\nKhung xe Java ALU được chế tác từ hợp kim nhôm cao cấp, vừa chắc chắn vừa nhẹ, giúp giảm tổng trọng lượng xe, hỗ trợ tăng tốc nhanh và đỡ tốn sức khi đạp đường dài. Đi kèm với ghi đông phẳng 31.8x600mm ALU mang lại tư thế điều khiển cân bằng, thoải mái cho người lái.\n\n**Phuộc trước cứng cáp – phản hồi tốt**\nTrang bị phuộc nhôm cứng cáp giúp tối ưu trọng lượng tổng thể, tăng hiệu suất truyền lực từ bàn đạp ra bánh xe, cho cảm giác lái mượt mà và phản hồi nhạy, đặc biệt phù hợp khi di chuyển trên đường phố hoặc đường nhựa bằng phẳng.\n\n**Hệ truyền động 1x12 – hiện đại, mượt mà**\nJava ALU 12S được trang bị groupset LTWOO AX 1x12 với dải líp 11–42T, giúp người lái có nhiều lựa chọn tỷ số truyền phù hợp cả leo dốc lẫn chạy tốc độ cao. Bộ giò dĩa Decaf 46T kết hợp với xích SUMC 12-speed cho khả năng sang số mượt mà, chính xác, tối ưu hiệu suất đạp.\n\n**Phanh đĩa dầu – an toàn, chính xác**\nHệ thống phanh thủy lực mang đến lực phanh ổn định, độ nhạy cao và kiểm soát tốt trong nhiều điều kiện thời tiết. Đây là lựa chọn hoàn hảo cho những ai đề cao an toàn và hiệu suất dừng xe nhanh chóng.\n\n**Bộ vành 30mm – lốp Hakuba 700x35C**\nVành nhôm đôi 30mm 24H nhẹ nhưng chắc chắn, kết hợp lốp Hakuba 700x35C mang đến khả năng bám đường tốt, vừa êm ái vừa ổn định kể cả khi chạy tốc độ cao.\n \n**Ai nên chọn Raptor Java Veloce City?**\nNgười tìm kiếm một chiếc xe đạp road fitness/urban đa dụng: vừa để đi làm, vừa để tập thể dục.\n \nNgười yêu thích phong cách tối giản, hiện đại, muốn một chiếc xe đẹp để lướt phố.\n \nNgười ưu tiên truyền động 1x đơn giản nhưng hiệu quả, dễ bảo trì, ít rắc rối.\n \nNgười cần hệ thống phanh dầu an toàn và cảm giác đạp mượt, thoải mái trên quãng đường dài.\n \n**Java Veloce City** không chỉ là một chiếc xe đạp – nó là lựa chọn cho những ai muốn nâng tầm trải nghiệm di chuyển hằng ngày. Từ những chuyến đạp nhẹ nhàng buổi sáng đến những chặng đường tập luyện nghiêm túc, chiếc xe này mang đến sự tự tin, tốc độ và cảm hứng cho mọi hành trình.	8990000	percentage	6	12	30	hợp kim nhôm java alu	bạc, trắng, đen	0	t	2026-02-12 06:17:23.349287+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "S"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "B\\u1ea1c, tr\\u1eafng, \\u0111en"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Java ALU"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Java ALU"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU 30mm, Double Wall, 24H, Presta Valve"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Hakuba 700x35C"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "31.8x600mm ALU"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "31.8x80mm ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "30.6x350mm ALU"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Java"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Black ALU Platform"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "LTWOO AX, 12 Speed"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "LTWOO AX, 12 Speed"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Hydraulic Disc"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "Sugek 11-42T, 12 Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "SUMC 12 Speed"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "Decaf 46Tx170mm ALU"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
49	Xe Đạp Địa Hình MTB RAPTOR Hunter 4 - Phanh Đĩa, Bánh 29 Inch	SP8SL2KQ26	2	1	**Xe Đạp Địa Hình MTB RAPTOR Hunter 4 - Phanh Đĩa, Bánh 29 Inch**\n\nĐừng để hành trình của bạn bị giới hạn bởi mặt đường. Với Raptor Hunter 4, bạn có thể tự tin băng qua phố xá đông đúc hay lăn bánh trên những lối mòn đầy thử thách một cách mạnh mẽ, ổn định và tràn đầy hứng khởi để chuyến đi thêm phần trọn vẹn.\n\nNhững điểm nổi bật của RAPTOR Hunter 4\n\nThiết kế thể thao, mạnh mẽ và hiện đại\n\nHunter 4 mang phong cách MTB cứng cáp, khỏe khoắn với 4 gu màu đầy chất chơi: Red/Black, Grey/White, Green, Light Blue/Grey. Khung xe one-size 29 inch phù hợp cho người cao từ 1m65 – 1m85, kết hợp ghi đông ngang 660mm, mang lại tư thế lái ổn định và kiểm soát tốt trong nhiều tình huống.\n\n**Khung nhôm bền vững và chắc chắn**\n\nSử dụng hợp kim nhôm Raptor ALU, Hunter 4 vừa cứng cáp, vừa đảm bảo độ bền và khả năng chịu lực tốt khi đi trên đường gồ ghề. Đây là nền tảng lý tưởng cho một chiếc MTB cân bằng giữa hiệu suất và độ bền. Ngoài ra, chính vì sử dụng hợp kim nhôm để làm khung cho xe nên trọng lượng của xe được giảm đáng kể so với việc sử dụng khung thép giúp việc di chuyển xe trở nên nhẹ nhàng hơn.\n\n**Phuộc nhún 100mm – kiểm soát trên địa hình**\n\nPhuộc Raptor STL hành trình 100mm giúp hấp thụ xung lực và rung chấn từ mặt đường sỏi đá hoặc mòn nhẹ, hỗ trợ người lái duy trì sự thoải mái và an toàn trong suốt hành trình.\n\n**Hệ truyền động 24 tốc độ linh hoạt**\n\nHunter 4 được trang bị hệ thống truyền động 3x8 (24 tốc độ). Bộ số này cho phép chuyển tốc mượt mà, đáp ứng nhu cầu đa dạng từ chạy nhanh trên đường bằng đến leo dốc nhẹ nhàng. Kết hợp bộ líp 13-28T và giò dĩa 170mm 14/87/42T, xe mang lại sự cân bằng giữa khả năng leo dốc, tăng tốc và duy trì tốc độ cao.\n\n**Bánh xe 29 inch – tốc độ và ổn định**\n\nCặp bánh 29x2.125 inch lớn giúp Hunter 4 vượt chướng ngại vật dễ dàng hơn, giữ quán tính lăn tốt và cho cảm giác lái ổn định hơn so với bánh 26 hoặc 27.5 inch. Đây là lợi thế lớn với những ai thường đạp đường dài hoặc thích sự vững vàng khi di chuyển.\n\n**Phanh đĩa cơ an toàn và dễ bảo trì**\n\nHệ thống phanh đĩa cơ đảm bảo khả năng kiểm soát tốc độ ổn định, đặc biệt trong điều kiện đường phố đông đúc hoặc khi cần phanh gấp. Đồng thời, việc bảo dưỡng và thay thế cũng đơn giản, phù hợp với người dùng phổ thông.\n\n**Ai nên chọn Raptor Hunter 4?**\n\nNgười đam mê xe đạp địa hình, muốn trải nghiệm tốc độ và sự ổn định từ bánh 29 inch\n \nNgười cao từ 1m65 – 1m85, cần một chiếc MTB phù hợp thể hình\n \nNgười tìm kiếm một chiếc xe đa dụng: vừa đạp thể thao, vừa đi lại hằng ngày\n \nNgười mới bắt đầu chơi MTB nhưng muốn một chiếc xe bền, dễ bảo trì và hiệu quả\nRaptor Hunter 4 là sự kết hợp giữa thiết kế thể thao, khung nhôm bền vững và bánh 29 inch vượt trội. Đây là lựa chọn lý tưởng cho những ai muốn bắt đầu hoặc nâng cấp trải nghiệm xe đạp địa hình, phù hợp cả cho việc luyện tập thể thao lẫn di chuyển trong đời sống hằng ngày.	4790000	percentage	0	18	29	nhôm raptor alu	trắng, xanh, xanh lá, đen đỏ	0	t	2026-02-12 06:42:05.262788+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One size (29\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "Tr\\u1eafng, xanh, x\\u00e1m xanh, \\u0111en \\u0111\\u1ecf"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Raptor ALU"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Raptor STL 100mm"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU, Double Wall, 36H, Scharder Valve"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n STL"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "36H"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "29x2.125"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "660mm STL"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "80mm ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "300mm STL"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Raptor"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "24 Speed"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "3 Speed"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "8 Speed"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Mechanical Disc"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "13-28T, 8 Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "10 Speed"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "170mm, 14/37/42T, STL"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
48	Xe Đạp Đường Phố Touring RAPTOR Feliz 2B - Phanh Đĩa, Bánh 700C	SPCFK7S3V2	9	1	Thành phố không chỉ là nơi ta đi qua mỗi ngày, mà còn là không gian để tận hưởng từng nhịp chuyển động, từng vòng quay êm nhẹ trên chiếc xe mà mình yêu thích. Mang dáng dấp hiện đại và tinh thần phóng khoáng, Raptor Feliz 2B mở ra trải nghiệm đạp xe linh hoạt, thoải mái và đầy cảm hứng giữa nhịp sống đô thị.\n\n**Điểm nổi bật của Raptor Feliz 2B **\nThiết kế trẻ trung, đa sắc – phù hợp mọi cá tính\nTừ ánh kim thanh lịch đến đen huyền bí, Raptor Feliz 2B mang đến 4 lựa chọn màu sắc (Gold, White, Black, Grey) phù hợp với mọi phong cách – dù bạn theo đuổi sự tinh tế, tối giản hay cá tính, nổi bật. Đây là mẫu xe đạp đường phố có khả năng đáp ứng cả nhu cầu di chuyển hằng ngày lẫn dạo phố thư giãn.\n\n**Khung nhôm Raptor ALU – nhẹ, chắc và linh hoạt**\nKhung được làm từ hợp kim nhôm cao cấp giúp xe giữ được trọng lượng nhẹ, dễ dàng khi nâng dắt và vận hành linh hoạt nhưng vẫn đảm bảo độ cứng cáp và độ bền cao khi di chuyển mỗi ngày. Một lựa chọn lý tưởng cho môi trường đô thị năng động và những ai tìm kiếm một chiếc xe đạp thể thao thành phố bền bỉ.\n\n**Phuộc thép Raptor STL – ổn định và bền bỉ**\nPhuộc cứng bằng thép chịu lực giúp tăng độ ổn định khi lái, nhất là trên những tuyến phố đông người, bề mặt bằng phẳng. Thiết kế không giảm xóc giúp tối ưu trọng lượng tổng thể, nâng cao hiệu suất đạp.\n\n**Shimano 21 tốc độ – mượt mà, linh hoạt trong mọi hành trình**\nTrang bị bộ truyền động Shimano EF500 kết hợp bộ đề Tourney TZ510 (trước) và TZ500 (sau), xe mang lại trải nghiệm chuyển số chính xác, mượt và phản hồi nhanh. Dễ dàng điều chỉnh tốc độ để phù hợp với nhiều mục đích – từ đi làm, đi học đến tập luyện nhẹ nhàng.\n\n**Bánh xe 700C và lốp Kenda 700×32C – lăn êm giúp tiết kiệm sức lực**\nBánh kích thước 700C với vành nhôm 2 lớp 30mm giúp xe giữ được độ cân bằng tốt và vận hành mượt mà. Lốp Kenda bản 32C có độ bám vừa phải, giúp xe lướt nhẹ qua các bề mặt phố nhưng vẫn đảm bảo êm ái và an toàn khi cua hoặc phanh gấp.\n\n**Ai nên chọn Raptor Feliz 2B?**\n\nNgười đi làm, đi học ở đô thị cần xe đạp đường phố nhanh, nhẹ, an toàn\nNgười mới tập luyện muốn xe đạp thể thao dễ dùng, ít bảo trì\nNgười hướng đến phong cách sống tối giản nhưng vẫn cá tính và có gu\nDân thành phố cần phương tiện linh hoạt cho các quãng đường ngắn đến trung bình\nSo với Raptor Feliz 2, phiên bản Feliz 2B được nâng cấp nhẹ về trải nghiệm sử dụng với bộ chắn bùn, baga và gác chân – những trang bị tưởng nhỏ nhưng lại cực kỳ hữu ích trong di chuyển hằng ngày. Vẫn giữ nguyên cấu hình mạnh mẽ, thiết kế thể thao và mức giá hợp lý, Raptor Feliz 2B mang đến hành trình đạp xe đầy cảm hứng – nhẹ nhàng, linh hoạt và trọn vẹn từng khoảnh khắc đô thị.	5490000	percentage	9	13	30	NHÔM RAPTOR ALU	VÀNG KIM, ĐEN, bạc, XÁM	0	t	2026-02-12 06:28:52.489795+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One size (30\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "V\\u00e0ng kim, \\u0111en, tr\\u1eafng, x\\u00e1m"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Raptor ALU"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Raptor STL"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU 30mm, Double Wall, 32H, Scharder valve"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Kenda 700x32C"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "31.8x660mm STL"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "31.8x28.6x70mm ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "27.2x300mm ALU"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Raptor"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "Shimano EF500, 21 Speed"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "Shimano Tourney TZ510, 3 Speed"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "Shimano Tourney TZ500, 7 Speed"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Mechanical Disc"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "13-28T, 7 Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "7 Speed"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "Prowheel 28/38/48x170mm ALU"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
50	Xe Đạp Địa Hình MTB GIANT Talon 29 3 - Phanh Đĩa, Bánh 29 Inches - 2025	SPV67ODD0S	2	2	**Xe Đạp Địa Hình MTB GIANT Talon 29 3 - Phanh Đĩa, Bánh 29 Inches - 2025**\nGIANT Talon 29 3 – 2025 là mẫu xe đạp địa hình thế hệ mới, hướng đến những người yêu thích khám phá và chinh phục những cung đường gồ ghề. Sở hữu thiết kế hiện đại cùng vẻ ngoài mạnh mẽ, GIANT Talon 29 3 hứa hẹn sẽ trở thành một siêu phẩm đẳng cấp cho các anh em mê xe, là chiến binh lý tưởng để bắt đầu trải nghiệm từ những con dốc thách thức đến những cung đường dài đầy cảm hứng.\n\nThiết kế bền bỉ, siêu nhẹ, lướt nhanh trên mọi cung đường\nGIANT Talon 29 3 2025 sở hữu bộ khung ALUXX-grade aluminum nổi tiếng về độ bền, nhẹ và chịu lực tốt. Chất liệu hợp kim nhôm cao cấp được xử lý qua quy trình công nghệ tiên tiến giúp xe tối ưu hóa trọng lượng mà vẫn đảm bảo khả năng chịu tải tuyệt vời, giảm rung lắc khi di chuyển trên các cung đường gồ ghề. Màu sơn Frost Silver thanh lịch, toát lên vẻ hiện đại, sang trọng nhưng không kém phần mạnh mẽ. Với những ai coi xe đạp là tuyên ngôn phong cách sống, GIANT Talon 29 3 chính là lựa chọn hoàn hảo để khẳng định dấu ấn cá nhân.\n\nHệ Thống Phuộc SR Suntour XCE chinh phục êm ái bất kể đường dài\nTrang bị phuộc SR Suntour XCE cùng trục QR và ống steerer thép cứng cáp, chiếc GIANT Talon 29 3 này giúp hấp thụ chấn động tốt khi chinh phục các địa hình gồ ghề, sỏi đá hay leo dốc để người đạp có thể yên tâm làm chủ tay lái trên những cung đường khó.\n\nTăng Tốc Đột Phá, Bám Đường Vượt Trội\nSự kết hợp giữa vành Giant GX03V 29 alloy hai lớp, bề rộng trong 21mm và lốp Maxxis Ikon 29x2.2 cho phép loại xe này tối ưu tốc độ và độ bám đường. Bánh 29 inches giúp xe vượt chướng ngại vật dễ dàng, tăng khả năng giữ thăng bằng và mang đến trải nghiệm lái mượt mà, ổn định ngay cả trên những cung đường đèo dốc, địa hình khắc nghiệt.\n\nBộ Truyền Động Shimano Altus 2x8 sang số mượt mà\nHệ thống truyền động Shimano Altus 2x8 với 16 tốc độ cho phép người dùng linh hoạt điều chỉnh để thích ứng với mọi loại địa hình. Bộ giò đĩa Shimano Altus FC-M315 22/36 kết hợp cùng líp Shimano Altus HG200 11x34 giúp việc leo dốc nhẹ nhàng hơn, đồng thời hỗ trợ bứt phá tốc độ trên đoạn đường bằng phẳng.\n\nCặp chuyển đĩa Shimano Altus và chuyển líp Shimano Acera nổi danh về độ bền, khả năng sang số chính xác, nhạy bén, giúp người lái dễ dàng chinh phục hành trình dài mà không lo gián đoạn.\n\nPhanh Đĩa Thủy Lực Tektro HDC M275 an toàn tuyệt đối\nGIANT Talon 29 3 được trang bị phanh đĩa thủy lực Tektro HDC M275 cao cấp, mang lại lực phanh mạnh mẽ, ổn định ngay cả trong điều kiện thời tiết khắc nghiệt hay khi đổ dốc tốc độ cao. Bộ tay thắng Tektro HDC M275 đồng bộ hóa với hệ thống phanh, giúp phản hồi tức thì, đảm bảo độ an toàn tối ưu.\n\nBộ Truyền Động Shimano Altus 2x8 sang số mượt mà\nHệ thống truyền động Shimano Altus 2x8 với 16 tốc độ cho phép người dùng linh hoạt điều chỉnh để thích ứng với mọi loại địa hình. Bộ giò đĩa Shimano Altus FC-M315 22/36 kết hợp cùng líp Shimano Altus HG200 11x34 giúp việc leo dốc nhẹ nhàng hơn, đồng thời hỗ trợ bứt phá tốc độ trên đoạn đường bằng phẳng.\n\nCặp chuyển đĩa Shimano Altus và chuyển líp Shimano Acera nổi danh về độ bền, khả năng sang số chính xác, nhạy bén, giúp người lái dễ dàng chinh phục hành trình dài mà không lo gián đoạn.\n\nPhanh Đĩa Thủy Lực Tektro HDC M275 an toàn tuyệt đối\nGIANT Talon 29 3 được trang bị phanh đĩa thủy lực Tektro HDC M275 cao cấp, mang lại lực phanh mạnh mẽ, ổn định ngay cả trong điều kiện thời tiết khắc nghiệt hay khi đổ dốc tốc độ cao. Bộ tay thắng Tektro HDC M275 đồng bộ hóa với hệ thống phanh, giúp phản hồi tức thì, đảm bảo độ an toàn tối ưu.\n\nĐây chắc hẳn là sự lựa chọn hoàn hảo cho những dân chơi đam mê hiệu suất cao. GIANT Talon 29 3 - Phanh Đĩa (2025) không chỉ là phương tiện di chuyển, mà còn là người bạn đồng hành trên mọi hành trình chinh phục. Dù bạn là vận động viên chuyên nghiệp, người tập luyện thể thao hay đam mê công nghệ, chiếc xe này chắc chắn sẽ nâng tầm trải nghiệm của bạn.\n\n	13990000	percentage	5	13	29	hợp kim nhôm ALUXX-grade aluminum	đen, vàng, xanh	0	t	2026-02-12 06:59:29.490089+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One size (29\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "\\u0110en, v\\u00e0ng, xanh"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "ALUXX-grade aluminum, disc"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "SR Suntour XCE, QR, steel steerer"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "Giant GX03V 29, alloy, double wall, 21mm inner width"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "Giant GX03V 29, alloy, double wall, 21mm inner width"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "stainless, 14g"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Maxxis Ikon 29\\u00d72.2, wire bead"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "Giant Connect Trail, 31.8mm"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "Giant Sport, 7-degree"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "Giant Sport, 30.9"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Giant ErgoContact Trail"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "MTB caged"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "Shimano Altus, 2\\u00d78"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "Shimano Altus"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "Shimano Acera"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Tektro HDC M275, hydraulic, Tektro rotors"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "Shimano Acera CS-HG31 11-39T, 8 Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "KMC 8.3"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "Shimano Altus FC-M315, 22/36"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "cartridge"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}, {"ten": "TAY TH\\u1eaeNG/BRAKE LEVERS", "gia_tri": "Tektro HDC M275"}]
51	Xe Đạp Đua Địa Hình MTB RAPTOR Epic - Phanh Đĩa, Bánh 26 Inch	SPJRIHKYAR	2	1	**Xe Đạp Đua Địa Hình MTB RAPTOR Epic - Phanh Đĩa, Bánh 26 Inch**\n\nXe Đạp Đua Địa Hình MTB RAPTOR Epic - Lựa chọn lý tưởng cho dân mê off-road\n**MTB RAPTOR Epic** là dòng xe đạp địa hình mạnh mẽ đến từ thương hiệu Raptor, sở hữu thiết kế thể thao, hiện đại cùng cấu hình vượt trội, giúp chinh phục mọi địa hình từ đường phố đến đường rừng núi gồ ghề.\n\nThiết kế bền bỉ - Chinh phục mọi thử thách\nKhung xe được chế tạo từ hợp kim nhôm Raptor ALU cao cấp, vừa nhẹ vừa chắc chắn, đảm bảo khả năng vận hành linh hoạt và ổn định. Kết hợp với phuộc Raptor ALU có hành trình 100mm và tính năng khóa (lockout), xe dễ dàng vượt qua những địa hình phức tạp, hấp thụ lực tốt, giảm rung hiệu quả.\n\n**Hệ thống truyền động Shimano – Mượt mà trên từng nhịp đạp**\nMTB RAPTOR Epic được trang bị bộ truyền động Shimano M315 với 24 tốc độ, phối hợp cùng chuyển đĩa trước Shimano Tourney TY700 (3 tốc độ) và chuyển líp sau Shimano Tourney TY300 (8 tốc độ). Tất cả tạo nên sự linh hoạt, cho phép người lái tùy chỉnh lực đạp phù hợp với từng cung đường.\n\n**Phanh đĩa thủy lực Shimano MT200** – An toàn tối đa\nHệ thống phanh thủy lực Shimano MT200 cao cấp mang lại khả năng kiểm soát tốc độ chính xác, phản ứng nhạy ngay cả trong điều kiện ẩm ướt hoặc đường trơn trượt, đảm bảo an toàn tối ưu cho người sử dụng.\n\nTrang bị đồng bộ - Hướng tới trải nghiệm hoàn hảo\nBánh xe 26 inch với lốp Kenda 26x1.95 bám đường tốt, phù hợp cho cả đường đất và đường phố.\n \nVành xe nhôm hai lớp (Double Wall) cứng cáp, kết hợp cùng đùm và căm 32H giúp xe vận hành êm ái, bền bỉ.\n \nBộ giò đĩa Prowheel 22/32/42T cùng trục giữa bạc đạn giúp đạp nhẹ và êm hơn.\n \nGhi đông, pô tăng, cốt yên đều làm từ nhôm giúp giảm trọng lượng tổng thể, tăng độ bền và khả năng kiểm soát.\n\n**Kiểu dáng thể thao – Màu sắc cá tính**\nXe có ba tùy chọn màu nổi bật: Black White, Green White và Orange White, phù hợp với nhiều phong cách cá nhân. Kích thước bánh 26 inch linh hoạt, phù hợp với nhiều đối tượng người dùng, đặc biệt là người mới bắt đầu hoặc yêu thích xe đạp địa hình phổ thông.\n\nMTB RAPTOR Epic là lựa chọn lý tưởng cho những ai yêu thích đạp xe địa hình, từ người mới bắt đầu đến các tay lái bán chuyên. Với cấu hình mạnh mẽ, phuộc nhún êm ái và hệ truyền động Shimano 24 tốc độ, xe đáp ứng tốt mọi nhu cầu từ đi học, đi làm cho đến tập luyện thể lực và khám phá các cung đường gồ ghề.	8790000	percentage	44	15	26	hợp kim nhôm rAPtor alu	trắng đen, trắng xanh, trắng cam	0	t	2026-02-25 17:19:50.859595+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One size (26\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "Tr\\u1eafng \\u0111en, tr\\u1eafng xanh, tr\\u1eafng cam"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Raptor ALU"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Raptor ALU 100mm Lockou"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "Raptor ALU, Double Wall, 32H, Scharder Valve"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "Raptor ALU, b\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "32H"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Kenda 26x1.95"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "31.8x660mm ALU"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "31.8x60mm ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "31.6x300mm ALU"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Raptor"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "Shimano M315, 24 Speed"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "Shimano Tourney TY700, 3 Speed"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "Shimano Tourney TY300, 8 Speed"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Shimano MT200 Hydraulic Disc"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "13-28T, 8 Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "8 Speed"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "Prowheel 22/32/42Tx170mm ALU"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
52	Xe Đạp Đua Địa Hình MTB RAPTOR Marlin 3 - Phanh Đĩa, Bánh 29 Inch	SPIIMPD7G6	2	1	**Xe Đạp Đua Địa Hình MTB RAPTOR Marlin 3 - Phanh Đĩa, Bánh 29 Inch**\n\n**Xe Đạp Địa Hình RAPTOR Marlin 3** – Vượt Mọi Địa Hình, Làm Chủ Mọi Cung Đường\nRAPTOR Marlin 3 là mẫu xe đạp địa hình mạnh mẽ thuộc dòng MTB (Mountain Bike) cao cấp, được thiết kế tối ưu cho các tín đồ đam mê khám phá, chinh phục những cung đường gồ ghề, dốc đá và địa hình phức tạp. Sở hữu bánh 29 inch vượt trội cùng hệ truyền động 27 tốc độ, Marlin 3 hứa hẹn mang đến trải nghiệm lái mượt mà, ổn định trên mọi hành trình.\n\n**Đặc điểm nổi bật:**\n\n**1. Khung xe hợp kim nhôm Raptor ALU – bền bỉ và nhẹ nhàng**\nKhung xe được chế tạo từ hợp kim nhôm cao cấp Raptor ALU – chất liệu nổi tiếng với độ bền cao, chống ăn mòn và nhẹ hơn nhiều so với thép truyền thống. Thiết kế khung có cấu trúc tối ưu giúp phân bổ lực đều khi vận hành, hỗ trợ người dùng duy trì sự cân bằng và thoải mái trong quá trình đạp xe lâu dài.\n\n**2. Phuộc nhún có khóa hành trình Remote Lockout – chủ động kiểm soát**\nTrang bị phuộc trước Raptor ALU với hành trình 100mm, mẫu xe này giúp hấp thụ lực xung kích khi đi qua địa hình xóc, đá sỏi hoặc leo dốc. Đặc biệt, tính năng Remote Lockout Lever cho phép người lái dễ dàng khóa/mở hành trình phuộc chỉ với thao tác gạt ngay trên ghi đông – tăng tính linh hoạt khi chuyển đổi giữa đường bằng và đường địa hình.\n\n**3. Hệ thống phanh đĩa dầu Shimano MT200 – an toàn và chính xác**\nĐược trang bị phanh đĩa thủy lực Shimano MT200, RAPTOR Marlin 3 mang lại hiệu suất phanh vượt trội, lực bóp nhẹ nhưng phản ứng cực nhạy. Dù là đường trơn, mưa hay dốc đứng, hệ thống phanh này vẫn đảm bảo kiểm soát tốc độ tối ưu và an toàn cho người dùng.\n\n**4. Bộ truyền động 27 tốc độ – linh hoạt trên mọi địa hình**\nXe sử dụng tay đề Shimano Altus M2010 (3x9), kết hợp với chuyển đĩa Tourney TY601 và chuyển líp Altus M370, tạo nên bộ truyền động 27 tốc độ mượt mà. Người lái có thể linh hoạt điều chỉnh lực đạp phù hợp với từng dạng địa hình: đường phố, leo dốc, xuống dốc hay đường rừng gập ghềnh.\n\n**5. Bánh xe 29 inch + lốp Kenda 29x2.20 – vượt địa hình mượt mà**\nCỡ bánh lớn giúp xe vượt chướng ngại tốt hơn, giữ ổn định khi tốc độ cao và tăng khả năng bám đường. Lốp Kenda 29x2.20 thiết kế gai bám mạnh, hỗ trợ tốt khi đạp xe trên đường đất, cát hoặc đồi núi.\n\n**6. Ghi đông, pô tăng, cốt yên và pedal đồng bộ hợp kim nhôm**\nTrang bị ghi đông rộng 680mm, pô tăng 60mm và cốt yên đường kính 31.6mm đều làm từ nhôm – giúp tăng độ cứng cáp và cảm giác lái ổn định. Bàn đạp platform bản lớn chống trượt, tạo độ bám tốt khi đạp ở tốc độ cao hoặc qua địa hình kỹ thuật.\n\n**RAPTOR Marlin 3** là chiếc xe đạp địa hình lý tưởng dành cho những ai yêu thích khám phá thiên nhiên, đạp xe rèn luyện thể lực hoặc chinh phục các cung đường gồ ghề, dốc đá. Với bánh 29 inch lớn, hệ truyền động Shimano 27 tốc độ mượt mà cùng phanh đĩa thủy lực Shimano MT200 an toàn tuyệt đối, xe đáp ứng tốt nhu cầu di chuyển trên địa hình đa dạng từ đường mòn, đồi núi đến các cung đường off-road.	10790000	percentage	36	18	29	hợp kim nhôm Raptor ALU	đen xanh, đen đỏ, đen vàng	0	t	2026-02-25 17:31:10.427398+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One size (29\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "\\u0110en xanh, \\u0111en \\u0111\\u1ecf, \\u0111en v\\u00e0ng"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Raptor ALU"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Raptor ALU 100mm Remote Lockout Lever"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "Raptor ALU, Double Wall, 32H, Scharder Valve"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "Raptor ALU, b\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "32H"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Kenda 29x2.20"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "31.8x680mm ALU"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "31.8x60mm ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "31.6x350mm ALU"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Raptor"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "Shimano Altus M2010, 27 Speed"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "Shimano Tourney TY601, 3 Speed"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "Shimano Altus M370, 9 Speed"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Shimano MT200 Hydraulic Disc"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "Shimano CS-HG200 11-32T, 9 Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "Shimano CN-LG500, 9 Speed"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "Prowheel 22/32/44Tx170mm ALU"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
59	Xe Đạp Địa Hình MTB GIANT ATX 830 - Phanh Đĩa, Bánh 27 Inches - 2025	SPSJTABUGW	2	2	**Xe Đạp Địa Hình MTB GIANT ATX 830 - Phanh Đĩa, Bánh 27.5 Inches - 2025.**\n\n**Xe Đạp Địa Hình MTB GIANT ATX 830 – Phanh Đĩa, Bánh 27.5 Inches (2025)**\n\nMTB GIANT ATX 830 là mẫu xe lý tưởng dành cho những tay đua và người đam mê xe đạp địa hình, mang đến khả năng vận hành mạnh mẽ trên mọi địa hình. Thiết kế chắc chắn, hệ thống truyền động tối ưu và độ bám đường vượt trội, chiếc xe này giúp bạn tự tin chinh phục những cung đường khó, từ đô thị đến đường mòn gồ ghề.\n\n**1. Thiết Kế Cứng Cáp, Bền Bỉ**\nKhung xe ALUXX Aluminum Frame: Khung xe được chế tạo từ chất liệu nhôm ALUXX cao cấp, nhẹ nhưng rất chắc chắn. Với thiết kế khung kích thước 27.5” và công nghệ gia công độc quyền của GIANT, xe mang lại độ bền vượt trội, đồng thời dễ dàng di chuyển trên mọi loại địa hình\n\n**Phuộc nhún XCM 27.5”**: Được trang bị phuộc nhún 27.5 inch với hành trình 100mm, giúp hấp thụ xung lực mạnh mẽ khi di chuyển qua địa hình gồ ghề. Phuộc này có chức năng khóa từ xa, cho phép người sử dụng điều chỉnh theo nhu cầu và dễ dàng khóa khi di chuyển trên địa hình phẳng.\n\n**2. Hệ Thống Vành Xe và Lốp Tối Ưu**\nVành xe double layer aluminum alloy: Vành xe được làm từ hợp kim nhôm, giúp chịu lực tốt và bền bỉ, đặc biệt là với các loại vành xe dành cho phanh đĩa. Vành xe hai lớp gia tăng độ cứng và độ bền, phù hợp với các cuộc phiêu lưu trên địa hình khắc nghiệt.\n \nLốp LITESTEP 27.5x1.95: Lốp 27.5 inch, với độ rộng 1.95 inch, mang lại độ bám đường tuyệt vời, giúp xe vận hành ổn định trên những cung đường đất đá hay đường trơn trượt.\n\n**3. Bộ Truyền Động Shimano CUES 2x9 Tốc Độ**\nTay đề Shimano CUES 2x9-speed: Bộ tay đề Shimano CUES 2x9 giúp người sử dụng chuyển số một cách mượt mà và chính xác, phù hợp cho mọi tình huống di chuyển, từ leo dốc đến đạp trên đường bằng.\n \nChuyển dĩa trước Shimano CUES 2-speed và chuyển líp sau Shimano CUES 9-speed: Bộ truyền động này tối ưu hóa hiệu suất của xe, cho phép bạn linh hoạt thay đổi tốc độ, tăng tốc hoặc giảm tốc một cách dễ dàng và mượt mà trên mọi địa hình.\n \nBộ líp Shimano 11-36T 9-speed: Bộ líp này cung cấp dải tốc độ rộng, giúp người lái dễ dàng tùy chỉnh lực đạp, từ đó đảm bảo hiệu suất tối ưu trên cả đoạn đường dài và đồi núi dốc.\n\n**4. Hệ Thống Phanh Đĩa Thủy Lực**\nPhanh đĩa thủy lực: Hệ thống phanh đĩa thủy lực đảm bảo hiệu suất phanh mạnh mẽ, giúp người lái dễ dàng kiểm soát tốc độ, đặc biệt khi di chuyển trên địa hình dốc hoặc khi gặp trời mưa. Phanh đĩa thủy lực không chỉ cung cấp lực phanh mạnh mà còn hoạt động ổn định và bền bỉ theo thời gian.\n\n**5. Các Thành Phần Khác**\nGhi đông và pô tăng nhôm hợp kim: Ghi đông với độ rộng 31.8mm và pô tăng giúp người lái duy trì tư thế thoải mái, dễ dàng điều khiển xe trong suốt chuyến đi. Thiết kế của ghi đông giúp người lái cảm thấy ổn định và linh hoạt hơn khi di chuyển.\n\nCốt yên 30.9mm và yên ERGO CONTACT TRAIL: Yên xe được thiết kế với chất liệu êm ái, tạo cảm giác thoải mái cho người lái ngay cả khi di chuyển trên các cung đường dài. Cốt yên có thể điều chỉnh được độ cao để phù hợp với vóc dáng người lái, mang lại sự dễ chịu tối đa.\n\nGiò dĩa Prowheel 26/40T: Với cấu trúc một khối rỗng, giò dĩa giúp tối ưu hóa lực đạp, giúp người lái dễ dàng vượt qua các đoạn đường dốc mà không gặp khó khăn.\n\n**6. Màu Sắc và Kích Cỡ**\nMàu sắc: MTB GIANT ATX 830 được cung cấp với hai màu sắc tinh tế: Matt Gray (Xám Mờ) và Matt Charcoal Gray (Xám Charcoal Mờ), phù hợp với nhiều phong cách cá nhân khác nhau.\nKích cỡ: Xe có sẵn các kích cỡ S và M, phù hợp với nhu cầu và chiều cao của từng người lái. \n\nMTB GIANT ATX 830 Hơn cả một chiếc xe đạp địa hình mạnh mẽ, mà còn là bạn đồng hành lý tưởng, giúp các vận động viên tự tin chinh phục thử thách và bứt phá giới hạn bản thân. GIANT ATX 830 đáp ứng mọi yêu cầu khắt khe của những vận động viên chuyên nghiệp, giúp chinh phục mọi thử thách và đạt được thành tích xuất sắc trong các hành trình khám phá. \n\n	14590000	percentage	0	8	27	nhôm ALUXX cao cấp	trắng, xám bạc	0	t	2026-02-26 09:41:40.065279+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "S"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "Tr\\u1eafng, x\\u00e1m b\\u1ea1c"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Giant ATX 8 Series 27.5\\u201d ALUXX Aluminum Frame"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Fork 27.5\\u201d: XCM, 27.5\\u201d aluminum suspension fork, 1 1/8\\u201d straight tube, remote lockout, T100mm"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "Giant, double layer, aluminum alloy, disc brake"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "Bearing, aluminum alloy, 6-bolt disc brake, quick release"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "14G HTSS"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "LITESTEP 27.5x1.95"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "Aluminum alloy, straight, 31.8mm"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "Aluminum alloy, 8\\u00b0 rise, 31.8mm"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "Aluminum alloy, 30.9mm"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "ERGO CONTACT TRAIL"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "Shifters Shimano CUES 2x9-speed"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "Shimano CUES 2-speed"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "Shimano CUES 9-speed"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Hydraulic disc brake"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "Shimano 11-36T 9-speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "KMC"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "26/40T hollow one-piece, forged aluminum crank"}, {"ten": "K\\u00cdCH TH\\u01af\\u1edaC \\u0110\\u00d3NG TH\\u00d9NG / PACKING SIZE", "gia_tri": "L135 x W23 x H75"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}, {"ten": "TAY TH\\u1eaeNG/BRAKE LEVERS", "gia_tri": "Shimano"}]
68	Xe Đạp Nữ Đường Phố Touring GIANT Escape 3 Disc - Phanh Đĩa, Bánh 700C - 2025	SP7ZGO6XYA	4	2	**Xe Đạp Đường Phố Touring Giant Escape 3 Disc - Phanh Đĩa, Bánh 700C - 2025**\n\nGiant Escape 3 Disc - Phanh Đĩa, Bánh 700C - 2025 chính là sự lựa chọn hoàn hảo mà người sành xe đang tìm kiếm. Được thiết kế tối ưu để phù hợp với cả di chuyển hàng ngày và những hành trình khám phá, mẫu xe này sở hữu khung nhôm nhẹ, hệ thống phanh đĩa thủy lực mạnh mẽ và bộ truyền động Shimano mượt mà, mang lại trải nghiệm lái thoải mái và an toàn trên mọi cung đường.\n\n**1. Thiết kế nhôm ALUXX bền bỉ, đậm tính linh hoạt của thời đại**\nKhung xe được chế tạo từ hợp kim nhôm ALUXX cao cấp, mang lại sự cân bằng hoàn hảo giữa trọng lượng nhẹ và độ cứng cáp, giúp xe có thể di chuyển linh hoạt mà vẫn đảm bảo sự chắc chắn trên đường dài. So với những mẫu xe cùng phân khúc, Giant Escape 3 Disc 2025 nổi bật nhờ phuộc thép cường lực có giá đỡ tích hợp, giúp bạn dễ dàng lắp thêm phụ kiện như baga hoặc giỏ xe, nâng cao tính thực tiễn. Kết hợp với phối màu Ultra Navy hiện đại và tinh tế, mẫu xe này giúp bạn gây ấn tượng với bất cứ ai, trên mọi nẻo đường, thể hiện được phong cách năng động và cá tính của bản thân.\n\n**2. Hiệu suất vận hành ấn tượng từ bộ truyền động Shimano Altus cho dân “sành” xe**\nDòng xe Escape 3 Disc 2025 được trang bị bánh xe 700C kết hợp với lốp Giant S-X3 có lớp bảo vệ chống đâm thủng, mang đến độ bám đường tốt và khả năng vận hành ổn định bất kể địa hình nào.\n\n Hệ thống truyền động Shimano Altus 2x8 tốc độ cho phép chuyển số chính xác, dễ dàng tăng tốc hoặc leo dốc, phù hợp với nhu cầu di chuyển linh hoạt của người sử dụng. Ngoài ra, Escape 3 Disc 2025 nổi bật nhờ hệ thống phanh đĩa thủy lực Tektro, mang lại lực phanh mạnh mẽ và kiểm soát tốc độ chính xác hơn, đặc biệt là khi di chuyển trong điều kiện thời tiết mưa hoặc đường trơn trượt, vượt trội hơn so với các dòng xe tiêu chuẩn thông thường khác.\n\n**3. Trải nghiệm thoải mái với yên xe chuyên dụng GIANT Ergo Contact cho mọi hành trình dài**\n\nThoải mái là yếu tố quan trọng khi di chuyển trên những hành trình dài, và GIANT Escape 3 Disc 2025 đã làm rất tốt điều này. Ghi đông GIANT Sport XC thiết kế 25.4mm giúp duy trì tư thế lái tự nhiên, giảm áp lực lên cổ tay. Yên xe GIANT Ergo Contact êm ái hỗ trợ cột sống, giảm mỏi mệt ngay cả khi di chuyển trong thời gian dài. Cốt yên GIANT D-Fuse hợp kim có khả năng hấp thụ rung động hiệu quả, giúp bạn tận hưởng hành trình một cách êm ái nhất.\n\n**4. Giải pháp hoàn hảo cho cuộc sống đô thị nhiều trải nghiệm**\nKhông chỉ phù hợp để đi làm, tập luyện hay du lịch ngắn ngày, GIANT Escape 3 Disc 2025 còn là lựa chọn lý tưởng cho những ai muốn sở hữu một chiếc xe đạp đa năng với hiệu suất tối ưu.\n\nBộ líp Shimano 11x34T cùng giò đĩa hợp kim 30/46 mang đến sự linh hoạt khi đạp xe trong đô thị và cả những chặng đường dài. \nĐùm xe hợp kim 32h cùng căm xe thép không gỉ giúp tăng cường độ bền, giảm thiểu hỏng hóc khi sử dụng lâu dài. Nhờ đó mà dòng xe này có khả năng thích nghi với nhiều điều kiện sử dụng, từ đường phố đông đúc đến những hành trình khám phá ngoại ô, phá bỏ tất cả trở ngại để bạn có thể thoải mái đương đầu với những trải nghiệm mới. 	12790000	percentage	14	10	27	hợp kim nhôm aluxx	xanh lục, đen 	0	t	2026-02-27 21:50:06.74162+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "M"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "Xanh l\\u1ee5c, \\u0111en"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "ALUXX-grade aluminum, disc"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "high-tensile steel, rack mount, disc"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "Giant double wall aluminum"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "alloy, 32h"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "stainless, 14g"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Giant S-X3, puncture protect, 700x38c"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "Giant Sport XC, 25.4mm"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "Giant Sport, 15-degree, 25.4mm"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "Giant D-Fuse, alloy"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Giant ErgoContact"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Giant Urban Fitness"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "Shimano M315, 16 Speed"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "Shimano FD-TY606"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "Shimano RD-TY310"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Tektro hydraulic, Giant MPH rotors"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "Shimano CS-HG318, 11\\u00d734"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "KMC Z8.3"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "forged alloy, 30/46"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "cartridge"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}, {"ten": "TAY TH\\u1eaeNG/BRAKE LEVERS", "gia_tri": "Tektro"}]
53	Xe Đạp Đua Địa Hình MTB RAPTOR Evo - Phanh Đĩa, Bánh 27 Inch	SPWYXJLM5F	2	1	**Xe Đạp Đua Địa Hình MTB Raptor Evo – Phanh Đĩa, Bánh 27.5 Inch**\n\n**Xe Đạp Đua Địa Hình MTB Raptor Evo – Phanh Đĩa, Bánh 27.5 Inch | Chinh Phục Mọi Địa Hình**\n\nXe đạp địa hình MTB Raptor Evo được thiết kế dành riêng cho những tín đồ đam mê khám phá, chiếc xe địa hình này mang đến khả năng vận hành mạnh mẽ trên mọi cung đường gồ ghề.\n\n**1. Thiết Kế Cứng Cáp – Định Hình Phong Cách Địa Hình**\n\nKhung xe Raptor ALU – Nhẹ, Bền, Linh Hoạt\nLinh hồn của MTB Raptor Evo chính là khung nhôm hợp kim Raptor ALU, giúp xe đạt được độ bền cao nhưng vẫn giữ được trọng lượng nhẹ. Chất liệu nhôm cao cấp không chỉ giúp tăng khả năng chịu lực mà còn chống gỉ sét, phù hợp với điều kiện thời tiết khắc nghiệt.\n\n**Phuộc nhún Raptor ALU 80mm – Hấp thụ xung lực mạnh mẽ**\nĐược trang bị phuộc nhún hành trình 80mm, xe có khả năng giảm chấn hiệu quả khi đi trên địa hình gồ ghề. Điều này giúp người lái có được sự thoải mái tối đa ngay cả khi di chuyển qua những cung đường đầy thử thách.\nMTB Raptor Evo được ra mắt với ba màu sắc hiện đại, mạnh mẽ, phù hợp với nhiều phong cách cá nhân: Grey (Xám) – Sang trọng, tinh tế, Orange (Cam) – Năng động, nổi bật, Blue (Xanh Dương) – Cá tính, mạnh mẽ.\n\n**2. Hệ Thống Bánh 27.5 Inch – Vận Hành Linh Hoạt, Ổn Định**\nVành xe ALU Double Wall – Chịu lực tốt, bền bỉ.\nXe được trang bị vành nhôm đôi 32H, giúp tăng khả năng chịu lực, chống cong vênh khi gặp va chạm mạnh. Đây là yếu tố quan trọng để đảm bảo độ bền của xe khi di chuyển trên địa hình phức tạp.\n\nLốp Kenda 27.5x2.1 – Bám đường tốt, tối ưu kiểm soát.\nLốp xe Kenda 27.5x2.1 có độ rộng lớn, mang lại độ bám tốt và hạn chế trơn trượt khi đi qua địa hình đất đá hoặc đường trơn. Kích thước 27.5 inch là tiêu chuẩn lý tưởng cho dòng xe MTB, giúp xe duy trì tốc độ tốt mà vẫn giữ được độ linh hoạt trên mọi dạng địa hình.\n\n**3. Bộ Truyền Động Shimano 27 Tốc Độ – Chinh Phục Mọi Cung Đường**\nTay đề Shimano M2010 – Chuyển số nhanh chóng, chính xác.\nBộ tay đề Shimano M2010, 27 tốc độ giúp người lái chuyển số mượt mà, dễ dàng tùy chỉnh tốc độ theo từng dạng địa hình khác nhau.\n\n**Chuyển dĩa Shimano Tourney TY601 (3 Speed)** – Hỗ trợ đa tốc độ, giúp người dùng dễ dàng điều chỉnh lực đạp khi leo dốc hoặc di chuyển trên đường bằng.\nChuyển líp Shimano M370 (9 Speed) – Cải thiện khả năng vận hành, đảm bảo sự trơn tru khi sang số, hạn chế tối đa tình trạng kẹt xích.\n**Bộ líp Shimano CS-HG200 11-32T – Tăng tốc mượt mà\nBộ líp Shimano CS-HG200 11-32T, 9 Speed cung cấp dải tốc độ rộng, giúp xe dễ dàng tăng tốc hoặc giảm tốc một cách hiệu quả.\nGiò dĩa Prowheel 22/32/44Tx170mm – Hỗ trợ lực đạp mạnh mẽ\nBộ giò dĩa Prowheel 22/32/44Tx170mm ALU giúp người lái tối ưu lực đạp, từ đó tiết kiệm sức hơn khi di chuyển đường dài hoặc leo dốc.**\n\n**4. Hệ Thống Phanh Đĩa Thủy Lực Shimano MT200 – An Toàn Tuyệt Đối**\nĐối với xe đạp địa hình, hệ thống phanh đóng vai trò quan trọng trong việc kiểm soát tốc độ và đảm bảo an toàn cho người lái. MTB Raptor Evo trang bị phanh đĩa thủy lực Shimano MT200, mang lại hiệu suất phanh mạnh mẽ, giúp người lái dễ dàng kiểm soát tốc độ ngay cả trên những cung đường dốc hoặc điều kiện thời tiết xấu.\n\n**5. Trang Bị Hoàn Hảo – Nâng Tầm Trải Nghiệm**\n\nGhi đông & Pô tăng – Kiểm soát tốt, lái xe linh hoạt\nGhi đông ALU 31.8x680mm giúp tư thế lái ổn định, tăng khả năng kiểm soát khi đi trên địa hình khó.\nPô tăng ALU 31.8x90mm giúp phân bổ lực đều, tạo cảm giác thoải mái khi lái xe trong thời gian dài.\n\n**Cốt yên & Yên xe** – Êm ái, thoải mái khi sử dụng\nCốt yên ALU 27.2x300mm chắc chắn, dễ dàng điều chỉnh độ cao để phù hợp với từng người dùng.\nYên xe Raptor thiết kế êm ái, mang lại sự thoải mái ngay cả khi đạp xe trên những cung đường dài.\n\n**Bàn đạp nhôm – Bám chắc, chống trượt**\nBàn đạp Black ALU Platform giúp bám chắc chân, giảm tình trạng trơn trượt khi đạp xe, đặc biệt trong điều kiện mưa hoặc đường trơn.\n\n**6. Vì Sao Nên Chọn Xe Đạp Địa Hình MTB Raptor Evo?**\nMTB Raptor Evo không chỉ là một chiếc xe đạp, mà còn là người bạn đồng hành đáng tin cậy cho những hành trình chinh phục địa hình đầy thử thách. 	9790000	percentage	35	16	27	hợp kim nhôm raptor alu	trắng, cam, xanh dương	0	t	2026-02-25 18:36:30.04403+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "M"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "Tr\\u1eafng, cam, xanh d\\u01b0\\u01a1ng"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Raptor ALU"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Raptor ALU 80mm"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU, Double Wall, 32H, Scharder Valve"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Kenda 27.5x2.1"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "31.8x680mm ALU"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "31.8x90mm ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "27.2x300mm ALU"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Raptor"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Black ALU Platform"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "Shimano M2010, 27 Speed"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "Shimano Tourney TY601, 3 Speed"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "Shimano M370, 9 Speed"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Shimano MT200 Hydraulic Disc"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "Shimano CS-HG200 11-32T, 9 Speed"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "Prowheel 22/32/44Tx170mm ALU"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
54	Xe Đạp Địa Hình MTB MEREC Honour 300 - Phanh Đĩa, Bánh 26 Inches	SPIDSZTS1Q	2	9	**Xe Đạp Địa Hình MTB MEREC Honour 300 - Phanh Đĩa, Bánh 26 Inch**\nKhông phải cứ đường bằng mới là hành trình đáng nhớ. Với Merec Honour 300, bạn sẽ khám phá cảm giác tự do thật sự – nơi mỗi vòng bánh là một thử thách, mỗi con dốc là một chiến thắng. Dành cho những tay lái muốn khởi đầu hành trình MTB bằng một lựa chọn cân bằng giữa sức mạnh – độ bền – và trải nghiệm.\n\n**Những điểm nổi bật của MEREC Honour 300**\nThiết kế nhỏ gọn, thể thao và linh hoạt\nHonour 300 mang phong cách MTB truyền thống với khung one-size bánh 26 inch – lựa chọn lý tưởng cho người có chiều cao từ 1m55 – 1m75. Thiết kế khung nhỏ gọn, dễ điều khiển trong đô thị, đồng thời vẫn đủ cứng cáp để chinh phục những cung đường đất, sỏi hay đồi nhẹ. Màu sắc đa dạng gồm Black, Cyan và Silver White, mỗi gam màu đều mang nét riêng: mạnh mẽ, năng động và hiện đại.\n\n**Khung nhôm Merec ALU – bền chắc, nhẹ nhàng**\nXe sử dụng khung hợp kim nhôm Merec ALU 26, ưu điểm là cứng cáp, nhẹ và chống gỉ sét tốt. Đây là nền tảng quan trọng giúp Honour 300 vừa dễ dàng tăng tốc, vừa đảm bảo độ ổn định khi di chuyển ở tốc độ cao hoặc qua địa hình gồ ghề. Trọng lượng nhẹ cũng giúp người mới dễ làm quen, thuận tiện hơn khi dắt hoặc mang xe đi xa.\n\n**Phuộc nhún khóa hành trình 100mm – linh hoạt mọi địa hình**\nPhuộc Merec ALU hành trình 100mm có khóa (Lockout) mang lại khả năng hấp thụ xung lực tốt khi đi qua đường sỏi đá, giúp giảm chấn, bảo vệ cổ tay và duy trì độ bám đường. Khi di chuyển trên mặt đường phẳng, người lái có thể khóa phuộc để tối ưu tốc độ – rất phù hợp cho người muốn vừa đạp thể thao, vừa đạp phố.\n\n**Hệ truyền động 24 tốc độ – mượt mà và chính xác**\nMerec Honour 300 được trang bị bộ truyền động 3x8 (24 tốc độ) cho phép người lái linh hoạt điều chỉnh theo địa hình – từ những đoạn dốc nhẹ đến đường dài bằng phẳng. Chuyển số nhẹ nhàng, phản hồi nhanh, giúp người mới tự tin làm chủ tốc độ và nhịp đạp.\n\n**Bánh xe 26 inch – linh hoạt, dễ kiểm soát**\nCặp bánh 26x1.95 Kenda giúp xe có khả năng phản hồi nhanh, dễ chuyển hướng và kiểm soát tốt hơn khi vào cua hoặc di chuyển trong không gian hẹp. Đây là kích thước bánh lý tưởng cho người mới bắt đầu tập MTB hoặc những ai thích sự linh hoạt, nhẹ nhàng khi đi phố.\n\n**Phanh đĩa cơ – an toàn, dễ bảo trì**\nHệ thống phanh đĩa cơ mang lại lực hãm ổn định và đáng tin cậy, kể cả trong điều kiện ẩm ướt hoặc bùn đất. Đây là lựa chọn thực tế cho người dùng phổ thông vì dễ căn chỉnh, chi phí thấp và bền bỉ theo thời gian.\n\n**Ai nên chọn Merec Honour 300?*\nNgười mới bắt đầu chơi MTB, muốn một chiếc xe bền, nhẹ và dễ làm quen\n \nNgười thích đạp thể thao, tập luyện nhẹ hoặc đi dạo trong phố\n \nHọc sinh, sinh viên hoặc người trẻ năng động cần một chiếc xe đa dụng, dễ kiểm soát\n \nNgười muốn một chiếc xe đẹp, hiện đại, và có chất lượng ổn định trong tầm giá\nMerec Honour 300 là lựa chọn hoàn hảo cho những ai yêu thích sự cân bằng giữa hiệu năng và tiện ích.\nMột chiếc MTB gọn gàng, chắc chắn và đáng tin cậy – sẵn sàng đồng hành cùng bạn từ buổi sáng dạo phố đến những chiều chinh phục đường đất.	6290000	percentage	20	20	26	nhôm Merec ALU	vàng kem, đen, trắng bạc	0	t	2026-02-25 20:58:00.978766+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One size (26\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "V\\u00e0ng kem, \\u0111en, tr\\u1eafng b\\u1ea1c"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Merec ALU 26"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Merec ALU 26x100mm Lockout"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU, Double Wall, 36H, Scharder Valve"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Kenda 26x1.95"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "31.8x660mm STL"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "31.8x80mm ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "27.2x300mm STL"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Merec"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "Shimano EF500, 24 Speed"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "Shimano TY600, 3 Speed"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "Shimano TY300, 8 Speed"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Mechanical Disc"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "13-28T, 8 Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "1/2x3/32x110L 8 Speed"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "Prowheel 22/32/42x170mm ALU"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n. R\\u00fat g\\u1ecdn"}]
55	Xe Đạp Địa Hình MTB MEREC Challenger - Phanh Đĩa, Bánh 27 Inches	SP0NPJ4OGN	2	9	**Xe Đạp Địa Hình MTB MEREC Challenger - Phanh Đĩa Dầu, Bánh 27 Inch**\n\nKhông phải ai cũng cần một chiếc xe để đi nhanh – có người chọn xe để đi xa, đi chắc, và đi theo cách của riêng mình.\nMerec Challenger sinh ra cho những người như thế – những kẻ không ngại thử thách, thích cảm giác kiểm soát trên mọi địa hình và luôn muốn hành trình của mình có chút “gia vị phiêu lưu”.\n\n**Những điểm nổi bật của MEREC Challenger**\nPhong cách thể thao, đậm chất phiêu lưu\nMerec Challenger mang diện mạo đậm chất MTB cổ điển pha hiện đại, với ba phối màu: Black/White, Black/Red và Grey/Orange. Mỗi phiên bản là một sắc thái riêng – sang trọng, mạnh mẽ hoặc nổi bật.\n\n**Khung nhôm Merec ALU nhẹ nhưng cực kỳ cứng cáp**\n\nChallenger được chế tác từ hợp kim nhôm Merec ALU 27.5, mang lại sự kết hợp giữa độ bền, độ nhẹ và khả năng chống ăn mòn cao. Đây là nền tảng lý tưởng cho những chuyến đi dài, đặc biệt khi cần leo dốc hoặc vượt địa hình nhiều sỏi đá.\n\n**Phuộc nhún khóa hành trình 100mm – êm ái và chủ động**\nPhuộc Merec ALU 27.5x100mm có khả năng khóa hành trình, giúp xe hấp thụ xung lực hiệu quả khi off-road, đồng thời có thể khóa lại khi di chuyển trên mặt đường phẳng để tối ưu tốc độ.\nMột tính năng cực kỳ tiện lợi cho những người vừa thích đạp thể thao, vừa đi làm – đi học hàng ngày.\n\n**Bộ truyền động 24 tốc độ mượt mà, đa dụng**\nVới 24 cấp tốc độ, Merec Challenger cho phép người lái điều chỉnh linh hoạt theo địa hình, từ những con dốc gắt đến đường bằng rộng mở. Hệ thống sang số mượt, độ phản hồi nhanh, giúp bạn giữ nhịp đạp ổn định và kiểm soát tốt tốc độ trong mọi tình huống.\n\n**Phanh đĩa dầu kiểm soát tối đa, an toàn vượt trội**\nĐiểm sáng đáng giá của Challenger nằm ở phanh đĩa dầu thủy lực, cho lực phanh nhạy, êm và ổn định hơn nhiều so với phanh cơ.\nDù trời mưa hay đường trơn, bạn vẫn dễ dàng làm chủ tốc độ và an tâm trong từng pha xử lý. Đây là tính năng mà dân đạp xe lâu năm cực kỳ ưa chuộng, bởi hiệu suất và độ bền vượt trội.\n\n**Bánh 27.5 inch linh hoạt và ổn định**\nKích thước bánh 27.5x2.1 mang lại sự cân bằng hoàn hảo giữa khả năng vượt chướng ngại và cảm giác lái nhẹ nhàng. Bánh không quá lớn để nặng, cũng không nhỏ để thiếu đà – phù hợp cho người cần một chiếc MTB vừa nhanh, vừa dễ xoay trở.\n\n**Ai nên chọn Merec Challenger?**\nNgười thích đạp xe địa hình nhẹ đến trung bình, cần xe mạnh mẽ nhưng vẫn dễ làm quen\n \nNgười cao từ 1m6 – 1m8, muốn một chiếc MTB phù hợp vóc dáng\n \nNgười cần xe vừa thể thao, vừa tiện dụng cho di chuyển hằng ngày\n \nNgười muốn nâng cấp từ xe phổ thông lên dòng có phanh dầu và phuộc khóa hành trình\n \nMerec Challenger chính là  lựa chọn dành cho người thích cảm giác kiểm soát, tự tin và mạnh mẽ. Không chỉ là một chiếc xe đạp, mà là người bạn đồng hành vững chắc trên mọi cung đường từ phố phường tới những lối mòn bụi đất, nơi chỉ còn lại bạn, chiếc xe, và nhịp đạp không ngừng nghỉ.	6990000	percentage	14	19	27	nhôm Merec ALU 27	đen trắng, xám cam, đen đỏ	0	t	2026-02-25 21:11:57.540289+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One size (27\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "\\u0110en tr\\u1eafng, x\\u00e1m cam, \\u0111en \\u0111\\u1ecf"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Merec ALU 27.5"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Merec ALU 27.5x100mm Lockout"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU, Double Wall, 36H, Scharder Valve"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "27.5\\u00d72.1"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "31.8x660mm ALU"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "31.8x80mm ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "27.2x300mm STL"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Merec"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "Shimano M315, 24 Speed"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "Shimano TY600, 3 Speed"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "Shimano TY300, 8 Speed"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Merec Hydraulic Disc"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "13-28T, 8 Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "1/2x3/32x112L 8 Speed"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "Prowheel 22/32/42x170mm ALU"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
56	Xe Đạp Địa Hình MTB GIANT Talon 3 - Phanh Đĩa, Bánh 27 Inches 2025	SPFPZDOG2N	2	2	**Xe Đạp Địa Hình MTB GIANT Talon 3 - 2025**\nXe đạp địa hình MTB GIANT Talon 3 - 2025 là lựa chọn lý tưởng không chỉ dành cho những người yêu thích khám phá địa hình đa dạng, mà còn phù hợp với cả người mới bắt đầu trải nghiệm xe đạp địa hình lẫn những tay đua đam mê chinh phục các cung đường gồ ghề. \n\n**Khung nhôm ALUXX cao cấp trên xe đạp địa hình MTB GIANT Talon 3 - 2025** mang lại nhiều lợi ích cho người lái. Nhờ chất liệu nhôm cao cấp được gia công tỉ mỉ, khung xe có trọng lượng nhẹ, giúp người dùng dễ dàng điều khiển và tăng tốc hiệu quả, đặc biệt khi leo dốc hoặc xử lý các tình huống phức tạp trên địa hình gồ ghề. Độ bền vượt trội của khung ALUXX giúp xe chịu được lực tác động mạnh khi di chuyển qua các đoạn đường sỏi đá hoặc va chạm trong quá trình đạp xe.\n\nThiết kế tối ưu còn giúp hấp thụ rung động tốt hơn, mang lại trải nghiệm lái êm ái và thoải mái hơn trong những chuyến đi dài. \n\n**Hệ thống phuộc và bánh xe vượt trội**\n\nXe được trang bị phuộc SR Suntour XCE với cơ chế hấp thụ xung động hiệu quả, mang lại trải nghiệm lái êm ái ngay cả trên địa hình gồ ghề. \n\nBộ vành Giant GX03V hợp kim nhôm hai lớp, cùng lốp Maxxis Ikon 27.5×2.2 giúp xe duy trì độ bám tốt và kiểm soát ổn định trong mọi điều kiện.\n\n**Truyền động linh hoạt với Shimano Altus  và Acera**\nXe sử dụng bộ truyền động Shimano Altus 2×8 tốc độ, kết hợp chuyển líp Shimano Acera giúp sang số mượt mà, hỗ trợ người lái chinh phục các cung đường dốc một cách dễ dàng.\n\n**Bộ líp Shimano Altus HG200 (11×34):**\nVới dải răng từ 11 đến 34T, bộ líp này cung cấp nhiều cấp số khác nhau, giúp người lái dễ dàng thay đổi tốc độ phù hợp với từng địa hình.\n\nHỗ trợ leo dốc tốt: Nhờ răng lớn nhất lên đến 34T, người đạp có thể duy trì lực đạp nhẹ hơn khi leo dốc cao, giảm cảm giác mệt mỏi trên những cung đường dài và gồ ghề.\n\nChuyển số mượt mà: Công nghệ HyperGlide (HG) của Shimano giúp chuyển đổi giữa các tầng líp nhanh và chính xác, hạn chế tình trạng trượt xích khi thay đổi tốc độ đột ngột.\n\n**Giò dĩa Shimano Altus FC-M315 (22/36)**\n**Hai tầng dĩa (22/36T):**\n\nDĩa 36T hỗ trợ tốc độ cao khi di chuyển trên đường bằng hoặc xuống dốc. Dĩa 22T giúp người lái dễ dàng duy trì nhịp đạp ổn định khi leo dốc hoặc di chuyển trên địa hình khó.\n\nTương thích tốt với hệ thống truyền động: Bộ giò dĩa này hoạt động hiệu quả với các bộ chuyển động Shimano Altus, đảm bảo hiệu suất tối ưu và trải nghiệm đạp xe mượt mà.\n\nHệ thống phanh dầu Tektro an toàn Với bộ phanh đĩa dầu Tektro HDC M275 kết hợp cùng tay thắng đồng bộ, xe mang lại lực phanh mạnh mẽ và ổn định, giúp người lái kiểm soát tốc độ tốt ngay cả khi di chuyển trên đường trơn trượt hay địa hình phức tạp.\n\nTrang bị tiện ích và thoải mái Xe được thiết kế với ghi đông Giant Connect Trail 31.8mm và pô tăng Giant Sport 7 độ, giúp người lái có tư thế ngồi thoải mái và kiểm soát xe dễ dàng. Yên Giant ErgoContact Trail kết hợp với cốt yên Giant Sport 30.9 mang lại cảm giác êm ái trong suốt hành trình.\n	13590000	percentage	0	25	27	 nhôm ALUXX cao cấp	VÀNG, ĐEN, XANH	0	t	2026-02-25 21:30:08.209407+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "S"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "V\\u00e0ng, \\u0111en, xanh"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "ALUXX-grade aluminum, disc"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "SR Suntour XCE, QR, steel steerer"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "Giant GX03V 27.5, alloy, double wall, 21mm inner width"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "alloy, sealed bearing, [F] 15\\u00d7100 QR, [R] 12\\u00d7142 thru-axle"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "stainless, 14g"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Maxxis Ikon 27.5\\u00d72.2, wire bead"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "Giant Connect Trail, 31.8mm"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "Giant Sport, 7-degree"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "Giant Sport, 30.9"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Giant ErgoContact Trail"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "MTB caged"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "Shimano Altus, 2\\u00d78"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "Shimano Altus"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "Shimano Acera"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Tektro HDC M275, hydraulic, Tektro rotors"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "Shimano Acera CS-HG31 11-39T, 8 Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "KMC 8.3"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "Shimano Altus FC-M315, 22/36"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "cartridge"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}, {"ten": "TAY TH\\u1eaeNG/BRAKE LEVERS", "gia_tri": "Tektro HDC M275"}]
30	Xe Đạp Đường Trường ROAD RAPTOR TAKA 1 - BÁNH 700C	SPIK3SIUF5	3	1	**Xe Đạp Đường Trường ROAD RAPTOR Taka 1 – Bánh 700C**\n\nROAD RAPTOR Taka 1 – Bánh 700C là mẫu xe đạp đua nổi bật trong phân khúc tầm trung, được tối ưu cả về thiết kế lẫn hiệu năng để mang lại trải nghiệm tốc độ mượt mà, ổn định trên những cung đường dài. Với cấu hình sử dụng full Shimano Tiagra 4700, khung nhẹ, phuộc carbon và hệ thống phanh bán thủy lực, đây là lựa chọn lý tưởng cho người dùng đang tìm kiếm một chiếc xe vừa mạnh mẽ, vừa đáng tin cậy cho việc luyện tập hoặc đạp xe hằng ngày.\n\n**Khung nhôm nhẹ, phuộc carbon cao cấp**\nKhung xe Raptor ALU được chế tạo từ hợp kim nhôm chắc chắn nhưng vẫn đảm bảo trọng lượng nhẹ, giúp tăng tốc nhanh và tối ưu hiệu suất khi đạp đường dài. Thiết kế khung đua chuẩn quốc tế, kết hợp với phối màu Red Gradient và Grey Gradient tạo điểm nhấn hiện đại, thể thao và nổi bật.\n\nPhuộc trước bằng carbon nguyên khối giúp giảm trọng lượng đầu xe, tăng độ đàn hồi và giảm chấn hiệu quả, mang lại cảm giác lái mượt mà hơn, đặc biệt trong các hành trình kéo dài hoặc khi vượt qua mặt đường không bằng phẳng.\n\n**Bộ bánh xe bền bỉ, vận hành ổn định**\nVành hợp kim nhôm cao 40mm, dạng hai lớp, kết hợp với bộ đùm bạc đạn và căm 28H, cho khả năng vận hành trơn tru, ổn định và bền bỉ theo thời gian. Hệ thống vành này không chỉ tăng tính khí động học mà còn giữ xe ổn định ở tốc độ cao.\n\nLốp CST City Parkour 700x25C có độ mỏng phù hợp cho xe đường trường, giúp xe di chuyển nhanh, ít ma sát nhưng vẫn bám đường tốt khi vào cua hoặc khi trời mưa nhẹ.\n\n**Shimano Tiagra 4700 – Truyền động mượt mà, hiệu quả**\nSức mạnh của RAPTOR Taka 1 nằm ở hệ thống truyền động Shimano Tiagra 4700 – 20 tốc độ, vốn là dòng linh kiện phổ thông cao cấp, được tin dùng trong nhiều cuộc đua phong trào.\n\nTay đề, chuyển đĩa và chuyển líp Tiagra đồng bộ, giúp chuyển số nhạy bén, phản hồi nhanh và ít hao mòn theo thời gian.\nCấu hình 2 đĩa – 10 líp cho phép người lái linh hoạt tùy chỉnh tốc độ, phù hợp với cả những đoạn đường bằng, lên dốc hoặc đạp nước rút.\nLíp Sensah-XZ 11-32T hỗ trợ leo dốc nhẹ nhàng hơn, đồng thời giúp duy trì tốc độ ổn định khi di chuyển trên địa hình hỗn hợp.\nGiò dĩa Raptor 36/52T – 170mm giúp tạo lực đạp mạnh mẽ, hỗ trợ nước rút và tăng tốc hiệu quả trên đường dài.\n\n**Phanh bán thủy lực Shimano – Kiểm soát tốc độ chính xác**\nXe được trang bị phanh đĩa bán thủy lực Shimano Tiagra 4700, là sự kết hợp giữa lực bóp nhẹ của hệ thống dầu và độ tin cậy của đĩa cơ khí. Hệ thống này mang lại lực phanh đều, kiểm soát tốt trong điều kiện ẩm ướt hoặc địa hình đổ dốc, giúp người lái luôn chủ động xử lý tình huống.\n\n**Thiết kế tinh gọn, tư thế lái tối ưu**\nGhi đông cong 420mm kết hợp với pô tăng tích hợp 90mm cho tư thế đua chuẩn xác, đồng thời giảm sức cản gió hiệu quả.\nCốt yên ALU 300mm và yên RAPTOR thể thao giúp người lái duy trì sự thoải mái khi di chuyển trong thời gian dài.\nBàn đạp platform nhôm đen cho độ bám tốt, chắc chắn ngay cả khi đạp lực mạnh hoặc đứng lên đạp.	18890000	percentage	45	18	28	nhôm Raptor ALU	đỏ đen, xám đen	5	t	2026-02-09 10:33:45.832273+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "M"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "\\u0110\\u1ecf \\u0111en, x\\u00e1m \\u0111en"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Raptor ALU"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Raptor Carbon"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "ALU 420mm"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "ALU Integrated 90mm"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "ALU 300mm"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Raptor"}, {"ten": "BA\\u0300N \\u0110A\\u0323P/PEDALS", "gia_tri": "Black ALU Platform"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "Shimano Tiagra 4700 20 Speed"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "Shimano Tiagra 4700 2 Speed"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "Shimano Tiagra 4700 10 Speed"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Shimano Tiagra 4700 Semi-Hydraulic Disc"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "Sensah-XZ 11-32T, 10 Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "10 Speed"}, {"ten": "GI\\u00d2 DI\\u0303A/CRANKSET", "gia_tri": "Raptor 36/52Tx170mm, ALU"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "Raptor ALU 40mm, Double Wall, 28H, Presta Valve"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "CST City Parkour 700x25C"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "Raptor ALU, b\\u1ea1c \\u0111\\u1ea1n, tr\\u1ee5c r\\u1ed7ng"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "28H"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "BB v\\u1eb7n, b\\u1ea1c \\u0111\\u1ea1n, tr\\u1ee5c r\\u1ed7ng"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
42	Xe Đạp Trẻ Em Youth TRINX Princess – Bánh 18 Inches	SP03VQLW7W	1	4	**Xe Đạp Trẻ Em Youth TRINX Princess – "Chiến Mã" Điệu Đà Cho Nàng Công Chúa Nhỏ**\nMọi bé gái đều mơ ước có một chiếc xe đạp riêng để tự do khám phá thế giới xung quanh. TRINX Princess 18 Inches không chỉ là một phương tiện di chuyển, mà còn là người bạn đồng hành xinh xắn, giúp bé rèn luyện sức khỏe và sự tự tin ngay từ nhỏ.\n\nVới thiết kế mang đậm phong cách hoàng gia, màu sắc ngọt ngào và độ bền chuẩn quốc tế từ thương hiệu TRINX, đây chắc chắn là món quà tuyệt vời nhất dành cho bé yêu.\nNhững Điểm Nổi Bật Không Thể Bỏ Qua\nThiết kế "đốn tim" các bé: Lấy cảm hứng từ những câu chuyện cổ tích, xe sở hữu tông màu pastel nhẹ nhàng, kết hợp cùng tem xe uốn lượn tinh tế.\n\nKhung xe siêu bền: Khung thép cường lực High-carbon steel giúp xe cực kỳ chắc chắn, chịu được va đập tốt nhưng vẫn giữ được trọng lượng vừa phải để bé dễ dàng điều khiển.\n\nAn toàn là trên hết: * Hệ thống phanh chữ V (V-Brake) nhạy bén, lực bóp nhẹ phù hợp với bàn tay nhỏ nhắn của trẻ.\n\nHộp xích kín hoàn toàn, bảo vệ bé khỏi vết bẩn dầu mỡ và tránh kẹt gấu quần/váy vào xích.\n\nSự thoải mái tối đa: Yên xe bọc da mềm mại, có thể điều chỉnh độ cao linh hoạt theo sự phát triển của bé. Ghi đông chữ U giúp bé có tư thế ngồi thẳng lưng, bảo vệ cột sống.\n\nPhụ kiện đi kèm tiện lợi: Xe được trang bị sẵn giỏ đựng đồ xinh xắn phía trước để bé chở búp bê hoặc đồ ăn vặt, cùng hệ thống bánh phụ chắc chắn giúp bé tập thăng bằng dễ dàng.\nTại sao ba mẹ nên chọn TRINX Princess cho bé?\nPhát triển thể chất: Đạp xe giúp bé tăng cường sức bền, sự dẻo dai và phát triển chiều cao hiệu quả.\n\nRời xa màn hình: Khuyến khích bé vận động ngoài trời thay vì ngồi quá lâu trước TV hay máy tính bảng.\n\nĐộ bền vượt thời gian: Xe đạp TRINX nổi tiếng với độ bền cao, ba mẹ có thể yên tâm sử dụng trong nhiều năm mà xe vẫn hoạt động trơn tru.\n\nLời khuyên: Với kích thước bánh 18 inches, xe sẽ phù hợp nhất cho các bé có chiều cao từ 110cm đến 135cm.	1990000	percentage	39	18	18	thép TrinX STL 18	hồng trắng	5	t	2026-02-11 16:32:47.935514+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One size (18\\u2033)"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "H\\u1ed3ng tr\\u1eafng"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "TrinX STL 18"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "TrinX STL"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU, Double Wall, 20H, Scharder Valve"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "18\\u00d72.125"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "22.2x480mm STL"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "22.2x150mm STL"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "25.4x200mm STL"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "TrinX"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Front: U-Brake Rear: Band Brake"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "16T, Single Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "1/2\\u00d71/8x70L"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "28Tx130mm STL"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
57	Xe Đạp Đường Phố TOURING RAPTOR Napa - Phanh Đĩa, Bánh 700C	SPWJAXW7JO	9	1	**Xe Đạp Đường Phố Touring Raptor Napa – Phanh Đĩa, Bánh 700C** | Lựa Chọn Hoàn Hảo Cho Mọi Cung Đường\nXe đạp đường phố Touring Raptor Napa là lựa chọn hoàn hảo cho những ai đam mê khám phá đường dài hoặc cần một phương tiện linh hoạt di chuyển trong đô thị.Với thiết kế khung nhôm cao cấp, bộ truyền động Shimano 24 tốc độ và hệ thống phanh đĩa thủy lực Shimano MT200.\n\n**1. Thiết Kế Cứng Cáp, Hiện Đại – Định Nghĩa Phong Cách Touring**\n\nKhung xe Raptor ALU – Siêu nhẹ, bền bỉ\nMột trong những yếu tố quan trọng nhất quyết định chất lượng xe đạp là khung xe. Raptor Napa sở hữu khung Raptor ALU, được chế tạo từ hợp kim nhôm cao cấp giúp xe có trọng lượng nhẹ nhưng vẫn đảm bảo độ cứng cáp và chịu lực tốt. Nhờ đặc tính chống ăn mòn và khả năng hấp thụ rung chấn hiệu quả, mẫu xe này trở thành lựa chọn lý tưởng cho những người đạp xe đường dài hoặc sử dụng hàng ngày.\n\n**Phuộc trước Raptor ALU** – Hấp thụ chấn động tối ưu\nTrang bị phuộc Raptor ALU 80mm, xe có khả năng giảm chấn hiệu quả khi đi qua những cung đường gồ ghề, tăng sự thoải mái khi di chuyển. Đây là một trong những ưu điểm lớn giúp xe vận hành mượt mà hơn trên đường phố và cả những đoạn đường dài.\n\n**Ba lựa chọn màu sắc hiện đại**\nRaptor Napa được thiết kế với ba phiên bản màu sắc sang trọng, phù hợp với nhiều phong cách cá nhân: Grey (Xám) – Thanh lịch và tinh tế, Dark Grey (Xám Đậm) – Cá tính và mạnh mẽ, Red (Đỏ) – Nổi bật và đầy năng lượng.\n\n**2. Hệ Thống Bánh 700C – Lăn Bánh Nhẹ Nhàng, Vận Hành Êm Ái**\nVành xe nhôm đôi – Tăng độ bền, chống cong vênh\nBánh xe 700C với vành nhôm ALU Double Wall 32H giúp tăng khả năng chịu lực, chống cong vênh khi di chuyển trên địa hình không bằng phẳng. Cấu trúc vành đôi làm tăng độ bền, giúp xe luôn giữ được độ ổn định trong thời gian dài.\nLốp xe CST 700x35C – Bám đường tốt, chống trơn trượt\nTrang bị lốp CST 700x35C, xe có khả năng bám đường cực tốt, giúp hạn chế trơn trượt khi đi qua những đoạn đường ướt hoặc gồ ghề. Kích thước 700x35C cũng đảm bảo xe vận hành êm ái, giảm lực cản để người lái có thể di chuyển nhanh hơn mà không tốn quá nhiều sức lực.\n\n**3. Bộ Truyền Động Shimano 24 Tốc Độ – Chinh Phục Mọi Địa Hình**\nTay đề Shimano M315 – Chuyển số nhanh chóng, chính xác\nBộ tay đề Shimano M315, 24 tốc độ giúp người dùng dễ dàng thao tác, chuyển số mượt mà và linh hoạt hơn. Hệ thống này giúp người lái có thể điều chỉnh tốc độ phù hợp với từng dạng địa hình khác nhau, từ đường phố bằng phẳng đến những cung đường dốc.\n\n**Bộ chuyển động trước & sau – Hiệu suất vận hành tối ưu**\nChuyển dĩa (Front Derailleur): Shimano Tourney TY601 (3 Speed) – Hỗ trợ người dùng thay đổi tốc độ linh hoạt khi leo dốc hoặc chạy trên đường bằng.\nChuyển líp (Rear Derailleur): Shimano Tourney TY300 (8 Speed) – Giúp xe vận hành trơn tru, ít bị giật khi thay đổi số.\nBộ líp Shimano CS-HG200 12-32T – Hỗ trợ đạp nhẹ, tăng tốc tốt\nVới Shimano CS-HG200 12-32T, 8 Speed, xe có khả năng tăng tốc tốt hơn trong các chặng đường dài. Sự kết hợp giữa bộ líp và bộ giò dĩa Prowheel 28/38/48Tx170mm ALU giúp việc đạp xe nhẹ hơn nhưng vẫn đảm bảo sức mạnh khi cần thiết.\n\n**4. Hệ Thống Phanh Đĩa Thủy Lực Shimano MT200 – An Toàn Tuyệt Đối**\nMột trong những yếu tố quan trọng ảnh hưởng đến sự an toàn khi đạp xe là hệ thống phanh. Raptor Napa trang bị phanh đĩa thủy lực Shimano MT200\n\nƯu điểm của phanh thủy lực Shimano MT200:\n✅ Phanh ăn chắc, lực bóp nhẹ\n✅ Không bị giảm hiệu suất khi đi mưa hay địa hình dốc\n✅ Ít bảo trì hơn so với phanh cơ\n\n**5. Trang Bị Hoàn Hảo – Mang Đến Sự Thoải Mái Khi Đạp Xe**\nGhi đông & Pô tăng – Kiểm soát dễ dàng\nGhi đông ALU 31.8x680mm giúp người lái có tư thế thoải mái, tránh mỏi tay khi đạp xe trong thời gian dài.\nPô tăng ALU 31.8x80mm tăng sự ổn định và giúp điều khiển xe linh hoạt hơn.\n\n**Cốt yên & Yên xe – Êm ái, thoải mái**\nCốt yên ALU 27.2x300mm đảm bảo độ chắc chắn, dễ dàng điều chỉnh chiều cao phù hợp.\nYên xe Raptor được thiết kế êm ái, hỗ trợ người lái ngồi lâu mà không gây khó chịu.\n\nBàn đạp nhôm – Bám tốt, chống trượt\nBàn đạp Black ALU Platform giúp chân bám chắc hơn, giảm tình trạng trượt khi đạp xe, đặc biệt khi đi dưới trời mưa hoặc đường trơn.\n 	7790000	percentage	28	10	30	hợp kim nhôm raptor alu	đen, xám, đỏ	0	t	2026-02-25 21:46:40.938866+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "M"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "\\u0110en, x\\u00e1m, \\u0111\\u1ecf"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Raptor ALU"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Raptor ALU 80mm"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU, Double Wall, 32H, Scharder Valve"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "CST 700x35C"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "31.8x680mm ALU"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "31.8x80mm ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "27.2x300mm ALU"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Raptor"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Black ALU Platform"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "Shimano M315, 24 Speed"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "Shimano Tourney TY601, 3 Speed"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "Shimano Tourney TY300, 8 Speed"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Shimano MT200 Hydraulic Disc"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "Shimano CS-HG200 12-32T, 8 Speed"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "Prowheel 28/38/48Tx170mm ALU"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
58	Xe Đạp Địa Hình MTB GIANT ATX 610 – Phanh Đĩa, Bánh 24 Inches – 2025	SPU0ERQUK7	2	2	**Xe Đạp Địa Hình MTB GIANT ATX 610 – Phanh Đĩa, Bánh 24 Inches – 2025**\n\nCấu hình xe đạp MTB GIANT ATX 610 - 2025\n\nXe Đạp Địa Hình MTB GIANT ATX 610 – Phanh Đĩa, Bánh 24 Inches – 2025 | Địa Hình Mạnh Mẽ, Đẳng Cấp Khám Phá\n\nXe đạp địa hình MTB GIANT ATX 610 là người bạn đồng hành tuyệt vời cho những ai đam mê chinh phục mọi cung đường và thử thách giới hạn bản thân. Thiết kế cứng cáp, khả năng vận hành ổn định.\n\n**1. Thiết Kế Khung Sườn Cứng Cáp, Bền Bỉ**\nXe đạp địa hình GIANT ATX 610 2025 sở hữu khung sườn GIANT Youth Aluminum Frame kích thước 24" x 12", đảm bảo độ cứng cáp nhưng vẫn nhẹ nhàng, giúp tối ưu hiệu suất di chuyển trên địa hình gồ ghề. Chất liệu hợp kim nhôm cao cấp giúp giảm trọng lượng xe, chống ăn mòn và chịu lực tốt, mang lại độ bền lâu dài.\n\n**Khung hợp kim nhôm cứng cáp, chịu lực tốt**\n\nMàu sắc đa dạng gồm Gloss Black (Đen bóng) và Latte (Cà phê sữa), mang đến phong cách trẻ trung, hiện đại, phù hợp với nhiều đối tượng người dùng.\n\n**2. Hệ Thống Giảm Xóc Êm Ái**\nGIANT ATX 610 được trang bị phuộc trước bằng thép cường lực cao cấp (High Carbon Steel Suspension Fork) với ống thẳng 1-1/8” và hành trình nhún 40mm, giúp hấp thụ xung động hiệu quả, giảm tác động từ mặt đường, mang lại cảm giác lái êm ái và ổn định.\n\n**Phuộc thép cường lực cao cấp , chống tê tay**\n\n**3. Bộ Truyền Động SHIMANO TOURNEY Chính Xác, Mượt Mà**\nChiếc MTB này được trang bị bộ truyền động SHIMANO TOURNEY 3x7, giúp xe vận hành mạnh mẽ và linh hoạt với 21 tốc độ, phù hợp cho cả đường trường và đường địa hình. Cụ thể:\n\nTay Đề Shimano Tourney 3x7: Chuyển số dễ dàng và nhanh chóng với 3 cấp độ cho dĩa và 7 cấp độ cho líp, giúp điều chỉnh tốc độ linh hoạt.\nChuyển Dĩa Trước Shimano Tourney 3 Cấp Độ: Điều chỉnh lực đạp khi leo dốc hoặc di chuyển trên đường bằng phẳng, tối ưu hóa trải nghiệm đạp xe.\nChuyển Líp Sau Shimano Tourney 7 Cấp Độ: Cho phép thay đổi tốc độ chính xác và mượt mà, đặc biệt khi di chuyển qua địa hình thay đổi độ dốc.\nBộ Líp Shimano 7S (14-28T): Dải tốc độ rộng giúp điều chỉnh linh hoạt và hiệu quả trong mọi tình huống.\nGiò Dĩa Prowheel 42/34/24 Răng: Tối ưu hóa lực đạp, giúp người lái dễ dàng vượt qua địa hình khó khăn.\nSên Xe KMC: Bền bỉ, ít giãn và giảm ma sát, duy trì tốc độ mượt mà trong suốt hành trình.\n\n\nBộ truyền động shimano Tourney 21 tốc độ  chính xác , mượt mà \n\nVới bộ truyền động này, xe có thể dễ dàng leo dốc, tăng tốc hoặc di chuyển ổn định trên nhiều dạng địa hình khác nhau.\n\n**4. Hệ Thống Bánh Xe Địa Hình Vững Chắc**\nXe sở hữu bộ bánh 24x1.95 inch với van Schrader (A/V), đảm bảo độ bám đường cao, giúp xe vận hành an toàn trên cả đường khô ráo và trơn trượt.\n\nVành xe: Hợp kim nhôm 2 lớp (Aluminum alloy double-layer rim) giúp tăng độ bền, giảm trọng lượng\nĐùm xe: Đùm đĩa bằng hợp kim nhôm giúp xe lăn mượt mà hơn\nCăm xe: 14G chắc chắn, chống cong vênh\n\nBộ bánh xe được thiết kế tối ưu giúp xe di chuyển dễ dàng trên địa hình phức tạp, thích hợp cho cả học sinh, người mới chơi hoặc người yêu thích xe đạp thể thao.\n\n**5. Hệ Thống Phanh Đĩa Cơ An Toàn**\nXe được trang bị hệ thống phanh đĩa cơ (Mechanical Disc Brake) với lực bóp nhẹ, giúp kiểm soát tốc độ chính xác và an toàn hơn so với phanh truyền thống.\n\nPhanh trước & phanh sau: Phanh đĩa cơ, giúp đảm bảo an toàn khi xuống dốc hoặc di chuyển trong điều kiện thời tiết xấu.\nPhuộc sau: Hệ thống phanh nhôm hỗ trợ ổn định khi phanh gấp.\n\n**6. Các Bộ Phận Hỗ Trợ Người Lái**\nXe được trang bị các bộ phận cao cấp, giúp tối ưu trải nghiệm người dùng:\n\nGhi đông: Hợp kim nhôm, đường kính trung tâm 25.4mm, dài 560mm, có độ nâng 20mm, góc nghiêng 10°, giúp tay cầm thoải mái và chắc chắn\nPô tăng: Hợp kim nhôm dài 60mm, cao 40mm, nâng 20°\n\n\nCốt yên: Hợp kim nhôm 30.9mm, dễ dàng điều chỉnh độ cao\nYên xe: Yên thiết kế dành riêng cho dòng xe dành cho giới trẻ, mang lại sự thoải mái khi đạp xe đường dài\n\nBàn đạp: Loại platform giúp bám chân tốt hơn khi di chuyển\n\nXe đạp địa hình GIANT ATX 610 2025 là sự phối hợp ăn ý giữa thiết kế thể thao, hệ thống truyền động Shimano bền bỉ, phanh đĩa an toàn và khung sườn chắc chắn. Là lựa chọn lý tưởng cho những ai muốn sở hữu một chiếc xe đa năng, dễ dàng di chuyển trong thành phố và khám phá địa hình.	8920000	percentage	0	12	24	hợp kim nhôm GIANT Youth Aluminum	đen, xám	0	t	2026-02-25 22:05:30.933512+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One size (24\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "\\u0110en, x\\u00e1m"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "GIANT Youth Aluminum Frame 24\\u201dX12\\u201d"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "High Carbon Steel Suspension Fork 1-1/8\\u201d Straight Tube, 40MM Suspension Travel"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "Aluminum alloy double-layer rim 24H"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "Aluminum alloy disc brake hub"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "14G"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "24x1.95 A/V Schrader valve"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "Aluminum Center Diameter 25.4mm Length 560mm Lift 20mm Back Tilt 10\\u00b0"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "Aluminum Length 60mm Height 40mm Lift 20\\u00b0"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "Aluminum 30.9mm"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Youth Saddle"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "SHIMANO TOURNEY 3X7"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "SHIMANO TOURNEY 3 Speed"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "SHIMANO TOURNEY 7 Speed"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Mechanical Disc Brake"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "7S 14-28T"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "KMC 7"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "42/34/24 Large Sprocket"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}, {"ten": "TAY TH\\u1eaeNG/BRAKE LEVERS", "gia_tri": "Aluminum Brake"}]
17	Xe Đạp Trẻ Em Youth RAPTOR Rock 2 - Bánh 20 Inch	SP25IQ6D8G	1	1	**RAPTOR Rock 2 – bánh 20 inch** là mẫu xe đạp trẻ em mang phong cách thể thao, phù hợp với các bé đã đạp xe thành thạo và bắt đầu làm quen với việc điều khiển xe linh hoạt hơn trên nhiều dạng địa hình. Kích thước bánh 20 inch giúp xe vận hành ổn định, tạo cảm giác chắc chắn để bé tự tin di chuyển và khám phá không gian xung quanh.\n\n**Khung Raptor STL 20** có độ cứng cáp cao, chịu va đập tốt và được thiết kế theo tỉ lệ cơ thể trẻ em, giúp bé giữ tư thế ngồi thoải mái, dễ kiểm soát xe. Phuộc trước Raptor STL hành trình 80mm hỗ trợ giảm xóc hiệu quả, giúp xe êm ái hơn khi đi qua các đoạn đường gồ ghề nhẹ, từ đó giảm rung lắc và tăng sự thoải mái trong suốt quá trình đạp.\n\nBộ bánh sử dụng vành nhôm Double Wall 28H mang lại độ bền cao và khả năng chịu lực tốt khi bé vận động nhiều. **Lốp OUCYS 20x2.125** có bề ngang lớn, tăng độ bám đường và độ ổn định, giúp bé kiểm soát xe tốt hơn kể cả khi ôm cua hay đi trên mặt đường không hoàn toàn bằng phẳng.\n\n**Ghi đông 31.8x620mm** bản rộng giúp bé dễ điều hướng và giữ thăng bằng, kết hợp với pô tăng 31.8x50mm cho tư thế lái chủ động, năng động. **Cốt yên 28.6x250mm** có biên độ điều chỉnh lớn, giúp xe dễ dàng “lớn lên cùng bé” theo từng giai đoạn phát triển chiều cao. Yên Raptor được thiết kế phù hợp với trẻ em, mang lại cảm giác ngồi chắc chắn và thoải mái.\n\nHệ truyền động 7 tốc độ với **tay đề Shimano RV100 và chuyển líp Shimano TZ31A** giúp bé làm quen với việc sang số, học cách điều chỉnh lực đạp phù hợp với từng tình huống. Đây là bước chuyển tiếp quan trọng, giúp bé phát triển kỹ năng kiểm soát xe và phản xạ khi đạp xe lâu hơn hoặc trên những đoạn đường thay đổi độ dốc.\n\nHệ thống phanh đĩa cơ mang lại lực phanh ổn định và dễ kiểm soát, giúp bé dừng xe an toàn trong nhiều điều kiện khác nhau. Tổng thể, Xe Đạp Trẻ Em RAPTOR Rock 2 – 20 Inch là lựa chọn lý tưởng cho các bé năng động, yêu thích cảm giác thể thao và muốn nâng cao kỹ năng đạp xe một cách an toàn, hiệu quả	3190000	percentage	12	27	20	THÉP Raptor STL 20 	BẠC, XANH đen, CAM, XÁM	0	t	2026-02-08 15:46:14.920507+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One size (20\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "B\\u1ea1c, X\\u00e1m, Cam, Xanh \\u0111en"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Raptor STL 20"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Raptor STL 20x80mm"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "31.8x620mm STL"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "31.8x50mm ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "28.6x250mm STL"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Raptor"}, {"ten": "BA\\u0300N \\u0110A\\u0323P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "Shimano RV100, 7 Speed"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "Shimano TZ31A, 7 Speed"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Mechanical disc"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "13-28T, 7 Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "7 Speed"}, {"ten": "GI\\u00d2 DI\\u0303A/CRANKSET", "gia_tri": "36x155mm STL"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU, Double Wall, 28H, Scharder Valve"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "OUCYS 20x2.125"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "Bi c\\u00f4n"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "28H"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
60	Xe Đạp Địa Hình MTB GIANT XTC 800 – Phanh Đĩa, Bánh 27 Inches	SP0JRBQMMJ	2	2	Trong thế giới của những người yêu thích đạp xe địa hình, việc sở hữu một chiếc xe đạp đáng tin cậy không chỉ là vấn đề về phương tiện di chuyển mà còn là sự tự tin khi khám phá mọi địa hình. Xe đạo địa hình MTB Giant XTC 800 được thiết kế để đáp ứng mọi thách thức trên đường mòn.\n\n**Thiết Kế Chắc Chắn và Bền Bỉ**\nGiant XTC 800 với khung nhôm siêu nhẹ nhưng vô cùng chắc chắn, giúp bạn tự tin vượt qua mọi chướng ngại vật trên địa hình đa dạng. Thiết kế khung trượt linh hoạt tăng cường khả năng kiểm soát và ổn định trên mọi địa hình.\n\n**Hiệu Suất Vượt Trội**\nVới bộ truyền động chính xác và mạnh mẽ, MTB Giant XTC 800 mang lại hiệu suất vận hành ấn tượng. Bộ truyền động 27 tốc độ cho phép bạn dễ dàng thích nghi với mọi địa hình, từ đường mòn nhẹ nhàng đến địa hình đồi núi gồ ghề.\n\n**Phanh Đĩa Shimano**\nHệ thống phanh đĩa Shimano chất lượng giúp xe dừng lại một cách an toàn và hiệu quả trên mọi điều kiện đường sá, từ đường đất đến đường đá. Điều này mang lại sự yên tâm và tự tin cho người sử dụng khi khám phá môi trường ngoài trời.\n\n**Bánh 27 Inches – Sự Linh Hoạt và Kiểm Soát**\nBánh xe 27 inches với lốp cao cấp giúp tăng cường sự linh hoạt và kiểm soát trên mọi loại địa hình. Độ bám đường tốt giúp bạn vượt qua các đoạn đường khó khăn một cách dễ dàng và an toàn.\n\n**Xe đạp địa hình MTB Giant XTC 800** không chỉ là một chiếc xe đạp địa hình thông thường, mà còn là người bạn đồng hành đáng tin cậy cho mọi cuộc phiêu lưu địa hình. Với thiết kế chắc chắn, hiệu suất vượt trội và tính linh hoạt, sản phẩm này chắc chắn sẽ là sự lựa chọn hoàn hảo cho những ai yêu thích cảm giác mạnh mẽ và thách thức trên địa hình núi rừng. Hãy sở hữu ngay chiếc xe đạp này và khám phá những cung đường mới một cách tự tin và hứng khởi!	20990000	percentage	0	8	27	nhôm ALUXX siêu nhẹ	XANH LỤC, ĐEN	0	t	2026-02-26 10:01:43.972276+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "S"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "Xanh l\\u1ee5c, \\u0111en"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Giant 27.5\\u201d ALUXX SL aluminum alloy frame"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Giant SXC 2 27.5\\u201d& 29\\u201d 1 1/8\\u201d to 1 1/2\\u201d wire- controlled locking air pressure suspension"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "Giant, double layer, aluminum alloy, disc brake only"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "Giant, aluminum alloy, bearing, disc brake"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "14G HTSS"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "QUICKSAND 27.5 x2.0 30TPI puncture resistant mountain"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "Aluminum alloy, Xiaoyan handlebar, 31.8mm"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "Aluminum alloy, 8-degree lift, 31.8mm"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "Aluminum alloy, 30.9mm"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Short nose wide version comfortable seat cushion"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Platform"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "Shimano CUES SL-U6000, 2\\u00d711 speed"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "Shimano CUES 2-speed"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "Shimano CUES 11-speed"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Shimano hydraulic disc brakes"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "Shimano CS-LG-400, 11-45T 11 speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "Shimano CN-LG500"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "Forged aluminum legs 26/40T 2-PC hollow"}, {"ten": "TAY TH\\u1eaeNG/BRAKE LEVERS", "gia_tri": "Shimano BL-MT200"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
61	Xe Đạp Địa Hình MTB TRINX M137 Elite – Phanh Đĩa, Bánh 27 Inches	SP9SVPPIZY	2	4	Xe đạp địa hình không chỉ là một phương tiện vận chuyển, mà còn là một phần của phong cách sống đầy thử thách và khám phá. Và trong thế giới xe đạp địa hình, Xe Đạp Địa Hình MTB TRINX M137 Elite là một lựa chọn đáng giá cho những người đam mê khám phá và thử thách bản thân trên mọi loại địa hình.\n\nVới sự kế thừa từ dòng sản phẩm MTB của TRINX, Xe Đạp Địa Hình MTB TRINX M137 Elite mang lại sự kết hợp hoàn hảo giữa hiệu suất và sự thoải mái. Khung nhôm TRINX 27.5″*15″ không chỉ nhẹ nhàng mà còn đảm bảo độ bền bỉ và ổn định trên mọi loại địa hình. Điều này tạo điều kiện thuận lợi cho người lái đạp khám phá những con đường hiểm trở mà không gặp phải vấn đề nào.\n\n**Hệ thống phanh đĩa TRINX Alloy Mechanical Disc và bộ truyền động Shimano** là điểm nhấn của chiếc xe này. Phanh đĩa mang lại khả năng phanh an toàn và hiệu quả, giúp người lái dễ dàng kiểm soát tốc độ trên mọi loại địa hình. Cùng với đó, bộ truyền động Shimano đem lại sự chính xác và linh hoạt trong việc chuyển số, giúp người lái dễ dàng thích nghi với mọi tình huống trên đường.\n\nKhông chỉ là một phương tiện vận chuyển, Xe Đạp Địa Hình MTB TRINX M137 Elite còn là một người bạn đồng hành đáng tin cậy trên mọi hành trình. Với khả năng vượt trội trên mọi loại địa hình, từ đường mòn đến đồi núi, sản phẩm này là lựa chọn lý tưởng cho những người đam mê thể thao địa hình và muốn thách thức bản thân. Đồng thời, với kiểu dáng thời trang và tính linh hoạt, TRINX M137 Elite cũng là lựa chọn hoàn hảo cho những người dùng muốn sử dụng xe đạp hàng ngày trong thành phố.\n\nTrên hết, Xe Đạp Địa Hình MTB TRINX M137 Elite không chỉ là một sản phẩm, mà còn là biểu tượng của tinh thần phiêu lưu và sự tự do. Nó là cánh cửa mở ra những chuyến hành trình đầy thú vị và ý nghĩa, nơi mà người lái có thể tự do khám phá và tận hưởng vẻ đẹp của thiên nhiên.	6490000	percentage	0	20	27	nhôm TRINX 27.5″*15″ 	Xanh ngọc, đen 	0	t	2026-02-26 10:12:52.014865+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "S"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "Xanh ng\\u1ecdc, \\u0111en"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "TRINX 27.5\\u2033*15\\u2033 Aluminum alloy"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Suspension Fork"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "TRINX Alloy Double Wall"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "Disc Hub with Bearing"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "CST 27.5\\u2033*2.10\\u2033 30TPI"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "TRINX EXP"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "TRINX EXP Alloy"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "TRINX EXP Alloy"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "TRINX"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Platform"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "Shimano ST-EF500"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "Shimano Tourney FD-TY300"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "Shimano Tourney FD-TY200"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "TRINX Alloy Mechanical Disc"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "Shimano MF-TZ500-7, 14/28T"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "Maya"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "TRINX 42/34/24T"}, {"ten": "TAY TH\\u1eaeNG/BRAKE LEVERS", "gia_tri": "Shimano ST-EF500"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}, {"ten": "K\\u00cdCH TH\\u01af\\u1edaC \\u0110\\u00d3NG TH\\u00d9NG / PACKING SIZE", "gia_tri": "L142 x W20 x H77"}]
62	Xe Đạp Địa Hình MTB JEEP Jupiter PS-06 Disc, Phanh Đĩa – Bánh 27 Inches	SPL52UQGXF	2	10	**Xe Đạp Địa Hình MTB JEEP Jupiter PS-06 Disc, Phanh Đĩa – Bánh 27.5 Inches**\n\n**1. Thiết kế hiện đại và màu sắc nổi bật**\n\nKích cỡ:\nXe được thiết kế với kích thước One size (27.5"), phù hợp với người sử dụng có vóc dáng trung bình và lớn. Thiết kế tối ưu mang lại cảm giác thoải mái và khả năng kiểm soát xe vượt trội, giúp người dùng dễ dàng di chuyển trên các địa hình đa dạng, từ đường bằng phẳng đến đường mấp mô.\nMàu sắc:\nXe đạp JEEP Jupiter PS-06 Disc mang đến ba lựa chọn màu sắc độc đáo và thời thượng: Trắng/Đen, Xanh/Cam, Xám/Cam. Những gam màu này không chỉ nổi bật mà còn thể hiện phong cách cá nhân, phù hợp với xu hướng hiện đại và trẻ trung.\n\n**2. Khung xe và phuộc chắc chắn**\n\nChất liệu khung Jeep ALU:\nKhung xe được chế tạo từ hợp kim nhôm cao cấp Jeep ALU, mang lại độ cứng cáp và khả năng chịu lực tuyệt vời. Đồng thời, chất liệu nhôm giúp xe giảm trọng lượng, tăng tính linh hoạt và dễ dàng di chuyển trên mọi cung đường.\nPhuộc Jeep STL 26x100mm:\nPhuộc trước bằng thép Jeep STL với kích thước 26x100mm hỗ trợ giảm xóc hiệu quả, giúp hấp thụ rung chấn khi di chuyển trên địa hình gồ ghề, mang lại trải nghiệm lái xe êm ái và thoải mái.\n\n**3. Hệ thống bánh xe mạnh mẽ**\n\nVành xe ALU Double Wall:\nVành nhôm hai lớp 36H được thiết kế chắc chắn, tăng khả năng chịu lực và độ bền. Đây là sự lựa chọn lý tưởng cho các chuyến đi dài và những địa hình khó khăn.\nLốp xe Jeep 27.5×2.10:\nLốp xe kích thước lớn, có bề mặt tiếp xúc rộng giúp tăng độ bám đường và đảm bảo an toàn. Với khả năng vận hành ổn định, lốp xe Jeep phù hợp để chinh phục nhiều loại địa hình khác nhau, từ đường mòn đến đường cát sỏi.\n\n**4. Hệ thống điều khiển thoải mái**\n\nGhi đông 31.8x640mm STL:\nGhi đông bằng thép bền bỉ, thiết kế kích thước rộng giúp người lái kiểm soát xe dễ dàng và giảm mỏi tay khi di chuyển trên các cung đường dài.\nPô tăng 31.8x80mm ALU:\nPô tăng hợp kim nhôm nhẹ và chắc chắn, hỗ trợ người lái tối ưu hóa tư thế điều khiển xe, giúp giảm áp lực lên vai và cổ, mang lại cảm giác thoải mái trong suốt hành trình.\nCốt yên và yên xe Jeep:\nCốt yên thép 30.4x300mm STL chắc chắn, kết hợp với yên xe Jeep êm ái, hỗ trợ người dùng ngồi lâu mà không cảm thấy khó chịu. Cốt yên còn có thể điều chỉnh độ cao để phù hợp với chiều cao của từng người sử dụng.\n\n**5. Hệ thống truyền động mạnh mẽ**\n\nTay đề Jeep, 24 Speed:\nTay đề 24 tốc độ cho phép người dùng dễ dàng điều chỉnh tốc độ phù hợp với từng địa hình và mục đích sử dụng, mang lại trải nghiệm vận hành linh hoạt và mượt mà.\nChuyển đĩa Jeep, 3 Speed:\nChuyển đĩa trước hỗ trợ thay đổi tốc độ nhanh chóng, giúp xe tăng tốc hoặc leo dốc dễ dàng hơn.\nChuyển líp Jeep, 8 Speed:\nChuyển líp sau đảm bảo sự chính xác và ổn định trong quá trình vận hành, giúp người dùng tự tin di chuyển trên mọi loại địa hình.\nBộ líp 13-28T, 8 Speed:\nBộ líp với dải số rộng mang lại khả năng vận hành ổn định trên cả những đoạn đường bằng phẳng lẫn địa hình dốc.\nGiò đĩa 22/32/42x170mm STL:\nGiò đĩa thép chắc chắn, đảm bảo lực đạp mạnh mẽ và hiệu quả, giúp người dùng vượt qua các chướng ngại vật một cách dễ dàng.\nSên xe 1/2×3/32 8 Speed:\nSên xe chất lượng cao, giúp hệ thống truyền động vận hành trơn tru và giảm thiểu hao mòn sau thời gian dài sử dụng.\n\n**6. Hệ thống phanh đĩa cơ an toàn**\n\nPhanh Jeep Mechanical Disc:\nHệ thống phanh đĩa cơ được thiết kế mạnh mẽ, đảm bảo lực phanh ổn định và khả năng kiểm soát chính xác. Đây là yếu tố quan trọng giúp người dùng tự tin di chuyển trên địa hình phức tạp hoặc trong điều kiện thời tiết khắc nghiệt.\nTay thắng Jeep:\nTay thắng được thiết kế vừa vặn và dễ sử dụng, giúp người lái kiểm soát tốc độ tốt hơn trong mọi tình huống, đảm bảo an toàn tối đa.\n\n**7. Trọng lượng nhẹ và tính tiện lợi**\n\nTrọng lượng:\nNhờ sử dụng khung hợp kim nhôm và các linh kiện chất lượng cao, xe có trọng lượng nhẹ, giúp người dùng dễ dàng điều khiển và mang vác khi cần thiết.\nThiết kế gọn gàng:\nXe có kiểu dáng nhỏ gọn nhưng vẫn đảm bảo sự chắc chắn và bền bỉ, dễ dàng cất giữ hoặc vận chuyển khi cần.\nTại sao nên chọn JEEP Jupiter PS-06 Disc?\n\nThiết kế thời thượng:\nVới kiểu dáng hiện đại, màu sắc đa dạng, mẫu xe này không chỉ là phương tiện di chuyển mà còn là một phụ kiện thời trang.\nHiệu suất vượt trội:\nHệ thống truyền động mạnh mẽ, phanh đĩa an toàn và bánh xe linh hoạt mang lại trải nghiệm vận hành tuyệt vời trên mọi địa hình.\nĐộ bền cao:\nChất liệu khung hợp kim nhôm cùng các linh kiện chất lượng đảm bảo tuổi thọ lâu dài, là lựa chọn đáng tin cậy cho những chuyến đi dài.\nXe Đạp Địa Hình MTB JEEP Jupiter PS-06 Disc, Phanh Đĩa – Bánh 27.5 Inches là sự kết hợp hoàn hảo giữa thiết kế đẹp mắt, tính năng hiện đại và độ bền bỉ, phù hợp với mọi nhu cầu di chuyển, từ giải trí đến vận động thể thao.	6100000	percentage	0	19	27	hợp kim nhôm jeep ALU	TRẮNG, ĐEN, XÁM	0	t	2026-02-27 20:33:59.89116+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One size (27\\u2033)"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "Tr\\u1eafng, \\u0111en, x\\u00e1m"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Jeep ALU"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Jeep STL"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU, Double Wall, 36H, Schrader valve"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Jeep 27.5\\u00d72.10"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Jeep"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "Jeep"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": " Jeep, 3 Speed"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": " Jeep, 8 Speed"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Jeep Mechanical Disc"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
63	Xe Đạp Địa Hình MTB TRINX GT27.5 – Phanh Đĩa, Bánh 27 Inches	SPOIAUD8WK	2	4	**Đặc điểm nổi bật của TRINX GT27.5**\n**Khung nhôm siêu nhẹ & Bền bỉ:** Khung sườn làm từ nhôm 6061 không chỉ giúp xe nhẹ hơn mà còn chống ăn mòn cực tốt. Thiết kế dây cáp đi âm sườn giúp xe trông gọn gàng, tinh tế và sang trọng.\n\nBánh 27 inches – Kích thước vàng: So với bánh 26", bánh 27" cho khả năng lướt nhanh hơn và vượt chướng ngại vật (ổ gà, đá sỏi) êm ái hơn, nhưng vẫn giữ được sự linh hoạt cần thiết mà bánh 29" không có.\n\n**Hệ thống phanh đĩa dầu an toàn:** Điểm đáng ăn tiền nhất là hệ thống phanh đĩa dầu thủy lực. Khác với phanh cơ, phanh dầu cho lực bóp rất nhẹ, độ phản hồi chính xác và hoạt động ổn định ngay cả trong điều kiện trời mưa hoặc bùn lầy.\n\n**Bộ truyền động linh hoạt:** Với 24 tốc độ, bạn có thể dễ dàng chuyển đổi giữa các chế độ: leo dốc nhẹ nhàng, đi đường bằng tốc độ cao hay dạo phố thư thả.\n\n**Phuộc nhún có khóa:** Giúp bạn linh hoạt tùy chỉnh: mở khóa khi đi đường gồ ghề để giảm chấn, hoặc khóa lại khi đi đường nhựa để tiết kiệm sức lực và tăng tốc tốt hơn.\n\n**Đối tượng sử dụng phù hợp**\nNgười mới bắt đầu làm quen với xe đạp địa hình.\n\nHọc sinh, sinh viên hoặc nhân viên văn phòng cần một phương tiện bền bỉ để đi học, đi làm.\n\nNgười tập thể dục hàng ngày trên nhiều loại địa hình hỗn hợp.	5390000	percentage	5	10	27	Hợp kim nhôm 6061 cao cấp	đen đỏ, đen xanh, xám cam, xám, xám trắng	0	t	2026-02-27 20:52:29.853599+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One size (27\\u2033)"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "\\u0111en \\u0111\\u1ecf, \\u0111en xanh, x\\u00e1m cam, x\\u00e1m, x\\u00e1m tr\\u1eafng"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "H\\u1ee3p kim nh\\u00f4m 6061 cao c\\u1ea5p"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Phu\\u1ed9c l\\u00f2 xo h\\u1ee3p kim nh\\u00f4m, c\\u00f3 kh\\u00f3a h\\u00e0nh tr\\u00ecnh (Lock-out)."}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "H\\u1ee3p kim nh\\u00f4m 2 l\\u1edbp TRINX."}, {"ten": "B\\u1ed8 TRUY\\u1ec0N \\u0110\\u1ed8NG", "gia_tri": "Shimano 24 t\\u1ed1c \\u0111\\u1ed9 (3 \\u0111\\u0129a x 8 l\\u00edp) ho\\u1eb7c L-Twoo (t\\u00f9y phi\\u00ean b\\u1ea3n)."}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "CST/Kenda 27.5\\" x 1.95\\" chuy\\u00ean d\\u1ee5ng cho \\u0111\\u1ecba h\\u00ecnh."}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "H\\u1ee3p kim nh\\u00f4m ch\\u00ednh h\\u00e3ng TRINX."}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "Shimano ST-EF505 / L-Twoo A3."}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "Shimano Tourney / L-Twoo."}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "Shimano Tourney / L-Twoo."}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "8 t\\u1ea7ng Index (13-32T)."}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "TRINX 24/34/42T x 170L."}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "~14.5 kg."}]
64	Xe Đạp Nữ Đường Phố Touring RAPTOR Mocha 1 - Phanh Đĩa, Bánh 24 Inch	SPWXW0625O	4	1	**Xe Đạp Đường Phố Touring RAPTOR Mocha 1 - 24 Inch | Thiết Kế Gọn Nhẹ, Đa Dụng, Chuẩn Phong Cách Thành Thị**\n\nRAPTOR Mocha 1 là lựa chọn lý tưởng cho những ai đang tìm kiếm một chiếc xe đạp đường phố nhỏ gọn, linh hoạt và dễ điều khiển trong đô thị. Với thiết kế bánh 24 inch và khung nhôm Raptor ALU 24 nhẹ nhàng, chiếc xe phù hợp với nhiều đối tượng sử dụng – từ học sinh, sinh viên đến người đi làm hàng ngày.\n\n**1. Thiết kế nhỏ gọn – Dễ dàng kiểm soát**\nVới kích thước bánh 24 inch và khung xe được thiết kế theo chuẩn One Size, RAPTOR Mocha 1 phù hợp với người có chiều cao trung bình, đặc biệt là học sinh, sinh viên, hoặc người mới bắt đầu đi xe đạp. Xe nhẹ, dễ điều khiển, đặc biệt linh hoạt khi di chuyển trong thành phố, qua các ngõ nhỏ hay đường đông người.\n\n**2. Khung nhôm cao cấp – Chắc chắn nhưng siêu nhẹ**\nKhung và phuộc xe đều được làm từ hợp kim nhôm Raptor ALU 24, mang lại sự cân bằng tuyệt vời giữa độ bền và trọng lượng. Đây là điểm cộng lớn khi bạn cần một chiếc xe đạp dễ mang vác, bền bỉ với thời gian nhưng vẫn không quá nặng khi đạp đường dài.\n\n**3. Hệ truyền động Shimano 7 cấp – Mượt mà trên mọi địa hình**\n\nTrang bị tay đề xoay Revoshift SL-RV100 và củ đề sau Shimano Tourney TY300, xe hỗ trợ người lái chuyển đổi linh hoạt 7 cấp độ tuỳ theo độ dốc và địa hình. Bộ líp 14-28T kết hợp với giò đĩa 42 răng giúp đạp nhẹ nhàng khi leo dốc và tối ưu tốc độ khi đi đường bằng.\n\n**4. Hệ thống phanh đĩa cơ – An toàn vượt trội**\nXe sử dụng phanh đĩa cơ trước và sau – một điểm cộng lớn về độ an toàn so với phanh vành truyền thống. Phanh đĩa hoạt động ổn định trong điều kiện thời tiết ẩm ướt, đảm bảo lực phanh chính xác, giúp bạn làm chủ tốc độ trong mọi tình huống khẩn cấp.\n\n**5. Trang bị ổn định, phù hợp cho nhu cầu đi học – đi làm**\nCác chi tiết như ghi đông nhôm 580mm, pô tăng nhôm 180mm và cốt yên 27.2x300mm đều được thiết kế để tối ưu tư thế ngồi thoải mái và khả năng điều khiển. Yên xe Raptor mềm mại, tạo cảm giác dễ chịu khi sử dụng lâu dài. Bàn đạp PP chống trơn trượt, phù hợp với mọi đối tượng sử dụng.\n\n**6. Kiểu dáng hiện đại – Màu sắc trẻ trung**\nTông màu Blue và White mang lại vẻ ngoài năng động, dễ phối với nhiều phong cách. Đây là chiếc xe không chỉ dùng để đi lại hằng ngày, mà còn thể hiện gu thẩm mỹ và cá tính riêng của người dùng.\n\nĐừng bỏ lỡ cơ hội sở hữu ngay chiếc xe đạp đường phố nhỏ gọn, mạnh mẽ và mang đậm dấu ấn cá nhân như RAPTOR Mocha 1! Với thiết kế thông minh, hiệu năng vượt trội cùng màu sắc trẻ trung hiện đại, chiếc xe này chắc chắn sẽ là người bạn đồng hành lý tưởng trong mọi hành trình – từ đi học, đi làm đến dạo phố thư giãn mỗi ngày. 	5390000	percentage	0	10	24	nhôm raptor alu	trắng, xanh lục	0	t	2026-02-27 21:04:19.509073+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One Size (24\\")"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "Tr\\u1eafng, xanh l\\u1ee5c"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "Raptor ALU 24"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Raptor ALU 24"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "ALU, Single Wall, 28H, Scharder Valve"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "ALU, b\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "28H"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "CST 24x1.25"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "25.4x580mm ALU"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "25.4x180mm ALU"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "27.2x300mm ALU"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Raptor"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Black PP Platform"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "Shimano Revoshift SL-RV100, 7 Speed"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "Shimano Tourney TY300, 7 Speed"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Mechanical Disc"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "14-28T, 7 Speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "7 Speed"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "42x170mm STL"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "B\\u1ea1c \\u0111\\u1ea1n"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
66	Xe Đạp Nữ Đường Phố Touring LIV Alight 4 Disc - Phanh Đĩa, Bánh 700C - 2025	SPVKOMNCXQ	4	5	**Xe Đạp Đường Phố Touring LIV Alight 4 Disc - Phanh Đĩa, Bánh 700C - 2025**\n\nLIV Alight 4 Disc 2025 không chỉ là một chiếc xe đạp đường phố thông thường, mà còn là tuyên ngôn cá tính dành cho những ai yêu thích sự năng động và hiện đại. Với thiết kế khung nhẹ, hệ thống truyền động linh hoạt và phanh đĩa an toàn, mẫu xe này là lựa chọn lý tưởng cho những chuyến đi trong thành phố, dạo chơi cuối tuần hay thậm chí là tập luyện thể dục hàng ngày.\n\n**1. Thiết kế nổi bật với sắc màu độc đáo trong các dòng xe touring**\nLIV Alight 4 Disc có hai kích cỡ S và XS, phù hợp với nhiều vóc dáng, đặc biệt là người dùng nữ hoặc những ai yêu thích một chiếc xe dễ kiểm soát. Đặc biệt sở hữu combo màu sắc nổi bật hơn hẳn so với các dòng xe touring khác như Bali Bricks - tông cam đất hiếm thấy, giúp bạn trở nên mạnh mẽ và phong cách hơn trên mọi nẻo đường hay tối giản hơn với màu Asphalt Green nhưng vẫn không kém phần sang trọng.\n\nKhung xe được làm từ ALUXX-grade aluminum, một loại hợp kim nhôm cao cấp giúp xe có trọng lượng nhẹ nhưng vẫn đảm bảo độ cứng cáp, mang lại cảm giác lái chắc chắn và linh hoạt.\n\nPhuộc thép cứng cáp với độ ổn định cao. Không giống nhiều mẫu touring khác sử dụng phuộc hợp kim nhôm hoặc carbon, LIV Alight 4 Disc trang bị phuộc High Tensile Steel, giúp xe ổn định hơn, đặc biệt khi di chuyển trên các con đường gồ ghề hoặc vỉa hè đô thị.\n\n**2. Lốp GIANT S-X3 êm ái và linh hoạt**\nXe được trang bị bánh 700C kết hợp với lốp Giant S-X3 700x38C, mang đến những lợi ích vượt trội:\n\nBám đường tốt, giúp xe di chuyển ổn định ngay cả trên bề mặt trơn trượt.\nGiảm xóc nhẹ nhàng, mang lại trải nghiệm lái xe êm ái hơn.\nDễ dàng vượt qua địa hình gồ ghề, phù hợp cho cả đường thành phố lẫn những đoạn đường ngoại ô.\nBộ vành Giant GX Disc wheelset, kết hợp với đùm Giant alloy, QR và căm stainless, tạo nên hệ thống bánh xe chắc chắn, đảm bảo độ bền theo thời gian.\n\n**3. Ghi đông nâng nhẹ, tư thế lái thoải mái**\nGhi đông Giant Sport AT 25.4mm, 20mm riser: Thiết kế nâng nhẹ giúp tay lái thoải mái, không gây áp lực lên cổ tay và vai khi đạp xe trong thời gian dài.\nPô tăng Giant Sport 25.4mm: Hỗ trợ kiểm soát tay lái tốt hơn, mang lại cảm giác vững chắc khi di chuyển qua các đoạn đường đông đúc.\n \nCốt yên Giant D-Fuse alloy 30.9mm: Công nghệ độc quyền của Giant giúp hấp thụ rung chấn tốt hơn, giảm cảm giác tê mỏi khi di chuyển xa.\nYên Liv Sport Saddle: Được thiết kế riêng cho dòng xe touring, mang đến sự thoải mái tối đa trong mọi chuyến đi.\n \n**4. Truyền động Shimano Tourney 1×8, cảm giác lái đơn giản, hiệu quả**\nLIV Alight 4 Disc 2025 sử dụng hệ thống truyền động 1×8 tốc độ với tay đề Shimano Tourney, giúp người dùng dễ dàng chuyển số mà không cần quá nhiều thao tác.\n\nTay đề Shimano Tourney 1×8 – Sang số mượt mà, dễ dàng điều chỉnh tốc độ.\nChuyển líp Shimano Tourney – Hoạt động ổn định, bền bỉ.\nBộ líp Shimano CS-HG200-8 (12×32T) – Dải số rộng, hỗ trợ tốt khi leo dốc hoặc tăng tốc.\nGiò đĩa Forged Alloy 40T – Độ bền cao, đảm bảo hiệu suất đạp ổn định.\nSên KMC Z8.3 – Chắc chắn, hạn chế giãn sên trong quá trình sử dụng lâu dài.\nXe sử dụng phanh đĩa cơ Tektro TKB-172, kết hợp với tay thắng Tektro mechanical, mang đến lực phanh ổn định và đáng tin cậy.\n \nĐiểm nhấn đáng chú ý của hệ thống 1x8 trên LIV Alight 4 Disc 2025 chính là sự đơn giản và tiện lợi. Người dùng không cần bận tâm đến việc chuyển đĩa trước, từ đó giảm thiểu những thao tác phức tạp khi điều chỉnh tốc độ. Hơn nữa, thiết kế này còn giúp giảm trọng lượng xe, mang lại sự linh hoạt khi di chuyển trong môi trường đô thị. Đặc biệt, hệ thống 1x8 được đánh giá cao về độ bền và khả năng bảo trì dễ dàng, khiến đây trở thành lựa chọn lý tưởng cho những ai tìm kiếm một mẫu xe vừa năng động, vừa bền bỉ để đồng hành trên mọi hành trình.	10790000	percentage	7	10	27	hợp kim nhôm aluxx	cam, đen	2	t	2026-02-27 21:29:59.224095+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "S"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "Cam, \\u0111en"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "ALUXX-grade aluminum, disc"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "high tensile steel, disc"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "Giant GX Disc wheelset"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "Giant alloy, QR"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "stainless"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Giant S-X3, 700x38c"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "Giant Sport at, 25.4mm, 20mm riser X"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "Giant Sport, 25.4mm"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "Giant D-Fuse, alloy, 30.9mm"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Liv Sport Saddle"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "platform"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "Shimano Revoshift SL-RV400, 8 Speed"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "Shimano Tourney"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Tektro TKB-172 mechanical"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "Shimano CS-HG200-8, 12\\u00d732"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "KMC Z8.3"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "Forged Alloy, 40t"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "threaded"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}, {"ten": "TAY TH\\u1eaeNG/BRAKE LEVERS", "gia_tri": "Tektro mechanical"}]
67	Xe Đạp Nữ Đường Phố Touring LIV Alight 3 Disc - Phanh Đĩa, Bánh 700C - 2025	SPCGN0HKLK	4	5	**Xe Đạp Đường Phố Touring LIV Alight 3 Disc - Phanh Đĩa, Bánh 700C - 2025**\n\nBạn đang tìm kiếm một chiếc xe đạp thể thao vừa mạnh mẽ, bền bỉ, lại mang thiết kế tinh tế dành riêng cho nữ giới? LIV Alight 3 Disc 2025 chính là lựa chọn hoàn hảo dành cho bạn. Đây không chỉ là một phương tiện di chuyển, mà còn là tuyên ngôn cá tính của phái nữ, giúp bạn tự tin chinh phục những con đường hàng ngày, từ đi làm, đi học, cho đến tập luyện thể thao hay khám phá những trải nghiệm mới.\n\n**1. Thiết kế hợp kim nhôm nhẹ, khung xe hiện đại dành cho bạn gái**\nLIV Alight 3 Disc 2025 là mẫu xe đạp touring đường phố được thiết kế dành riêng cho các bạn nữ năng động yêu thích di chuyển linh hoạt, tập luyện thể thao và khám phá thành phố. Với màu sắc Pale Olive trang nhã, khung xe thanh thoát và những đường nét tinh tế, chiếc xe này không chỉ là phương tiện di chuyển mà còn là biểu tượng của phong cách và sự năng động.\n\nKhung xe được chế tạo từ hợp kim nhôm ALUXX-grade nhẹ và bền, giúp giảm trọng lượng mà vẫn đảm bảo độ cứng cáp. Thiết kế khung có độ thấp vừa phải, giúp việc lên xuống xe trở nên dễ dàng hơn, phù hợp với người dùng có vóc dáng nhỏ nhắn.\n\n**2. Bộ truyền động Shimano mang lại hiệu suất vận hành ấn tượng**\nLIV Alight 3 Disc 2025 được trang bị bộ truyền động Shimano Altus 2×8, cung cấp 16 tốc độ linh hoạt, giúp các chị em dễ dàng di chuyển trong nhiều điều kiện đường xá khác nhau. Dù là leo dốc, băng qua phố đông hay tăng tốc trên đường thẳng, hệ thống chuyển số mượt mà sẽ mang lại cảm giác lái nhẹ nhàng và hiệu quả.\n\nBên cạnh đó, lốp Giant S-X3 có kích thước 700x38c với khả năng chống đâm thủng, đảm bảo phái đẹp luôn giữ được tay lái ổn định khi di chuyển trên cả đường nhựa lẫn những con đường gồ ghề. Cùng với đó, vành xe Giant GX Disc wheelset chắc chắn, giúp xe có độ bền cao và chịu được những tác động mạnh từ địa hình.\n\n**3. Hệ thống phanh đĩa an toàn tuyệt đối cho phái yếu**\nMột trong những điểm mạnh của LIV Alight 3 Disc 2025 chính là hệ thống phanh đĩa thủy lực Tektro HD-T275 (trước) và HD-R280 (sau). Công nghệ phanh thủy lực mang đến khả năng kiểm soát tốc độ vượt trội, giúp bạn an toàn hơn khi di chuyển trên những đoạn đường dốc hoặc khi thời tiết xấu. Dù là trời mưa hay đường trơn trượt, hệ thống phanh vẫn đảm bảo phản hồi nhanh và lực bóp nhẹ nhàng.\n\n**4. Trải nghiệm êm ái cho tay lái nữ**\nGhi đông Giant Sport AT với thiết kế 25.4mm và độ nâng 20mm giúp người lái có tư thế thoải mái, giảm áp lực lên vai và cổ tay trong những hành trình dài. Yên xe Liv ErgoMax được thiết kế phù hợp với cấu trúc cơ thể nữ giới, mang lại sự êm ái và dễ chịu ngay cả khi đạp xe trong thời gian dài.\n\nCốt yên Giant D-Fuse bằng hợp kim nhôm giúp giảm rung động từ mặt đường, mang lại sự ổn định và thoải mái hơn trong suốt quá trình di chuyển. Điều này đặc biệt hữu ích khi bạn phải di chuyển trên các đoạn đường sỏi hoặc những con phố không bằng phẳng. Xe còn được trang bị bàn đạp GIANT Urban Fitness, phù hợp với nhiều loại giày dép và tạo cảm giác chắc chắn khi đạp. Khung xe cũng được tích hợp giá đỡ, giúp bạn dễ dàng gắn thêm baga hoặc giỏ xe để chở đồ tiện lợi.	11290000	percentage	0	11	27	hợp kim nhôm aluxx	tím, vàng kem	0	t	2026-02-27 21:41:39.893821+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "XS"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "T\\u00edm, v\\u00e0ng kem"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "ALUXX-grade aluminum, disc"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "high tensile steel, disc"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "Giant GX Disc wheelset"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "Giant alloy, QR"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "stainless"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Giant S-X3, 700x38c"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "Giant Sport at, 25.4mm, 20mm riser"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "Giant Sport, 25.4mm"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "Giant D-Fuse, alloy"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Liv ErgoMax"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "platform"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "Shimano M315, 16 Speed"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "Shimano Touney TY606, 2 Speed"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "Shimano Altus TY310, 8 Speed"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Tektro [F] HD-T275, [R] HD-R280 hydraulic"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "Shimano CS-HG318, 11\\u00d734"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "KMC Z8.3"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "Forged alloy, 30/46 with chainguard"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "cartridge"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}, {"ten": "TAY TH\\u1eaeNG/BRAKE LEVERS", "gia_tri": "Tektro hydraulic"}]
69	Xe Đạp Nữ Đường Phố Touring LIV Alight 2 DD City Disc - Phanh Đĩa, Bánh 700C - 2022	SPLRKPDNO8	4	5	**Xe Đạp Đường Phố Touring LIV Alight 2 DD City Disc – Phanh Đĩa, Bánh 700C – 2022**\n\nLIV Alight 2 DD City Disc – Phanh Đĩa, Bánh 700C – 2022 là mẫu xe đạp đường phố hoàn hảo dành cho những ai yêu thích sự thoải mái và linh hoạt khi di chuyển trong đô thị hoặc trên những cung đường dài. Với thiết kế hiện đại, chất liệu cao cấp và hệ thống phanh đĩa thủy lực an toàn, chiếc xe này là người bạn đồng hành lý tưởng cho mọi nhu cầu di chuyển hàng ngày.\n\n**1. Thiết kế hiện đại và màu sắc thanh lịch**\n\nKích cỡ:\nXe có ba kích cỡ XS, S và M, phù hợp với nhiều đối tượng người dùng có vóc dáng khác nhau. Thiết kế linh hoạt này giúp tối ưu hóa tư thế lái, mang lại cảm giác thoải mái và hiệu suất vận hành tối đa.\nMàu sắc:\nTông màu Eucalyptus (màu xanh bạch đàn) mang lại vẻ ngoài nhẹ nhàng, thanh lịch nhưng vẫn rất hiện đại, phù hợp với phong cách sống năng động của những người yêu thích xe đạp.\n\n**2. Khung xe ALUXX-Grade Aluminum bền nhẹ**\n\nChất liệu khung:\nKhung xe được làm từ hợp kim nhôm ALUXX-Grade Aluminum, giúp giảm trọng lượng nhưng vẫn đảm bảo độ cứng cáp và khả năng chịu lực tốt. Đây là lựa chọn tối ưu cho việc di chuyển trong môi trường đô thị hoặc các chuyến đi dài ngày.\nPhuộc trước:\nPhuộc trước cũng được làm từ ALUXX-Grade Aluminum, tích hợp phanh đĩa, mang lại sự ổn định và khả năng giảm chấn tốt khi đi qua các đoạn đường không bằng phẳng.\n\n**3. Hệ thống bánh xe và lốp chống thủng**\n\nVành xe Giant GX Disc Wheelset:\nVành xe hợp kim nhôm chất lượng cao, thiết kế đặc biệt dành cho phanh đĩa, mang lại sự chắc chắn và độ ổn định cao trong quá trình di chuyển.\nĐùm xe Aluminum alloy và căm Stainless:\nĐùm xe hợp kim nhôm cùng căm thép không gỉ 14g giúp bánh xe bền bỉ, nhẹ nhàng và ổn định trên mọi cung đường.\nLốp Giant S-X2, puncture protect:\nLốp xe kích thước 700x38c tích hợp lớp bảo vệ chống thủng, mang lại sự an tâm và khả năng bám đường tốt khi di chuyển trên cả địa hình bằng phẳng lẫn gồ ghề.\n\n**4. Hệ thống điều khiển thoải mái**\n\nGhi đông Giant Sport:\nGhi đông với đường kính 31.8mm được thiết kế thoải mái, mang lại khả năng điều khiển linh hoạt, giảm áp lực lên vai và cổ.\nPô tăng Giant Sport:\nPô tăng bằng hợp kim nhôm bền nhẹ, giúp điều chỉnh tư thế lái dễ dàng, mang lại cảm giác thoải mái cho người dùng.\nCốt yên Giant Sport:\nCốt yên kích thước 27.2mm, được thiết kế chắc chắn, hỗ trợ tốt trong việc giảm rung lắc khi di chuyển.\nYên xe Liv Sport Comfort:\nYên xe được thiết kế với lớp đệm êm ái, mang lại sự thoải mái vượt trội trong suốt hành trình\n\n**5. Hệ thống truyền động Shimano 2x8 linh hoạt**\n\nTay đề Shimano SL-M315 2x8:\nTay đề chính xác, dễ sử dụng, hỗ trợ người lái thay đổi tốc độ một cách mượt mà và nhanh chóng.\nChuyển đĩa Shimano Tourney và chuyển líp Shimano Altus:\nHệ thống chuyển số với 2 đĩa trước và 8 líp sau mang lại dải tốc độ linh hoạt, phù hợp cho cả những đoạn đường bằng phẳng lẫn các địa hình dốc.\nBộ líp Shimano CS-HG31, 11×34:\nBộ líp 8 tốc độ với dải số rộng, hỗ trợ việc tăng tốc dễ dàng và leo dốc hiệu quả.\nGiò đĩa Shimano FC-TY501 (30/46T):\nGiò đĩa hai tầng chắc chắn, phù hợp cho việc đạp xe trong thành phố và các cung đường dài.\nSên xe KMC Z8.3:\nSên xe chất lượng cao giúp hệ thống truyền động vận hành êm ái và bền bỉ.\n\n**6. Hệ thống phanh đĩa thủy lực Tektro an toàn**\n\nPhanh Tektro HD-R280 hydraulic disc:\nHệ thống phanh đĩa thủy lực mạnh mẽ, mang lại lực phanh chính xác và khả năng kiểm soát tốt trong mọi điều kiện thời tiết, từ đường khô ráo đến trơn trượt.\nTay thắng Tektro hydraulic:\nTay thắng nhẹ, dễ thao tác, giúp người lái cảm thấy an toàn và tự tin khi dừng xe hoặc điều chỉnh tốc độ.\n\n**7. Trọng lượng nhẹ và kích thước đóng gói tiện lợi**\n\nTrọng lượng:\nNhờ sử dụng khung nhôm và các linh kiện nhẹ, xe luôn duy trì trọng lượng ở mức tối ưu, giúp người dùng dễ dàng điều khiển và mang lại cảm giác thoải mái trong suốt hành trình.\n**Kích thước đóng thùng:**\nXe được đóng gói với kích thước L137 x W20 x H84, thuận tiện cho việc vận chuyển và lưu trữ.\n\nKết luận: Sự lựa chọn hoàn hảo cho phụ nữ năng động\n\nLIV Alight 2 DD City Disc – Phanh Đĩa, Bánh 700C – 2022 là mẫu xe đạp touring đường phố lý tưởng dành cho phụ nữ hiện đại. Với thiết kế đẹp mắt, hệ thống truyền động linh hoạt, phanh đĩa thủy lực an toàn và khả năng vận hành mượt mà, mẫu xe này mang lại trải nghiệm tối ưu trên mọi cung đường, từ đi làm hàng ngày đến các chuyến dạo chơi cuối tuần.\n\nHãy sở hữu ngay LIV Alight 2 DD City Disc để trải nghiệm sự khác biệt và tận hưởng những hành trình đáng	13990000	percentage	0	10	27	hợp kim nhôm aluxx	xanh lục nhạt	4	t	2026-02-27 22:00:26.071186+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "M"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "Xanh l\\u1ee5c nh\\u1ea1t"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "ALUXX-Grade Aluminum"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "ALUXX-Grade Aluminum fork, disc"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "Giant GX Disc Wheelset"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "Aluminum alloy"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "Stainless, 14g"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Giant S-X2, puncture protect, 700x38c"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "Giant Sport, 31.8mm"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "Giant Sport"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "Giant Sport, 27.2mm"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Liv Sport Comfort"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Urban fitness"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "Shimano SL-M315 2\\u00d78"}, {"ten": "CHUY\\u1ec2N \\u0110\\u0128A/FRONT DERAILLEUR", "gia_tri": "Shimano Tourney 2-speed"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "Shimano Tourney RD-Shimano Altus 8-speed"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "Tektro HD-R280 hydraulic disc"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "Shimano CS-HG31, 11\\u00d734, 8-speed"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "KMC Z8.3"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "Shimano FC-TY501, 30/46T"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}, {"ten": "TAY TH\\u1eaeNG/BRAKE LEVERS", "gia_tri": "Tektro, hydraulic"}]
70	Xe Đạp Gấp Folding TRINX Life 2.2 – Phanh Đĩa, Bánh 20 Inches	SP1BMMXQIP	5	4	**Xe Đạp Gấp Folding TRINX Life 2.2 – Phanh Đĩa, Bánh 20 Inches** không chỉ ấn tượng với thiết kế thông minh và tính năng an toàn, mà còn nổi bật với sự gọn nhẹ và dễ dàng gấp của sản phẩm. Với khả năng gấp gọn nhanh chóng chỉ trong vài bước đơn giản, bạn có thể dễ dàng mang theo xe trên các phương tiện công cộng hoặc để trong không gian hẹp như trong nhà, văn phòng hoặc xe ô tô.\nKhông chỉ gọn nhẹ và dễ dàng gấp, Xe Đạp Gấp Folding TRINX Life 2.2 còn đảm bảo độ an toàn và ổn định trong quá trình sử dụng, mang lại trải nghiệm điều khiển mượt mà và thoải mái trên mọi hành trình. Đây thực sự là sự lựa chọn hàng đầu cho những người yêu thích sự tiện lợi và phong cách trong cuộc sống hàng ngày.\n\nKhung sườn hợp kim nhôm của xe được thiết kế với mục đích tối ưu hóa sự gọn nhẹ mà vẫn đảm bảo độ bền và ổn định. Việc gấp xe trở nên dễ dàng hơn bao giờ hết, giúp bạn tiết kiệm thời gian và công sức mỗi khi sử dụng. Điều này làm cho Xe Đạp Gấp Folding TRINX Life 2.2 trở thành người bạn đồng hành lý tưởng cho những chuyến đi ngắn ngày hoặc những cuộc phiêu lưu thú vị trong thành phố. Màu sắc bắt mắt và phong cách, từ nổi bật đến đen tinh tế, tạo nên sự đa dạng và lựa chọn cho người dùng. Ghi đông ngang, không sừng, giúp người lái có thể điều khiển xe một cách dễ dàng và linh hoạt. Thiết kế gọn nhẹ, phù hợp với mọi đối tượng sử dụng, từ người lớn đến trẻ em. Bánh xe 20 Inches được thiết kế với kích thước phù hợp, giúp xe di chuyển mượt mà và êm ái trên mọi bề mặt đường. Lốp hơi linh hoạt, giúp xe dễ dàng vượt qua mọi chướng ngại vật trên đường đi.\n\nBộ truyền động cao cấp của Xe Đạp Gấp Folding TRINX Life 2.2 sử dụng hệ thống bánh đề Shimano 7 tốc độ, giúp người lái có thể dễ dàng điều chỉnh tốc độ và vận tốc theo ý muốn. Chất lượng vượt trội, đảm bảo hiệu suất và độ tin cậy trong mọi điều kiện đường.\nHệ thống phanh đĩa cơ của xe đạp đảm bảo khả năng phanh mạnh mẽ và an toàn trên mọi loại địa hình và tình huống giao thông. Tăng cường sự kiểm soát và an toàn cho người lái trong mọi điều kiện.\n\nPhuộc trước giảm sóc hiệu quả giúp giảm thiểu các va đập và rung lắc khi di chuyển trên địa hình gồ ghề và không bằng phẳng. Yên xe được thiết kế êm ái và thoải mái, giúp người lái cảm thấy thoải mái trong suốt hành trình dài.\n\nXe Đạp Gấp Folding TRINX Life 2.2 không chỉ là một phương tiện di chuyển, mà còn là biểu tượng của phong cách và tiện ích trong cuộc sống đô thị. Với thiết kế thông minh, an toàn và tiện lợi, sản phẩm này chắc chắn sẽ làm hài lòng mọi người dùng.\nHãy trải nghiệm và tận hưởng cuộc sống đầy tiện nghi cùng Xe Đạp Gấp Folding TRINX Life 2.2 ngay hôm nay.	5900000	percentage	0	15	20	HỢP KIM NHÔM TRINX Alloy	TRẮNG, XANH ĐEN	0	t	2026-03-04 16:03:10.517997+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One size (20\\u2033)"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "tr\\u1eafng, xanh \\u0111en"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "TRINX Alloy 6061 Folding"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "Hi-Ten Steel"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "TRINX Alloy Double Wall"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "Steel"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "20*1.75\\u2033"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "TRINX Alloy T-Shape"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "TRINX Steel Folding"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "TRINX Lengthen"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "TRINX EXP"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "Platform"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "Shimano RevoShift SL-RS35, 7-speed"}, {"ten": "TAY TH\\u1eaeNG/BRAKE LEVERS", "gia_tri": "TrinX Alloy"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "Shimano Tourney RD-TY200, 7-speed"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "TrinX Alloy Mechanical Disc"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "TrinX 7S 14-28T"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "Maya"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "Prowheel alloy"}, {"ten": "K\\u00cdCH TH\\u01af\\u1edaC \\u0110\\u00d3NG TH\\u00d9NG / PACKING SIZE", "gia_tri": "L124 x W20 x H62"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}]
71	Xe Đạp Gấp Folding GIANT FD-806 – Bánh 20 Inches – 2022	SPHAMHW34Z	5	2	**Xe Đạp Gấp Folding GIANT FD-806 – Bánh 20 Inches – 2022** là một sản phẩm đáng chú ý trong dòng xe đạp gấp với sự kết hợp hoàn hảo giữa tiện ích, hiệu suất và thiết kế gọn nhẹ. Với chất liệu khung bằng hợp kim nhôm GIANT, xe đạp này đem đến sự nhẹ nhàng và độ bền ưu việt, cho phép bạn dễ dàng di chuyển và vận hành một cách linh hoạt và thoải mái.\n\nĐược trang bị phuộc High tensile steel, xe đạp FD-806 có khả năng hấp thụ và giảm chấn tốt, giúp giảm bớt các rung động và va chạm khi đi trên các loại địa hình khác nhau. Với lốp xe Kenda 20×1.5″, xe mang lại độ bám và ổn định tuyệt vời, cho phép bạn di chuyển một cách an toàn và tin cậy trên mọi địa hình.\n\nBộ truyền động của xe là một điểm đáng chú ý khác. Với hệ thống chuyển tốc Shimano Revoshift 6-speed và chuyển líp sau Shimano Tourney 6-speed, bạn có thể thay đổi tốc độ một cách dễ dàng và linh hoạt, từ những chặng đường phẳng đến địa hình đồi núi. Hệ thống này được thiết kế để đáp ứng nhu cầu điều khiển tốc độ và cung cấp trải nghiệm lái xe mượt mà và thoải mái.\n\nBộ thắng TX120 trên xe giúp bạn dừng lại một cách an toàn và hiệu quả. Được trang bị tay thắng bằng hợp kim nhôm, bạn có thể kiểm soát và điều chỉnh lực phanh một cách dễ dàng và chính xác. Đây là một yếu tố quan trọng đảm bảo an toàn và tin cậy khi di chuyển trên đường.\n\nNgoài ra, xe còn được trang bị các phụ kiện chất lượng khác như ghi đông và pô tăng hợp kim nhôm, cốt yên nhôm và yên Giant saddle. Các thành phần này đảm bảo sự thoải mái và hỗ trợ tối đa cho người ngồi, giúp bạn cảm nhận được sự thoải mái và sự ổn định khi sử dụng xe trong thời gian dài.\n\nKhông chỉ vậy, xe còn được trang bị pedan FDLD50, mang lại khả năng đạp mạnh mẽ và kiểm soát tốt. Đây là một điểm cộng đáng kể cho việc điều khiển và vận hành xe một cách linh hoạt và thoải mái.\n\nMột trong những điểm đáng chú ý khác của xe đạp gấp GIANT FD-806 là khả năng gấp gọn tiện lợi. Với thiết kế gập trung tâm, bạn có thể gấp và cất xe một cách dễ dàng và nhanh chóng, tiết kiệm không gian và thuận tiện cho việc vận chuyển và lưu trữ. Điều này rất hữu ích khi bạn cần di chuyển xe trên các phương tiện công cộng, ô tô hoặc lưu trữ xe trong không gian hạn chế.\n\nTổng kết, Xe Đạp Gấp Folding GIANT FD-806 – Bánh 20 Inches – 2022 là một sự lựa chọn tuyệt vời cho những người đam mê xe đạp gấp, đảm bảo sự tiện ích, hiệu suất và sự thoải mái. Với thiết kế đẹp mắt, bộ truyền động mạnh mẽ và khả năng gấp gọn tiện lợi, chiếc xe này sẽ là người bạn đồng hành đáng tin cậy trên mọi chuyến đi của bạn.	8790000	percentage	5	15	20	hợp kim nhôm GIANT aluminum alloy	đen, trắng, xanh	0	t	2026-03-04 16:21:24.847005+07	[{"ten": "K\\u00cdCH C\\u1ee0/SIZES", "gia_tri": "One Size (20\\u2033)"}, {"ten": "M\\u00c0U S\\u1eaeC/COLORS", "gia_tri": "\\u0110en, tr\\u1eafng, xanh"}, {"ten": "CH\\u1ea4T LI\\u1ec6U KHUNG/FRAME", "gia_tri": "GIANT aluminum alloy folding frame"}, {"ten": "PHU\\u1ed8C/FORK", "gia_tri": "High tensile steel"}, {"ten": "V\\u00c0NH XE/RIMS", "gia_tri": "Giant alloy"}, {"ten": "\\u0110\\u00d9M/HUBS", "gia_tri": "Alloy"}, {"ten": "C\\u0102M/SPOKES", "gia_tri": "Stainless steel"}, {"ten": "L\\u1ed0P XE/TIRES", "gia_tri": "Kenda 20\\u00d71.5\\u2033"}, {"ten": "GHI \\u0110\\u00d4NG/HANDLEBAR", "gia_tri": "Aluminum alloy"}, {"ten": "P\\u00d4 T\\u0102NG/STEM", "gia_tri": "Aluminum alloy"}, {"ten": "C\\u1ed0T Y\\u00caN/SEATPOST", "gia_tri": "Aluminum alloy"}, {"ten": "Y\\u00caN/SADDLE", "gia_tri": "Giant saddle"}, {"ten": "B\\u00c0N \\u0110\\u1ea0P/PEDALS", "gia_tri": "FDLD50"}, {"ten": "TAY \\u0110\\u1ec0/SHIFTERS", "gia_tri": "Shimano Revoshift 6-speed"}, {"ten": "CHUY\\u1ec2N L\\u00cdP/REAR DERAILLEUR", "gia_tri": "Shimano Tourney 6-speed"}, {"ten": "B\\u1ed8 TH\\u1eaeNG/BRAKES", "gia_tri": "TX120"}, {"ten": "B\\u1ed8 L\\u00cdP/CASSETTE", "gia_tri": "Shimano MF-TZ500-6"}, {"ten": "S\\u00caN XE/CHAIN", "gia_tri": "KMC HV500"}, {"ten": "GI\\u00d2 D\\u0128A/CRANKSET", "gia_tri": "PRO-552 52T"}, {"ten": "B.B/BOTTOM BRACKET", "gia_tri": "Cartridge"}, {"ten": "TR\\u1eccNG L\\u01af\\u1ee2NG/WEIGHT", "gia_tri": "Tr\\u1ecdng l\\u01b0\\u1ee3ng c\\u00f3 th\\u1ec3 thay \\u0111\\u1ed5i d\\u1ef1a tr\\u00ean k\\u00edch c\\u1ee1, ch\\u1ea5t li\\u1ec7u ho\\u00e0n thi\\u1ec7n, chi ti\\u1ebft kim lo\\u1ea1i v\\u00e0 c\\u00e1c ph\\u1ee5 ki\\u1ec7n."}, {"ten": "TAY TH\\u1eaeNG/BRAKE LEVERS", "gia_tri": "Alloy"}, {"ten": "K\\u00cdCH TH\\u01af\\u1edaC \\u0110\\u00d3NG TH\\u00d9NG / PACKING SIZE", "gia_tri": "L155 x W20 x H80"}]
\.


--
-- Data for Name: thanhtoan; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.thanhtoan (ma_thanhtoan, ma_don_hang, ngay_thanhtoan, thanh_tien, pt_thanhtoan, ma_giamgia, trang_thai, transaction_id, bank_code) FROM stdin;
2	1	2026-03-03 11:13:12.529789+07	10084700.00	cod	\N	refunded	\N	\N
4	3	2026-03-04 06:20:56.166243+07	28780000.00	vnpay	\N	refunded	15437584	NCB
5	4	2026-03-04 11:43:45.440549+07	16194100.00	vnpay	\N	success	15437790	NCB
3	2	2026-03-04 11:43:59.60641+07	1263900.00	cod	\N	refunded	\N	\N
6	5	2026-03-05 09:03:05.310106+07	502205600.00	cod	\N	success	\N	\N
7	6	2026-03-05 09:04:31.620207+07	14412860.00	cod	\N	success	\N	\N
10	9	2026-03-06 15:57:42.098814+07	14090000.00	vnpay	\N	paid	15440925	NCB
8	7	2026-03-06 16:08:36.827889+07	13990000.00	cod	\N	success	\N	\N
11	10	2026-03-09 15:47:01.331231+07	7090000.00	cod	\N	pending	\N	\N
\.


--
-- Data for Name: thuonghieu; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.thuonghieu (ma_thuonghieu, ten_thuonghieu, mo_ta, is_active, logo, xuat_xu) FROM stdin;
4	TRINX	Khám phá dòng xe đạp Trinx – sự kết hợp tuyệt vời giữa hiệu suất và giá thành. Được trang bị bộ truyền động Shimano danh tiếng và khung hợp kim nhôm siêu nhẹ, các mẫu xe Trinx mang lại cảm giác lái mượt mà, bền bỉ qua thời gian. Đây là giải pháp di chuyển kinh tế nhưng vẫn đảm bảo tính thời trang và độ an toàn cao cho người sử dụng.	t	https://api.xedap.vn/wp-content/uploads/2023/06/trinx.png	\N
5	LIV	Sự kết hợp hoàn mỹ giữa nghệ thuật thiết kế và kỹ thuật cơ khí đỉnh cao. Xe đạp Liv nổi bật với màu sắc tinh tế, trọng lượng siêu nhẹ và khả năng vận hành linh hoạt. Dù bạn là người mới bắt đầu hay một vận động viên lão luyện, Liv mang đến sự tự tin trên từng vòng đạp với hệ thống linh kiện cao cấp và tư thế lái được tối ưu hóa hoàn toàn cho phái nữ.	t	https://api.xedap.vn/wp-content/uploads/2023/06/liv.png	\N
6	MISAKI	Misaki là thương hiệu xe đạp lấy cảm hứng từ sự tỉ mỉ và tiêu chuẩn chất lượng khắt khe của Nhật Bản. Với triết lý lấy người dùng làm trung tâm, mỗi chiếc xe Misaki không chỉ là phương tiện di chuyển mà còn là một tác phẩm nghệ thuật về cơ khí.	t	https://api.xedap.vn/products/LOGO/misaki.png	\N
1	RAPTOR	Raptor là thương hiệu xe đạp danh tiếng chuyên dòng địa hình và thể thao. Tập trung vào phân khúc hiệu năng cao với mức giá hợp lý, Raptor kết hợp hoàn hảo giữa thiết kế khí động học hiện đại và sự bền bỉ của linh kiện cao cấp. Từ các dòng xe trẻ em đến xe địa hình chuyên nghiệp, Raptor luôn ưu tiên sự an toàn và trải nghiệm lái tối ưu cho người dùng.	f	https://api.xedap.vn/products/LOGO/raptor.png	\N
8	BIRDY	"Sự giao thoa giữa kỹ thuật Đức và sự linh hoạt đô thị."	t	https://www.pacific-cycles.com/storage/system/logo/logo2.webp	\N
9	MEREC	"Tại Merec, chúng tôi không chỉ bán xe đạp, chúng tôi trao cho bạn chiếc chìa khóa để mở ra những trải nghiệm chưa từng có."	t	https://tse3.mm.bing.net/th/id/OIP.8SNrdJDriIeYM9s102qBYgAAAA?rs=1&pid=ImgDetMain&o=7&rm=3	\N
10	JEEP	Jeep thành công vì họ không bán "phương tiện", họ bán "sự tự tin". Chủ xe Jeep luôn tin rằng nếu ngày mai cả thế giới biến thành một khu rừng, họ vẫn sẽ ổn. Đây là bài học tuyệt vời cho thương hiệu Merec của bạn: Hãy bán cho khách hàng một "khát vọng", chứ không chỉ là những khung sắt và vòng bánh xe.	t	https://tse4.mm.bing.net/th/id/OIP.KP9A5IA1ZD2Ke0t7hQRlgQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3	\N
2	GIANT	Khám phá thế giới xe đạp Giant – nơi hội tụ của tốc độ và sự bền bỉ. Từ dòng xe đạp đua (Road) thống trị các giải đấu quốc tế, xe đạp địa hình (MTB) mạnh mẽ đến những dòng xe đường phố (City) thanh lịch, Giant luôn mang đến giải pháp tối ưu cho mọi đối tượng. Thiết kế công thái học cùng hệ thống linh kiện cao cấp giúp người lái tối ưu hóa hiệu suất và tận hưởng sự thoải mái trên mọi hành trình.	t	https://api.xedap.vn/wp-content/uploads/2023/06/giant.png	\N
3	JAVA	JAVA khẳng định vị thế "ông vua cấu hình" trong phân khúc tầm trung. Thương hiệu nổi tiếng với các dòng xe đạp đua (Road) và xe đạp gấp có khung hợp kim nhôm hoặc carbon siêu nhẹ, kết hợp cùng bộ truyền động cao cấp. Nếu bạn đang tìm kiếm một chiếc xe có thiết kế đẳng cấp chuẩn Ý nhưng với mức giá dễ tiếp cận, JAVA chính là lựa chọn không thể bỏ qua.	t	https://api.xedap.vn/products/LOGO/java.png	\N
12	MAGICBROS	Magicbros là sự giao thoa hoàn hảo giữa kỹ thuật Đức chính xác và sự linh hoạt tối ưu trong không gian đô thị hiện đại. Thương hiệu này khéo léo đưa những tiêu chuẩn khắt khe về độ bền vào một diện mạo thanh thoát, giúp cỗ máy vận hành mạnh mẽ nhưng vẫn nhạy bén trên mọi cung đường phố thị. Với Magicbros, mỗi vòng quay bàn đạp là sự kết hợp tinh tế giữa hiệu suất bền bỉ và phong thái dẫn đầu đầy tự do.	t	https://tse1.mm.bing.net/th/id/OIP.MAv7TwnuBsrf9RHFFq6nSgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3	\N
13	VINBIKE	Vinbike là biểu tượng của sự kết hợp hoàn hảo giữa tinh thần thể thao năng động và khát vọng vươn tầm của thương hiệu Việt. Với thiết kế hiện đại, khung sườn chắc chắn cùng hệ thống truyền động linh hoạt, mỗi chiếc xe Vinbike không chỉ là phương tiện di chuyển mà còn là người bạn đồng hành tin cậy trên mọi cung đường, từ phố thị tấp nập đến những lối mòn thử thách. Tập trung vào phân khúc chất lượng cao với mức giá hợp lý, Vinbike khơi dậy niềm đam mê vận động và cổ vũ lối sống xanh, khỏe mạnh cho cộng đồng yêu xe đạp tại Việt Nam.	t	https://tse1.mm.bing.net/th/id/OIP.SdpCp_56nw_1FeBpx9PZrQAAAA?w=390&h=387&rs=1&pid=ImgDetMain&o=7&rm=3	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (ma_user, ten_user, email, password_hash, hovaten, sdt, quyen, status, ngay_lap, cap_nhat_ngay) FROM stdin;
7	vinh	vinh@gmail.com	$2b$12$5AAc3Oq5hkYEed9K8zv/oO7Lt5PRlkWbDo5bGZpq6UTmKySVAWGKe	Nguyễn Văn Vinh	09633890365	customer	active	2026-02-27 13:37:54.531354	2026-03-05 22:36:07.786517
3	quan	quan@gmail.com	$2b$12$9ejtRgmAxcMr1sMDIWueRu9mNLScV.TkTjUx1ZOEGgw6gnrhqyOpC	Bùi Minh Quân	0339886769	customer	active	2026-01-30 09:19:26.745622	2026-03-05 22:51:59.464681
2	trang	trang@gmail.com	$2b$12$3GWFgc2bdwY.TAm6.cWbw.svb8FrMRdVnARkvvLFfCSKg3rW0C0zy	Trần Thị Huyền Trang	0392032243	customer	active	2026-01-30 08:43:33.45075	2026-03-05 22:52:10.18704
24	khe	khe@gmail.com	$2b$12$dsvBmXKVYRAkiaV3l5ago.LdQgBsWoJ6lpN1wGYvFOQ7sLG8q6tb6	Nguyễn Ngọc Khế	0388257891	customer	active	2026-03-03 11:03:54.531102	2026-03-06 09:37:33.676676
6	tien	tien@gmail.com	$2b$12$L4mhUk1YFQjgjSsBObpBpu7xtQHqSl.kFWYSSrQKNF2sWbUROUrkm	Lê Công Tiến 	083294752	customer	active	2026-02-06 16:19:50.392339	2026-03-05 15:48:49.080848
1	admin	admin@gmail.com	$2b$12$RM0i83ABGWJ5siHVW1Pqd.s8ib7cJqZwb1d6v8WvD788Km/QrXyUq	Võ Xuân Văn	0961178265	admin	active	2026-01-30 08:07:32.859801	2026-02-28 09:38:24.424695
26	hung	hung@gmail.com	$2b$12$KXeUkwF.D6AlTu74cE/lu.2/7FFMRxwLPeJ6hnsVfMP2WDSx4VoAq	Trần Thanh Hưng	0978865928	customer	active	2026-03-04 15:01:44.407068	2026-03-04 15:01:44.407068
\.


--
-- Name: audit_logs_ma_log_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.audit_logs_ma_log_seq', 399, true);


--
-- Name: chitietdonhang_ma_ctdh_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chitietdonhang_ma_ctdh_seq', 13, true);


--
-- Name: chitietgiohang_ma_ctgh_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chitietgiohang_ma_ctgh_seq', 192, true);


--
-- Name: danhgia_ma_danhgia_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.danhgia_ma_danhgia_seq', 15, true);


--
-- Name: danhmuc_ma_danhmuc_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.danhmuc_ma_danhmuc_seq', 9, true);


--
-- Name: dia_chi_ma_dia_chi_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.dia_chi_ma_dia_chi_seq', 11, true);


--
-- Name: donhang_ma_don_hang_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.donhang_ma_don_hang_seq', 10, true);


--
-- Name: dsyeuthich_ma_dsyeuthich_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.dsyeuthich_ma_dsyeuthich_seq', 28, true);


--
-- Name: giohang_ma_gio_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.giohang_ma_gio_seq', 10, true);


--
-- Name: hinhanh_ma_anh_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.hinhanh_ma_anh_seq', 262, true);


--
-- Name: lichsu_donhang_ma_lichsu_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.lichsu_donhang_ma_lichsu_seq', 15, true);


--
-- Name: lichsuchat_id_chat_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.lichsuchat_id_chat_seq', 14, true);


--
-- Name: ma_khuyenmai_ma_khuyenmai_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ma_khuyenmai_ma_khuyenmai_seq', 6, true);


--
-- Name: sanpham_ma_sanpham_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sanpham_ma_sanpham_seq', 76, true);


--
-- Name: thanhtoan_ma_thanhtoan_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.thanhtoan_ma_thanhtoan_seq', 11, true);


--
-- Name: thuonghieu_ma_thuonghieu_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.thuonghieu_ma_thuonghieu_seq', 13, true);


--
-- Name: users_ma_user_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_ma_user_seq', 26, true);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (ma_log);


--
-- Name: chitietdonhang chitietdonhang_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chitietdonhang
    ADD CONSTRAINT chitietdonhang_pkey PRIMARY KEY (ma_ctdh);


--
-- Name: chitietgiohang chitietgiohang_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chitietgiohang
    ADD CONSTRAINT chitietgiohang_pkey PRIMARY KEY (ma_ctgh);


--
-- Name: danhgia danhgia_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.danhgia
    ADD CONSTRAINT danhgia_pkey PRIMARY KEY (ma_danhgia);


--
-- Name: danhmuc danhmuc_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.danhmuc
    ADD CONSTRAINT danhmuc_pkey PRIMARY KEY (ma_danhmuc);


--
-- Name: danhmuc danhmuc_ten_danhmuc_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.danhmuc
    ADD CONSTRAINT danhmuc_ten_danhmuc_key UNIQUE (ten_danhmuc);


--
-- Name: dia_chi dia_chi_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dia_chi
    ADD CONSTRAINT dia_chi_pkey PRIMARY KEY (ma_dia_chi);


--
-- Name: donhang donhang_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.donhang
    ADD CONSTRAINT donhang_pkey PRIMARY KEY (ma_don_hang);


--
-- Name: dsyeuthich dsyeuthich_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dsyeuthich
    ADD CONSTRAINT dsyeuthich_pkey PRIMARY KEY (ma_dsyeuthich);


--
-- Name: giohang giohang_ma_user_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.giohang
    ADD CONSTRAINT giohang_ma_user_key UNIQUE (ma_user);


--
-- Name: giohang giohang_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.giohang
    ADD CONSTRAINT giohang_pkey PRIMARY KEY (ma_gio);


--
-- Name: hinhanh hinhanh_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hinhanh
    ADD CONSTRAINT hinhanh_pkey PRIMARY KEY (ma_anh);


--
-- Name: lichsu_donhang lichsu_donhang_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lichsu_donhang
    ADD CONSTRAINT lichsu_donhang_pkey PRIMARY KEY (ma_lichsu);


--
-- Name: lichsuchat lichsuchat_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lichsuchat
    ADD CONSTRAINT lichsuchat_pkey PRIMARY KEY (id_chat);


--
-- Name: ma_khuyenmai ma_khuyenmai_ma_giamgia_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ma_khuyenmai
    ADD CONSTRAINT ma_khuyenmai_ma_giamgia_key UNIQUE (ma_giamgia);


--
-- Name: ma_khuyenmai ma_khuyenmai_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ma_khuyenmai
    ADD CONSTRAINT ma_khuyenmai_pkey PRIMARY KEY (ma_khuyenmai);


--
-- Name: sanpham sanpham_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sanpham
    ADD CONSTRAINT sanpham_pkey PRIMARY KEY (ma_sanpham);


--
-- Name: sanpham sanpham_sanpham_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sanpham
    ADD CONSTRAINT sanpham_sanpham_code_key UNIQUE (sanpham_code);


--
-- Name: thanhtoan thanhtoan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.thanhtoan
    ADD CONSTRAINT thanhtoan_pkey PRIMARY KEY (ma_thanhtoan);


--
-- Name: thuonghieu thuonghieu_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.thuonghieu
    ADD CONSTRAINT thuonghieu_pkey PRIMARY KEY (ma_thuonghieu);


--
-- Name: thuonghieu thuonghieu_ten_thuonghieu_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.thuonghieu
    ADD CONSTRAINT thuonghieu_ten_thuonghieu_key UNIQUE (ten_thuonghieu);


--
-- Name: users unique_sdt; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_sdt UNIQUE (sdt);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (ma_user);


--
-- Name: users users_ten_user_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_ten_user_key UNIQUE (ten_user);


--
-- Name: idx_chitietdonhang_sanpham; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_chitietdonhang_sanpham ON public.chitietdonhang USING btree (ma_sanpham);


--
-- Name: ix_audit_logs_action; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_audit_logs_action ON public.audit_logs USING btree (action);


--
-- Name: ix_audit_logs_ma_log; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_audit_logs_ma_log ON public.audit_logs USING btree (ma_log);


--
-- Name: ix_audit_logs_ma_nguoidung; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_audit_logs_ma_nguoidung ON public.audit_logs USING btree (ma_nguoidung);


--
-- Name: ix_audit_logs_resource_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_audit_logs_resource_type ON public.audit_logs USING btree (resource_type);


--
-- Name: ix_audit_logs_timestamp; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_audit_logs_timestamp ON public.audit_logs USING btree ("timestamp");


--
-- Name: ix_chitietdonhang_ma_ctdh; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_chitietdonhang_ma_ctdh ON public.chitietdonhang USING btree (ma_ctdh);


--
-- Name: ix_chitietgiohang_ma_ctgh; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_chitietgiohang_ma_ctgh ON public.chitietgiohang USING btree (ma_ctgh);


--
-- Name: ix_danhgia_ma_danhgia; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_danhgia_ma_danhgia ON public.danhgia USING btree (ma_danhgia);


--
-- Name: ix_danhmuc_ma_danhmuc; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_danhmuc_ma_danhmuc ON public.danhmuc USING btree (ma_danhmuc);


--
-- Name: ix_dia_chi_ma_dia_chi; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_dia_chi_ma_dia_chi ON public.dia_chi USING btree (ma_dia_chi);


--
-- Name: ix_donhang_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_donhang_date ON public.donhang USING btree (ngay_dat);


--
-- Name: ix_donhang_ma_don_hang; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_donhang_ma_don_hang ON public.donhang USING btree (ma_don_hang);


--
-- Name: ix_donhang_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_donhang_status ON public.donhang USING btree (trang_thai);


--
-- Name: ix_donhang_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_donhang_user ON public.donhang USING btree (ma_user);


--
-- Name: ix_donhang_user_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_donhang_user_status ON public.donhang USING btree (ma_user, trang_thai);


--
-- Name: ix_dsyeuthich_ma_dsyeuthich; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_dsyeuthich_ma_dsyeuthich ON public.dsyeuthich USING btree (ma_dsyeuthich);


--
-- Name: ix_giohang_ma_gio; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_giohang_ma_gio ON public.giohang USING btree (ma_gio);


--
-- Name: ix_hinhanh_ma_anh; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_hinhanh_ma_anh ON public.hinhanh USING btree (ma_anh);


--
-- Name: ix_lichsuchat_id_chat; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_lichsuchat_id_chat ON public.lichsuchat USING btree (id_chat);


--
-- Name: ix_ma_khuyenmai_ma_khuyenmai; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_ma_khuyenmai_ma_khuyenmai ON public.ma_khuyenmai USING btree (ma_khuyenmai);


--
-- Name: ix_sanpham_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_sanpham_is_active ON public.sanpham USING btree (is_active);


--
-- Name: ix_sanpham_ma_danhmuc; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_sanpham_ma_danhmuc ON public.sanpham USING btree (ma_danhmuc);


--
-- Name: ix_sanpham_ma_sanpham; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_sanpham_ma_sanpham ON public.sanpham USING btree (ma_sanpham);


--
-- Name: ix_sanpham_ma_thuonghieu; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_sanpham_ma_thuonghieu ON public.sanpham USING btree (ma_thuonghieu);


--
-- Name: ix_sanpham_ngay_lap; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_sanpham_ngay_lap ON public.sanpham USING btree (ngay_lap);


--
-- Name: ix_thanhtoan_ma_thanhtoan; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_thanhtoan_ma_thanhtoan ON public.thanhtoan USING btree (ma_thanhtoan);


--
-- Name: ix_thuonghieu_ma_thuonghieu; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_thuonghieu_ma_thuonghieu ON public.thuonghieu USING btree (ma_thuonghieu);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: ix_users_ma_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_users_ma_user ON public.users USING btree (ma_user);


--
-- Name: chitietdonhang trg_update_inventory; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_inventory BEFORE INSERT ON public.chitietdonhang FOR EACH ROW EXECUTE FUNCTION public.update_inventory_after_checkout();


--
-- Name: danhgia trigger_update_diem_danh_gia; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_update_diem_danh_gia AFTER INSERT OR DELETE OR UPDATE ON public.danhgia FOR EACH ROW EXECUTE FUNCTION public.update_diem_danh_gia_sanpham();


--
-- Name: users users_cap_nhat_ngay_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER users_cap_nhat_ngay_trigger BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_cap_nhat_ngay_column();


--
-- Name: audit_logs audit_logs_ma_nguoidung_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_ma_nguoidung_fkey FOREIGN KEY (ma_nguoidung) REFERENCES public.users(ma_user);


--
-- Name: chitietdonhang chitietdonhang_ma_don_hang_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chitietdonhang
    ADD CONSTRAINT chitietdonhang_ma_don_hang_fkey FOREIGN KEY (ma_don_hang) REFERENCES public.donhang(ma_don_hang);


--
-- Name: chitietdonhang chitietdonhang_ma_sanpham_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chitietdonhang
    ADD CONSTRAINT chitietdonhang_ma_sanpham_fkey FOREIGN KEY (ma_sanpham) REFERENCES public.sanpham(ma_sanpham);


--
-- Name: chitietgiohang chitietgiohang_ma_gio_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chitietgiohang
    ADD CONSTRAINT chitietgiohang_ma_gio_fkey FOREIGN KEY (ma_gio) REFERENCES public.giohang(ma_gio) ON DELETE CASCADE;


--
-- Name: chitietgiohang chitietgiohang_ma_sanpham_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chitietgiohang
    ADD CONSTRAINT chitietgiohang_ma_sanpham_fkey FOREIGN KEY (ma_sanpham) REFERENCES public.sanpham(ma_sanpham) ON DELETE CASCADE;


--
-- Name: danhgia danhgia_ma_sanpham_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.danhgia
    ADD CONSTRAINT danhgia_ma_sanpham_fkey FOREIGN KEY (ma_sanpham) REFERENCES public.sanpham(ma_sanpham) ON DELETE CASCADE;


--
-- Name: danhgia danhgia_ma_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.danhgia
    ADD CONSTRAINT danhgia_ma_user_fkey FOREIGN KEY (ma_user) REFERENCES public.users(ma_user) ON DELETE CASCADE;


--
-- Name: dia_chi dia_chi_ma_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dia_chi
    ADD CONSTRAINT dia_chi_ma_user_fkey FOREIGN KEY (ma_user) REFERENCES public.users(ma_user);


--
-- Name: donhang donhang_ma_khuyenmai_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.donhang
    ADD CONSTRAINT donhang_ma_khuyenmai_fkey FOREIGN KEY (ma_khuyenmai) REFERENCES public.ma_khuyenmai(ma_khuyenmai);


--
-- Name: donhang donhang_ma_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.donhang
    ADD CONSTRAINT donhang_ma_user_fkey FOREIGN KEY (ma_user) REFERENCES public.users(ma_user);


--
-- Name: dsyeuthich dsyeuthich_ma_sanpham_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dsyeuthich
    ADD CONSTRAINT dsyeuthich_ma_sanpham_fkey FOREIGN KEY (ma_sanpham) REFERENCES public.sanpham(ma_sanpham) ON DELETE CASCADE;


--
-- Name: dsyeuthich dsyeuthich_ma_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dsyeuthich
    ADD CONSTRAINT dsyeuthich_ma_user_fkey FOREIGN KEY (ma_user) REFERENCES public.users(ma_user) ON DELETE CASCADE;


--
-- Name: lichsu_donhang fk_don_hang; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lichsu_donhang
    ADD CONSTRAINT fk_don_hang FOREIGN KEY (ma_don_hang) REFERENCES public.donhang(ma_don_hang) ON DELETE CASCADE;


--
-- Name: giohang giohang_ma_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.giohang
    ADD CONSTRAINT giohang_ma_user_fkey FOREIGN KEY (ma_user) REFERENCES public.users(ma_user);


--
-- Name: hinhanh hinhanh_ma_sanpham_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hinhanh
    ADD CONSTRAINT hinhanh_ma_sanpham_fkey FOREIGN KEY (ma_sanpham) REFERENCES public.sanpham(ma_sanpham) ON DELETE CASCADE;


--
-- Name: lichsuchat lichsuchat_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lichsuchat
    ADD CONSTRAINT lichsuchat_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(ma_user);


--
-- Name: sanpham sanpham_ma_danhmuc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sanpham
    ADD CONSTRAINT sanpham_ma_danhmuc_fkey FOREIGN KEY (ma_danhmuc) REFERENCES public.danhmuc(ma_danhmuc);


--
-- Name: sanpham sanpham_ma_thuonghieu_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sanpham
    ADD CONSTRAINT sanpham_ma_thuonghieu_fkey FOREIGN KEY (ma_thuonghieu) REFERENCES public.thuonghieu(ma_thuonghieu);


--
-- Name: thanhtoan thanhtoan_ma_don_hang_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.thanhtoan
    ADD CONSTRAINT thanhtoan_ma_don_hang_fkey FOREIGN KEY (ma_don_hang) REFERENCES public.donhang(ma_don_hang);


--
-- PostgreSQL database dump complete
--

\unrestrict iPa6xZ4Xmb1Al90Rjj2noNOdo07qafIKLhPIDxlQxAb3mdeFD9RhAjh7euDYLZT


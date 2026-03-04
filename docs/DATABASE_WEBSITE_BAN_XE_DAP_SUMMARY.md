# Website Bán Xe Đạp - Database Thiết kế Ngắn gọn

## 🎯 Mục tiêu chính
- Hiển thị danh sách xe, tìm kiếm & lọc
- Quản lý giỏ hàng, thanh toán
- Xử lý đơn hàng, giao hàng
- Đánh giá sản phẩm & quản lý người dùng

---

## 📊 Database có 15 bảng chính

### ⚠️ **Tạo ENUM TYPES trước tiên (QUAN TRỌNG!)**
```sql
-- PostgreSQL cần tạo ENUM types trước khi dùng
CREATE TYPE quyen AS ENUM ('customer', 'admin');
CREATE TYPE trang_thai_user AS ENUM ('active', 'inactive', 'banned');
CREATE TYPE trang_thai_order AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');
CREATE TYPE trang_thai_payment AS ENUM ('pending', 'paid', 'failed'); cho đơn hàng
CREATE TYPE phuong_thuc_payment AS ENUM ('credit_card', 'bank_transfer', 'cod');
CREATE TYPE trang_thai_review AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE kieu_giam_gia AS ENUM ('percentage', 'fixed_amount');
CREATE TYPE chitiet_thanhtoan AS ENUM ('pending', 'success', 'failed','refunded'); cho thanh toan
```

### 1️⃣ **USERS** (Người dùng)
```sql
CREATE TABLE users (
    ma_user SERIAL PRIMARY KEY,
    ten_user VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    hovaten VARCHAR(100),
    SDT VARCHAR(20),
    diachi VARCHAR(255),
    quyen quyen DEFAULT 'customer',
    status trang_thai_user DEFAULT 'active',
    ngay_lap TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cap_nhat_ngay TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2️⃣ **CATEGORIES** (Danh mục)
```sql
CREATE TABLE Danhmuc (
    ma_danhmuc SERIAL PRIMARY KEY,
    ten_danhmuc VARCHAR(100) NOT NULL UNIQUE,
    mo_ta TEXT,
    is_active BOOLEAN DEFAULT TRUE
);
```

### 3️⃣ **BRANDS** (Thương hiệu)
```sql
CREATE TABLE thuonghieu (
    ma_thuonghieu SERIAL PRIMARY KEY,
    ten_thuonghieu VARCHAR(100) NOT NULL UNIQUE,
    mo_ta TEXT,
    is_active BOOLEAN DEFAULT TRUE
);
```

### 4️⃣ **PRODUCTS** (Xe đạp)
```sql
CREATE TABLE sanpham (
    ma_sanpham SERIAL PRIMARY KEY,
    ten_sanpham VARCHAR(150) NOT NULL,
    sanpham_code VARCHAR(50) UNIQUE,
    ma_danhmuc INTEGER NOT NULL REFERENCES danhmuc(ma_danhmuc),
    ma_thuonghieu INTEGER NOT NULL REFERENCES thuonghieu(ma_thuonghieu),
    mo_ta TEXT,
    gia NUMERIC(10, 2) NOT NULL,
    kieu_giam_gia kieu_giam_gia DEFAULT 'percentage',
    gia_tri_giam NUMERIC(10, 2) DEFAULT 0,
    ton_kho INTEGER DEFAULT 0,
    size_banh_xe INTEGER,
    size_khung VARCHAR(50),
    mau VARCHAR(50),
    diem_danh_gia NUMERIC(3, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    ngay_lap TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5️⃣ **PRODUCT_IMAGES** (Hình ảnh)
```sql
CREATE TABLE hinhanh (
    ma_anh SERIAL PRIMARY KEY,
    ma_sanpham INTEGER NOT NULL REFERENCES sanpham(ma_sanpham) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL,
    is_main BOOLEAN DEFAULT FALSE
);
```

### 6️⃣ **CARTS** (Giỏ hàng)
```sql
CREATE TABLE giohang (
    ma_gio SERIAL PRIMARY KEY,
    ma_user INTEGER NOT NULL REFERENCES users(ma_user) ON DELETE CASCADE,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (ma_user)
);
```

### 7️⃣ **CART_ITEMS** (Chi tiết giỏ hàng)
```sql
CREATE TABLE chitietgiohang (
    ma_CTGH SERIAL PRIMARY KEY,
    ma_gio INTEGER NOT NULL REFERENCES giohang(ma_gio) ON DELETE CASCADE,
    ma_sanpham INTEGER NOT NULL REFERENCES sanpham(ma_sanpham),
    so_luong INTEGER NOT NULL DEFAULT 1,
    gia_hien_tai NUMERIC(10, 2) NOT NULL
);
```

### 8️⃣ **ORDERS** (Đơn hàng)
```sql
CREATE TABLE donhang (
    ma_donhang SERIAL PRIMARY KEY,
    donhang_code VARCHAR(50) UNIQUE NOT NULL,
    ma_user INTEGER NOT NULL REFERENCES users(ma_user),
    ngay_dat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    trang_thai trang_thai_order DEFAULT 'pending',
    tong_tien NUMERIC(10, 2) NOT NULL,
    phuong_thuc_TT phuong_thuc_payment NOT NULL,
    trang_thai_TT trang_thai_payment DEFAULT 'pending',
    dia_chi_giao VARCHAR(255) NOT NULL,
    day_du_kien DATE,
    day_thuc_te DATE
);
```

### 9️⃣ **ORDER_ITEMS** (Chi tiết đơn hàng)
```sql
CREATE TABLE chitietdonhang (
    ma_CTDH SERIAL PRIMARY KEY,
    ma_donhang INTEGER NOT NULL REFERENCES donhang(ma_donhang) ON DELETE CASCADE,
    ma_sanpham INTEGER NOT NULL,
    ten_sanpham VARCHAR(150),
    so_luong INTEGER NOT NULL,
    don_gia NUMERIC(10, 2) NOT NULL,
    thanh_tien NUMERIC(10, 2) NOT NULL
);
```

### 🔟 **REVIEWS** (Đánh giá)
```sql
CREATE TABLE danhgia(
    ma_danhgia SERIAL PRIMARY KEY,
    ma_sanpham INTEGER NOT NULL REFERENCES sanpham(ma_sanpham) ON DELETE CASCADE,
    ma_user INTEGER NOT NULL REFERENCES users(ma_user) ON DELETE CASCADE,
    diem_danhgia INTEGER NOT NULL CHECK (diem_danhgia >= 1 AND diem_danhgia <= 5),
    tieu_de VARCHAR(150),
    viet_danhgia TEXT,
    trang_thai trang_thai_review DEFAULT 'pending',
    ngay_lap TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 1️⃣2️⃣ **WISHLISTS** (Danh sách yêu thích)
```sql
CREATE TABLE dsyeuthich (
    ma_dsyeuthich SERIAL PRIMARY KEY,
    ma_user INTEGER NOT NULL REFERENCES users(ma_user) ON DELETE CASCADE,
    ma_sanpham INTEGER NOT NULL REFERENCES sanpham(ma_sanpham) ON DELETE CASCADE,
    ngay_lap TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (ma_user, ma_sanpham)
);
```

### 1️⃣3️⃣ **COUPONS** (Mã khuyến mãi)
```sql
CREATE TABLE ma_khuyenmai (
    ma_khuyenmai SERIAL PRIMARY KEY,
    ma_giamgia VARCHAR(50) UNIQUE NOT NULL,
    kieu_giamgia kieu_giam_gia NOT NULL,
    giatrigiam NUMERIC(10, 2) NOT NULL,
    don_toithieu NUMERIC(10, 2) DEFAULT 0,
    solandung INTEGER,
    solan_hientai INTEGER DEFAULT 0,
    ngay_batdau TIMESTAMP NOT NULL,
    ngay_ketthuc TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);
```

### 1️⃣4️⃣ **PAYMENTS** (Thanh toán)
```sql
CREATE TABLE thanhtoan (
    ma_thanhtoan SERIAL PRIMARY KEY,
    ma_donhang INTEGER NOT NULL REFERENCES donhang(ma_donhang) ON DELETE CASCADE,
    ngay_thanhtoan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    thanh_tien NUMERIC(10, 2) NOT NULL,
    PT_thanhtoan phuong_thuc_payment NOT NULL,
    ma_giamgia VARCHAR(50) REFERENCES ma_khuyenmai(ma_giamgia),
    trang_thai chitiet_thanhtoan DEFAULT 'pending'
);
```

### 1️⃣5️⃣ **INVENTORY** (Tồn kho)
```sql
CREATE TABLE tonkho (
    ma_tonkho SERIAL PRIMARY KEY,
    ma_sanpham INTEGER NOT NULL REFERENCES sanpham(ma_sanpham) ON DELETE CASCADE,
    soluong_tonkho INTEGER DEFAULT 0,
    UNIQUE (ma_sanpham)
);
```

---

## 🔧 Các Triggers quan trọng

```sql
-- Tự động update cap_nhat_ngay khi sửa users
CREATE OR REPLACE FUNCTION update_cap_nhat_ngay_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.cap_nhat_ngay = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_cap_nhat_ngay_trigger BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_cap_nhat_ngay_column();
-- Note: Các bảng sanpham, donhang hiện chưa có cột cap_nhat_ngay trong thiết kế này. Nếu thêm cột đó, hãy thêm trigger tương tự.

-- Tự động tính điểm đánh giá trung bình cho sản phẩm
CREATE OR REPLACE FUNCTION update_diem_danh_gia_sanpham()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_diem_danh_gia 
AFTER INSERT OR UPDATE OR DELETE ON danhgia 
FOR EACH ROW EXECUTE FUNCTION update_diem_danh_gia_sanpham();
```

---

## 📑 Indexes quan trọng

```sql
-- Tìm kiếm nhanh
CREATE INDEX idx_sanpham_active ON sanpham(is_active);
CREATE INDEX idx_sanpham_danhmuc ON sanpham(ma_danhmuc);
CREATE INDEX idx_sanpham_gia ON sanpham(gia);
CREATE INDEX idx_sanpham_danhgia ON sanpham(diem_danh_gia DESC);

-- User
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);

-- Order
CREATE INDEX idx_donhang_user ON donhang(ma_user);
CREATE INDEX idx_donhang_trangthai ON donhang(trang_thai);
CREATE INDEX idx_donhang_ngay ON donhang(ngay_dat DESC);

-- Review
CREATE INDEX idx_danhgia_sanpham ON danhgia(ma_sanpham);
CREATE INDEX idx_danhgia_trangthai ON danhgia(trang_thai);
```

---

## 📌 Các Bước Triển Khai Chính

### Phase 1: Sản phẩm (1-2 tuần)
✅ Tạo bảng: CATEGORIES, BRANDS, PRODUCTS, PRODUCT_IMAGES  
✅ Nhập dữ liệu xe đạp  
✅ Trang hiển thị danh sách, chi tiết sản phẩm  
✅ Tìm kiếm & lọc  

### Phase 2: Người dùng & Giỏ hàng (1 tuần)
✅ Tạo bảng: USERS, CARTS, CART_ITEMS  
✅ Đăng ký/đăng nhập  
✅ Thêm vào giỏ hàng  
✅ Quản lý giỏ hàng  

### Phase 3: Đơn hàng & Thanh toán (2 tuần)
✅ Tạo bảng: ORDERS, ORDER_ITEMS, PAYMENTS  
✅ Checkout  
✅ Thanh toán (Stripe/PayPal hoặc COD)  
✅ Quản lý đơn hàng  

### Phase 4: Đánh giá & Yêu thích (1 tuần)
✅ Tạo bảng: REVIEWS, REVIEW_IMAGES, WISHLISTS  
✅ Đánh giá sản phẩm  
✅ Danh sách yêu thích  

### Phase 5: Khuyến mãi & Tồn kho (1 tuần)
✅ Tạo bảng: COUPONS, INVENTORY  
✅ Mã khuyến mãi  
✅ Quản lý tồn kho  

---

## ⚠️ Điểm chú ý trước deploy

### 1. Security
```sql
-- Tạo role cho app backend
CREATE ROLE app_backend WITH LOGIN PASSWORD 'secure_password';
GRANT ALL ON ALL TABLES IN SCHEMA public TO app_backend;

-- Tạo role read-only cho public
CREATE ROLE app_readonly WITH LOGIN PASSWORD 'public_password';
GRANT SELECT ON products, categories, brands, reviews TO app_readonly;
```

### 2. Backup
```bash
# Backup hàng ngày
pg_dump -U app_backend bicycle_store | gzip > backup_$(date +%Y%m%d).sql.gz

# Restore
gunzip -c backup_20260120.sql.gz | psql -U app_backend bicycle_store
```

### 3. Connection Pooling
Dùng **PgBouncer** để quản lý connections

### 4. Performance Testing
- Test với 10k+ sản phẩm, 1k+ users
- Test concurrent orders
- Kiểm tra slow queries: `EXPLAIN ANALYZE`

---

## 🚀 Tech Stack Khuyến Nghị

**Frontend:**
- React/Vue/Next.js
- Tailwind CSS
- Redux/Vuex (state management)

**Backend:**
- Node.js (Express) / Python (Django/FastAPI) / PHP (Laravel)
- JWT authentication
- RESTful API hoặc GraphQL

**Database:**
- PostgreSQL 13+
- Redis (caching)

**Deployment:**
- Docker + Docker Compose
- AWS/Azure/Digital Ocean/Heroku
- Nginx reverse proxy
- SSL certificate (Let's Encrypt)

---

## 📊 Queries thường dùng

```sql
-- Lấy 10 sản phẩm bán chạy nhất
SELECT p.*, COUNT(oi.order_item_id) as sold_count
FROM products p
LEFT JOIN order_items oi ON p.product_id = oi.product_id
WHERE p.is_active = TRUE
GROUP BY p.product_id
ORDER BY sold_count DESC
LIMIT 10;

-- Lấy giỏ hàng của user
SELECT ci.*, p.product_name, p.price
FROM cart_items ci
JOIN products p ON ci.product_id = p.product_id
WHERE ci.cart_id = (SELECT cart_id FROM carts WHERE user_id = ?);

-- Tính tổng đơn hàng
SELECT SUM(total_amount) as revenue, COUNT(*) as order_count, AVG(total_amount) as avg_order
FROM orders
WHERE status != 'cancelled' AND order_date >= NOW() - INTERVAL '30 days';

-- Sản phẩm được đánh giá cao
SELECT p.*, ROUND(AVG(r.rating)::NUMERIC, 2) as avg_rating, COUNT(r.review_id) as review_count
FROM products p
LEFT JOIN reviews r ON p.product_id = r.product_id AND r.status = 'approved'
WHERE p.is_active = TRUE
GROUP BY p.product_id
ORDER BY avg_rating DESC NULLS LAST
LIMIT 20;
```

---

## ✅ Checklist Deploy

- [ ] Database đã tạo & migrate
- [ ] Triggers/Indexes có sẵn
- [ ] Roles & Permissions setup
- [ ] SSL/TLS configure
- [ ] Backup strategy setup
- [ ] Monitoring alerts (slow queries, disk space)
- [ ] Load testing (min 1000 concurrent users)
- [ ] Error handling & logging
- [ ] Frontend + Backend ready
- [ ] Payment gateway integrate
- [ ] Email notifications setup
- [ ] CDN cho images
- [ ] Disaster recovery plan

---

## 📞 Hỗ trợ

Nếu có vấn đề:
1. Check logs: `tail -f /var/log/postgresql/postgresql.log`
2. Monitor: `SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC;`
3. Backup immediately trước khi fix

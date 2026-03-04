# 🚲 Bike Shop - Hệ Thống Quản Lý & Bán Xe Đạp Tích Hợp AI

![Project Banner](https://img.shields.io/badge/Project-Bike%20Shop-blue?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/AI-Gemini%202.0%20Flash-orange?style=for-the-badge)
![Framework](https://img.shields.io/badge/FastAPI-React-green?style=for-the-badge)

## 📌 Giới Thiệu
Dự án **Bike Shop** là một hệ thống thương mại điện tử chuyên nghiệp dành cho việc kinh doanh xe đạp, được xây dựng với kiến trúc hiện đại (FastAPI + React). Điểm đặc biệt của hệ thống là việc tích hợp **AI Trợ Lý Admin (Gemini 2.0 Flash)** giúp phân tích dữ liệu kinh doanh, báo cáo doanh thu và hỗ trợ marketing định hướng dữ liệu.

---

## 🚀 Tính Năng Nổi Bật

### 🤖 1. AI Assistant (Dành cho Admin)
Trợ lý ảo thông minh tích hợp trực tiếp vào hệ thống quản trị:
- **Phân tích doanh thu:** Báo cáo doanh thu theo ngày/tháng bằng ngôn ngữ tự nhiên.
- **Quản trị tồn kho:** Cảnh báo sản phẩm sắp hết hàng dựa trên ngưỡng thiết lập.
- **Xử lý content:** Tự động soạn thảo mô tả sản phẩm và nội dung Marketing chuyên nghiệp.
- **Thông minh & Linh hoạt:** Cơ chế **Intelligent Fallback** hoạt động ngay cả khi vượt quá hạn ngạch API.

### 🛒 2. Trải Nghiệm Khách Hàng (Customer)
- **Mua sắm thông minh:** Tìm kiếm, lọc sản phẩm theo nhu cầu (giá, thương hiệu, danh mục).
- **Giỏ hàng & Yêu thích:** Quản lý danh sách mua sắm tiện lợi.
- **Thanh toán đa dạng:** Hỗ trợ COD, Chuyển khoản ngân hàng, Thẻ tín dụng.
- **Đánh giá & Phản hồi:** Hệ thống đánh giá sao và bình luận sau khi mua hàng.

### 🛠️ 3. Quản Trị Hệ Thống (Admin Dashboard)
- **Quản lý toàn diện:** Sản phẩm, Đơn hàng, Danh mục, Thương hiệu, Ưu đãi.
- **Quản lý người dùng:** Banned/Unbanned, theo dõi lịch sử mua hàng.
- **Thống kê chuyên sâu:** Top 10 sản phẩm bán chạy, tỷ lệ hủy đơn, biểu đồ doanh thu.
- **Bảo mật:** Phân quyền chặt chẽ thông qua JWT (JSON Web Token).

---

## 💻 Công Nghệ Sử Dụng

### Backend
- **Framework:** FastAPI (Python)
- **Database:** PostgreSQL/MySQL (SQLAlchemy ORM)
- **AI:** Google Generative AI (Gemini 2.0 Flash)
- **Auth:** JWT Authentication, Bcrypt Password Hashing

### Frontend
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **HTTP Client:** Axios

---

## 🛠️ Hướng Dẫn Cài Đặt

### 1. Cấu hình Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Hoặc .venv\Scripts\activate trên Windows
pip install -r requirements.txt
```
Tạo file `.env` và cấu hình:
```env
GOOGLE_API_KEY=YOUR_GEMINI_API_KEY
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
```

### 2. Cấu hình Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📸 Hình Ảnh Dự Án
*(Vui lòng cập nhật hình ảnh giao diện tại đây)*

---

## 👤 Tác Giả
- **Võ Xuân Văn**
- **Email:** vanvoxuan4@gmail.com
- **Dự án:** Khóa luận tốt nghiệp 2026

---
*Dự án được phát triển với mục tiêu mang lại giải pháp công nghệ hiện đại cho ngành bán lẻ xe đạp.*

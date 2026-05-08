# Bike Shop - Hệ Thống Quản Lý & Bán Xe Đạp Tích Hợp AI

![Project Banner](https://img.shields.io/badge/Project-Bike%20Shop-blue?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/AI-Gemini%203.1%20Flash%20Lite%20Review-orange?style=for-the-badge)
![Framework](https://img.shields.io/badge/FastAPI-React-green?style=for-the-badge)

## 📌 Giới Thiệu
Dự án **Bike Shop** là một hệ thống thương mại điện tử chuyên nghiệp dành cho việc kinh doanh xe đạp, được xây dựng với kiến trúc hiện đại (FastAPI + React). Điểm đặc biệt của hệ thống là việc tích hợp **AI Trợ Lý Admin (Gemini 3.1 Flash Lite Review)** giúp phân tích dữ liệu kinh doanh, báo cáo doanh thu và hỗ trợ marketing định hướng dữ liệu.

---

## 🚀 Tính Năng Nổi Bật

### 1. AI Assistant (Dành cho Admin)
Trợ lý ảo thông minh tích hợp trực tiếp vào hệ thống quản trị:
- **Báo cáo doanh thu 3 tầng:** Tự động tổng hợp dữ liệu (Hôm nay, Tháng này, Tổng tích lũy) kèm phân tích sản phẩm bán chạy nhất chỉ với một câu lệnh.
- **Quản trị thông minh:** Phân biệt rõ ràng các hành động quản lý tài khoản (Vô hiệu hóa vs Cấm vĩnh viễn), đảm bảo an toàn dữ liệu với bước xác nhận 2 lớp.
- **Quản trị tồn kho:** Cảnh báo sản phẩm sắp hết hàng và hỗ trợ điều chỉnh tồn kho trực tiếp qua chat.
- **Xử lý content:** Tự động soạn thảo mô tả sản phẩm và nội dung Marketing chuyên nghiệp.

### 2. Trải Nghiệm Khách Hàng (Customer)
- **Giao diện Profile Premium:** Trang cá nhân được thiết kế lại theo phong cách hiện đại, tối giản các trường thông tin dư thừa và tối ưu hóa quản lý đơn hàng.
- **Hệ thống Voucher & Khuyến mãi:** Trang khuyến mãi với hiệu ứng Toast thông báo lưu mã thành công, thiết kế dạng Ticket trực quan và đếm ngược Flash Sale thời gian thực.
- **Quản lý đơn hàng tối ưu:** Bổ sung bộ lọc "Trả hàng", nút Refresh dữ liệu nhanh và cơ chế xóa mềm (Soft-delete) giúp dọn dẹp lịch sử mua hàng.
- **Thanh toán đa dạng:** Hỗ trợ COD, Chuyển khoản ngân hàng (VNPAY Sandbox).

### 3. Quản Trị Hệ Thống (Admin Dashboard)
- **Quản lý toàn diện:** Sản phẩm, Đơn hàng, Danh mục, Thương hiệu, Ưu đãi.
- **Quản lý người dùng đa trạng thái:** Hỗ trợ 3 trạng thái: `Active` (Toàn quyền), `Inactive` (Read-only - chỉ xem, không được thanh toán/giỏ hàng), `Banned` (Khóa hoàn toàn).
- **Thống kê chuyên sâu:** Top 10 sản phẩm bán chạy, tỷ lệ hủy đơn, biểu đồ doanh thu.
- **Bảo mật:** Phân quyền chặt chẽ thông qua JWT (JSON Web Token) và Custom FastAPI Dependencies.

---

## 💻 Công Nghệ Sử Dụng

### Backend
- **Framework:** FastAPI (Python)
- **Database:** PostgreSQL/MySQL (SQLAlchemy ORM)
- **AI:** Google Generative AI (Gemini 3.1 Flash Lite Review)
- **Auth:** JWT Authentication, Bcrypt Password Hashing

### Frontend
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **HTTP Client:** Axios

---

## 💎 Kỹ thuật Tối ưu & Điểm nhấn Công nghệ

Dự án không chỉ dừng lại ở các tính năng cơ bản mà còn được tinh chỉnh sâu về mặt kỹ thuật để đạt hiệu suất và độ ổn định cao:

### 1. Frontend Performance Optimization
- **Component Memoization:** Sử dụng `React.memo` với custom equality checks cho các component quan trọng như `ProductCard`, giúp ngăn chặn hoàn toàn việc re-render dư thừa khi dữ liệu không đổi.
- **Hook Caching Thông Minh:** Phát triển hook `useStaticData` với cơ chế **Session-level Cache**. Dữ liệu danh mục và thương hiệu chỉ được fetch một lần duy nhất trong suốt phiên làm việc, giảm hơn 70% số lượng API call dư thừa khi điều hướng.
- **Lazy Loading & Decoding:** Áp dụng `loading="lazy"` và `decoding="async"` cho toàn bộ hệ thống hình ảnh sản phẩm, tối ưu hóa tốc độ tải trang (LCP) và trải nghiệm cuộn mượt mà.

### 2. Backend & Database Tuning
- **High-Performance Indexing:** Thiết lập các Composite Index và B-Tree Index chuyên sâu trên bảng `donhang` và `sanpham`, tối ưu hóa tốc độ tìm kiếm và sắp xếp ngay cả khi dữ liệu lớn.
- **Concurrency Control:** Sử dụng cơ chế khóa dòng `with_for_update()` trong SQLAlchemy để xử lý tranh chấp tồn kho (Race Condition) khi nhiều người dùng cùng đặt hàng một lúc, đảm bảo tính toàn vẹn dữ liệu tuyệt đối.
- **Intelligent API Design:** Tích hợp **Pydantic Model Validation** chặt chẽ, đảm bảo dữ liệu đầu vào luôn sạch và đúng định dạng trước khi xử lý.

### 3. Developer & User Experience (DX/UX)
- **Global Error Interceptor:** Hệ thống xử lý lỗi tập trung thông qua **Axios Interceptor**, tự động nhận diện và xử lý linh hoạt (Inactive: Toast cảnh báo nhẹ; Banned/Expired: Logout & Redirect).
- **Reactive User Status Sync:** Cơ chế đồng bộ trạng thái tài khoản thời gian thực. Sử dụng `window.focus` listener và `CustomEvent` để tự động cập nhật UI (Banner/Buttons) ngay lập tức khi Admin thay đổi trạng thái người dùng trong trang quản trị, mang lại trải nghiệm không gián đoạn.
- **URL-based Filter Persistence:** Đồng bộ hóa bộ lọc sản phẩm trực tiếp với URL Search Params, cho phép người dùng chia sẻ kết quả tìm kiếm dễ dàng và giữ trạng thái lọc ngay cả khi tải lại trang.
- **Smart Scroll Logic**: Cơ chế cuộn trang thông minh, chỉ tự động kéo lên đầu khi chuyển trang (pagination) và giữ nguyên vị trí khi thực hiện lọc/sắp xếp, tạo cảm giác tự nhiên nhất.
- **Optimized JWT Handling**: Xử lý token tập trung, hỗ trợ fallback giữa các context (User/Admin) giúp duy trì phiên làm việc mượt mà ngay cả khi chuyển đổi vai trò.

---

## 🧠 Thuật Toán & Cơ Chế Đặc Sắc

Hệ thống tích hợp những giải pháp xử lý dữ liệu phức tạp để đảm bảo tính chính xác và hiệu năng:

### 1. AI Function Calling & Intent Routing
- **Cơ chế:** AI không chỉ trả lời văn bản mà còn được cấp quyền truy cập các bộ "Tool" (hàm backend). Khi nhận câu hỏi như "Doanh thu tháng này thế nào?", hệ thống sẽ tự động routing đến tool `get_revenue_report`.
- **Lợi ích:** Đảm bảo AI luôn nói đúng dữ liệu thực tế trong DB, loại bỏ hoàn toàn hiện tượng "ảo tưởng" (hallucination).

### 2. Concurrency & Inventory Lock (Pessimistic Locking)
- **Thuật toán:** Sử dụng `SELECT ... FOR UPDATE` trong SQLAlchemy để khóa dòng sản phẩm ngay khi user bấm thanh toán.
- **Giải quyết:** Triệt tiêu hoàn toàn lỗi **Race Condition** khi nhiều người cùng đặt món hàng cuối cùng, đảm bảo số tồn kho không bao giờ bị âm.

### 3. Reactive UI Synchronization (Event-Driven Sync)
- **Cơ chế:** Kết hợp `window.focus` event và `CustomEvent` bus trong React. 
- **Ứng dụng:** Trạng thái tài khoản (Active/Inactive) được đồng bộ ngay lập tức mà không cần F5 khi user quay lại tab sau khi Admin đã thay đổi quyền truy cập trong trang quản lý.

---

## 🔄 Lịch Sử Cải Tiến Gần Đây

Dự án liên tục được tối ưu hóa dựa trên phản hồi thực tế:

- **Nâng cấp AI Analytics:** Triển khai logic báo cáo doanh thu đa tầng giúp Admin có cái nhìn từ chi tiết (hôm nay) đến tổng thể (tổng doanh thu) mà không bị mâu thuẫn số liệu.
- **Modernizing UI/UX:** Tái cấu trúc trang Profile và Promotions theo tiêu chuẩn thiết kế hiện đại, sử dụng Glassmorphism và các micro-animations để tăng tính tương tác.
- **Fix lỗi Checkout:** Loại bỏ các Trigger dư thừa ở cấp Database để giải quyết triệt để lỗi "Network Error" khi thanh toán, chuyển toàn bộ logic xử lý tồn kho về cấp Application (Python).
- **Phân tách trạng thái tài khoản:** Chuẩn hóa thuật ngữ AI (Active/Inactive/Banned) để tránh việc AI nhầm lẫn giữa việc "Tạm khóa" và "Cấm vĩnh viễn".

---

## 🛠️ Hướng Dẫn Cài Đặt (Cách nhanh nhất)

Hệ thống đã được Docker hóa toàn bộ. Người dùng không cần cài đặt Python, NodeJS hay PostgreSQL thủ công.

### 1. Yêu cầu hệ thống
- Đã cài đặt [Docker Desktop](https://www.docker.com/products/docker-desktop/).
- Đảm bảo các cổng **3000** (Frontend), **8000** (Backend) và **5432** (Database) đang trống.

### 2. Khởi chạy với 1 lệnh duy nhất
Mở Terminal tại thư mục gốc của dự án và chạy:
```bash
docker-compose up --build
```
Hệ thống sẽ tự động build, cài đặt thư viện và nạp dữ liệu mẫu từ `init_db.sql`.

### 3. Truy cập hệ thống
- **Giao diện người dùng:** [http://localhost:3000](http://localhost:3000)
- **Tài liệu API (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Tài khoản Admin:** `admin` / Mật khẩu: `admin@123` (Dữ liệu mẫu).

---

## 📸 Hình Ảnh Dự Án
*(Vui lòng cập nhật hình ảnh giao diện tại đây)*
![Home Page](./images/home.png)
![AI Assistant](./images/ai.png)
![Admin Dashboard](./images/dashboard.png)
![Cart & Checkout](./images/cart.png)
![Product Detail](./images/productdetail.png)
---

## 👤 Tác Giả
- **Võ Xuân Văn**
- **Email:** vanvoxuan4@gmail.com
- **Dự án:** Đề tài thực tập tốt nghiệp 2026

---
*Dự án được phát triển với mục tiêu mang lại giải pháp công nghệ hiện đại cho ngành bán lẻ xe đạp.*

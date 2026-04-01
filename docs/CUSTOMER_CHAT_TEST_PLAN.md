# Manual Test Plan - Chat Customer (AI Support Online)

Bản kế hoạch này giúp kiểm tra các chức năng của Chatbot dành cho khách hàng, đảm bảo tính thân thiện, tư vấn chính xác và hỗ trợ xử lý đơn hàng an toàn.

---

## 1. Kiểm tra Phong cách & Giao tiếp (UI/UX)

| STT | Kịch bản kiểm tra | Hành động của người dùng | Kết quả mong đợi |
|---|---|---|---|
| 1.1 | **Chào hỏi & Xưng hô** | Nhắn: "Chào bạn", "Hello" | AI chào thân thiện, xưng "Mình" và gọi khách là "Bạn". |
| 1.2 | **Bảo mật thông tin** | Nhắn: "ID của mình là gì?" | AI không tiết lộ mã ID nội bộ, ưu tiên bảo mật. |
| 1.3 | **Định dạng Markdown** | Tra cứu danh sách sản phẩm | AI hiển thị danh sách rõ ràng, có emoji, link sản phẩm clickable. |

---

## 2. Tìm kiếm & Tư vấn Sản phẩm

| STT | Kịch bản kiểm tra | Hành động của người dùng | Kết quả mong đợi |
|---|---|---|---|
| 2.1 | **Tìm kiếm theo từ khóa** | Nhắn: "Tìm xe đạp điện tay ga" | AI liệt kê các mẫu xe phù hợp từ DB kèm giá và link. |
| 2.2 | **Tư vấn thông minh** | Nhắn: "Mình cao 1m70 thì chọn xe nào?" | AI gợi ý kích cỡ (vd: Size M) và lý do phù hợp. |
| 2.3 | **Gợi ý theo ngân sách** | Nhắn: "Dưới 10 triệu có xe nào không?" | AI lọc và hiển thị SP trong tầm giá yêu cầu. |

---

## 3. Quản lý Đơn hàng (Personal Orders)

| STT | Kịch bản kiểm tra | Hành động của người dùng | Kết quả mong đợi |
|---|---|---|---|
| 3.1 | **Xem lịch sử mua hàng** | Nhắn: "Đơn hàng của mình thế nào rồi?" | AI liệt kê danh sách đơn gần đây của khách. |
| 3.2 | **Xác nhận hủy đơn** | Nhắn: "Hủy đơn hàng #XX" | AI phải hỏi lại: **"Bạn có chắc chắn muốn hủy đơn hàng này không?"** |
| 3.3 | **Điều kiện hủy đơn** | Cố gắng hủy đơn "Đã giao" | AI từ chối và giải thích lý do (Chỉ được hủy đơn Pending). |

---

## 4. Thông tin & Chính sách

| STT | Kịch bản kiểm tra | Hành động của người dùng | Kết quả mong đợi |
|---|---|---|---|
| 4.1 | **Thông tin cửa hàng** | Nhắn: "Địa chỉ cửa hàng ở đâu?" | AI trả về địa chỉ: Đà Nẵng — Hotline: 0961.178.265. |
| 4.2 | **Chính sách bảo hành** | Nhắn: "Bảo hành xe như thế nào?" | AI giải thích chi tiết về thời hạn, linh kiện và điều kiện bảo hành. |

---

## 5. Trí nhớ ngữ cảnh (Context Memory)

| STT | Kịch bản kiểm tra | Hành động của người dùng | Kết quả mong đợi |
|---|---|---|---|
| 5.1 | **Tham chiếu (Anaphora)** | Hỏi xe A -> Hỏi: "Cái đó có màu đỏ không?" | AI phải hiểu "cái đó" là xe A đang nói ở trên. |

---
# Kịch bản Kiểm thử: Độ chính xác Tìm kiếm Sản phẩm (Product Search Precision)

Tài liệu này dùng để kiểm tra riêng tính năng tìm kiếm sản phẩm, đảm bảo AI ưu tiên tìm đúng tên sản phẩm cụ thể trước khi trả về kết quả theo danh mục.

---

## 1. Thông tin lỗi đã fix
- **Mô tả lỗi**: Khi user hỏi tên một xe cụ thể (vd: "LIV Alight 2"), AI nhận diện nó thuộc danh mục "Xe Đạp Nữ" và trả về 5 xe đạp nữ bất kỳ thay vì trả về đúng chiếc "LIV Alight 2".
- **Giải pháp**: Đảo ngược thứ tự ưu tiên trong code. Tìm chính xác tên sản phẩm trước, nếu không có mới tìm theo danh mục.

---

## 2. Kịch bản kiểm thử (Test Cases)

| STT | Kịch bản | Dữ liệu nhập (Chat) | Kết quả mong đợi | Trạng thái |
|---|---|---|---|---|
| **1** | **Tìm chính xác tên** | "Xe Đạp Nữ Đường Phố Touring LIV Alight 2 DD City Disc - Phanh Đĩa, Bánh 700C - 2022 có sản phẩm này không" | AI phải hiển thị đúng chiếc LIV Alight 2. **Không** được hiện các xe khác như Java Sequoia hay Raptor. | [ ] |
| **2** | **Tìm tên viết tắt** | "LIV Alight 2 DD City Disc" | AI tìm thấy đúng sản phẩm dựa trên keyword đặc thù. | [ ] |
| **3** | **Tìm danh mục (Fallback)** | "Cho mình xem các mẫu xe đạp nữ" | AI liệt kê 5 mẫu xe thuộc danh mục Xe đạp nữ (vì không có tên SP cụ thể). | [ ] |
| **4** | **Tìm sai tên** | "Xe đạp không có thực XYZ123" | AI báo không tìm thấy sản phẩm và gợi ý các danh mục hiện có. | [ ] |

---

## 3. Cách thức kiểm tra
1. Mở Chatbot ở góc phải màn hình.
2. Copy nguyên văn câu hỏi ở STT 1 dán vào chat.
3. Kiểm tra sản phẩm AI trả về có trùng khớp với sản phẩm đang hiển thị trên trang Web hay không.

---
**Người tạo:** Antigravity (AI)
**Ngày:** 30/03/2026

**Ghi chú cho người kiểm thử:**
- Phải đăng nhập tài khoản **Customer** để kiểm thử đơn hàng.
- Kiểm tra tính đúng đắn của Link sản phẩm và Link đơn hàng.

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

**Ghi chú cho người kiểm thử:**
- Phải đăng nhập tài khoản **Customer** để kiểm thử đơn hàng.
- Kiểm tra tính đúng đắn của Link sản phẩm và Link đơn hàng.

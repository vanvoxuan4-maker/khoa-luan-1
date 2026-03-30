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

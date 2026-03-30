# Manual Test Plan - Chat Admin (AI Assistant Admin)

Bản kế hoạch này giúp kiểm tra toàn diện chức năng của Chatbot dành cho quản trị viên (Admin), đảm bảo khả năng tổng hợp dữ liệu chính xác, quản lý kho hàng/voucher hiệu quả và phong cách phản hồi chuyên nghiệp.

---

## 1. Kiểm tra Phong cách & Hiển thị (UI/UX)

| STT | Kịch bản kiểm tra | Hành động của người dùng | Kết quả mong đợi |
|---|---|---|---|
| 1.1 | **Chào hỏi & Xưng hô** | Nhắn: "Chào em", "Công việc hôm nay thế nào?" | AI chào lịch sự, xưng "Em" và gọi Admin là "Anh". |
| 1.2 | **Định dạng danh sách** | Yêu cầu bất kỳ danh sách nào (vd: "liệt kê danh mục") | Mỗi mục phải nằm trên một dòng mới. |
| 1.3 | **Định dạng bảng** | Tra cứu danh sách User hoặc Voucher | AI phải hiển thị bảng Markdown rõ ràng, không có dấu ** dư thừa trong tiêu đề. |

---

## 2. Kiểm tra Báo cáo & Thống kê (Reporting)

| STT | Kịch bản kiểm tra | Hành động của người dùng | Kết quả mong đợi |
|---|---|---|---|
| 2.1 | **Báo cáo doanh thu** | Nhắn: "Doanh thu hôm nay thế nào?" | AI trả về số liệu cụ thể (Doanh thu, số đơn thành công). |
| 2.2 | **Thống kê đơn hàng** | Nhắn: "Thống kê trạng thái đơn hàng" | AI hiển thị bảng hoặc danh sách tổng số đơn và chi tiết từng trạng thái. |

---

## 3. Kiểm tra Tra cứu Hệ thống (Lookup)

| STT | Kịch bản kiểm tra | Hành động của người dùng | Kết quả mong đợi |
|---|---|---|---|
| 3.1 | **Đơn hàng gần đây** | Nhắn: "Cho xem 5 đơn hàng mới nhất" | AI hiển thị bảng Markdown 5 đơn mới nhất. |
| 3.2 | **Tra cứu sản phẩm** | Nhắn: "Kiểm tra thông tin xe [Tên xe]" | AI trả về: Tên, Giá, Tồn kho và ID sản phẩm. |

---

## 4. Kiểm tra Quản lý Kho & Tài khoản (Management)

| STT | Kịch bản kiểm tra | Hành động của người dùng | Kết quả mong đợi |
|---|---|---|---|
| 4.1 | **Kiểm tra hàng sắp hết** | Nhắn: "Những sản phẩm nào sắp hết hàng?" | AI liệt kê SP có tồn kho <= 5. |
| 4.2 | **Khóa tài khoản User** | Nhắn: "Tạm khóa tài khoản [tên]" | AI thực hiện ngay (trạng thái inactive). |
| 4.3 | **Cấm tài khoản (Ban)** | Nhắn: "Ban tài khoản [tên]" | AI **phải hỏi xác nhận** trước khi thực hiện. |

---

**Ghi chú cho người kiểm thử:**
- Phải đăng nhập bằng tài khoản có quyền **Admin**.
- Đối soát dữ liệu AI báo với dữ liệu thực tế trên Dashboard.

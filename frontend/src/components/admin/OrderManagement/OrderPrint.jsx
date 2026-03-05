import React from 'react';
import { SHOP_INFO } from './OrderManager';

const OrderPrint = ({ order, itemsOnly, subtotal, shipFee, giamGia, tongSauGiam }) => {
    if (!order) return null;

    const printDate = new Date().toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    return (
        <>
            <style>{`
        @page {
          size: A4;
          margin: 12mm 15mm;
        }

        @media print {
          body * { visibility: hidden !important; }

          html, body {
            height: auto !important;
            overflow: visible !important;
          }
          #root, .fixed, .modal-anim, [class*="overflow"] {
            overflow: visible !important;
            max-height: none !important;
            height: auto !important;
            position: static !important;
            transform: none !important;
          }

          #printable-invoice,
          #printable-invoice * {
            visibility: visible !important;
          }

          #printable-invoice {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            background: white !important;
            z-index: 2147483647 !important;
            display: block !important;
          }

          #printable-invoice,
          #printable-invoice * {
            font-family: 'Times New Roman', Times, serif !important;
            color: #000 !important;
            background: white !important;
            box-shadow: none !important;
          }

          #printable-invoice table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          #printable-invoice th {
            background: #f0f0f5 !important;
            color: black !important;
            border: 1pt solid black !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          #printable-invoice .even-row {
            background: #ffffff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          #printable-invoice .logo-box {
            background: none !important;
            border: 1.5pt solid black !important;
          }
          #printable-invoice .total-row th,
          #printable-invoice .total-row td {
            background: white !important;
            color: black !important;
            border-top: 2pt solid black !important;
            border-bottom: 2pt solid black !important;
            font-weight: 900 !important;
            text-transform: uppercase !important;
          }
          .sign-line {
            border-top: 1pt solid #aaa !important;
          }
        }
      `}</style>

            <div id="printable-invoice" style={{
                display: 'none',
                fontFamily: "'Times New Roman', Times, serif",
                color: '#000',
                background: 'white',
                fontSize: '11pt',
                lineHeight: '1.5',
            }}>

                {/* ===== HEADER CỬA HÀNG 3 PHẦN (FLEXBOX) ===== */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2.5pt solid #1a1a2e', paddingBottom: '12px', marginBottom: '16px', marginTop: '-20px' }}>

                    {/* 1. Bên Trái: Logo & Thương hiệu */}
                    <div style={{ flex: '1 1 0', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <div className="logo-box" style={{
                            width: '52px', height: '52px', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: '4px',
                        }}>
                            <svg viewBox="0 0 100 100" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="30" cy="65" r="16" stroke="black" strokeWidth="4" strokeDasharray="8 4" />
                                <circle cx="30" cy="65" r="5" fill="black" />
                                <circle cx="75" cy="65" r="16" stroke="black" strokeWidth="4" strokeDasharray="8 4" />
                                <circle cx="75" cy="65" r="4" fill="black" />
                                <path d="M30 65 L 42 35 L 75 65 M 42 35 L 65 35 M 58 65 L 42 35"
                                    stroke="black" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div>
                            <div style={{ fontSize: '18pt', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', color: '#1a1a2e', lineHeight: 1 }}>
                                BIKE<span style={{ color: '#ca8a04' }}>STORE</span>
                            </div>
                            <div style={{ fontSize: '7.5pt', fontWeight: '700', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px' }}>
                                Premium Bicycles
                            </div>
                            <div style={{ borderTop: '0.4pt solid #bbb', marginTop: '4px' }}></div>
                        </div>
                    </div>

                    {/* 2. Ở Giữa: Tiêu đề Hóa đơn */}
                    <div style={{ flex: '1.5 1 0', textAlign: 'center', paddingTop: '30px' }}>
                        <div style={{ fontSize: '20pt', fontWeight: '900', textTransform: 'uppercase', color: '#1a1a2e', letterSpacing: '2px', whiteSpace: 'nowrap', lineHeight: 1 }}>
                            HÓA ĐƠN BÁN HÀNG
                        </div>
                        <div style={{ fontSize: '8.5pt', color: '#444', fontStyle: 'italic', marginTop: '4px' }}>
                            Cửa hàng xe đạp cao cấp & Bảo hành uy tín
                        </div>
                    </div>

                    {/* 3. Bên Phải: Thông tin liên hệ & Hóa đơn */}
                    <div style={{ flex: '1 1 0', textAlign: 'right', fontSize: '9pt', color: '#333', lineHeight: '1.3' }}>
                        <div style={{ fontWeight: '700', fontSize: '9.5pt' }}>{SHOP_INFO.address}</div>
                        <div>Hotline: {SHOP_INFO.phone}</div>
                        <div style={{ marginBottom: '4px' }}>Email: bikestore@gmail.com</div>
                        <div style={{ borderTop: '0.4pt solid #bbb', paddingTop: '4px', marginTop: '2px', fontSize: '8.5pt' }}>
                            <strong>Số HĐ:</strong> #{order.ma_don_hang} — <strong>Ngày:</strong> {new Date(order.ngay_dat).toLocaleDateString('vi-VN')}
                        </div>
                    </div>
                </div>

                {/* ===== THÔNG TIN KHÁCH HÀNG + GIAO HÀNG ===== */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    {/* Khách hàng */}
                    <div style={{ border: '1.5pt solid #1a1a2e', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ background: '#1a1a2e', color: 'white', padding: '5px 10px', fontSize: '9pt', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            👤 Thông tin khách hàng
                        </div>
                        <div style={{ padding: '8px 10px', fontSize: '10.5pt' }}>
                            <div style={{ marginBottom: '4px' }}>
                                <span style={{ color: '#555', fontWeight: '600', display: 'inline-block', width: '75px' }}>Họ tên:</span>
                                <strong>{order.ten_nguoi_nhan}</strong>
                            </div>
                            <div style={{ marginBottom: '4px' }}>
                                <span style={{ color: '#555', fontWeight: '600', display: 'inline-block', width: '75px' }}>SĐT:</span>
                                {order.sdt_nguoi_nhan}
                            </div>
                            {order.email_nguoi_nhan && (
                                <div>
                                    <span style={{ color: '#555', fontWeight: '600', display: 'inline-block', width: '75px' }}>Email:</span>
                                    {order.email_nguoi_nhan}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Giao hàng */}
                    <div style={{ border: '1.5pt solid #1a1a2e', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ background: '#1a1a2e', color: 'white', padding: '5px 10px', fontSize: '9pt', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            🚚 Thông tin giao hàng
                        </div>
                        <div style={{ padding: '8px 10px', fontSize: '10.5pt' }}>
                            <div style={{ marginBottom: '4px' }}>
                                <span style={{ color: '#555', fontWeight: '600', display: 'inline-block', width: '80px' }}>Địa chỉ:</span>
                                {order.dia_chi_giao}
                            </div>
                            <div style={{ marginBottom: '4px' }}>
                                <span style={{ color: '#555', fontWeight: '600', display: 'inline-block', width: '80px' }}>PT TT:</span>
                                <strong>{order.phuong_thuc}</strong>
                            </div>
                            {order.ma_giamgia && (
                                <div>
                                    <span style={{ color: '#555', fontWeight: '600', display: 'inline-block', width: '80px' }}>Voucher:</span>
                                    <span style={{ color: '#c00', fontWeight: '700' }}>{order.ma_giamgia}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ===== BẢNG SẢN PHẨM ===== */}
                <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '10pt', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#1a1a2e', marginBottom: '6px', borderLeft: '4px solid #1a1a2e', paddingLeft: '8px' }}>
                        Danh sách sản phẩm ({itemsOnly.length} mặt hàng)
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10pt' }}>
                        <thead>
                            <tr style={{ background: '#1a1a2e', color: 'white' }}>
                                <th style={{ border: '1pt solid #333', padding: '6px 8px', textAlign: 'center', width: '28px' }}>STT</th>
                                <th style={{ border: '1pt solid #333', padding: '6px 8px', textAlign: 'left', width: '58px' }}>Mã SP</th>
                                <th style={{ border: '1pt solid #333', padding: '6px 8px', textAlign: 'left' }}>Tên sản phẩm</th>
                                <th style={{ border: '1pt solid #333', padding: '6px 8px', textAlign: 'center', width: '55px' }}>Màu sắc</th>
                                <th style={{ border: '1pt solid #333', padding: '6px 8px', textAlign: 'center', width: '30px' }}>SL</th>
                                <th style={{ border: '1pt solid #333', padding: '6px 8px', textAlign: 'right', width: '105px' }}>Đơn giá (VND)</th>
                                <th style={{ border: '1pt solid #333', padding: '6px 8px', textAlign: 'right', width: '115px' }}>Thành tiền (VND)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itemsOnly.map((item, i) => (
                                <tr key={i} className={i % 2 === 1 ? 'even-row' : ''} style={{ background: i % 2 === 1 ? '#f8f8ff' : 'white' }}>
                                    <td style={{ border: '1pt solid #ccc', padding: '5px 8px', textAlign: 'center' }}>{i + 1}</td>
                                    <td style={{ border: '1pt solid #ccc', padding: '5px 8px', textAlign: 'center', fontFamily: 'monospace', fontSize: '9pt', color: '#555' }}>{item.ma_sanpham || '—'}</td>
                                    <td style={{ border: '1pt solid #ccc', padding: '5px 8px', fontWeight: '600' }}>{item.ten_sanpham}</td>
                                    <td style={{ border: '1pt solid #ccc', padding: '5px 8px', textAlign: 'center', fontSize: '9.5pt' }}>{item.mau_sac || '—'}</td>
                                    <td style={{ border: '1pt solid #ccc', padding: '5px 8px', textAlign: 'center', fontWeight: '700' }}>{item.so_luong}</td>
                                    <td style={{ border: '1pt solid #ccc', padding: '5px 8px', textAlign: 'right' }}>{item.gia_mua?.toLocaleString('vi-VN')}</td>
                                    <td style={{ border: '1pt solid #ccc', padding: '5px 8px', textAlign: 'right', fontWeight: '700' }}>{item.thanh_tien?.toLocaleString('vi-VN')}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="6" style={{ border: '1pt solid #ccc', padding: '5px 10px', textAlign: 'right', fontWeight: '600' }}>Tiền hàng:</td>
                                <td style={{ border: '1pt solid #ccc', padding: '5px 8px', textAlign: 'right', fontWeight: '700' }}>{subtotal.toLocaleString('vi-VN')}</td>
                            </tr>
                            <tr>
                                <td colSpan="6" style={{ border: '1pt solid #ccc', padding: '5px 10px', textAlign: 'right', fontWeight: '600' }}>Phí vận chuyển:</td>
                                <td style={{ border: '1pt solid #ccc', padding: '5px 8px', textAlign: 'right', fontWeight: '700' }}>+{shipFee.toLocaleString('vi-VN')}</td>
                            </tr>
                            {giamGia > 0 && (
                                <tr>
                                    <td colSpan="6" style={{ border: '1pt solid #ccc', padding: '5px 10px', textAlign: 'right', fontWeight: '600', color: '#c00', whiteSpace: 'nowrap' }}>
                                        Giảm giá ({order.ma_giamgia}{order.voucher_info ? ` -${order.voucher_info.type === 'percentage' ? `${order.voucher_info.value}%` : `${order.voucher_info.value.toLocaleString('vi-VN')} VND`}` : ''}):
                                    </td>
                                    <td style={{ border: '1pt solid #ccc', padding: '5px 8px', textAlign: 'right', fontWeight: '700', color: '#c00' }}>-{giamGia.toLocaleString('vi-VN')}</td>
                                </tr>
                            )}
                            <tr className="total-row" style={{ background: '#1a1a2e' }}>
                                <td colSpan="6" style={{ border: '1pt solid #333', padding: '8px 10px', textAlign: 'right', fontWeight: '900', fontSize: '12pt', color: 'white', textTransform: 'uppercase', letterSpacing: '1px', background: '#1a1a2e' }}>
                                    TỔNG CỘNG THANH TOÁN:
                                </td>
                                <td style={{ border: '1pt solid #333', padding: '8px', textAlign: 'right', fontWeight: '900', fontSize: '13pt', color: 'white', background: '#1a1a2e' }}>
                                    {tongSauGiam.toLocaleString('vi-VN')}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* ===== GHI CHÚ ===== */}
                <div style={{ border: '1pt dashed #999', borderRadius: '4px', padding: '8px 12px', marginBottom: '20px', fontSize: '10pt', color: '#444' }}>
                    <strong>Ghi chú:</strong> Hàng đã bán không được hoàn trả sau 7 ngày kể từ ngày giao. Vui lòng kiểm tra hàng hóa kỹ trước khi ký nhận.
                    Mọi thắc mắc xin liên hệ: <strong>{SHOP_INFO.phone}</strong>.
                </div>

                {/* ===== KHU VỰC KÝ TÊN ===== */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '8px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: '700', textTransform: 'uppercase', fontSize: '10pt', marginBottom: '52px' }}>Khách hàng</div>
                        <div className="sign-line" style={{ borderTop: '1pt solid #aaa', paddingTop: '4px', fontSize: '9pt', color: '#555', fontStyle: 'italic' }}>(Ký, ghi rõ họ tên)</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: '700', textTransform: 'uppercase', fontSize: '10pt', marginBottom: '52px' }}>Người giao hàng</div>
                        <div className="sign-line" style={{ borderTop: '1pt solid #aaa', paddingTop: '4px', fontSize: '9pt', color: '#555', fontStyle: 'italic' }}>(Ký, ghi rõ họ tên)</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: '700', textTransform: 'uppercase', fontSize: '10pt', marginBottom: '4px' }}>Đại diện cửa hàng</div>
                        <div style={{ fontSize: '9pt', color: '#555', marginBottom: '36px', fontStyle: 'italic' }}>(Ký, đóng dấu)</div>
                        <div className="sign-line" style={{ borderTop: '1pt solid #aaa', paddingTop: '4px', fontSize: '9pt', color: '#555', fontStyle: 'italic' }}>{SHOP_INFO.name}</div>
                    </div>
                </div>

                {/* ===== FOOTER ===== */}
                <div style={{ marginTop: '24px', borderTop: '1.5pt solid #1a1a2e', paddingTop: '8px', textAlign: 'center', fontSize: '9pt', color: '#555' }}>
                    Cảm ơn quý khách đã mua hàng tại <strong>{SHOP_INFO.name}</strong> — {SHOP_INFO.address} — {SHOP_INFO.phone}
                </div>
            </div>
        </>
    );
};

export default OrderPrint;

import React from 'react';
import Breadcrumb from '../layouts/Breadcrumb';

const ReturnPolicy = () => {
    return (
        <>
            <Breadcrumb items={[{ label: 'Chính sách đổi trả' }]} />
            <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 py-20">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-block mb-4">
                            <span className="text-6xl">🔄</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600 mb-6 uppercase">
                            Chính Sách Đổi Trả
                        </h1>
                        <p className="text-xl text-slate-600 font-bold max-w-3xl mx-auto">
                            Cam kết đổi trả minh bạch – Mua sắm an tâm tại Bike Store
                        </p>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        {/* Highlight Banner */}
                        <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-3xl p-10 mb-12 shadow-2xl">
                            <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                                <span className="text-4xl">⭐</span>
                                Cam Kết Của Chúng Tôi
                            </h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                                    <div className="text-4xl font-black mb-2">7 NGÀY</div>
                                    <div className="text-rose-100 font-bold">Đổi trả miễn phí</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                                    <div className="text-4xl font-black mb-2">100%</div>
                                    <div className="text-rose-100 font-bold">Hoàn tiền nếu lỗi NSX</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                                    <div className="text-4xl font-black mb-2">24H</div>
                                    <div className="text-rose-100 font-bold">Xử lý yêu cầu</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Điều kiện đổi trả */}
                            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                                <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                                    <span className="text-3xl">✅</span>
                                    1. Điều Kiện Được Đổi / Trả
                                </h3>
                                <ul className="space-y-3 text-gray-700 font-medium">
                                    <li className="flex items-start gap-3">
                                        <span className="text-rose-500 font-black text-xl">✓</span>
                                        <span>Sản phẩm còn trong <strong className="text-rose-600">7 ngày</strong> kể từ ngày nhận hàng</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-rose-500 font-black text-xl">✓</span>
                                        <span>Sản phẩm còn nguyên vẹn, chưa qua sử dụng, còn đủ tem nhãn, hộp đựng</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-rose-500 font-black text-xl">✓</span>
                                        <span>Lỗi do nhà sản xuất: sai màu, sai kích cỡ, hàng bị hư hỏng khi vận chuyển</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-rose-500 font-black text-xl">✓</span>
                                        <span>Có hóa đơn mua hàng hợp lệ từ Bike Store</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Trường hợp KHÔNG được đổi trả */}
                            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                                <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                                    <span className="text-3xl">🚫</span>
                                    2. Trường Hợp Không Được Đổi / Trả
                                </h3>
                                <ul className="space-y-3 text-gray-700 font-medium">
                                    <li className="flex items-start gap-3">
                                        <span className="text-gray-400 font-black text-xl">✗</span>
                                        <span>Sản phẩm đã qua sử dụng, có dấu hiệu trầy xước, biến dạng</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-gray-400 font-black text-xl">✗</span>
                                        <span>Quá 7 ngày kể từ ngày nhận hàng</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-gray-400 font-black text-xl">✗</span>
                                        <span>Lỗi do người dùng gây ra: va đập, rơi vỡ, sử dụng sai cách</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-gray-400 font-black text-xl">✗</span>
                                        <span>Các sản phẩm phụ kiện tiêu hao: lốp, xăm, xích (đã lắp)</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Quy trình đổi trả */}
                            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                                <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                                    <span className="text-3xl">📋</span>
                                    3. Quy Trình Đổi / Trả Hàng
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { step: 1, title: 'Liên hệ với chúng tôi', desc: 'Gọi hotline 0961.178.265 hoặc nhắn tin qua Zalo trong vòng 7 ngày sau khi nhận hàng.' },
                                        { step: 2, title: 'Cung cấp thông tin', desc: 'Cung cấp mã đơn hàng, ảnh/video sản phẩm lỗi để chúng tôi xác nhận.' },
                                        { step: 3, title: 'Gửi hàng về', desc: 'Gửi sản phẩm về cửa hàng (chúng tôi hỗ trợ phí vận chuyển nếu lỗi từ NSX).' },
                                        { step: 4, title: 'Kiểm tra & xử lý', desc: 'Chúng tôi kiểm tra trong vòng 1-2 ngày làm việc kể từ khi nhận hàng.' },
                                        { step: 5, title: 'Hoàn tiền / Đổi hàng', desc: 'Hoàn tiền vào tài khoản trong 3-5 ngày làm việc hoặc giao hàng đổi mới.' },
                                    ].map(({ step, title, desc }) => (
                                        <div key={step} className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-rose-500 text-white rounded-full flex items-center justify-center font-black shrink-0">{step}</div>
                                            <div>
                                                <h4 className="font-black text-gray-800 mb-1">{title}</h4>
                                                <p className="text-gray-600">{desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Phương thức hoàn tiền */}
                            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                                <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                                    <span className="text-3xl">💰</span>
                                    4. Phương Thức Hoàn Tiền
                                </h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 text-center">
                                        <div className="text-3xl mb-2">🏦</div>
                                        <h4 className="font-black text-blue-700 mb-1">Chuyển khoản</h4>
                                        <p className="text-blue-600 text-sm font-medium">3-5 ngày làm việc</p>
                                    </div>
                                    <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100 text-center">
                                        <div className="text-3xl mb-2">📱</div>
                                        <h4 className="font-black text-purple-700 mb-1">Ví điện tử</h4>
                                        <p className="text-purple-600 text-sm font-medium">1-2 ngày làm việc</p>
                                    </div>
                                    <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 text-center">
                                        <div className="text-3xl mb-2">💵</div>
                                        <h4 className="font-black text-amber-700 mb-1">Tiền mặt tại cửa hàng</h4>
                                        <p className="text-amber-600 text-sm font-medium">Ngay lập tức</p>
                                    </div>
                                </div>
                            </div>

                            {/* Liên hệ */}
                            <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-3xl p-8 border-2 border-rose-100">
                                <h3 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-3">
                                    <span className="text-3xl">📞</span>
                                    Liên Hệ Hỗ Trợ Đổi Trả
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4 text-gray-700 font-bold">
                                    <div>
                                        <p className="mb-2">📍 <strong>Địa chỉ:</strong> Xã Thượng Đức, TP. Đà Nẵng</p>
                                        <p className="mb-2">📞 <strong>Hotline:</strong> 0961.178.265</p>
                                    </div>
                                    <div>
                                        <p className="mb-2">✉️ <strong>Email:</strong> vanvoxuan4@gmail.com</p>
                                        <p className="mb-2">🕐 <strong>Giờ làm việc:</strong> T2-T7: 8:00-20:00</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReturnPolicy;

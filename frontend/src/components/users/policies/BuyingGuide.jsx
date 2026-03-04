import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../layouts/Breadcrumb';

const BuyingGuide = () => {
    return (
        <>
            <Breadcrumb items={[{ label: 'Hướng dẫn mua hàng' }]} />
            <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 py-20">
                <div className="container mx-auto px-4">
                    {/* Header Section */}
                    <div className="text-center mb-16">
                        <div className="inline-block mb-4">
                            <span className="text-6xl">🛒</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700 mb-6 uppercase">
                            Hướng Dẫn Mua Hàng
                        </h1>
                        <p className="text-xl text-slate-600 font-bold max-w-3xl mx-auto">
                            Mua sắm dễ dàng - Thanh toán an toàn - Giao hàng nhanh chóng
                        </p>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-5xl mx-auto">
                        {/* Buying Steps */}
                        <div className="mb-12">
                            <h2 className="text-3xl font-black text-gray-800 mb-8 text-center">
                                Các Bước Mua Hàng
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Step 1 */}
                                <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-2">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center text-3xl font-black mb-4 mx-auto">
                                        1
                                    </div>
                                    <h3 className="text-xl font-black text-gray-800 mb-3 text-center">Chọn Sản Phẩm</h3>
                                    <p className="text-gray-600 font-medium text-center">
                                        Duyệt danh mục và chọn xe đạp phù hợp với nhu cầu của bạn
                                    </p>
                                </div>

                                {/* Step 2 */}
                                <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-2">
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl flex items-center justify-center text-3xl font-black mb-4 mx-auto">
                                        2
                                    </div>
                                    <h3 className="text-xl font-black text-gray-800 mb-3 text-center">Thêm Vào Giỏ</h3>
                                    <p className="text-gray-600 font-medium text-center">
                                        Chọn màu sắc, số lượng và thêm sản phẩm vào giỏ hàng
                                    </p>
                                </div>

                                {/* Step 3 */}
                                <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-2">
                                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl flex items-center justify-center text-3xl font-black mb-4 mx-auto">
                                        3
                                    </div>
                                    <h3 className="text-xl font-black text-gray-800 mb-3 text-center">Thanh Toán</h3>
                                    <p className="text-gray-600 font-medium text-center">
                                        Điền thông tin giao hàng và chọn phương thức thanh toán
                                    </p>
                                </div>

                                {/* Step 4 */}
                                <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-2">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl flex items-center justify-center text-3xl font-black mb-4 mx-auto">
                                        4
                                    </div>
                                    <h3 className="text-xl font-black text-gray-800 mb-3 text-center">Nhận Hàng</h3>
                                    <p className="text-gray-600 font-medium text-center">
                                        Nhận xe tại nhà hoặc đến cửa hàng để lấy hàng
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
                            <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                                <span className="text-3xl">💳</span>
                                Phương Thức Thanh Toán
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl">
                                    <div className="text-4xl">💰</div>
                                    <div>
                                        <h4 className="font-black text-gray-800 mb-2">Thanh toán khi nhận hàng (COD)</h4>
                                        <p className="text-gray-600 font-medium">Thanh toán bằng tiền mặt khi nhận hàng tại nhà</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-2xl">
                                    <div className="text-4xl">🏦</div>
                                    <div>
                                        <h4 className="font-black text-gray-800 mb-2">Chuyển khoản ngân hàng</h4>
                                        <p className="text-gray-600 font-medium">Chuyển khoản trực tiếp qua tài khoản ngân hàng</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-2xl">
                                    <div className="text-4xl">💳</div>
                                    <div>
                                        <h4 className="font-black text-gray-800 mb-2">Thanh toán online (VNPay)</h4>
                                        <p className="text-gray-600 font-medium">Thanh toán qua cổng VNPay an toàn, bảo mật</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Policy */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
                            <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                                <span className="text-3xl">🚚</span>
                                Chính Sách Giao Hàng & Phí Vận Chuyển
                            </h3>

                            <div className="overflow-x-auto mb-8">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50">
                                            <th className="p-4 border-b-2 border-slate-200 font-black text-slate-700 uppercase text-sm">Khu vực</th>
                                            <th className="p-4 border-b-2 border-slate-200 font-black text-slate-700 uppercase text-sm">Phí vận chuyển</th>
                                            <th className="p-4 border-b-2 border-slate-200 font-black text-slate-700 uppercase text-sm">Miễn phí (Freeship)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr>
                                            <td className="p-4 font-bold text-slate-800">Đà Nẵng</td>
                                            <td className="p-4 font-black text-blue-600">50.000 VND</td>
                                            <td className="p-4 font-medium text-slate-600">Đơn hàng từ <span className="text-green-600 font-black tracking-tight">15.000.000 VND</span></td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-bold text-slate-800">Các tỉnh thành khác</td>
                                            <td className="p-4 font-black text-blue-600">100.000 VND</td>
                                            <td className="p-4 font-medium text-slate-600">Đơn hàng từ <span className="text-green-600 font-black tracking-tight">25.000.000 VND</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                                    <span className="text-indigo-600 font-black text-xl">🕒</span>
                                    <div>
                                        <strong className="text-indigo-900 block mb-1">Thời gian giao hàng</strong>
                                        <p className="text-indigo-800/70 text-sm font-medium">1-2 ngày (Đà Nẵng) | 3-5 ngày (Tỉnh khác)</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                    <span className="text-emerald-600 font-black text-xl">🔍</span>
                                    <div>
                                        <strong className="text-emerald-900 block mb-1">Kiểm tra & Nhận hàng</strong>
                                        <p className="text-emerald-800/70 text-sm font-medium">Quý khách được kiểm tra sản phẩm trước khi thanh toán</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Support */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-3xl p-8 shadow-2xl mb-8">
                            <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                                <span className="text-3xl">💬</span>
                                Hỗ Trợ Khách Hàng
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                    <h4 className="font-black mb-3 text-lg">Tư vấn mua hàng</h4>
                                    <p className="text-blue-100 font-medium mb-3">
                                        Đội ngũ tư vấn chuyên nghiệp sẵn sàng hỗ trợ bạn chọn sản phẩm phù hợp
                                    </p>
                                    <p className="font-bold">📞 Hotline: 0961.178.265</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                    <h4 className="font-black mb-3 text-lg">Theo dõi đơn hàng</h4>
                                    <p className="text-blue-100 font-medium mb-3">
                                        Kiểm tra trạng thái đơn hàng của bạn mọi lúc mọi nơi
                                    </p>
                                    <Link to="/my-orders" className="font-bold hover:text-yellow-300 transition-colors">
                                        👉 Xem đơn hàng của tôi
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl p-8 border-2 border-yellow-200">
                            <h3 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-3">
                                <span className="text-3xl">💡</span>
                                Lưu Ý Quan Trọng
                            </h3>
                            <ul className="space-y-3 text-gray-700 font-medium">
                                <li className="flex items-start gap-3">
                                    <span className="text-orange-600 font-black">•</span>
                                    <span>Vui lòng cung cấp đầy đủ thông tin giao hàng chính xác để tránh trễ hẹn</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-orange-600 font-black">•</span>
                                    <span>Kiểm tra kỹ sản phẩm trước khi nhận hàng và ký xác nhận</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-orange-600 font-black">•</span>
                                    <span>Giữ lại hóa đơn và phiếu bảo hành để được hỗ trợ tốt nhất</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-orange-600 font-black">•</span>
                                    <span>Liên hệ ngay với chúng tôi nếu có bất kỳ vấn đề gì với đơn hàng</span>
                                </li>
                            </ul>
                        </div>

                        {/* CTA */}
                        <div className="text-center mt-12">
                            <Link
                                to="/products"
                                className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-12 py-5 rounded-full font-black text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                            >
                                🛍️ Bắt Đầu Mua Sắm Ngay
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BuyingGuide;

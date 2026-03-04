import React from 'react';
import Breadcrumb from '../layouts/Breadcrumb';

const Warranty = () => {
    return (
        <>
            <Breadcrumb items={[{ label: 'Chính sách bảo hành' }]} />
            <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 py-20">
                <div className="container mx-auto px-4">
                    {/* Header Section */}
                    <div className="text-center mb-16">
                        <div className="inline-block mb-4">
                            <span className="text-6xl">🛡️</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700 mb-6 uppercase">
                            Chính Sách Bảo Hành
                        </h1>
                        <p className="text-xl text-slate-600 font-bold max-w-3xl mx-auto">
                            Cam kết bảo hành chất lượng - Yên tâm sử dụng lâu dài
                        </p>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-5xl mx-auto">
                        {/* Warranty Overview */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-3xl p-10 mb-12 shadow-2xl">
                            <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                                <span className="text-4xl">⭐</span>
                                Cam Kết Bảo Hành
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                    <div className="text-5xl font-black mb-2">5 NĂM</div>
                                    <div className="text-blue-100 font-bold">Bảo hành khung sườn</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                    <div className="text-5xl font-black mb-2">1-2 NĂM</div>
                                    <div className="text-blue-100 font-bold">Bảo hành linh kiện</div>
                                </div>
                            </div>
                        </div>

                        {/* Warranty Details */}
                        <div className="space-y-8">
                            {/* Section 1: Khung sườn */}
                            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                                <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                                    <span className="text-3xl">🚴</span>
                                    1. Bảo Hành Khung Sườn
                                </h3>
                                <ul className="space-y-3 text-gray-700 font-medium">
                                    <li className="flex items-start gap-3">
                                        <span className="text-blue-600 font-black text-xl">✓</span>
                                        <span>Bảo hành <strong className="text-blue-600">5 năm</strong> đối với khung sườn xe đạp</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-blue-600 font-black text-xl">✓</span>
                                        <span>Bảo hành lỗi kỹ thuật, nứt, gãy do lỗi sản xuất</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-blue-600 font-black text-xl">✓</span>
                                        <span>Miễn phí sửa chữa hoặc thay thế khung mới nếu có lỗi</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Section 2: Linh kiện */}
                            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                                <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                                    <span className="text-3xl">⚙️</span>
                                    2. Bảo Hành Linh Kiện
                                </h3>
                                <ul className="space-y-3 text-gray-700 font-medium">
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-600 font-black text-xl">✓</span>
                                        <span>Phuộc, giảm xóc: <strong className="text-green-600">2 năm</strong></span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-600 font-black text-xl">✓</span>
                                        <span>Bộ truyền động (líp, sên, đĩa): <strong className="text-green-600">1 năm</strong></span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-600 font-black text-xl">✓</span>
                                        <span>Phanh đĩa, phanh V-brake: <strong className="text-green-600">1 năm</strong></span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-600 font-black text-xl">✓</span>
                                        <span>Các linh kiện khác: <strong className="text-green-600">6 tháng - 1 năm</strong></span>
                                    </li>
                                </ul>
                            </div>

                            {/* Section 3: Điều kiện */}
                            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                                <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                                    <span className="text-3xl">📋</span>
                                    3. Điều Kiện Bảo Hành
                                </h3>
                                <ul className="space-y-3 text-gray-700 font-medium">
                                    <li className="flex items-start gap-3">
                                        <span className="text-orange-600 font-black text-xl">•</span>
                                        <span>Sản phẩm còn trong thời hạn bảo hành</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-orange-600 font-black text-xl">•</span>
                                        <span>Có phiếu bảo hành và hóa đơn mua hàng hợp lệ</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-orange-600 font-black text-xl">•</span>
                                        <span>Lỗi do nhà sản xuất, không do người dùng gây ra</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-orange-600 font-black text-xl">•</span>
                                        <span>Sản phẩm không bị tác động vật lý mạnh, tai nạn nghiêm trọng</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Section 4: Quy trình */}
                            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                                <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                                    <span className="text-3xl">🔄</span>
                                    4. Quy Trình Bảo Hành
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-black shrink-0">1</div>
                                        <div>
                                            <h4 className="font-black text-gray-800 mb-1">Liên hệ với chúng tôi</h4>
                                            <p className="text-gray-600">Gọi hotline <strong>0961.178.265</strong> hoặc đến cửa hàng trực tiếp</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-black shrink-0">2</div>
                                        <div>
                                            <h4 className="font-black text-gray-800 mb-1">Mang sản phẩm đến cửa hàng</h4>
                                            <p className="text-gray-600">Mang theo phiếu bảo hành và hóa đơn mua hàng</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-black shrink-0">3</div>
                                        <div>
                                            <h4 className="font-black text-gray-800 mb-1">Kiểm tra và xác nhận</h4>
                                            <p className="text-gray-600">Kỹ thuật viên kiểm tra và xác nhận tình trạng bảo hành</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-black shrink-0">4</div>
                                        <div>
                                            <h4 className="font-black text-gray-800 mb-1">Sửa chữa/Thay thế</h4>
                                            <p className="text-gray-600">Tiến hành sửa chữa hoặc thay thế linh kiện trong 3-7 ngày</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-black shrink-0">5</div>
                                        <div>
                                            <h4 className="font-black text-gray-800 mb-1">Nhận lại sản phẩm</h4>
                                            <p className="text-gray-600">Nhận xe đã được sửa chữa và kiểm tra kỹ trước khi về</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Section */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border-2 border-blue-100">
                                <h3 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-3">
                                    <span className="text-3xl">📞</span>
                                    Liên Hệ Hỗ Trợ Bảo Hành
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

export default Warranty;

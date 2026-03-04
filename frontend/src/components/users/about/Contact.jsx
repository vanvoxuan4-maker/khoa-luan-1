import React, { useState, useEffect } from 'react';
import Breadcrumb from '../layouts/Breadcrumb';
import { getUserInfo } from '../../../utils/auth';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const user = getUserInfo();
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.hovaten || user.ten_user || '',
                email: user.email || '',
                phone: user.sdt || user.phone || ''
            }));
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("https://formspree.io/f/xpqjbrov", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert('✅ Cảm ơn bạn đã liên hệ! Tin nhắn của bạn đã được gửi trực tiếp tới Admin.');
                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    message: ''
                });
            } else {
                alert('❌ Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('❌ Lỗi kết nối. Vui lòng kiểm tra mạng của bạn.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Breadcrumb items={[{ label: 'Liên hệ' }]} />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/5 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    {/* Header Section */}
                    <div className="text-center mb-16 animate-fade-in-up">
                        <div className="inline-block mb-4">
                            <span className="text-6xl">📞</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-6 uppercase tracking-tight">
                            Liên Hệ Với Chúng Tôi
                        </h1>
                        <p className="text-xl text-slate-600 font-bold max-w-2xl mx-auto">
                            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn 24/7
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">
                        {/* Left Column - Contact Info (2 cols) */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Contact Information Card */}
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-blue-500/20 transition-all duration-500">
                                <h2 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tight flex items-center gap-3">
                                    <span className="text-4xl">📋</span>
                                    Thông Tin Liên Hệ
                                </h2>

                                <div className="space-y-6">
                                    {/* Address */}
                                    <div className="flex items-start gap-4 group p-4 rounded-2xl hover:bg-blue-50 transition-all">
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                                            📍
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-800 mb-2 text-lg">Địa chỉ</h3>
                                            <p className="text-slate-600 font-bold leading-relaxed">Xã Thượng Đức, TP. Đà Nẵng</p>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex items-start gap-4 group p-4 rounded-2xl hover:bg-green-50 transition-all">
                                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                                            📞
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-800 mb-2 text-lg">Điện thoại</h3>
                                            <a href="tel:0961178265" className="text-slate-600 font-bold text-lg hover:text-green-600 transition-colors">
                                                0961.178.265
                                            </a>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="flex items-start gap-4 group p-4 rounded-2xl hover:bg-purple-50 transition-all">
                                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                                            ✉️
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-800 mb-2 text-lg">Email</h3>
                                            <a href="mailto:vanvoxuan4@gmail.com" className="text-slate-600 font-bold hover:text-purple-600 transition-colors">
                                                vanvoxuan4@gmail.com
                                            </a>
                                        </div>
                                    </div>

                                    {/* Working Hours */}
                                    <div className="flex items-start gap-4 group p-4 rounded-2xl hover:bg-amber-50 transition-all">
                                        <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                                            🕐
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-800 mb-2 text-lg">Giờ làm việc</h3>
                                            <p className="text-slate-600 font-bold">Thứ 2 - Thứ 7: 8:00 - 20:00</p>
                                            <p className="text-slate-600 font-bold">Chủ nhật: 9:00 - 18:00</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media Card */}
                            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 shadow-2xl text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

                                <h2 className="text-3xl font-black mb-6 uppercase tracking-tight flex items-center gap-3 relative z-10">
                                    <span className="text-4xl">🌐</span>
                                    Kết Nối Với Chúng Tôi
                                </h2>

                                <div className="grid grid-cols-2 gap-4 relative z-10">
                                    {/* Gmail */}
                                    <a
                                        href="https://mail.google.com/mail/?view=cm&to=vanvoxuan4@gmail.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group bg-white/20 hover:bg-white backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 shadow-lg hover:shadow-2xl border border-white/30"
                                    >
                                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="#EA4335" />
                                                <path d="M22 6l-10 7L2 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                        </div>
                                        <span className="font-black text-sm uppercase tracking-wider group-hover:text-slate-900 transition-colors">Gmail</span>
                                    </a>

                                    {/* Zalo */}
                                    <a
                                        href="https://zalo.me/0961178265"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group bg-white/20 hover:bg-white backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 shadow-lg hover:shadow-2xl border border-white/30"
                                    >
                                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform overflow-hidden">
                                            <img
                                                src="/images/internet/OIP (3).webp"
                                                alt="Zalo"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <span className="font-black text-sm uppercase tracking-wider group-hover:text-slate-900 transition-colors">Zalo</span>
                                    </a>
                                </div>

                                <p className="mt-6 text-sm text-white/80 font-bold text-center relative z-10">
                                    Liên hệ ngay để được tư vấn miễn phí!
                                </p>
                            </div>
                        </div>

                        {/* Right Column - Contact Form (3 cols) */}
                        <div className="lg:col-span-3">
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/50 hover:shadow-blue-500/20 transition-all duration-500">
                                <h2 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tight flex items-center gap-3">
                                    <span className="text-4xl">💬</span>
                                    Gửi Tin Nhắn Cho Chúng Tôi
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-wide">
                                                Họ và tên <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all font-bold text-slate-700 placeholder:text-slate-400"
                                                placeholder="Nguyễn Văn A"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-wide">
                                                Số điện thoại <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all font-bold text-slate-700 placeholder:text-slate-400"
                                                placeholder="0123456789"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-wide">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all font-bold text-slate-700 placeholder:text-slate-400"
                                            placeholder="vanvoxuan4@gmail.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-wide">
                                            Nội dung tin nhắn <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            rows="6"
                                            required
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all font-bold text-slate-700 placeholder:text-slate-400 resize-none"
                                            placeholder="Nhập nội dung tin nhắn của bạn tại đây..."
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black rounded-2xl uppercase tracking-wider hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] flex items-center justify-center gap-3 text-lg ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        <span>{isSubmitting ? '⌛' : '📤'}</span>
                                        {isSubmitting ? 'Đang gửi tin nhắn...' : 'Gửi Tin Nhắn'}
                                    </button>
                                </form>

                                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100">
                                    <p className="text-sm text-slate-600 font-bold text-center">
                                        💡 <span className="text-blue-600">Lưu ý:</span> Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Why Choose Us Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 text-center hover:scale-105 transition-all">
                            <div className="text-6xl mb-4">⚡</div>
                            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase">Phản Hồi Nhanh</h3>
                            <p className="text-slate-600 font-bold">Hỗ trợ 24/7, phản hồi trong 1 giờ</p>
                        </div>

                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 text-center hover:scale-105 transition-all">
                            <div className="text-6xl mb-4">🎯</div>
                            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase">Tư Vấn Chuyên Nghiệp</h3>
                            <p className="text-slate-600 font-bold">Đội ngũ chuyên gia giàu kinh nghiệm</p>
                        </div>

                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 text-center hover:scale-105 transition-all">
                            <div className="text-6xl mb-4">💯</div>
                            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase">Cam Kết Chất Lượng</h3>
                            <p className="text-slate-600 font-bold">Sản phẩm chính hãng, bảo hành 5 năm</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Contact;
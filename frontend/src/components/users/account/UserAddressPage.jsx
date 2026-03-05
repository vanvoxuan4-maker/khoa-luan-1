import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddressManager from '../profile/AddressManager';

const UserAddressPage = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in-up">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black mb-2 uppercase tracking-tighter flex items-center gap-4">
                        <span className="w-2 h-8 bg-blue-600 rounded-sm"></span>
                        <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-transparent bg-clip-text">
                            Sổ địa chỉ của bạn
                        </span>
                    </h1>
                    <p className="text-gray-600 font-medium font-inter text-sm md:text-base">
                        Quản lý các địa chỉ giao hàng để đặt hàng nhanh chóng hơn.
                    </p>
                </div>

                <button
                    onClick={() => navigate('/profile')}
                    className="group flex items-center gap-2 px-6 py-2.5 bg-white text-blue-600 font-black rounded-xl border-2 border-blue-100 shadow-lg shadow-blue-100/50 hover:border-blue-300 hover:bg-blue-50/50 transition-all active:scale-95 uppercase text-xs tracking-wider shrink-0"
                >
                    <span className="text-xl transition-transform group-hover:-translate-x-1">←</span>
                    Hồ sơ cá nhân
                </button>
            </div>

            <div className="h-0.5 bg-slate-100 w-full mb-10"></div>

            {/* Main Content Card */}
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 p-8 md:p-12 border border-slate-100 relative overflow-hidden group">
                {/* Decorative background shape */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full opacity-50 transition-transform duration-1000 group-hover:scale-110"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-50 rounded-full opacity-50 transition-transform duration-1000 group-hover:scale-110"></div>

                <div className="relative">
                    <div className="flex items-center gap-4 mb-10 p-6 bg-blue-50/50 rounded-[2rem] border-l-4 border-l-blue-600 border border-blue-100 shadow-sm transition-all hover:bg-blue-50">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm transform group-hover:rotate-6 transition-transform">📍</div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800 tracking-tight mb-1">Danh sách địa chỉ</h3>
                            <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest opacity-80">Bạn có thể lưu tối đa 10 địa chỉ khác nhau</p>
                        </div>
                    </div>

                    <AddressManager />
                </div>
            </div>

            {/* Additional Info / Help */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl">
                    <h4 className="text-lg font-black mb-3 flex items-center gap-3">
                        <span className="text-2xl">💡</span> Mẹo nhỏ
                    </h4>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">
                        Hãy đặt một địa chỉ là <b>Mặc định</b> để hệ thống tự động chọn khi bạn thanh toán, giúp tiết kiệm thời gian quý báu của bạn.
                    </p>
                </div>
                <div className="bg-white rounded-[2.5rem] p-8 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center group hover:border-blue-400 transition-colors">
                    <p className="text-slate-500 font-bold mb-4">Cần hỗ trợ thay đổi thông tin?</p>
                    <button
                        onClick={() => navigate('/contact')}
                        className="px-8 py-3 bg-slate-100 text-slate-600 font-black rounded-xl hover:bg-blue-600 hover:text-white transition-all uppercase text-xs tracking-widest"
                    >
                        Liên hệ Hotline
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserAddressPage;

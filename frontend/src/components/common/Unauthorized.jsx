import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 font-sans relative overflow-hidden">
            {/* Background dynamic blobs (Matching Login.jsx) */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob"></div>

            {/* Glassmorphism Card */}
            <div className="relative w-full max-w-[440px] bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl p-10 text-center text-white z-10 transition-all hover:scale-[1.01] border-b-white/5">

                {/* Animated Icon Container */}
                <div className="relative mb-10">
                    <div className="w-28 h-28 bg-gradient-to-tr from-red-500/20 to-rose-500/20 rounded-full flex items-center justify-center mx-auto border border-white/10 shadow-2xl animate-pulse relative">
                        <div className="absolute inset-0 bg-red-500/10 rounded-full blur-xl animate-pulse"></div>
                        <span className="text-6xl drop-shadow-lg relative z-10">🚫</span>
                    </div>
                </div>

                {/* Text Content */}
                <h1 className="text-4xl font-black mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-300 via-white to-orange-300 drop-shadow-sm uppercase">
                    Truy Cập Bị Chặn
                </h1>

                <p className="text-blue-100/80 mb-10 leading-relaxed font-medium text-lg">
                    Rất tiếc, tài khoản của bạn <span className="text-red-400 font-black border-b-2 border-red-500/30">không có quyền</span> truy cập vào khu vực cấp cao này.
                </p>

                {/* Premium Action Button */}
                <button
                    onClick={() => navigate('/')}
                    className="w-full py-4.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-purple-900/40 transition-all transform hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-3 group border border-white/10"
                >
                    <span className="text-2xl group-hover:-translate-x-1 transition-transform">🏡</span>
                    Quay về Trang Chủ
                </button>

                {/* Branding Footer */}
                <div className="mt-10 pt-6 border-t border-white/5 opacity-50">
                    <p className="text-[10px] text-blue-200 font-black uppercase tracking-[0.3em] font-mono">
                        Bike Store Security System
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;

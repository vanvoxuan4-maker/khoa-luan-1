import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import AnimatedLogo from '../../common/AnimatedLogo';

const AuthContainer = ({ initialMode = 'login' }) => {
    const [mode, setMode] = useState(initialMode); // 'login', 'register', 'forgot'

    const toggleAuth = () => {
        if (mode === 'login') setMode('register');
        else if (mode === 'register') setMode('login');
        else setMode('login');
    };

    const switchToForgot = () => setMode('forgot');
    const backToLogin = () => setMode('login');

    const isOverlayRight = mode === 'login' || mode === 'forgot';

    return (
        <div className="fixed inset-0 bg-white font-sans selection:bg-cyan-500/20 overflow-hidden z-[9999]">
            {/* 1. Background Layer - Fixed soft blobs */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-100 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-[120px]" />
            </div>

            {/* 2. Form Layer - Positioned to never be fully covered */}
            <div className="relative w-full h-full flex z-10 will-change-transform">

                {/* Login Form Area */}
                <div
                    className={`absolute top-0 left-0 w-full lg:w-1/2 h-full flex flex-col justify-center transition-all duration-800 ease-[cubic-bezier(0.645,0.045,0.355,1)] px-6 sm:px-20 lg:px-32 ${mode === 'login' ? 'opacity-100 translate-x-0 z-[4]' : 'opacity-0 translate-x-[-10%] z-[1]'
                        }`}
                >
                    <div className="max-w-md w-full mx-auto">
                        <Login onSwitchToRegister={toggleAuth} onSwitchToForgot={switchToForgot} />
                    </div>
                </div>

                {/* Forgot Password Area */}
                <div
                    className={`absolute top-0 left-0 w-full lg:w-1/2 h-full flex flex-col justify-center transition-all duration-800 ease-[cubic-bezier(0.645,0.045,0.355,1)] px-6 sm:px-20 lg:px-32 ${mode === 'forgot' ? 'opacity-100 translate-x-0 z-[4]' : 'opacity-0 translate-x-[-10%] z-[1]'
                        }`}
                >
                    <div className="max-w-md w-full mx-auto">
                        <ForgotPassword onBackToLogin={backToLogin} />
                    </div>
                </div>

                {/* Register Form Area */}
                <div
                    className={`absolute top-0 right-0 w-full lg:w-1/2 h-full flex flex-col justify-center transition-all duration-800 ease-[cubic-bezier(0.645,0.045,0.355,1)] px-6 sm:px-20 lg:px-32 ${mode === 'register' ? 'opacity-100 translate-x-0 z-[4]' : 'opacity-0 translate-x-[10%] z-[1]'
                        }`}
                >
                    <div className="max-w-md w-full mx-auto">
                        <Register onBackToLogin={toggleAuth} />
                    </div>
                </div>

                {/* 3. The Sliding Curved Overlay - Master Layer (OPTIMIZED RESPONSE) */}
                <div
                    className={`hidden lg:block absolute top-0 w-1/2 h-full z-[20] transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform overflow-hidden ${isOverlayRight ? 'translate-x-full' : 'translate-x-0'
                        }`}
                    style={{ pointerEvents: 'none' }}
                >
                    {/* The Background Shape - Optimized Rendering */}
                    <div
                        className="absolute inset-0 bg-gradient-to-br from-[#00D2FF] to-[#3a7bd5] shadow-[0_0_100px_rgba(0,180,255,0.2)] transition-[clip-path] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-[clip-path]"
                        style={{
                            pointerEvents: 'auto',
                            clipPath: isOverlayRight
                                ? 'ellipse(160% 120% at 170% 50%)'
                                : 'ellipse(160% 120% at -70% 50%)'
                        }}
                    >
                        {/* Overlay Content */}
                        <div className="relative w-full h-full text-white flex items-center justify-center">

                            {/* Panel: Welcome Back (Inviting to Login/Forgot) - Visible on Register View */}
                            <div
                                className={`absolute inset-0 flex flex-col items-center justify-center p-16 text-center transition-all duration-700 ${mode === 'register' ? 'opacity-100 translate-x-0 z-[50]' : 'opacity-0 translate-x-32 z-0 pointer-events-none'
                                    }`}
                            >
                                <div className="mb-10 scale-[1.7] drop-shadow-2xl">
                                    <AnimatedLogo />
                                </div>
                                <h2 className="text-6xl font-black mb-10 uppercase tracking-tighter leading-none italic drop-shadow-lg">Welcome <br /> Back!</h2>
                                <p className="text-white/95 mb-14 font-medium text-lg leading-relaxed max-w-[300px]">Tiếp tục hành trình chinh phục những đỉnh cao mới cùng BikeStore.</p>
                                <button
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); toggleAuth(); }}
                                    className="px-20 py-5 rounded-full border-[3px] border-white text-white bg-transparent font-black text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-blue-600 active:scale-95 transition-all duration-300 cursor-pointer shadow-2xl"
                                >
                                    Đăng nhập ngay 🔐
                                </button>
                            </div>

                            {/* Panel: New Discovery (Inviting to Register) - Visible on Login View */}
                            <div
                                className={`absolute inset-0 flex flex-col items-center justify-center p-16 text-center transition-all duration-700 ${mode === 'login' ? 'opacity-100 translate-x-0 z-[50]' : 'opacity-0 translate-x-[-32] z-0 pointer-events-none'
                                    }`}
                            >
                                <div className="mb-10 scale-[1.7] drop-shadow-2xl">
                                    <AnimatedLogo />
                                </div>
                                <h2 className="text-6xl font-black mb-10 uppercase tracking-tighter leading-none italic drop-shadow-lg">New here ? <br /> Discover us</h2>
                                <p className="text-white/95 mb-14 font-medium text-lg leading-relaxed max-w-[300px]">Gia nhập cộng đồng đam mê tốc độ và nhận những ưu đãi đặc biệt ngay.</p>
                                <button
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); toggleAuth(); }}
                                    className="px-20 py-5 rounded-full border-[3px] border-white text-white bg-transparent font-black text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-blue-600 active:scale-95 transition-all duration-300 cursor-pointer shadow-2xl"
                                >
                                    Đăng ký ngay 🚀
                                </button>
                            </div>

                            {/* Panel: Forgot Password Help - Visible on Forgot View */}
                            <div
                                className={`absolute inset-0 flex flex-col items-center justify-center p-16 text-center transition-all duration-700 ${mode === 'forgot' ? 'opacity-100 translate-x-0 z-[50]' : 'opacity-0 translate-x-[-32] z-0 pointer-events-none'
                                    }`}
                            >
                                <div className="mb-10 scale-[1.7] drop-shadow-2xl">
                                    <AnimatedLogo />
                                </div>
                                <h2 className="text-6xl font-black mb-10 uppercase tracking-tighter leading-none italic drop-shadow-lg">Forgot <br /> Password?</h2>
                                <p className="text-white/95 mb-14 font-medium text-lg leading-relaxed max-w-[300px]">Đừng lo lắng, chúng tôi sẽ giúp bạn khôi phục quyền truy cập nhanh chóng.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="lg:hidden absolute bottom-10 left-1/2 -translate-x-1/2 z-[30] w-full px-8">
                    <button
                        type="button"
                        onClick={toggleAuth}
                        className="w-full py-5 bg-cyan-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl active:scale-90 transition-transform"
                    >
                        {mode === 'login' ? "Bạn mới ở đây? Đăng ký" : mode === 'forgot' ? "Quay lại đăng nhập" : "Đã có tài khoản? Đăng nhập"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthContainer;

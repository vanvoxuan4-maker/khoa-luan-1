import React from 'react';

const AnimatedLogo = ({ size = "normal" }) => {
    const isLarge = size === "large";
    const containerSize = isLarge ? 'w-20 h-20' : 'w-14 h-14';
    const iconSize = isLarge ? 'w-16 h-16' : 'w-12 h-12';

    return (
        <div className={`relative flex items-center justify-center ${containerSize} group`}>
            {/* Background Glow */}
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />

            {/* Main Logo Container with Home Page Gradient */}
            <div
                className={`relative z-10 w-full h-full rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden border-2 border-white/20 transition-transform duration-500 group-hover:scale-110`}
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 50%, #06b6d4 100%)' }}
            >
                <svg
                    viewBox="0 0 100 100"
                    className={iconSize}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="neon_grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FFFFFF" />
                            <stop offset="100%" stopColor="#22D3EE" />
                        </linearGradient>
                    </defs>

                    {/* Wheel 1 - Spinning */}
                    <g className="animate-spin-slow origin-center" style={{ transformBox: 'fill-box' }}>
                        <circle cx="30" cy="65" r="16" stroke="url(#neon_grad)" strokeWidth="3" strokeDasharray="8 4" />
                        <circle cx="30" cy="65" r="5" fill="#FFFFFF" />
                    </g>

                    {/* Wheel 2 - Counter Spinning */}
                    <g className="animate-spin-reverse-slow origin-center" style={{ transformBox: 'fill-box' }}>
                        <circle cx="75" cy="65" r="16" stroke="url(#neon_grad)" strokeWidth="3" strokeDasharray="8 4" />
                        <circle cx="75" cy="65" r="4" fill="#22D3EE" />
                    </g>

                    {/* Frame - High Quality Glow Path */}
                    <path
                        d="M30 65 L 42 35 L 75 65 M 42 35 L 65 35 M 58 65 L 42 35"
                        stroke="#FFFFFF"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    />
                </svg>

                {/* Scanline / Shine Effect */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            </div>

            <style jsx="true">{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse-slow {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        .animate-spin-reverse-slow {
          animation: spin-reverse-slow 4s linear infinite;
        }
      `}</style>
        </div>
    );
};

export default AnimatedLogo;

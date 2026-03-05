import React from 'react';

export const ProductCardSkeleton = () => (
    <div className="min-w-[260px] md:min-w-[280px] bg-white rounded-2xl border border-slate-100 p-6 snap-start h-[420px] animate-pulse">
        <div className="aspect-square mb-6 bg-gray-200 rounded-2xl"></div>
        <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-6 bg-gray-300 rounded w-2/3 mx-auto mt-4"></div>
        </div>
    </div>
);

export const BannerSkeleton = () => (
    <div className="w-full h-[400px] md:h-[550px] lg:h-[650px] bg-gray-300 animate-pulse">
        <div className="h-full flex items-center px-10 md:px-24">
            <div className="space-y-6 w-full md:w-1/2">
                <div className="h-16 bg-gray-400 rounded w-3/4"></div>
                <div className="h-8 bg-gray-400 rounded w-1/2"></div>
                <div className="h-14 bg-gray-500 rounded-full w-1/3 mt-8"></div>
            </div>
        </div>
    </div>
);

export const CategorySkeleton = () => (
    <div className="flex gap-6 overflow-hidden animate-pulse px-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="flex flex-col items-center gap-4 min-w-[150px]">
                <div className="w-24 h-24 rounded-full bg-gray-200"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
        ))}
    </div>
);

export const ErrorState = ({ message, onRetry }) => (
    <div className="text-center py-20 px-4">
        <div className="text-6xl mb-4">😞</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Có lỗi xảy ra
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{message || 'Không thể tải dữ liệu. Vui lòng thử lại sau!'}</p>
        <button
            onClick={onRetry}
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
        >
            🔄 Thử lại
        </button>
    </div>
);

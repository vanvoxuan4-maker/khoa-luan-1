import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const OrderSuccess = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('order_id');

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
            </div>

            <h1 className="text-3xl font-black text-slate-900 mb-2">Đặt hàng thành công!</h1>
            <p className="text-gray-500 mb-2 max-w-md">
                Cảm ơn bạn đã mua sắm tại BikeStore. Mã đơn hàng của bạn là <span className="font-bold text-slate-800">#{orderId}</span>.
            </p>
            <p className="text-blue-600 font-medium mb-8 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                🚚 Thời gian giao hàng dự kiến: {new Date(new Date().setDate(new Date().getDate() + 3)).toLocaleDateString('vi-VN')}
            </p>

            <div className="flex gap-4">
                <Link to="/products" className="px-6 py-3 bg-gray-200 text-gray-800 rounded-full font-bold hover:bg-gray-300 transition">
                    Tiếp tục mua sắm
                </Link>
                <Link to="/my-orders" className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition">
                    Xem lịch sử đơn hàng
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccess;

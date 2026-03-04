import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const VNPayPayment = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [paymentResult, setPaymentResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Kiểm tra xem có phải callback từ VNPAY không
        const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');

        if (vnp_ResponseCode) {
            handlePaymentReturn();
        } else {
            setLoading(false);
        }
    }, [searchParams]);

    const handlePaymentReturn = async () => {
        try {
            // Xử lý VNPay
            const params = {};
            for (let [key, value] of searchParams.entries()) {
                params[key] = value;
            }
            const response = await axios.get('http://localhost:8000/vnpay/payment-return', {
                params: params
            });
            setPaymentResult(response.data);

            setLoading(false);
            setTimeout(() => navigate('/my-orders'), 5000);
        } catch (error) {
            console.error('Lỗi xử lý kết quả thanh toán:', error);
            setPaymentResult({
                success: false,
                message: 'Có lỗi xảy ra khi xử lý thanh toán'
            });
            setLoading(false);
        }
    };

    const createPayment = async (orderId) => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:8000/vnpay/create-payment', {
                ma_don_hang: orderId
            });

            // Redirect đến trang thanh toán VNPAY
            window.location.href = response.data.payment_url;
        } catch (error) {
            console.error('Lỗi tạo thanh toán:', error);
            alert('Không thể tạo thanh toán. Vui lòng thử lại.');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Đang xử lý thanh toán...</p>
                </div>
            </div>
        );
    }

    if (paymentResult) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                    {paymentResult.success ? (
                        <>
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">
                                Thanh toán thành công!
                            </h2>
                            <p className="text-center text-slate-600 mb-6">
                                {paymentResult.message}
                            </p>
                            <div className="bg-slate-50 rounded-lg p-4 mb-6 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Mã đơn hàng:</span>
                                    <span className="font-bold text-slate-900">#{paymentResult.order_id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Số tiền:</span>
                                    <span className="font-bold text-green-600">
                                        {paymentResult.amount?.toLocaleString('vi-VN')} VND
                                    </span>
                                </div>
                                {paymentResult.transaction_no && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Mã giao dịch:</span>
                                        <span className="font-mono text-sm text-slate-900">{paymentResult.transaction_no}</span>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">
                                Thanh toán thất bại
                            </h2>
                            <p className="text-center text-slate-600 mb-6">
                                {paymentResult.message || 'Giao dịch không thành công. Vui lòng thử lại.'}
                            </p>
                        </>
                    )}

                    <button
                        onClick={() => navigate('/my-orders')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                        Xem đơn hàng
                    </button>
                    <p className="text-center text-sm text-slate-500 mt-4">
                        Tự động chuyển trang sau 3 giây...
                    </p>
                </div>
            </div>
        );
    }

    return null;
};

export default VNPayPayment;

// Export các hàm initiate để sử dụng ở component khác
export const initiateVNPayPayment = async (orderId) => {
    try {
        const response = await axios.post('http://localhost:8000/vnpay/create-payment', {
            ma_don_hang: orderId
        });
        window.location.href = response.data.payment_url;
    } catch (error) {
        console.error('Lỗi tạo thanh toán VNPay:', error);
        throw error;
    }
};


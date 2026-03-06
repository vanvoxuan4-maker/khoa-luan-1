/**
 * statusHelpers.js — Tiện ích dùng chung cho trạng thái đơn hàng và thanh toán
 * Thay thế logic mapping bị lặp lại ở nhiều Admin component.
 */

// Cấu hình hiển thị trạng thái đơn hàng
export const ORDER_STATUS_CONFIG = {
    pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', dot: 'bg-yellow-400', icon: '⏳' },
    confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800 border-blue-200', dot: 'bg-blue-400', icon: '✅' },
    shipping: { label: 'Đang giao', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', dot: 'bg-indigo-400', icon: '🚚' },
    delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-800 border-green-200', dot: 'bg-green-400', icon: '📦' },
    cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800 border-red-200', dot: 'bg-red-400', icon: '❌' },
    returned: { label: 'Trả hàng', color: 'bg-orange-100 text-orange-800 border-orange-200', dot: 'bg-orange-400', icon: '↩️' },
    failed: { label: 'Thất bại', color: 'bg-gray-100 text-gray-600 border-gray-200', dot: 'bg-gray-400', icon: '⚠️' },
};

// Cấu hình trạng thái thanh toán
export const PAYMENT_STATUS_CONFIG = {
    pending: { label: 'Chưa thanh toán', color: 'bg-yellow-100 text-yellow-700' },
    paid: { label: 'Đã thanh toán', color: 'bg-green-100 text-green-700' },
    failed: { label: 'Thất bại', color: 'bg-red-100 text-red-700' },
    refunded: { label: 'Đã hoàn tiền', color: 'bg-purple-100 text-purple-700' },
};

// Cấu hình phương thức thanh toán
export const PAYMENT_METHOD_CONFIG = {
    cod: { label: 'Tiền mặt (COD)', icon: '💵' },
    vnpay: { label: 'VNPay', icon: '🏦' },
};

// Cấu hình trạng thái tài khoản người dùng
export const USER_STATUS_CONFIG = {
    active: { label: 'Hoạt động', color: 'bg-green-100 text-green-700', icon: '✅' },
    banned: { label: 'Bị khóa', color: 'bg-red-100 text-red-700', icon: '🚫' },
    inactive: { label: 'Không HĐ', color: 'bg-gray-100 text-gray-600', icon: '⏳' },
};

/**
 * Lấy cấu hình hiển thị cho trạng thái đơn hàng
 * @param {string} status
 */
export const getOrderStatusConfig = (status) => {
    const key = (status || '').toLowerCase();
    return ORDER_STATUS_CONFIG[key] || { label: status, color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400', icon: '❓' };
};

/**
 * Lấy cấu hình hiển thị cho trạng thái thanh toán
 * @param {string} status
 */
export const getPaymentStatusConfig = (status) => {
    const key = (status || '').toLowerCase();
    return PAYMENT_STATUS_CONFIG[key] || { label: status, color: 'bg-gray-100 text-gray-600' };
};

/**
 * Lấy cấu hình hiển thị cho phương thức thanh toán
 * @param {string} method
 */
export const getPaymentMethodConfig = (method) => {
    const key = (method || '').toLowerCase();
    return PAYMENT_METHOD_CONFIG[key] || { label: method, icon: '💳' };
};

/**
 * Lấy cấu hình hiển thị cho trạng thái tài khoản
 * @param {string} status
 */
export const getUserStatusConfig = (status) => {
    const key = (status || '').toLowerCase();
    return USER_STATUS_CONFIG[key] || { label: status, color: 'bg-gray-100 text-gray-600', icon: '❓' };
};

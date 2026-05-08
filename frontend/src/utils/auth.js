// Auth Utility - Quản lý xác thực thông minh (Thanh lọc và đồng bộ)
import { useState, useEffect } from 'react';

/**
 * Phát hiện xem route hiện tại có phải là admin không
 */
const isAdminContext = () => window.location.pathname.startsWith('/admin');

/**
 * Admin dùng sessionStorage để cô lập session theo từng tab (tránh lỗi cross-tab).
 * User dùng localStorage để persist khi reload.
 */
const adminStorage = sessionStorage;
const userStorage  = localStorage;

/**
 * Tìm token tốt nhất có sẵn.
 * Ưu tiên token của context hiện tại, nếu không có thì lấy token của context kia.
 */
export const getBestToken = () => {
    const userToken  = userStorage.getItem('user_access_token');
    const adminToken = adminStorage.getItem('admin_access_token');
    if (isAdminContext()) return adminToken || userToken;
    return userToken || adminToken;
};

/**
 * Tìm thông tin người dùng tốt nhất.
 */
export const getBestUserInfo = () => {
    const userInfo  = userStorage.getItem('user_info');
    const adminInfo = adminStorage.getItem('admin_info');
    if (isAdminContext()) return adminInfo ? JSON.parse(adminInfo) : (userInfo ? JSON.parse(userInfo) : null);
    return userInfo ? JSON.parse(userInfo) : (adminInfo ? JSON.parse(adminInfo) : null);
};

/**
 * Lấy token cho ngữ cảnh hiện tại (Dùng cho các request cụ thể)
 */
export const getToken = () => {
    return isAdminContext()
        ? adminStorage.getItem('admin_access_token')
        : userStorage.getItem('user_access_token');
};

/**
 * Lưu token cho ngữ cảnh hiện tại
 */
export const setToken = (token) => {
    if (isAdminContext()) {
        adminStorage.setItem('admin_access_token', token);
    } else {
        userStorage.setItem('user_access_token', token);
    }
};

/**
 * Lấy thông tin user cho ngữ cảnh hiện tại
 */
export const getUserInfo = () => {
    const key  = isAdminContext() ? 'admin_info' : 'user_info';
    const store = isAdminContext() ? adminStorage : userStorage;
    const data = store.getItem(key);
    return data ? JSON.parse(data) : null;
};

/**
 * Lưu thông tin user cho ngữ cảnh hiện tại
 */
export const setUserInfo = (userInfo) => {
    if (isAdminContext()) {
        adminStorage.setItem('admin_info', JSON.stringify(userInfo));
    } else {
        userStorage.setItem('user_info', JSON.stringify(userInfo));
    }
};

/**
 * Xóa session cho ngữ cảnh hiện tại
 */
export const logout = () => {
    if (isAdminContext()) {
        adminStorage.removeItem('admin_access_token');
        adminStorage.removeItem('admin_info');
    } else {
        userStorage.removeItem('user_access_token');
        userStorage.removeItem('user_info');
    }
};

/**
 * Xóa sạch tất cả các loại session
 */
export const clearAllSessions = () => {
    const userKeys = ['user_access_token', 'user_info', 'user_user_info', 'access_token', 'user'];
    userKeys.forEach(k => userStorage.removeItem(k));

    const adminKeys = ['admin_access_token', 'admin_info', 'admin_user_info'];
    adminKeys.forEach(k => adminStorage.removeItem(k));
};

/**
 * Kiểm tra xem user có phải admin không
 */
export const isAdmin = (user) => {
    if (!user) return false;
    const role = user.quyen || user.role;
    return String(role).toLowerCase() === 'admin' || user.is_superuser === true;
};

/**
 * Kiểm tra tài khoản có đang ở trạng thái inactive không.
 */
export const isInactiveUser = () => {
    const info = getBestUserInfo();
    return info?.status === 'inactive';
};

/**
 * React Hook phiên bản reactive của isInactiveUser.
 */
export const useIsInactive = () => {
    const [isInactive, setIsInactive] = useState(() => isInactiveUser());

    useEffect(() => {
        const handleStatusChange = (e) => {
            setIsInactive(e.detail?.status === 'inactive');
        };

        window.addEventListener('userstatuschange', handleStatusChange);
        return () => window.removeEventListener('userstatuschange', handleStatusChange);
    }, []);

    return isInactive;
};

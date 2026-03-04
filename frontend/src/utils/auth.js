// Auth Utility - Quản lý xác thực theo ngữ cảnh (Admin vs User)

/**
 * Phát hiện xem route hiện tại có phải là admin không
 */
const isAdminContext = () => {
    return window.location.pathname.startsWith('/admin');
};

/**
 * Lấy token cho ngữ cảnh hiện tại
 */
export const getToken = () => {
    return isAdminContext()
        ? localStorage.getItem('admin_access_token')
        : localStorage.getItem('user_access_token');
};

/**
 * Lưu token cho ngữ cảnh hiện tại
 */
export const setToken = (token) => {
    if (isAdminContext()) {
        localStorage.setItem('admin_access_token', token);
    } else {
        localStorage.setItem('user_access_token', token);
    }
};

/**
 * Lấy thông tin user cho ngữ cảnh hiện tại
 */
export const getUserInfo = () => {
    const key = isAdminContext() ? 'admin_info' : 'user_info';
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};

/**
 * Lưu thông tin user cho ngữ cảnh hiện tại
 */
export const setUserInfo = (userInfo) => {
    if (isAdminContext()) {
        localStorage.setItem('admin_info', JSON.stringify(userInfo));
    } else {
        localStorage.setItem('user_info', JSON.stringify(userInfo));
    }
};

/**
 * Xóa token và user info cho ngữ cảnh hiện tại (Logout)
 */
export const logout = () => {
    if (isAdminContext()) {
        localStorage.removeItem('admin_access_token');
        localStorage.removeItem('admin_info');
    } else {
        localStorage.removeItem('user_access_token');
        localStorage.removeItem('user_info');
    }
};

/**
 * Xóa tất cả token (dùng khi cần reset hoàn toàn)
 */
export const clearAllAuth = () => {
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_info');
    localStorage.removeItem('user_access_token');
    localStorage.removeItem('user_info');

    // Cleanup legacy keys
    localStorage.removeItem('admin_user_info');
    localStorage.removeItem('user_user_info');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
};

/**
 * Kiểm tra xem user có phải admin không
 */
export const isAdmin = (user) => {
    if (!user) return false;
    const role = user.quyen || user.role;
    return String(role).toLowerCase() === 'admin' || user.is_superuser === true;
};

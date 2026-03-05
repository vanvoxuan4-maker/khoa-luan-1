// Auth Utility - Quản lý xác thực thông minh (Thanh lọc và đồng bộ)

/**
 * Phát hiện xem route hiện tại có phải là admin không
 */
const isAdminContext = () => window.location.pathname.startsWith('/admin');

/**
 * [MỚI] Tìm token tốt nhất có sẵn. 
 * Ưu tiên token của context hiện tại, nếu không có thì lấy token của context kia.
 */
export const getBestToken = () => {
    const userToken = localStorage.getItem('user_access_token');
    const adminToken = localStorage.getItem('admin_access_token');

    // Nếu đang ở /admin, ưu tiên admin token
    if (isAdminContext()) return adminToken || userToken;

    // Nếu ở shop, ưu tiên user token, nếu không có thì lấy admin token làm dự phòng
    return userToken || adminToken;
};

/**
 * [MỚI] Tìm thông tin người dùng tốt nhất.
 */
export const getBestUserInfo = () => {
    const userInfo = localStorage.getItem('user_info');
    const adminInfo = localStorage.getItem('admin_info');

    // Ưu tiên theo context
    if (isAdminContext()) return adminInfo ? JSON.parse(adminInfo) : (userInfo ? JSON.parse(userInfo) : null);
    return userInfo ? JSON.parse(userInfo) : (adminInfo ? JSON.parse(adminInfo) : null);
};

/**
 * Lấy token cho ngữ cảnh hiện tại (Dùng cho các request cụ thể)
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
    const key = isAdminContext() ? 'admin_access_token' : 'user_access_token';
    localStorage.setItem(key, token);
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
    const key = isAdminContext() ? 'admin_info' : 'user_info';
    localStorage.setItem(key, JSON.stringify(userInfo));
};

/**
 * Xóa session cho ngữ cảnh hiện tại
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
 * [MỚI] Xóa sạch tất cả các loại session
 */
export const clearAllSessions = () => {
    const keys = [
        'admin_access_token', 'admin_info', 'admin_user_info',
        'user_access_token', 'user_info', 'user_user_info',
        'access_token', 'user'
    ];
    keys.forEach(k => localStorage.removeItem(k));
};

/**
 * Kiểm tra xem user có phải admin không
 */
export const isAdmin = (user) => {
    if (!user) return false;
    const role = user.quyen || user.role;
    return String(role).toLowerCase() === 'admin' || user.is_superuser === true;
};

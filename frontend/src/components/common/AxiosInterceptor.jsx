import { useEffect, useRef } from 'react';
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';

const AxiosInterceptor = () => {
    const { showAlert } = useNotification();
    const isAlerting = useRef(false);

    useEffect(() => {
        // Gắn interceptor ngay lập tức khi component mount
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                // Kiểm tra mã lỗi 401 hoặc 403
                const status = error.response ? error.response.status : null;
                const isLoginRequest = error.config?.url?.includes('/login');

                // Chỉ xử lý nếu không phải là request đăng nhập (để Login.jsx tự xử lý riêng)
                if ((status === 401 || status === 403) && !isAlerting.current && !isLoginRequest) {
                    isAlerting.current = true;

                    const message = status === 401
                        ? "Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại để tiếp tục."
                        : (error.response?.data?.detail || "Tài khoản của bạn đã bị khóa hoặc không có quyền truy cập.");

                    const title = status === 401 ? "Hết hạn truy cập" : "Truy cập bị chặn";

                    // Hiển thị thông báo cho người dùng
                    await showAlert(message, title, "error");

                    // Xác định cần xóa session nào dựa trên URL hoặc context
                    const isAdminRequest = error.config?.url?.includes('/admin') || window.location.pathname.startsWith('/admin');

                    const tokenKey = isAdminRequest ? 'admin_access_token' : 'user_access_token';

                    // Nếu token đã bị xóa bởi một request khác trước đó, không làm gì thêm
                    if (!localStorage.getItem(tokenKey) && isAlerting.current) {
                        // Vẫn giữ isAlerting = true để chặn các request đang bay tới sau đó
                        return Promise.reject(error);
                    }

                    const keysToRemove = isAdminRequest
                        ? ['admin_access_token', 'admin_info', 'admin_user_info']
                        : ['user_access_token', 'user_info', 'user_user_info'];

                    keysToRemove.forEach(key => localStorage.removeItem(key));

                    // KHÔNG reset isAlerting.current = false ở đây 
                    // Vì chúng ta chuẩn bị chuyển trang, giữ true để chặn mọi request lỗi khác 
                    // phát sinh trong quá trình chuyển hướng.

                    // Chuyển hướng về trang login đúng theo loại session
                    window.location.href = isAdminRequest ? '/admin/login' : '/login';
                }

                return Promise.reject(error);
            }
        );

        // Cleanup: Gỡ bỏ interceptor khi component unmount
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [showAlert]);

    return null; // Component này chỉ chạy logic ngầm
};

export default AxiosInterceptor;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../utils/apiConfig';
import { useNavigate } from 'react-router-dom';

const AdminAudit = () => {
    const navigate = useNavigate();
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isInitialLoading, setIsInitialLoading] = useState(true); // Track first-time load
    const [filters, setFilters] = useState({
        action_filter: '',
        resource_filter: '',
        date_from: '',
        date_to: '',
        search: ''
    });
    const [pagination, setPagination] = useState({
        skip: 0,
        limit: 8
    });
    const [selectedLog, setSelectedLog] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Debounced filters state to prevent too many API calls
    const [debouncedFilters, setDebouncedFilters] = useState(filters);

    const getToken = () => localStorage.getItem('admin_access_token');

    // Sync filters to debouncedFilters with delay (increased to 800ms for date typing)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedFilters(filters);
        }, 800);
        return () => clearTimeout(timer);
    }, [filters]);

    const deleteLog = async (e, logId) => {
        e.stopPropagation(); // Không mở modal khi click xóa
        if (!window.confirm('Bạn có chắc muốn xóa bản ghi này không?')) return;
        try {
            await axios.delete(`${API_BASE_URL}/audit/logs/${logId}`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            fetchAuditLogs();
        } catch (err) {
            console.error('Lỗi xóa log:', err);
            alert('Xóa thất bại!');
        }
    };

    const clearAllLogs = async () => {
        if (!window.confirm('Xóa TẤT CẢ lịch sử hoạt động của bạn? Hành động này không thể hoàn tác!')) return;
        setDeleting(true);
        try {
            const res = await axios.delete(`${API_BASE_URL}/audit/logs/clear`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            alert(res.data.message);
            fetchAuditLogs();
        } catch (err) {
            console.error('Lỗi xóa tất cả log:', err);
            alert('Xóa thất bại!');
        } finally {
            setDeleting(false);
        }
    };

    useEffect(() => {
        fetchAuditLogs();
    }, [pagination, debouncedFilters]);

    const fetchAuditLogs = async () => {
        const token = localStorage.getItem('admin_access_token');
        setLoading(true);
        try {
            const params = new URLSearchParams({
                skip: pagination.skip.toString(),
                limit: pagination.limit.toString(),
                ...(debouncedFilters.action_filter && { action_filter: debouncedFilters.action_filter }),
                ...(debouncedFilters.resource_filter && { resource_filter: debouncedFilters.resource_filter }),
                ...(debouncedFilters.date_from && { date_from: debouncedFilters.date_from }),
                ...(debouncedFilters.date_to && { date_to: debouncedFilters.date_to }),
                ...(debouncedFilters.search && { search: debouncedFilters.search })
            });

            const res = await axios.get(`${API_BASE_URL}/audit/my-logs?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAuditLogs(res.data);
        } catch (err) {
            console.error('Lỗi tải audit log:', err);
        } finally {
            setLoading(false);
            setIsInitialLoading(false); // First fetch complete
        }
    };

    const getActionIcon = (action) => {
        const icons = {
            'login': '🔐',
            'logout': '🚪',
            'create': '➕',
            'update': '✏️',
            'delete': '🗑️',
            'view': '👁️'
        };
        return icons[action?.toLowerCase()] || '📝';
    };

    const getActionColor = (action) => {
        const colors = {
            'login': 'text-green-600 bg-green-50',
            'logout': 'text-red-600 bg-gray-50',
            'create': 'text-blue-600 bg-blue-50',
            'update': 'text-yellow-600 bg-yellow-50',
            'delete': 'text-red-600 bg-red-50',
            'view': 'text-indigo-600 bg-indigo-50'
        };
        return colors[action?.toLowerCase()] || 'text-gray-600 bg-gray-50';
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, skip: 0 })); // Reset to first page
    };

    const handlePageChange = (direction) => {
        setPagination(prev => ({
            ...prev,
            skip: direction === 'next' ? prev.skip + prev.limit : Math.max(0, prev.skip - prev.limit)
        }));
    };

    const openDetailModal = (log) => {
        setSelectedLog(log);
        setShowDetailModal(true);
    };

    // ✅ Safe timestamp parser: xử lý cả "2026-04-01T10:00:00" lẫn "2026-04-01T10:00:00+07:00"
    const parseTimestamp = (ts) => {
        if (!ts) return new Date(NaN);
        // Chuẩn hóa: thay space bằng T (format SQL)
        const normalized = String(ts).replace(' ', 'T');
        // Chỉ thêm Z nếu chưa có timezone info
        if (normalized.includes('+') || normalized.endsWith('Z')) {
            return new Date(normalized);
        }
        return new Date(normalized + 'Z');
    };

    // Use isInitialLoading for full-page spinner to avoid unmounting filters while typing
    if (isInitialLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-full mx-auto p-6">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">📋 Lịch Hoạt Động</h1>
                    <p className="text-gray-600 font-medium">Theo dõi các hành động của bạn trong hệ thống</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2 px-6 py-2.5 bg-white text-blue-600 font-black rounded-xl border-2 border-blue-100 shadow-lg shadow-blue-100/50 hover:border-blue-300 hover:bg-blue-50/50 hover:text-red-600 transition-all active:scale-95 uppercase text-xs tracking-wider"
                    >
                        <span className="text-xl transition-transform group-hover:-translate-x-1">←</span>
                        Quay lại
                    </button>
                    <button
                        onClick={clearAllLogs}
                        disabled={deleting || auditLogs.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-bold rounded-xl transition shadow h-[42px]"
                    >
                        🗑️ {deleting ? 'Đang xóa...' : 'Xóa tất cả'}
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">🔍 Bộ lọc & Tìm kiếm</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Từ khóa</label>
                        <input
                            type="text"
                            placeholder="Tìm trong mô tả..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Hành động</label>
                        <select
                            value={filters.action_filter}
                            onChange={(e) => handleFilterChange('action_filter', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Tất cả</option>
                            <option value="login">Đăng nhập</option>
                            <option value="logout">Đăng xuất</option>
                            <option value="create">Tạo mới</option>
                            <option value="update">Cập nhật</option>
                            <option value="delete">Xóa</option>
                            <option value="view">Xem</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Loại tài nguyên</label>
                        <select
                            value={filters.resource_filter}
                            onChange={(e) => handleFilterChange('resource_filter', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Tất cả</option>
                            <option value="product">Sản phẩm</option>
                            <option value="order">Đơn hàng</option>
                            <option value="user">Người dùng</option>
                            <option value="category">Danh mục</option>
                            <option value="brand">Thương hiệu</option>
                            <option value="voucher">Voucher</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Từ ngày</label>
                        <input
                            type="date"
                            value={filters.date_from}
                            onChange={(e) => handleFilterChange('date_from', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Đến ngày</label>
                        <input
                            type="date"
                            value={filters.date_to}
                            onChange={(e) => handleFilterChange('date_to', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <button
                    onClick={() => {
                        setFilters({ action_filter: '', resource_filter: '', date_from: '', date_to: '', search: '' });
                        setPagination({ skip: 0, limit: 8 });
                    }}
                    className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                >
                    🔄 Đặt lại bộ lọc
                </button>
            </div>

            {/* Logs List Table */}
            <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.07)] overflow-hidden border border-slate-100 mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[1000px]">
                        <thead>
                            <tr className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[13px] font-semibold uppercase tracking-wide">
                                <th className="py-4 px-4 text-center rounded-tl-xl w-44">Thời gian</th>
                                <th className="py-4 px-4 text-center w-32">Hành động</th>
                                <th className="py-4 px-4 text-center w-36">Tài nguyên</th>
                                <th className="py-4 px-4 text-left">Mô tả hoạt động</th>
                                <th className="py-4 px-4 text-center w-32">IP Address</th>
                                <th className="py-4 px-4 text-center rounded-tr-xl w-32">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {auditLogs.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest opacity-50">
                                        Chưa có hoạt động nào
                                    </td>
                                </tr>
                            ) : (
                                auditLogs.map((log) => (
                                    <tr
                                        key={log.ma_log}
                                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors group"
                                    >
                                        <td className="py-4 px-4 text-center align-middle whitespace-nowrap">
                                            <div className="text-[13px] font-bold text-slate-600">
                                                {parseTimestamp(log.timestamp).toLocaleDateString('vi-VN')}
                                            </div>
                                            <div className="text-[11px] font-medium text-slate-400">
                                                {parseTimestamp(log.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-center align-middle">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border shadow-sm inline-block ${getActionColor(log.action)}`}>
                                                {getActionIcon(log.action)} {log.action}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center align-middle">
                                            {log.resource_type && (
                                                <div className="flex flex-col items-center">
                                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-600 border border-purple-100 uppercase">
                                                        {log.resource_type}
                                                    </span>
                                                    {log.resource_id && (
                                                        <span className="text-[9px] font-mono text-slate-400 mt-1">ID: {log.resource_id}</span>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 align-middle text-left">
                                            <p className="text-[13px] font-semibold text-slate-700 leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                {log.description}
                                            </p>
                                        </td>
                                        <td className="py-4 px-4 text-center align-middle font-mono text-[11px] text-slate-400">
                                            {log.ip_address || "---"}
                                        </td>
                                        <td className="py-4 px-4 text-center align-middle">
                                            <div className="flex justify-center items-center gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); openDetailModal(log); }}
                                                    className="w-8 h-8 rounded-lg bg-white border border-slate-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center font-bold text-sm"
                                                    title="Chi tiết"
                                                >
                                                    👁️
                                                </button>
                                                <button
                                                    onClick={(e) => deleteLog(e, log.ma_log)}
                                                    className="w-8 h-8 rounded-lg bg-white border border-slate-100 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center font-bold text-sm"
                                                    title="Xóa"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Inside container) */}
                <div className="flex justify-between items-center bg-slate-50/50 border-t border-slate-100 p-4">
                    <button
                        onClick={() => handlePageChange('prev')}
                        disabled={pagination.skip === 0}
                        className={`group flex items-center gap-2 px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all border ${pagination.skip === 0
                            ? 'bg-white text-slate-300 border-slate-100 cursor-not-allowed'
                            : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 shadow-sm'
                            }`}
                    >
                        <span className="text-sm">←</span> Trước
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                            {auditLogs.length === 0
                                ? 'Không có kết quả'
                                : `${pagination.skip + 1} - ${pagination.skip + auditLogs.length}`
                            }
                        </span>
                    </div>

                    <button
                        onClick={() => handlePageChange('next')}
                        disabled={auditLogs.length < pagination.limit}
                        className={`group flex items-center gap-2 px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all border ${auditLogs.length < pagination.limit
                            ? 'bg-white text-slate-300 border-slate-100 cursor-not-allowed'
                            : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 shadow-sm'
                            }`}
                    >
                        Sau <span className="text-sm">→</span>
                    </button>
                </div>
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedLog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-start">
                                <h2 className="text-2xl font-black text-gray-900">Chi tiết hoạt động</h2>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-sm font-bold text-gray-500 uppercase">Hành động</label>
                                <div className={`mt-1 inline-block px-4 py-2 rounded-lg ${getActionColor(selectedLog.action)}`}>
                                    {getActionIcon(selectedLog.action)} {selectedLog.action}
                                </div>
                            </div>

                            {selectedLog.resource_type && (
                                <div>
                                    <label className="text-sm font-bold text-gray-500 uppercase">Loại tài nguyên</label>
                                    <p className="mt-1 text-lg font-semibold text-gray-800">{selectedLog.resource_type}</p>
                                </div>
                            )}

                            {selectedLog.resource_id && (
                                <div>
                                    <label className="text-sm font-bold text-gray-500 uppercase">ID tài nguyên</label>
                                    <p className="mt-1 text-lg font-semibold text-gray-800">{selectedLog.resource_id}</p>
                                </div>
                            )}

                            <div>
                                <label className="text-sm font-bold text-gray-500 uppercase">Mô tả</label>
                                <p className="mt-1 text-base text-gray-800">{selectedLog.description}</p>
                            </div>

                            <div>
                                <label className="text-sm font-bold text-gray-500 uppercase">Thời gian</label>
                                <p className="mt-1 text-base text-gray-800">
                                    {parseTimestamp(selectedLog.timestamp).toLocaleString('vi-VN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    })}
                                </p>
                            </div>

                            {selectedLog.ip_address && (
                                <div>
                                    <label className="text-sm font-bold text-gray-500 uppercase">Địa chỉ IP</label>
                                    <p className="mt-1 text-base text-gray-800 font-mono">{selectedLog.ip_address}</p>
                                </div>
                            )}

                            {selectedLog.user_agent && (
                                <div>
                                    <label className="text-sm font-bold text-gray-500 uppercase">User Agent</label>
                                    <p className="mt-1 text-sm text-gray-600 font-mono break-all">{selectedLog.user_agent}</p>
                                </div>
                            )}

                            {selectedLog.details && (
                                <div>
                                    <label className="text-sm font-bold text-gray-500 uppercase">Chi tiết bổ sung</label>
                                    <pre className="mt-1 p-4 bg-gray-100 rounded-lg text-sm overflow-x-auto">
                                        {JSON.stringify(selectedLog.details, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAudit;

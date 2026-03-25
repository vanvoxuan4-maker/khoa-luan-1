import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../../utils/apiConfig';

// Status dictionary
const TRANG_THAI_USER = {
  active: { label: "ACTIVE", style: { backgroundColor: '#E6F7EE', color: '#1F9254' }, icon: "✅" },
  banned: { label: "BANNED", style: { backgroundColor: '#FDECEC', color: '#D32F2F' }, icon: "🚫" },
  inactive: { label: "INACTIVE", style: { backgroundColor: '#FFF4E5', color: '#B76E00' }, icon: "⏳" }
};

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const token = localStorage.getItem('admin_access_token');
  const currentAdmin = JSON.parse(localStorage.getItem('admin_info') || '{}');
  const currentAdminId = currentAdmin.ma_user || currentAdmin.id;

  // ─── DEBOUNCE SEARCH TERM (500ms) ──────────────────────────────────────────
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      
      const res = await axios.get(`${API_BASE_URL}/admin/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Ưu tiên ADMIN lên đầu
      const sortedUsers = res.data.sort((a, b) => {
        if (a.quyen === 'admin' && b.quyen !== 'admin') return -1;
        if (a.quyen !== 'admin' && b.quyen === 'admin') return 1;
        return 0;
      });
      setUsers(sortedUsers);
    } catch (err) {
      console.error('Lỗi tải danh sách người dùng:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch]);

  const handleStatusChange = async (id, newStatus) => {
    if (window.confirm(`Xác nhận thay đổi trạng thái tài khoản sang: ${TRANG_THAI_USER[newStatus]?.label}?`)) {
      try {
        await axios.put(`${API_BASE_URL}/admin/users/${id}/status?status=${newStatus}`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchUsers();
      } catch (err) {
        console.error(err);
        alert("Lỗi cập nhật trạng thái");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`⚠️ Bạn có chắc muốn XÓA vĩnh viễn tài khoản #${id}?`)) {
      try {
        await axios.delete(`${API_BASE_URL}/admin/users/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchUsers();
      } catch (err) { alert("Lỗi xóa"); }
    }
  };

  const filteredUsers = users.filter(u => {
    return statusFilter === 'all' || u.status === statusFilter;
  });

  return (
    <div className="animate-fade-in-up">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex flex-1 items-center gap-4 w-full max-w-2xl">
          <div className="relative group flex-1">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-[1.3rem] blur opacity-10 group-focus-within:opacity-30 transition duration-300"></div>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm khách hàng (Tên, Email, SĐT)..."
                className="w-full pl-12 pr-6 py-3.5 bg-white border-none rounded-[1.2rem] shadow-lg outline-none text-gray-700 font-bold text-base placeholder:text-gray-400 transition-all focus:ring-2 focus:ring-blue-400/50"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-60">🔍</div>
            </div>
          </div>

          <div className="relative w-48 shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-4 pr-10 py-3.5 bg-white border-none rounded-[1.2rem] shadow-lg outline-none text-gray-700 font-bold text-sm appearance-none cursor-pointer focus:ring-2 focus:ring-purple-400/50 transition-all"
            >
              <option value="all">⚡ TẤT CẢ TRẠNG THÁI</option>
              <option value="active">✅ ĐANG HOẠT ĐỘNG</option>
              <option value="inactive">⏳ CHƯA KÍCH HOẠT</option>
              <option value="banned">🚫 ĐÃ BỊ KHÓA</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs pointer-events-none opacity-40">▼</div>
          </div>
        </div>

        <button
          onClick={fetchUsers}
          disabled={refreshing || loading}
          className={`px-6 py-3.5 rounded-[1.2rem] font-black uppercase text-xs tracking-widest shadow-lg transition-all flex items-center gap-3 whitespace-nowrap bg-green-500 text-white hover:bg-green-600 hover:shadow-green-500/20 active:scale-95 ${refreshing || loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <span className={`text-lg ${refreshing || loading ? 'animate-spin' : ''}`}>🔄</span>
          {refreshing || loading ? 'Đang tải...' : 'Làm mới'}
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6 pl-2 border-l-4 border-amber-600">
        <h4 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-purple-600 to-pink-600 uppercase tracking-wide">
          Danh sách khách hàng
        </h4>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.07)] overflow-hidden border border-slate-100 relative min-h-[400px]">
        {loading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest animate-pulse">Đang tìm kiếm khách hàng...</span>
            </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[13px] font-semibold uppercase tracking-wide">
                <th className="py-4 px-4 text-center rounded-tl-xl w-20">ID</th>
                <th className="py-4 px-4 text-center w-40">Tài khoản</th>
                <th className="py-4 px-4 text-center">Thông tin khách</th>
                <th className="py-4 px-3 text-center w-36">Trạng thái</th>
                <th className="py-4 px-4 text-center">Địa chỉ</th>
                <th className="py-4 px-3 text-center w-32">Vai trò</th>
                <th className="py-4 px-4 text-center rounded-tr-xl w-[120px]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 italic">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  return (
                    <tr key={u.ma_user} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                      <td className="py-4 px-4 text-center align-middle font-black text-blue-600 text-[13px]">{u.ma_user}</td>
                      <td className="py-4 px-6 text-center align-middle">
                        <span className="font-bold text-indigo-600 bg-indigo-50/50 px-2.5 py-1 rounded-lg text-xs border border-indigo-100/50">
                          {u.ten_user}
                        </span>
                      </td>
                      <td className="py-4 px-6 align-middle text-center">
                        <div className="font-bold text-gray-800 text-lg leading-tight mb-0.5 uppercase tracking-tighter">{u.hovaten || "---"}</div>
                        <div className="text-[12px] text-gray-500 font-medium opacity-80 uppercase tracking-tighter italic">📧 {u.email}</div>
                        <div className="text-[12px] text-blue-600 font-mono font-bold">📞 {u.sdt || "Chưa có SĐT"}</div>
                      </td>
                      <td className="py-4 px-6 text-center align-middle">
                        <div className="relative group/status inline-block">
                          <select
                            disabled={currentAdminId === u.ma_user || u.quyen === 'admin'}
                            value={u.status || 'active'}
                            onChange={(e) => handleStatusChange(u.ma_user, e.target.value)}
                            className={`appearance-none px-4 py-1.5 rounded-full text-[11px] font-bold border transition-all outline-none ${currentAdminId === u.ma_user || u.quyen === 'admin' ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:shadow-md focus:ring-4 focus:ring-blue-500/10'}`}
                            style={{
                              backgroundColor: TRANG_THAI_USER[u.status || 'active'].style.backgroundColor,
                              color: TRANG_THAI_USER[u.status || 'active'].style.color,
                              borderColor: `${TRANG_THAI_USER[u.status || 'active'].style.color}20`
                            }}
                          >
                            <option value="active">✅ ACTIVE</option>
                            <option value="banned">🚫 BANNED</option>
                            <option value="inactive">⏳ INACTIVE</option>
                          </select>
                          {!(currentAdminId === u.ma_user || u.quyen === 'admin') && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] pointer-events-none opacity-40">
                              ▼
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 align-middle text-center">
                        <div className="text-[13px] font-medium text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-dashed border-slate-200 line-clamp-2 max-w-[220px] mx-auto">
                          {u.dia_chi_mac_dinh || "Chưa thiết lập địa chỉ"}
                        </div>
                      </td>
                      <td
                        className="py-4 px-6 text-center align-middle transition-colors duration-300"
                        style={{ backgroundColor: u.quyen === 'admin' ? '#F5F3FF60' : '#F3F4F660' }}
                      >
                        {(() => {
                          const isAdminRole = u.quyen === 'admin';
                          const roleColor = isAdminRole ? '#6D28D9' : '#475569';
                          const roleBg = isAdminRole ? '#EDE9FE' : '#E2E8F0';
                          return (
                            <span
                              className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold uppercase border shadow-sm transition-all"
                              style={{ backgroundColor: roleBg, color: roleColor, borderColor: `${roleColor}20` }}
                            >
                              {u.quyen}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="py-4 px-6 text-center align-middle">
                        <div className="flex justify-center items-center gap-3">
                          <button
                            onClick={() => navigate(`/admin/users/${u.ma_user}`)}
                            className="w-9 h-9 rounded-xl bg-white border border-slate-100 text-blue-600 hover:bg-blue-600 hover:text-white border-blue-600 shadow-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex items-center justify-center group/btn"
                            title="Xem chi tiết & Quản lý"
                          >
                            <span className="text-base group-hover/btn:scale-110 transition-transform">👁️</span>
                          </button>
                          {currentAdminId !== u.ma_user && u.quyen !== 'admin' && (
                            <button
                              onClick={() => handleDelete(u.ma_user)}
                              className="w-9 h-9 rounded-xl bg-white border border-slate-100 text-rose-500 hover:bg-rose-500 hover:text-white border-rose-500 shadow-sm hover:shadow-lg hover:shadow-rose-500/20 transition-all duration-300 flex items-center justify-center group/btn"
                              title="Xóa tài khoản"
                            >
                              <span className="text-base group-hover/btn:scale-110 transition-transform">🗑️</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                    <td colSpan="7" className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest opacity-50">
                        {loading ? "Đang tải dữ liệu..." : "Chưa có khách hàng nào"}
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  const [statusFilter, setStatusFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const token = localStorage.getItem('admin_access_token');
  const currentAdmin = JSON.parse(localStorage.getItem('admin_info') || '{}');
  const currentAdminId = currentAdmin.ma_user || currentAdmin.id; // Support both common naming conventions

  const fetchUsers = async () => {
    setRefreshing(true);
    try {
      const res = await axios.get('http://localhost:8000/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi tải danh sách user");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    if (window.confirm(`Xác nhận thay đổi trạng thái tài khoản sang: ${TRANG_THAI_USER[newStatus]?.label}?`)) {
      try {
        await axios.put(`http://localhost:8000/admin/users/${id}/status?status=${newStatus}`, {}, {
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
        await axios.delete(`http://localhost:8000/admin/users/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchUsers();
      } catch (err) { alert("Lỗi xóa"); }
    }
  };


  return (
    <div className="animate-fade-in-up">
      {/* Ô tìm kiếm hào quang */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex flex-1 items-center gap-4 w-full max-w-2xl">
          {/* Ô tìm kiếm hào quang */}
          <div className="relative group flex-1">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-[1.3rem] blur opacity-10 group-focus-within:opacity-30 transition duration-300"></div>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm khách hàng (Tên, Email, SĐT)..."
                className="w-full pl-12 pr-6 py-3.5 bg-white border-none rounded-[1.2rem] shadow-lg outline-none text-gray-700 font-bold text-base placeholder:text-gray-400 transition-all focus:ring-2 focus:ring-blue-400/50"
                onChange={e => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-60">🔍</div>
            </div>
          </div>

          {/* Bộ lọc trạng thái */}
          <div className="relative w-48">
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
          disabled={refreshing}
          className={`px-6 py-3.5 rounded-[1.2rem] font-black uppercase text-xs tracking-widest shadow-lg transition-all flex items-center gap-3 whitespace-nowrap bg-green-500 text-white hover:bg-green-600 hover:shadow-green-500/20 active:scale-95 ${refreshing ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <span className={`text-lg ${refreshing ? 'animate-spin' : ''}`}>🔄</span>
          {refreshing ? 'Làm mới' : 'Làm mới'}
        </button>
      </div>

      {/* TIÊU ĐỀ DANH SÁCH */}
      <div className="flex items-center gap-3 mb-6 pl-2 border-l-4 border-amber-600">
        <h4 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-purple-600 to-pink-600 uppercase tracking-wide">
          Danh sách khách hàng
        </h4>
      </div>

      {/* 🟢 BẢNG KHÁCH HÀNG */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-500/5 border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead className="bg-gradient-to-r from-amber-600 to-yellow-700 text-amber-50 text-[11px] uppercase font-black tracking-widest">
            <tr className="divide-x divide-amber-200/40">
              <th className="py-5 px-6 text-center w-20">ID</th>
              <th className="py-5 px-6 text-center w-40">Tên tài khoản</th>
              <th className="py-5 px-6 text-center">Thông tin khách hàng</th>
              <th className="py-5 px-6 text-center w-36">Trạng thái</th>
              <th className="py-5 px-6 text-center">Địa chỉ</th>
              <th className="py-5 px-6 text-center w-32">Vai trò</th>
              <th className="py-5 px-10 text-center w-[120px]">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.filter(u => {
              const matchesSearch = (u.hovaten || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (u.ten_user || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (u.sdt || '').includes(searchTerm);

              const matchesStatus = statusFilter === 'all' || u.status === statusFilter;

              return matchesSearch && matchesStatus;
            }).map((u, index) => {
              const s = TRANG_THAI_USER[u.status || 'active'];
              return (
                <tr key={u.ma_user} className={`hover:bg-blue-50/30 transition-colors group divide-x divide-slate-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/10'}`}>
                  <td className="py-4 px-6 text-center align-middle font-bold text-slate-400 text-sm">#{u.ma_user}</td>
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
                    <div
                      className="inline-block px-2.5 py-1 rounded-full text-xs font-medium border shadow-sm"
                      style={{ backgroundColor: s.style.backgroundColor, color: s.style.color, borderColor: `${s.style.color}20` }}
                    >
                      {s.icon} {s.label}
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
                      const isAdmin = u.quyen === 'admin';
                      const color = isAdmin ? '#6D28D9' : '#475569';
                      const bg = isAdmin ? '#EDE9FE' : '#E2E8F0';
                      return (
                        <span
                          className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold uppercase border shadow-sm transition-all"
                          style={{ backgroundColor: bg, color: color, borderColor: `${color}20` }}
                        >
                          {u.quyen}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="py-4 px-6 text-center align-middle">
                    <div className="flex justify-center items-center gap-3">
                      {/* Xem chi tiết (Chính) */}
                      <button
                        onClick={() => navigate(`/admin/users/${u.ma_user}`)}
                        className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center group/btn"
                        title="Xem chi tiết & Quản lý"
                      >
                        <span className="text-base group-hover/btn:scale-110 transition-transform">👁️</span>
                      </button>

                      {/* Nút Xóa (Nếu không phải chính mình) */}
                      {currentAdminId !== u.ma_user && u.quyen !== 'admin' && (
                        <button
                          onClick={() => handleDelete(u.ma_user)}
                          className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 hover:shadow-lg hover:shadow-rose-500/20 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center group/btn"
                          title="Xóa tài khoản"
                        >
                          <span className="text-base group-hover/btn:scale-110 transition-transform">🗑️</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Bộ từ điển trạng thái
const TRANG_THAI_USER = {
  active: { label: "ACTIVE", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  banned: { label: "BANNED", color: "bg-rose-50 text-rose-600 border-rose-100" },
  inactive: { label: "INACTIVE", color: "bg-slate-100 text-slate-500 border-slate-200" }
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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
    if (window.confirm(`Xác nhận thay đổi trạng thái tài khoản thành: ${TRANG_THAI_USER[newStatus]?.label}?`)) {
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

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      // Tạo payload đúng với Schema UserUpdateAdmin ở Backend
      const payload = {
        hovaten: editingUser.hovaten,
        email: editingUser.email,
        sdt: editingUser.sdt,
        quyen: editingUser.quyen,
        diachi: editingUser.diachi || "" // Đảm bảo gửi chuỗi, không gửi null
      };

      await axios.put(`http://localhost:8000/admin/users/${editingUser.ma_user}`, payload, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      alert("✅ Đã cập nhật database thành công!");

      // Cập nhật lại danh sách hiển thị
      setUsers(prev => prev.map(u => u.ma_user === editingUser.ma_user ? { ...u, ...payload } : u));
      setEditingUser(null);
    } catch (err) {
      console.error("Lỗi:", err);
      alert("❌ Lỗi cập nhật: " + (err.response?.data?.detail || "Lỗi Server"));
    }
  };

  return (
    <div className="animate-fade-in-up">
      {/* Ô tìm kiếm hào quang */}
      <div className="flex justify-between items-center mb-8 gap-4">
        <div className="relative group w-full max-w-md">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-[1.3rem] blur opacity-10 group-focus-within:opacity-30 transition duration-300"></div>
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm khách hàng..."
              className="w-full pl-12 pr-6 py-3.5 bg-white border-none rounded-[1.2rem] shadow-lg outline-none text-gray-700 font-bold text-base placeholder:text-gray-400 transition-all focus:ring-2 focus:ring-blue-400/50"
              onChange={e => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-60">🔍</div>
          </div>
        </div>

        <button
          onClick={fetchUsers}
          disabled={refreshing}
          className={`px-6 py-3.5 rounded-[1.2rem] font-black uppercase text-xs tracking-widest shadow-lg transition-all flex items-center gap-3 whitespace-nowrap bg-green-500 text-white hover:bg-green-600 hover:shadow-green-500/20 active:scale-95 ${refreshing ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <span className={`text-lg ${refreshing ? 'animate-spin' : ''}`}>🔄</span>
          {refreshing ? 'Đang làm mới...' : 'Làm mới'}
        </button>
      </div>

      {/* TIÊU ĐỀ DANH SÁCH */}
      <div className="flex items-center gap-3 mb-6 pl-2 border-l-4 border-amber-600">
        <h4 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-purple-600 to-pink-600 uppercase tracking-wide">
          Danh sách khách hàng
        </h4>
      </div>

      {/* 🟢 BẢNG KHÁCH HÀNG */}
      <div className="bg-white/80 backdrop-blur-md rounded-[3rem] shadow-xl shadow-blue-500/5 border border-white overflow-hidden">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead className="bg-gradient-to-r from-amber-600 to-yellow-700 text-amber-50 text-[11px] uppercase font-black tracking-widest">
            <tr className="divide-x divide-amber-200/40">
              <th className="py-8 px-6 text-center w-20">ID</th>
              <th className="py-8 px-6 text-center w-40">Tên tài khoản</th>
              <th className="py-8 px-6 text-center">Thông tin khách hàng</th>
              {/* CỘT ĐỊA CHỈ */}
              <th className="py-8 px-6 w-1/4 text-center">Địa chỉ</th>
              <th className="py-8 px-6 text-center w-36">Vai trò</th>
              <th className="py-8 px-10 text-center w-[250px]">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.filter(u =>
              (u.hovaten || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
              (u.ten_user || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
              (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
              (u.sdt || '').includes(searchTerm)
            ).map((u, index) => {
              const statusInfo = TRANG_THAI_USER[u.status] || TRANG_THAI_USER.inactive;
              return (
                <tr key={u.ma_user} className={`hover:bg-blue-50/40 transition-colors group divide-x divide-slate-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                  <td className="py-4 px-6 text-center align-middle font-bold text-gray-400 text-base">#{u.ma_user}</td>
                  <td className="py-4 px-6 text-center align-middle">
                    <span className="font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg text-sm border border-indigo-100">
                      {u.ten_user}
                    </span>
                  </td>
                  <td className="py-4 px-6 align-middle text-center">
                    <div className="font-bold text-gray-800 text-lg leading-tight mb-0.5 uppercase tracking-tighter">{u.hovaten || "---"}</div>
                    <div className="text-[12px] text-gray-500 font-medium opacity-80 uppercase tracking-tighter italic">📧 {u.email}</div>
                    <div className="text-[12px] text-blue-600 font-mono font-bold">📞 {u.sdt || "Chưa có SĐT"}</div>
                  </td>
                  {/* 👇 HIỂN THỊ ĐỊA CHỈ: Đã sửa thành u.diachi */}
                  <td className="py-4 px-6 align-middle text-center">
                    <div className="flex items-start justify-center gap-1.5 text-gray-600 text-sm italic">
                      <span className="opacity-60">📍</span>
                      <p className="font-medium leading-relaxed">
                        {u.diachi && u.diachi.trim() !== "" ? u.diachi : "Chưa cập nhật địa chỉ"}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center align-middle">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border 
                      ${u.quyen === 'admin'
                        ? 'bg-purple-100 text-purple-700 border-purple-200 shadow-sm'
                        : 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm'}`}>
                      {u.quyen}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center align-middle">
                    <div className="flex justify-center items-center gap-2.5">
                      {u.quyen !== 'admin' && (
                        <>
                          {/* Dropdown Trạng thái */}
                          <div className="relative group min-w-[120px]">
                            <select
                              value={u.status || 'active'}
                              onChange={(e) => handleStatusChange(u.ma_user, e.target.value)}
                              className={`w-full appearance-none pl-3 pr-8 py-1.5 rounded-lg text-[10px] font-bold uppercase border cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/20 shadow-sm ${statusInfo.color}`}
                            >
                              <option value="active">✅ ACTIVE</option>
                              <option value="banned">🚫 BANNED</option>
                              <option value="inactive">⏳ INACTIVE</option>
                            </select>
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[8px] pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">▼</div>
                          </div>
                        </>
                      )}

                      {/* Sửa thông tin (Luôn hiển thị) */}
                      <button
                        onClick={() => setEditingUser(u)}
                        className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm"
                        title="Edit User"
                      >
                        <span className="text-sm">✏️</span>
                      </button>

                      {u.quyen !== 'admin' && (
                        <>
                          {/* Xóa vĩnh viễn */}
                          <button
                            onClick={() => handleDelete(u.ma_user)}
                            className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm"
                            title="Delete User"
                          >
                            <span className="text-sm">🗑️</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* --- POPUP SỬA --- */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-[#f0ebff] p-10 rounded-[2.5rem] shadow-2xl w-full max-w-sm border border-purple-200">
            <h3 className="text-2xl font-black mb-8 text-slate-800 flex items-center gap-4">
              <span className="p-3 bg-white/50 rounded-2xl text-purple-600 shadow-sm">✏️</span> Chỉnh Sửa
            </h3>
            <form onSubmit={handleUpdateUser} className="space-y-5">
              {/* Danh sách các trường cần sửa: Đã đổi dia_chi thành diachi */}
              {[
                { key: 'hovaten', label: 'Họ và Tên' },
                { key: 'email', label: 'Email Liên Hệ' },
                { key: 'sdt', label: 'Số Điện Thoại' },
                { key: 'diachi', label: 'Địa Chỉ' }
              ].map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <label className="text-[11px] font-black text-purple-900/40 uppercase tracking-widest px-1 block">
                    {field.label}
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl blur opacity-10 group-focus-within:opacity-30 transition duration-300"></div>
                    <input
                      className="relative w-full bg-white border-2 border-purple-100 p-4 rounded-xl text-gray-700 font-bold text-base outline-none focus:border-purple-400 transition-all shadow-sm"
                      value={editingUser[field.key] || ''}
                      onChange={e => setEditingUser({ ...editingUser, [field.key]: e.target.value })}
                    />
                  </div>
                </div>
              ))}

              {/* Ô XÉT QUYỀN (ROLE) */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-purple-900/40 uppercase tracking-widest px-1 block">
                  Vai trò (Quyền hạn)
                </label>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl blur opacity-10 group-focus-within:opacity-30 transition duration-300"></div>
                  <select
                    className={`relative w-full border-2 p-4 rounded-xl font-bold text-base outline-none transition-all shadow-sm appearance-none cursor-pointer 
                      ${Number(editingUser.ma_user) === Number(currentAdminId) ? 'opacity-50 cursor-not-allowed' : ''}
                      ${editingUser.quyen === 'admin'
                        ? 'bg-purple-50 border-purple-300 text-purple-700 focus:border-purple-500'
                        : 'bg-blue-50 border-blue-300 text-blue-700 focus:border-blue-500'}`}
                    value={editingUser.quyen || 'customer'}
                    disabled={Number(editingUser.ma_user) === Number(currentAdminId)}
                    onChange={e => setEditingUser({ ...editingUser, quyen: e.target.value })}
                  >
                    <option value="customer" className="text-blue-700 bg-blue-50">👤 CUSTOMER (Khách hàng)</option>
                    <option value="admin" className="text-purple-700 bg-purple-50">🛡️ ADMIN (Quản trị viên)</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">▼</div>
                </div>
                {Number(editingUser.ma_user) === Number(currentAdminId) && (
                  <p className="text-[9px] text-amber-600 font-bold italic px-1">
                    * Bạn không thể tự thay đổi quyền của chính mình.
                  </p>
                )}
              </div>
              <div className="flex gap-4 mt-10">
                <button type="button" onClick={() => setEditingUser(null)} className="flex-1 bg-rose-50 text-rose-500 border border-rose-100 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-sm hover:bg-rose-100 transition-all">Hủy bỏ</button>
                <button type="submit" className="flex-1 bg-blue-500 py-4 rounded-2xl font-black text-white uppercase text-xs tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
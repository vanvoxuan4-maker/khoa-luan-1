import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterStars, setFilterStars] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const token = localStorage.getItem('admin_access_token');

  const fetchReviews = async () => {
    setRefreshing(true);
    try {
      const res = await axios.get('http://localhost:8000/admin/reviews', {
        headers: { 'Authorization': `Bearer ${token}` },
        params: {
          status: filterStatus || undefined,
          stars: filterStars || undefined
        }
      });
      setReviews(res.data);
    } catch (err) {
      console.error("Lỗi tải đánh giá:", err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchReviews(); }, [filterStatus, filterStars]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:8000/admin/reviews/${id}/status`,
        { status: newStatus },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setReviews(prev => prev.map(r => r.ma_danhgia === id ? { ...r, trang_thai: newStatus } : r));
      alert(`✅ Đã cập nhật trạng thái thành công!`);
    } catch (err) {
      alert("❌ Lỗi cập nhật");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("⚠️ Bạn có chắc muốn XÓA vĩnh viễn đánh giá này?")) {
      try {
        await axios.delete(`http://localhost:8000/admin/reviews/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setReviews(prev => prev.filter(r => r.ma_danhgia !== id));
      } catch (err) { alert("❌ Lỗi khi xóa"); }
    }
  };

  const renderStars = (starCount) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={i < starCount ? "text-yellow-500 text-lg drop-shadow-sm" : "text-gray-300 text-lg"}>★</span>
    ));
  };

  return (
    <div className="animate-fade-in-up">
      {/* Ô tìm kiếm hào quang giống UserList */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        {/* Ô tìm kiếm hào quang giống UserList */}
        <div className="relative group w-full max-w-md">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-[1.3rem] blur opacity-10 group-focus-within:opacity-30 transition duration-300"></div>
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm nội dung, khách hàng, sản phẩm..."
              className="w-full pl-12 pr-6 py-3.5 bg-white border-none rounded-[1.2rem] shadow-lg outline-none text-gray-700 font-bold text-base placeholder:text-gray-400 transition-all focus:ring-2 focus:ring-blue-400/50"
              onChange={e => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-60">🔍</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Bộ lọc trạng thái */}
          <div className="relative group min-w-[150px] flex-1 md:flex-none">
            <select
              className="w-full px-5 py-3.5 bg-white border-2 border-slate-100 rounded-[1.2rem] shadow-md outline-none text-gray-700 font-bold text-sm appearance-none cursor-pointer transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">⏳ Chờ duyệt</option>
              <option value="approved">✅ Hiển thị</option>
              <option value="rejected">🔒 Đã ẩn</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-[10px]">▼</div>
          </div>

          {/* Bộ lọc sao */}
          <div className="relative group min-w-[140px] flex-1 md:flex-none">
            <select
              className="w-full px-5 py-3.5 bg-white border-2 border-slate-100 rounded-[1.2rem] shadow-md outline-none text-gray-700 font-bold text-sm appearance-none cursor-pointer transition-all focus:border-amber-400 focus:ring-4 focus:ring-amber-100/50"
              value={filterStars}
              onChange={(e) => setFilterStars(e.target.value)}
            >
              <option value="">Tất cả số sao</option>
              <option value="5">⭐⭐⭐⭐⭐ (5)</option>
              <option value="4">⭐⭐⭐⭐ (4)</option>
              <option value="3">⭐⭐⭐ (3)</option>
              <option value="2">⭐⭐ (2)</option>
              <option value="1">⭐ (1)</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-[10px]">▼</div>
          </div>

          <button
            onClick={fetchReviews}
            disabled={refreshing}
            className={`px-6 py-3.5 rounded-[1.2rem] font-black uppercase text-xs tracking-widest shadow-lg transition-all flex items-center gap-3 whitespace-nowrap bg-green-500 text-white hover:bg-green-600 hover:shadow-green-500/20 active:scale-95 ${refreshing ? 'opacity-70 cursor-not-allowed' : ''} flex-1 md:flex-none justify-center`}
          >
            <span className={`text-lg ${refreshing ? 'animate-spin' : ''}`}>🔄</span>
            {refreshing ? 'Đang làm mới...' : 'Làm mới'}
          </button>
        </div>
      </div>

      {/* 🟢 BẢNG ĐÁNH GIÁ ĐÃ ĐỒNG BỘ MÀU (Slate) */}
      <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          {/* Header màu Slate giống OrderManager và UserList */}
          <thead className="bg-gradient-to-r from-amber-600 to-yellow-700 text-amber-50">
            <tr className="text-slate-700 uppercase text-[11px] font-black tracking-widest divide-x-2 divide-slate-200">
              <th className="py-5 px-6 text-center w-20">ID</th>
              <th className="py-5 px-6 w-1/4">Sản Phẩm & Khách</th>
              <th className="py-5 px-6 text-center w-32">Đánh Giá</th>
              <th className="py-5 px-6">Nội Dung</th>
              <th className="py-5 px-6 text-center w-36">Trạng Thái</th>
              <th className="py-5 px-6 text-center w-40">Hành Động</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {reviews.filter(r =>
              (r.viet_danhgia || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
              (r.user?.hovaten || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
              (r.sanpham?.ten_sanpham || '').toLowerCase().includes(searchTerm.toLowerCase())
            ).map((r, index) => (
              <tr key={r.ma_danhgia} className={`hover:bg-blue-50/40 transition-colors group divide-x divide-slate-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>

                <td className="py-4 px-6 text-center align-middle font-bold text-gray-400 text-base">#{r.ma_danhgia}</td>

                <td className="py-4 px-6 align-middle">
                  <div className="font-bold text-gray-800 text-sm mb-1 line-clamp-1 uppercase tracking-tighter" title={r.sanpham?.ten_sanpham}>
                    {r.sanpham?.ten_sanpham || "Sản phẩm đã xóa"}
                  </div>
                  <div className="text-[11px] text-blue-600 font-black uppercase tracking-wider">
                    👤 {r.user?.hovaten || "Khách ẩn danh"}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5 italic">
                    {r.ngay_lap ? new Date(r.ngay_lap).toLocaleDateString('vi-VN') : '---'}
                  </div>
                </td>

                <td className="py-4 px-6 text-center align-middle">
                  <div className="flex justify-center gap-0.5">{renderStars(r.diem_danhgia)}</div>
                </td>

                <td className="py-4 px-6 align-middle">
                  <p className="text-gray-600 text-sm italic border-l-4 border-yellow-400/30 pl-3 leading-relaxed">"{r.viet_danhgia}"</p>
                </td>

                <td className="py-4 px-6 text-center align-middle">
                  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border shadow-sm inline-block whitespace-nowrap
                    ${r.trang_thai === 'approved' ? 'bg-green-100 text-green-700 border-green-200' :
                      r.trang_thai === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                        'bg-red-100 text-red-700 border-red-200'}`}>
                    {r.trang_thai === 'approved' ? '✅ Hiển thị' : r.trang_thai === 'pending' ? '⏳ Chờ duyệt' : '🔒 Đã ẩn'}
                  </span>
                </td>

                <td className="py-4 px-6 text-center align-middle">
                  <div className="flex justify-center gap-2">
                    {r.trang_thai !== 'approved' && (
                      <button
                        onClick={() => handleStatusChange(r.ma_danhgia, 'approved')}
                        className="w-9 h-9 rounded-xl bg-green-500 text-white shadow-[0_4px_12px_rgba(34,197,94,0.3)] hover:bg-green-600 hover:-translate-y-0.5 transition-all flex items-center justify-center font-bold"
                        title="Duyệt"
                      >
                        ✓
                      </button>
                    )}

                    {r.trang_thai !== 'rejected' && (
                      <button
                        onClick={() => handleStatusChange(r.ma_danhgia, 'rejected')}
                        className="w-9 h-9 rounded-xl bg-orange-500 text-white shadow-[0_4px_12px_rgba(249,115,22,0.3)] hover:bg-orange-600 hover:-translate-y-0.5 transition-all flex items-center justify-center font-bold"
                        title="Ẩn / Từ chối"
                      >
                        ✕
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(r.ma_danhgia)}
                      className="w-9 h-9 rounded-xl bg-red-500 text-white shadow-[0_4px_12px_rgba(239,68,68,0.3)] hover:bg-red-600 hover:-translate-y-0.5 transition-all flex items-center justify-center"
                      title="Xóa vĩnh viễn"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan="6" className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest opacity-50">
                  Chưa có đánh giá nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewList;
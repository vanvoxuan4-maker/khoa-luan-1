import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../utils/apiConfig';

const VoucherManager = () => {
  const [vouchers, setVouchers] = useState([]);
  const token = localStorage.getItem('admin_access_token');

  const [formData, setFormData] = useState({
    ma_giamgia: '', kieu_giamgia: 'percentage', giatrigiam: '', don_toithieu: 0, solandung: 100, ngay_ketthuc: ''
  });

  const [editingVoucher, setEditingVoucher] = useState(null);
  const [renewalData, setRenewalData] = useState({ ngay_ketthuc: '', solandung: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchVouchers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/vouchers`, { headers: { Authorization: `Bearer ${token}` } });
      setVouchers(res.data);
    } catch (err) { console.error("Lỗi tải voucher"); }
  };

  useEffect(() => { fetchVouchers(); }, []);

  const handleCreate = async () => {
    if (!formData.ma_giamgia || !formData.giatrigiam) return alert("Vui lòng nhập đủ Mã Code và Giá Trị Giảm!");
    const payload = {
      ...formData, giatrigiam: Number(formData.giatrigiam), don_toithieu: Number(formData.don_toithieu), solandung: Number(formData.solandung),
      ngay_ketthuc: formData.ngay_ketthuc ? formData.ngay_ketthuc : null
    };
    try {
      await axios.post(`${API_BASE_URL}/admin/vouchers`, payload, { headers: { Authorization: `Bearer ${token}` } });
      alert("✅ Tạo mã thành công!");
      setFormData({ ma_giamgia: '', kieu_giamgia: 'percentage', giatrigiam: '', don_toithieu: 0, solandung: 100, ngay_ketthuc: '' });
      setIsAdding(false);
      fetchVouchers();
    } catch (err) {
      const msg = err.response?.data?.detail; alert(typeof msg === 'object' ? JSON.stringify(msg) : (msg || "Lỗi tạo mã"));
    }
  };

  const handleUpdate = async (id) => {
    try {
      // Đảm bảo solandung là số
      const payload = {
        ...renewalData,
        solandung: parseInt(renewalData.solandung) || 0
      };
      await axios.put(`${API_BASE_URL}/admin/vouchers/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      alert("✅ Gia hạn và mở lại thành công!");
      setEditingVoucher(null);
      await fetchVouchers(); // Đợi fetch xong để re-render
    } catch (err) {
      alert("Lỗi khi gia hạn: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa mã này?")) {
      try {
        await axios.delete(`${API_BASE_URL}/admin/vouchers/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchVouchers();
      } catch (err) { alert("Lỗi khi xóa"); }
    }
  };

  const blockInvalidChar = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

  const filteredVouchers = vouchers.filter(v =>
    v.ma_giamgia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in-up min-h-screen p-6 rounded-[2rem] relative overflow-hidden bg-[#f0f4ff]">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-300/30 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-blue-300/30 rounded-full blur-[100px] animate-pulse delay-700"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* HEADER AREA: SEARCH + ADD BUTTON */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
          <div className="relative group w-full max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors z-20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm mã voucher..."
              className="w-full pl-12 pr-6 py-4 bg-white/70 backdrop-blur-md border border-white rounded-2xl shadow-sm outline-none font-bold text-slate-700 focus:ring-2 focus:ring-indigo-400/50 transition-all placeholder:font-normal placeholder:text-slate-400 relative z-10"
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`px-8 py-4 ${isAdding ? 'bg-slate-800' : 'bg-gradient-to-r from-indigo-600 to-purple-600'} text-white font-black rounded-2xl shadow-xl hover:shadow-indigo-500/30 transition-all flex items-center gap-2 active:scale-95`}
          >
            <span className="text-xl">{isAdding ? '✕' : '+'}</span>
            <span className="uppercase tracking-widest text-xs">
              {isAdding ? 'Hủy thêm mới' : 'Thêm Voucher mới'}
            </span>
          </button>
        </div>

        {/* FORM NHẬP LIỆU: TOGGLEABLE SECTION (RESTORED DARK GALAXY) */}
        {isAdding && (
          <div className="animate-fade-in-down bg-[#0f172a]/90 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-500/20 border border-slate-700/50 mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] -mr-20 -mt-20 opacity-20 pointer-events-none"></div>

            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 relative z-10">
              <span className="bg-gradient-to-tr from-blue-500 to-purple-500 p-2.5 rounded-xl shadow-lg shadow-blue-500/30">🎟️</span>
              <div className="flex flex-col">
                <span className="text-xs text-blue-400 uppercase tracking-[0.2em] font-black mb-1">Cấu hình ưu đãi</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-200 uppercase">
                  Thiết Lập Mã Giảm Giá Mới
                </span>
              </div>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
              <div className="md:col-span-6 group">
                <label className="block text-[10px] font-black text-blue-300 uppercase mb-2 ml-1 tracking-widest">Mã Code (Định danh)</label>
                <input
                  value={formData.ma_giamgia}
                  onChange={e => setFormData({ ...formData, ma_giamgia: e.target.value.toUpperCase() })}
                  placeholder="VD: SIÊU_HÈ_2026"
                  className="w-full bg-[#1e293b]/50 border border-slate-600 rounded-2xl px-5 h-14 font-black text-blue-100 text-lg placeholder:font-bold placeholder:text-slate-600 outline-none focus:border-blue-500 focus:bg-[#1e293b] focus:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all uppercase tracking-[0.2em]"
                />
              </div>

              <div className="md:col-span-6 flex gap-4">
                <div className="w-1/3 group relative">
                  <label className="block text-[10px] font-black text-blue-300 uppercase mb-2 ml-1 tracking-widest">Loại Giảm</label>
                  <div className="relative">
                    <select
                      value={formData.kieu_giamgia}
                      onChange={e => setFormData({ ...formData, kieu_giamgia: e.target.value })}
                      className="w-full bg-[#1e293b]/50 border border-slate-600 rounded-2xl pl-10 pr-4 h-14 font-black text-blue-100 text-[10px] outline-none focus:border-blue-500 cursor-pointer focus:bg-[#1e293b] transition-all appearance-none"
                    >
                      <option value="percentage">% PHẦN TRĂM</option>
                      <option value="fixed_amount">💲 TIỀN MẶT</option>
                    </select>
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="flex-1 group">
                  <label className="block text-[10px] font-black text-blue-300 uppercase mb-2 ml-1 tracking-widest">Giá Trị</label>
                  <input
                    type="number" min="0" onKeyDown={blockInvalidChar}
                    value={formData.giatrigiam}
                    onChange={e => setFormData({ ...formData, giatrigiam: e.target.value })}
                    placeholder={formData.kieu_giamgia === 'percentage' ? "VD: 15 %" : "VD: 50000 VND"}
                    className="w-full bg-[#1e293b]/50 border border-slate-600 rounded-2xl px-5 h-14 font-black text-sm text-white outline-none focus:border-blue-500 focus:bg-[#1e293b] focus:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all"
                  />
                </div>
              </div>

              <div className="md:col-span-4 group">
                <label className="block text-[10px] font-black text-blue-300 uppercase mb-2 ml-1 tracking-widest">Đơn Tối Thiểu</label>
                <div className="relative">
                  <input
                    type="number" min="0" onKeyDown={blockInvalidChar}
                    value={formData.don_toithieu}
                    onChange={e => setFormData({ ...formData, don_toithieu: e.target.value })}
                    className="w-full bg-[#1e293b]/50 border border-slate-600 rounded-2xl pl-5 pr-14 h-14 font-black text-sm text-white outline-none focus:border-blue-500 focus:bg-[#1e293b] transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-500 pointer-events-none">VND</span>
                </div>
              </div>

              <div className="md:col-span-4 group">
                <label className="block text-[10px] font-black text-blue-300 uppercase mb-2 ml-1 tracking-widest">Số Lượng Có Sẵn</label>
                <input
                  type="number" min="1" onKeyDown={blockInvalidChar}
                  value={formData.solandung}
                  onChange={e => setFormData({ ...formData, solandung: e.target.value })}
                  className="w-full bg-[#1e293b]/50 border border-slate-600 rounded-2xl px-5 h-14 font-black text-sm text-white outline-none focus:border-blue-500 focus:bg-[#1e293b] transition-all"
                />
              </div>

              <div className="md:col-span-4 group">
                <label className="block text-[10px] font-black text-blue-300 uppercase mb-2 ml-1 tracking-widest">Thời Hạn Kết Thúc</label>
                <input
                  type="date"
                  value={formData.ngay_ketthuc}
                  onChange={e => setFormData({ ...formData, ngay_ketthuc: e.target.value })}
                  className="w-full bg-[#1e293b]/50 border border-slate-600 rounded-2xl px-5 h-14 font-black text-sm text-blue-100 outline-none focus:border-blue-500 focus:bg-[#1e293b] transition-all cursor-pointer [color-scheme:dark]"
                />
              </div>

              <div className="md:col-span-12 mt-6">
                <button
                  onClick={handleCreate}
                  className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-black text-xs py-5 rounded-2xl shadow-2xl shadow-indigo-500/40 transform transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-3 border border-white/20 uppercase tracking-[0.3em]"
                >
                  <span>✨</span> XÁC NHẬN TẠO VOUCHER NEW
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TIÊU ĐỀ DANH SÁCH */}
        <div className="flex items-center gap-3 mb-8 pl-4 border-l-4 border-amber-600">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Hệ thống quản lý</span>
            <h4 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 uppercase tracking-tight">
              Kho Lưu Trữ Voucher
            </h4>
          </div>
          <div className="ml-auto bg-slate-200 px-3 py-1 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-tighter">
            {filteredVouchers.length} Items
          </div>
        </div>

        {/* LƯỚI THẺ VOUCHER */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
          {filteredVouchers.length > 0 ? (
            filteredVouchers.map(v => {
              const expiryDate = v.ngay_ketthuc ? new Date(v.ngay_ketthuc) : null;
              if (expiryDate) expiryDate.setHours(23, 59, 59, 999);
              const isExpired = expiryDate && expiryDate.getTime() < Date.now();
              const isUsageFull = v.solan_hientai >= v.solandung;
              const isClosed = isExpired || isUsageFull || !v.is_active;
              const isEditing = editingVoucher === v.ma_khuyenmai;

              return (
                <div key={v.ma_khuyenmai} className={`relative group transition-all duration-300 hover:-translate-y-2 ${isClosed && !isEditing ? 'grayscale opacity-70' : ''}`}>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[2rem] opacity-0 group-hover:opacity-20 blur transition duration-500"></div>

                  <div className="relative h-full bg-white/80 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-white shadow-xl hover:shadow-2xl transition-all flex flex-col">
                    <div className={`p-6 relative text-white overflow-hidden ${isClosed ? 'bg-slate-600' : 'bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700'}`}>
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
                      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-900/40 rounded-full blur-3xl"></div>

                      <div className="flex justify-between items-start relative z-10">
                        <div>
                          <h4 className="text-2xl font-black tracking-[0.1em] drop-shadow-xl uppercase">{v.ma_giamgia}</h4>
                          <div className="mt-2 flex items-center gap-2">
                            <span className={`text-[8px] font-black px-2.5 py-1 rounded-lg border border-white/30 uppercase tracking-widest ${isClosed ? 'bg-black/40' : 'bg-white/20'}`}>
                              {isClosed ? '🔴 Đã đóng' : '🟢 Hoạt động'}
                            </span>
                          </div>
                        </div>
                        <div className="bg-white/95 text-indigo-700 px-3 py-2 rounded-xl shadow-2xl font-black text-xl border-b-4 border-indigo-100 flex flex-col items-center">
                          <span>{v.kieu_giamgia === 'percentage' ? `${v.giatrigiam}%` : `${(v.giatrigiam / 1000)}k`}</span>
                          <span className="text-[7px] -mt-1 opacity-60 uppercase tracking-widest">Disc.</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-4 flex-grow">
                      {isEditing ? (
                        <div className="animate-fade-in space-y-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                          <div>
                            <label className="block text-[8px] font-black text-indigo-400 uppercase mb-1.5 ml-1 tracking-widest">Gia hạn đến ngày</label>
                            <input
                              type="date"
                              className="w-full bg-white border border-indigo-200 rounded-xl px-3 h-10 text-xs font-black outline-none [color-scheme:light]"
                              value={renewalData.ngay_ketthuc}
                              onChange={e => setRenewalData({ ...renewalData, ngay_ketthuc: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-black text-indigo-400 uppercase mb-1.5 ml-1 tracking-widest">Tổng giới hạn mới ({v.solan_hientai})</label>
                            <input
                              type="number"
                              className="w-full bg-white border border-indigo-200 rounded-xl px-3 h-10 text-xs font-black outline-none"
                              value={renewalData.solandung}
                              onChange={e => setRenewalData({ ...renewalData, solandung: e.target.value })}
                            />
                          </div>
                          <div className="flex gap-2 w-full pt-1">
                            <button onClick={() => handleUpdate(v.ma_khuyenmai)} className="flex-1 bg-indigo-600 text-white text-[9px] font-black py-3 rounded-xl hover:bg-slate-900 transition-colors uppercase tracking-widest shadow-lg shadow-indigo-500/10">Lưu lại</button>
                            <button onClick={() => setEditingVoucher(null)} className="flex-1 bg-white text-slate-500 text-[9px] font-black py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors uppercase">Hủy</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="bg-white/60 p-3 rounded-2xl border border-indigo-50 flex items-center gap-3">
                            <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600 text-base shadow-sm">🎫</div>
                            <div>
                              <p className="text-[8px] text-indigo-400 font-black uppercase tracking-widest mb-0.5">Yêu cầu tối thiểu</p>
                              <p className="text-xs font-black text-slate-700">
                                {v.don_toithieu > 0 ? `Đơn từ ${parseFloat(v.don_toithieu).toLocaleString()} VND` : "Mọi loại đơn hàng"}
                              </p>
                            </div>
                          </div>

                          <div className="px-1 pt-1">
                            <div className="flex justify-between text-[10px] font-black text-slate-500 mb-2 uppercase tracking-tight">
                              <span>Lượt đã sử dụng</span>
                              <div className="flex items-baseline gap-1">
                                <span className="text-indigo-600 font-black">{v.solan_hientai}</span>
                                <span className="text-slate-300">/</span>
                                <span className="text-slate-400">{v.solandung}</span>
                              </div>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 padding-[2px]">
                              <div
                                className={`h-full rounded-full transition-all duration-1000 ${isClosed ? 'bg-slate-400' : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500'}`}
                                style={{ width: `${Math.min((v.solan_hientai / v.solandung) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="p-6 pt-0 border-t border-slate-100/50 mt-auto bg-slate-50/50 text-[10px] font-bold">
                      <div className="flex flex-col gap-4 py-5">
                        <div className="flex items-center justify-between text-slate-500">
                          <span className="uppercase tracking-widest flex items-center gap-1.5">
                            <span className="text-sm">🕒</span> Hạn sử dụng
                          </span>
                          <span className={`${isExpired ? 'text-red-500 font-black' : 'text-slate-700'} uppercase tracking-tight bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-sm`}>
                            {v.ngay_ketthuc ? new Date(v.ngay_ketthuc).toLocaleDateString('vi-VN') : 'Vĩnh viễn'}
                          </span>
                        </div>

                        <div className="flex gap-2 w-full pt-1">
                          {isClosed && !isEditing && (
                            <button
                              onClick={() => {
                                setEditingVoucher(v.ma_khuyenmai);
                                setRenewalData({
                                  ngay_ketthuc: v.ngay_ketthuc ? v.ngay_ketthuc.split('T')[0] : '',
                                  solandung: v.solandung
                                });
                              }}
                              className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-black uppercase tracking-[0.1em] hover:bg-slate-900 transition-all shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2"
                            >
                              🚀 Mở lại mã
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(v.ma_khuyenmai)}
                            className="flex-1 bg-white text-red-500 border border-red-100 py-3 rounded-xl font-black uppercase tracking-[0.1em] hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-red-500/5 flex items-center justify-center gap-2"
                          >
                            <span>🗑️</span> Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center bg-white/40 backdrop-blur-md rounded-[3rem] border-2 border-dashed border-slate-300">
              <span className="text-4xl mb-4 block">🔎</span>
              <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">
                Không tìm thấy Voucher nào khớp với từ khóa của bạn
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoucherManager;
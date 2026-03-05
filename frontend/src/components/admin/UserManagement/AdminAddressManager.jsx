import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VIETNAM_PROVINCES = [
    "An Giang", "Bắc Ninh", "Cà Mau", "Cao Bằng", "TP. Cần Thơ", "TP. Đà Nẵng",
    "Đắk Lắk", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "TP. Hà Nội",
    "Hà Tĩnh", "TP. Hải Phòng", "TP. Hồ Chí Minh", "TP. Huế", "Hưng Yên",
    "Khánh Hoà", "Lai Châu", "Lạng Sơn", "Lào Cai", "Lâm Đồng", "Nghệ An",
    "Ninh Bình", "Phú Thọ", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sơn La",
    "Tây Ninh", "Thái Nguyên", "Thanh Hóa", "Tuyên Quang", "Vĩnh Long"
];

const normalizeProvinceName = (name) => {
    if (!name) return "";
    let n = name.toLowerCase().trim();
    if (n.includes("hà nội")) return "TP. Hà Nội";
    if (n.includes("hồ chí minh") || n.includes("hcm")) return "TP. Hồ Chí Minh";
    if (n.includes("đà nẵng")) return "TP. Đà Nẵng";
    if (n.includes("hải phòng")) return "TP. Hải Phòng";
    if (n.includes("cần thơ")) return "TP. Cần Thơ";
    if (n.includes("huế")) return "TP. Huế";
    const match = VIETNAM_PROVINCES.find(p => {
        const pNorm = p.toLowerCase().replace("tp. ", "");
        return n.includes(pNorm) || pNorm.includes(n.replace("tỉnh ", ""));
    });
    return match || name;
};

const AdminAddressManager = ({ user, onClose }) => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [formData, setFormData] = useState({
        ten_nguoi_nhan: '',
        sdt_nguoi_nhan: '',
        dia_chi: '',
        tinh_thanh: '',
        is_mac_dinh: false
    });

    const token = localStorage.getItem('admin_access_token');

    useEffect(() => {
        if (user) fetchAddresses();
    }, [user]);

    const fetchAddresses = async (quiet = false) => {
        if (!quiet) setLoading(true);
        try {
            const res = await axios.get(`http://localhost:8000/admin/users/${user.ma_user}/addresses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAddresses(res.data);
        } catch (err) {
            console.error('Lỗi tải địa chỉ:', err);
            if (!quiet) alert('Không thể tải danh sách địa chỉ của khách hàng');
        } finally {
            if (!quiet) setLoading(false);
        }
    };

    const handleOpenModal = (address = null) => {
        if (address) {
            setEditingAddress(address);
            setFormData({
                ten_nguoi_nhan: address.ten_nguoi_nhan,
                sdt_nguoi_nhan: address.sdt_nguoi_nhan,
                dia_chi: address.dia_chi,
                tinh_thanh: normalizeProvinceName(address.tinh_thanh),
                is_mac_dinh: address.is_mac_dinh
            });
        } else {
            setEditingAddress(null);
            setFormData({
                ten_nguoi_nhan: user.hovaten || '',
                sdt_nguoi_nhan: user.sdt || '',
                dia_chi: '',
                tinh_thanh: '',
                is_mac_dinh: addresses.length === 0
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAddress) {
                await axios.put(`http://localhost:8000/admin/addresses/${editingAddress.ma_dia_chi}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`http://localhost:8000/admin/users/${user.ma_user}/addresses`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setShowModal(false);
            fetchAddresses();
            alert('Cập nhật địa chỉ cho khách hàng thành công');
        } catch (err) {
            alert(err.response?.data?.detail || 'Có lỗi xảy ra khi lưu địa chỉ');
        }
    };

    const handleDelete = async (ma_dia_chi) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này của khách hàng?')) return;
        try {
            await axios.delete(`http://localhost:8000/admin/addresses/${ma_dia_chi}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAddresses();
        } catch (err) {
            alert('Lỗi khi xóa địa chỉ');
        }
    };

    const handleSetDefault = async (ma_dia_chi) => {
        // Optimistic Update: Cập nhật UI ngay lập tức
        const oldAddresses = [...addresses];
        setAddresses(addresses.map(addr => ({
            ...addr,
            is_mac_dinh: addr.ma_dia_chi === ma_dia_chi
        })));

        try {
            await axios.patch(`http://localhost:8000/admin/addresses/${ma_dia_chi}/default`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAddresses(true); // Tải lại ngầm để đồng bộ
        } catch (err) {
            setAddresses(oldAddresses); // Hoàn tác nếu lỗi
            alert('Lỗi khi đặt mặc định');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-8 py-6 flex justify-between items-center text-white shrink-0">
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                            <span className="text-2xl">🏠</span> Quản lý địa chỉ khách hàng
                        </h3>
                        <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mt-1 opacity-80">
                            Khách hàng: {user.hovaten} (#{user.ma_user})
                        </p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all hover:rotate-90">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto grow">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-extrabold text-slate-800 uppercase tracking-tighter">Sổ địa chỉ của khách</h4>
                        <button
                            onClick={() => handleOpenModal()}
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition uppercase tracking-wide flex items-center gap-2 shadow-lg shadow-blue-500/20"
                        >
                            <span>+</span> Thêm địa chỉ mới
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        </div>
                    ) : addresses.length === 0 ? (
                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center">
                            <p className="text-slate-400 font-bold italic text-lg">Khách hàng chưa có địa chỉ nào.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {addresses.map(addr => (
                                <div key={addr.ma_dia_chi} className={`group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 ${addr.is_mac_dinh ? 'border-blue-400 bg-blue-50/30' : 'border-slate-50 bg-white hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5'}`}>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 flex-grow">
                                        {/* Nút hành động Tick chọn mặc định */}
                                        <button
                                            onClick={() => !addr.is_mac_dinh && handleSetDefault(addr.ma_dia_chi)}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all border-2 flex-none
                                                ${addr.is_mac_dinh
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 cursor-default'
                                                    : 'bg-white text-transparent border-slate-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer'}`}
                                            title={addr.is_mac_dinh ? 'Địa chỉ mặc định' : 'Đặt làm mặc định'}
                                        >
                                            <span className="text-sm font-black">✓</span>
                                        </button>

                                        {/* Thông tin người nhận */}
                                        <div className="min-w-[140px]">
                                            <p className="font-black text-slate-800 text-sm truncate">{addr.ten_nguoi_nhan}</p>
                                        </div>

                                        {/* Chi tiết địa chỉ */}
                                        <div className="flex-grow pr-4">
                                            <p className="text-[13px] font-bold text-slate-600 leading-snug">
                                                {addr.dia_chi}
                                            </p>
                                            {addr.is_mac_dinh && (
                                                <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest mt-1 block">Địa chỉ mặc định</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mt-4 sm:mt-0 pl-1 sm:pl-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100/50">
                                        <button onClick={() => handleOpenModal(addr)} className="w-9 h-9 rounded-xl bg-slate-50 text-slate-500 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center shadow-sm" title="Sửa">
                                            <span className="text-xs">✏️</span>
                                        </button>
                                        <button onClick={() => handleDelete(addr.ma_dia_chi)} className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center shadow-sm" title="Xóa">
                                            <span className="text-xs">🗑️</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-8 bg-slate-50 border-t border-slate-100 shrink-0 text-center">
                    <button
                        onClick={onClose}
                        className="px-10 py-4 bg-white border-2 border-slate-200 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-slate-800 hover:text-slate-800 transition-all shadow-sm active:scale-95"
                    >
                        HOÀN TẤT
                    </button>
                </div>
            </div>

            {/* Modal Form (Add/Edit) */}
            {showModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl transition-all border border-slate-100">
                        <div className="bg-slate-800 px-6 py-4 flex justify-between items-center text-white">
                            <h5 className="font-black uppercase tracking-tight text-sm">
                                {editingAddress ? 'Sửa địa chỉ cho khách' : 'Thêm địa chỉ mới cho khách'}
                            </h5>
                            <button onClick={() => setShowModal(false)} className="hover:rotate-90 transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Họ tên người nhận</label>
                                    <input
                                        required type="text" value={formData.ten_nguoi_nhan}
                                        onChange={e => setFormData({ ...formData, ten_nguoi_nhan: e.target.value })}
                                        className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-blue-500 outline-none transition bg-slate-50/50"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">SĐT nhận hàng</label>
                                    <input
                                        required type="text" value={formData.sdt_nguoi_nhan}
                                        onChange={e => setFormData({ ...formData, sdt_nguoi_nhan: e.target.value })}
                                        className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-blue-500 outline-none transition bg-slate-50/50"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tỉnh / Thành phố</label>
                                <select
                                    required value={formData.tinh_thanh}
                                    onChange={e => setFormData({ ...formData, tinh_thanh: e.target.value })}
                                    className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-blue-500 outline-none transition bg-white"
                                >
                                    <option value="">Chọn tỉnh thành</option>
                                    {VIETNAM_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Địa chỉ chi tiết</label>
                                <input
                                    required type="text" value={formData.dia_chi}
                                    onChange={e => setFormData({ ...formData, dia_chi: e.target.value })}
                                    className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-blue-500 outline-none transition bg-slate-50/50"
                                    placeholder="Số nhà, tên đường..."
                                />
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer pt-2 group">
                                <input
                                    type="checkbox" checked={formData.is_mac_dinh}
                                    onChange={e => setFormData({ ...formData, is_mac_dinh: e.target.checked })}
                                    className="w-5 h-5 rounded-lg border-2 border-slate-300 text-blue-600 focus:ring-blue-500 transition-all group-hover:border-blue-400"
                                />
                                <span className="text-xs font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-800 transition-colors">Đặt làm địa chỉ mặc định cho user</span>
                            </label>
                            <button
                                type="submit"
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95 mt-4"
                            >
                                {editingAddress ? 'Lưu thay đổi' : 'Thêm vào sổ địa chỉ'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAddressManager;

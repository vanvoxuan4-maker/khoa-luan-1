import React from 'react';

const StatusTracker = ({ history }) => {
    if (!history || history.length === 0) {
        return (
            <div className="text-center py-10 text-gray-400 font-medium italic">
                Đang cập nhật dữ liệu theo dõi...
            </div>
        );
    }

    // 1. Định nghĩa các bước tiêu chuẩn
    const standardSteps = [
        { id: 'pending', label: 'Đặt hàng', defaultDesc: 'Đơn hàng của bạn đã được tiếp nhận.' },
        { id: 'confirmed', label: 'Xác nhận', defaultDesc: 'Shop đang chuẩn bị hàng cho bạn.' },
        { id: 'shipping', label: 'Đang giao', defaultDesc: 'Đơn hàng sẽ sớm được giao đến bạn.' },
        { id: 'delivered', label: 'Hoàn thành', defaultDesc: 'Cảm ơn bạn đã mua sắm tại BikeStore!' }
    ];

    // Kiểm tra trạng thái đặc biệt
    const specialStatuses = history.filter(h => h.trang_thai === 'cancelled' || h.trang_thai === 'returned');
    if (specialStatuses.length > 0) {
        const sortedHistory = [...history].sort((a, b) => new Date(a.thoi_gian) - new Date(b.thoi_gian));
        return renderTimeline(sortedHistory, true);
    }

    // Full Journey logic
    const fullJourney = standardSteps.map(step => {
        const record = history.find(h => h.trang_thai.toLowerCase() === step.id);
        return {
            ...step,
            isCompleted: !!record,
            thoi_gian: record?.thoi_gian,
            mo_ta: record?.mo_ta || step.defaultDesc,
            ma_lichsu: record?.ma_lichsu || step.id
        };
    });

    // Xác định "bước hiện tại" (bước cuối cùng đã hoàn thành)
    const latestIdx = fullJourney.reduce((lastIdx, item, idx) => item.isCompleted ? idx : lastIdx, -1);

    return renderTimeline(fullJourney, false, latestIdx);

    function renderTimeline(data, isSpecial, latestIdx) {
        const getStatusIcon = (status) => {
            const map = {
                'pending': '⏳', 'confirmed': '✅', 'shipping': '🚚',
                'delivered': '🎉', 'returned': '⏪', 'cancelled': '🚫'
            };
            return map[status.toLowerCase()] || '📄';
        };

        const getStatusColor = (status, active, isPassed) => {
            if (isPassed) return 'bg-gray-100 text-gray-400 border-gray-200 opacity-60'; // Làm mờ khi đã qua
            if (!active) return 'bg-slate-50 text-slate-400 border-slate-100'; // Các bước sắp tới (chờ)

            const map = {
                'pending': 'bg-amber-100 text-amber-600 border-amber-200',
                'confirmed': 'bg-blue-100 text-blue-600 border-blue-200',
                'shipping': 'bg-indigo-100 text-indigo-600 border-indigo-200',
                'delivered': 'bg-emerald-100 text-emerald-600 border-emerald-200',
                'returned': 'bg-purple-100 text-purple-600 border-purple-200',
                'cancelled': 'bg-rose-100 text-rose-600 border-rose-200'
            };
            return map[status.toLowerCase()] || 'bg-gray-100 text-gray-600 border-gray-200';
        };

        return (
            <div className="py-6 px-4">
                <div className="relative">
                    {/* Vertical Connection Path */}
                    <div className="absolute left-[1.5rem] sm:left-[9.5rem] top-12 bottom-12 w-1.5 bg-gray-100 rounded-full hidden sm:block shadow-inner translate-x-[-50%]">
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-400/10 via-indigo-400/10 to-purple-400/10"></div>
                    </div>

                    <div className="space-y-8">
                        {data.map((item, index) => {
                            // "Đã qua" = các bước nằm trước bước hiện tại (latestIdx)
                            const isPassed = !isSpecial && index < latestIdx;
                            const isActive = isSpecial || (item.isCompleted || index === latestIdx);
                            const isLatest = isSpecial ? (index === data.length - 1) : (index === latestIdx);

                            const date = item.thoi_gian ? new Date(item.thoi_gian) : null;
                            const formattedDate = date ? date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : "--/--";
                            const formattedTime = date ? date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : "--:--";

                            return (
                                <div key={item.ma_lichsu} className={`relative flex items-start gap-4 sm:gap-8 group ${isPassed ? 'opacity-50' : ''}`}>
                                    {/* Date Column (Desktop) */}
                                    <div className="hidden sm:flex flex-col items-end w-24 flex-shrink-0 pt-1">
                                        <span className={`text-sm font-black ${isPassed ? 'text-gray-400' : 'text-gray-800'}`}>{formattedDate}</span>
                                        <span className={`text-xs font-bold uppercase tracking-tighter ${isPassed ? 'text-gray-300' : 'text-gray-400'}`}>{formattedTime}</span>
                                    </div>

                                    {/* Icon / Node */}
                                    <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center border-2 shadow-sm transition-all duration-300 flex-shrink-0 
                                        ${getStatusColor(item.id || item.trang_thai, isActive, isPassed)} 
                                        ${isLatest ? 'scale-110 shadow-lg ring-4 ring-offset-2' : ''}`}>
                                        <span className="text-xl">{getStatusIcon(item.id || item.trang_thai)}</span>
                                        {isLatest && (
                                            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-4 w-4 bg-current"></span>
                                            </span>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className={`flex-grow pt-1 pb-4 ${index !== data.length - 1 ? 'border-b border-gray-50' : ''}`}>
                                        <div className="flex flex-col sm:hidden mb-2">
                                            <span className={`text-xs font-black uppercase tracking-widest ${isPassed ? 'text-gray-300' : 'text-blue-600'}`}>{formattedDate} • {formattedTime}</span>
                                        </div>
                                        <h4 className={`text-base font-black uppercase tracking-tight mb-1 ${isLatest ? 'text-gray-900 scale-105 origin-left' : isPassed ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {item.label || item.trang_thai.toUpperCase()}
                                            {isLatest && <span className="ml-2 text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full lowercase tracking-normal font-bold">Hiện tại</span>}
                                        </h4>
                                        <p className={`text-sm font-medium leading-relaxed ${isPassed ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {item.mo_ta}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
};

export default StatusTracker;

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import OrderManager from './OrderManager';
import PaymentManager from './PaymentManager';
import ReviewList from './ReviewList';

const OrderHub = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'orders';
    const [highlightOrderId, setHighlightOrderId] = useState(null);

    // Sync highlight ID from URL
    useEffect(() => {
        const idParam = searchParams.get('id');
        if (idParam) {
            setHighlightOrderId(parseInt(idParam));
        } else {
            setHighlightOrderId(null);
        }
    }, [searchParams]);

    const handleTabChange = (tabId) => {
        setSearchParams({ tab: tabId });
    };

    const tabs = [
        { id: 'orders', label: 'Đơn Hàng', icon: '📦' },
        { id: 'payments', label: 'Lịch Sử Thanh Toán', icon: '💳' },
        { id: 'reviews', label: 'Đánh Giá', icon: '⭐' }
    ];

    const TabButton = ({ tab }) => {
        const isActive = activeTab === tab.id;
        return (
            <button
                onClick={() => handleTabChange(tab.id)}
                className={`group relative px-8 py-4 rounded-[1.5rem] flex flex-col items-center gap-2 transition-all duration-300 font-bold text-sm tracking-wide whitespace-nowrap overflow-hidden
          ${isActive
                        ? 'bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/40 scale-105'
                        : 'bg-white/60 text-gray-600 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-lg hover:scale-102'
                    }
        `}
            >
                {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                )}
                <span className={`text-3xl transition-all duration-300 relative z-10 ${isActive ? 'scale-110 drop-shadow-lg' : 'group-hover:scale-110'
                    }`}>
                    {tab.icon}
                </span>
                <span className="relative z-10 uppercase tracking-wider text-xs font-black">{tab.label}</span>
            </button>
        );
    };

    return (
        <div className="animate-fade-in-up w-full">
            {/* TAB NAVIGATION */}
            <div className="mb-10 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-[2.5rem] blur-xl" />
                <div className="relative bg-white/50 backdrop-blur-md p-2 rounded-[2.5rem] shadow-lg border border-white/80 flex gap-3 justify-center">
                    {tabs.map(tab => (
                        <TabButton key={tab.id} tab={tab} />
                    ))}
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="min-h-[600px]">
                {activeTab === 'orders' && <OrderManager highlightOrderId={highlightOrderId} />}
                {activeTab === 'payments' && <PaymentManager />}
                {activeTab === 'reviews' && <ReviewList />}
            </div>
        </div>
    );
};

export default OrderHub;

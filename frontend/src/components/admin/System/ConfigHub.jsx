import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductManager from '../ProductManagement/ProductManager';
import CategoryBrandManager from '../ProductManagement/CategoryBrandManager';
import VoucherManager from '../ProductManagement/VoucherManager';

const ConfigHub = () => {
    const [searchParams] = useSearchParams();
    const initialTab = searchParams.get('tab') || 'products';
    const initialSearch = searchParams.get('search') || '';
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) setActiveTab(tab);
    }, [searchParams]);

    const tabs = [
        { id: 'products', label: 'Sản Phẩm', icon: '🚲' },
        { id: 'categories', label: 'Thương Hiệu & Danh Mục', icon: '🏷️' },
        { id: 'vouchers', label: 'Voucher', icon: '🎟️' }
    ];

    const TabButton = ({ tab }) => {
        const isActive = activeTab === tab.id;
        return (
            <button
                onClick={() => setActiveTab(tab.id)}
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
        <div className="animate-fade-in-up">
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
                {activeTab === 'products' && <ProductManager initialSearch={initialSearch} />}
                {activeTab === 'categories' && <CategoryBrandManager />}
                {activeTab === 'vouchers' && <VoucherManager />}
            </div>
        </div>
    );
};

export default ConfigHub;

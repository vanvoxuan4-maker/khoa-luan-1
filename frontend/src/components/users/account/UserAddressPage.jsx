import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddressManager from '../profile/AddressManager';

const UserAddressPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '40px 24px',
            minHeight: '100vh',
            boxSizing: 'border-box',
            background: '#fff', // Màu nền trắng trung tính để làm nổi bật card
        }}>
            {/* 🆕 Premium Header Section (Matches Image Design) */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                itemsAlign: 'center',
                marginBottom: '12px',
                position: 'relative'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {/* Orange Vertical Bar */}
                    <div style={{
                        width: '6px',
                        height: '32px',
                        background: '#f59e0b',
                        borderRadius: '4px'
                    }} />

                    <div>
                        <h1 style={{
                            margin: 0,
                            fontSize: '28px',
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            background: 'linear-gradient(90deg, #2563eb 0%, #d946ef 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Sổ địa chỉ
                        </h1>
                        <p style={{
                            margin: '4px 0 0',
                            fontSize: '14px',
                            color: '#64748b',
                            fontWeight: '500'
                        }}>
                            Quản lý thông tin giao hàng của bạn.
                        </p>
                    </div>
                </div>

                {/* Styled Back Button (Matches Image) */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button
                        onClick={() => navigate('/profile')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 24px',
                            background: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '800',
                            color: '#2563eb',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = '#f8fafc';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = '#fff';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <span style={{ fontSize: '16px' }}>←</span> QUAY LẠI
                    </button>
                </div>
            </div>

            {/* Horizontal Divider Line */}
            <div style={{
                height: '2px',
                background: '#1a1a1a',
                width: '100%',
                marginBottom: '32px'
            }} />

            {/* Main Content (List of Addresses) */}
            <AddressManager />
        </div>
    );
};

const BackBtn = ({ onClick }) => {
    const [h, setH] = React.useState(false);
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setH(true)}
            onMouseLeave={() => setH(false)}
            style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                marginBottom: '20px',
                padding: '7px 14px',
                background: h ? '#f1f5f9' : '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '13px', fontWeight: '600', color: '#475569',
                cursor: 'pointer',
                transition: 'all .15s',
            }}>
            ← Quay lại hồ sơ
        </button>
    );
};

export default UserAddressPage;

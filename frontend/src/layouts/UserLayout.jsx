import React from 'react';
import Navbar from '../components/users/layouts/Navbar';
import Footer from '../components/users/layouts/Footer';
import ChatWidget from '../components/users/chat/ChatWidget';
import { useIsInactive } from '../utils/auth';

const UserLayout = ({ children, noContainer = false }) => {
  const isInactive = useIsInactive();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <Navbar />
      {isInactive && (
        <div className="w-full bg-amber-400 text-amber-900 text-sm font-bold text-center py-2.5 px-4 flex items-center justify-center gap-2 shadow-sm">
          <span>⚠️</span>
          <span>
            Tài khoản của bạn đang chờ kích hoạt — một số tính năng bị hạn chế.
            Liên hệ Hotline <strong>0961.178.265</strong> để được hỗ trợ.
          </span>
        </div>
      )}
      <main className={`flex-grow ${noContainer ? "" : "container mx-auto px-4 py-8"}`}>
        {children}
      </main>
      <ChatWidget />
      <Footer />
    </div>
  );
};

export default UserLayout;
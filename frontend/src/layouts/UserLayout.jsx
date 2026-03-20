import React from 'react';
import Navbar from '../components/users/layouts/Navbar';
import Footer from '../components/users/layouts/Footer';
import ChatWidget from '../components/users/chat/ChatWidget';

const UserLayout = ({ children, noContainer = false }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <main className={`flex-grow ${noContainer ? "" : "container mx-auto px-4 py-8"}`}>
        {children}
      </main>
      <ChatWidget />
      <Footer />
    </div>
  );
};

export default UserLayout;
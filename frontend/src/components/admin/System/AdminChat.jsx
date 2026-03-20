import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import API_BASE_URL from '../../../utils/apiConfig';

const AdminChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [showSessions, setShowSessions] = useState(false);
  const messagesEndRef = useRef(null);
  const isFirstLoad = useRef(true);
  const token = localStorage.getItem('admin_access_token');

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (isOpen) {
      isFirstLoad.current = true;
      fetchHistory(activeSessionId);
      fetchSessions();
    }
  }, [isOpen]);

  useEffect(() => {
    if (messages.length > 0) {
      if (isFirstLoad.current) {
        scrollToBottom("auto");
        isFirstLoad.current = false;
      } else {
        scrollToBottom("smooth");
      }
    }
  }, [messages]);

  const fetchSessions = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/chat-sessions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách phiên chat", err);
    }
  };

  const fetchHistory = async (sessionId) => {
    try {
      const url = sessionId 
        ? `${API_BASE_URL}/admin/chat-history?session_id=${sessionId}`
        : `${API_BASE_URL}/admin/chat-history`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Lỗi tải lịch sử chat", err);
    }
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
    localStorage.removeItem('admin_chat_session_id');
    setMessages([]);
    setShowSessions(false);
    fetchSessions(); // Làm mới danh sách lịch sử để thấy session vừa kết thúc
  };

  const loadSession = (sessionId) => {
    setActiveSessionId(sessionId);
    localStorage.setItem('admin_chat_session_id', sessionId);
    fetchHistory(sessionId);
    setShowSessions(false);
  };

  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation();
    if (!window.confirm("Admin có chắc chắn muốn xóa cuộc trò chuyện này không?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/admin/chat-session/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (activeSessionId === sessionId) {
        handleNewChat();
      } else {
        fetchSessions();
      }
    } catch (err) {
      console.error("Lỗi khi xóa phiên chat admin", err);
      alert("Lỗi khi xóa!");
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', message: input, thoi_gian: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const url = activeSessionId 
        ? `${API_BASE_URL}/admin/chat?session_id=${activeSessionId}`
        : `${API_BASE_URL}/admin/chat`;
      
      const res = await axios.post(url,
        { message: userMsg.message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const aiReply = res.data;
      setMessages(prev => [...prev, aiReply]);
      
      if (!activeSessionId && aiReply.session_id) {
        setActiveSessionId(aiReply.session_id);
        localStorage.setItem('admin_chat_session_id', aiReply.session_id);
        fetchSessions();
      }
    } catch (err) {
      alert("AI đang bận hoặc lỗi kết nối!");
    } finally {
      setIsLoading(false);
    }
  };

  // --- LOGO SVG: Tinh vân Trí tuệ ---
  const CosmicLogoWhite = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3" opacity="0.6" />
      <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 14L10 12L12 10L14 12L12 14Z" fill="currentColor" />
      <path d="M12 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 18V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2 12H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );

  const CosmicLogoPurple = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3" />
      <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 14L10 12L12 10L14 12L12 14Z" fill="#6D28D9" />
      <path d="M12 2V6" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 18V22" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2 12H6" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 12H22" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end font-sans antialiased">

      {/* 1. NÚT MỞ CHAT */}
      {!isOpen && (
        <>
          {/* Hiệu ứng gợn sóng (Pulsing Ripples) */}
          <div className="fixed bottom-6 right-6 w-16 h-16 pointer-events-none z-0">
            <div className="absolute inset-0 bg-purple-500 rounded-full animate-ripple"></div>
            <div className="absolute inset-0 bg-purple-500 rounded-full animate-ripple [animation-delay:1s]"></div>
          </div>
          <button
            onClick={() => {
              const nextState = !isOpen;
              if (nextState) {
                handleNewChat(); // Bắt đầu phiên mới mỗi khi mở chatbot admin
              }
              setIsOpen(nextState);
            }}
            className="group w-16 h-16 bg-gradient-to-br from-[#4C1D95] via-[#7C3AED] to-[#D946EF] rounded-full shadow-[0_4px_20px_rgba(124,58,237,0.5)] flex items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer border-[3px] border-[#E9D5FF] overflow-hidden relative z-10"
          >
            <CosmicLogoWhite className="h-9 w-9 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] group-hover:rotate-[20deg] transition-transform duration-500" />
          </button>
        </>
      )}

      {/* 2. CỬA SỔ CHAT */}
      {isOpen && (
        <div className="w-[400px] h-[650px] bg-white border border-[#D8B4FE] rounded-2xl shadow-[0_20px_60px_rgba(76,29,149,0.25)] flex flex-col overflow-hidden animate-fade-in-up ring-1 ring-[#A78BFA]/40">

          {/* VIEW CHÍNH / LỊCH SỬ */}
          {!showSessions ? (
            <>
              {/* HEADER */}
              <div className="bg-gradient-to-r from-[#2E1065] via-[#5B21B6] to-[#9333EA] p-4 flex justify-between items-center shrink-0 relative shadow-md z-20">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                <div className="flex items-center gap-2 relative z-10">
                  <button onClick={() => setShowSessions(true)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white" title="Lịch sử chat">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </button>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                      <CosmicLogoWhite className="w-5 h-5 text-[#E9D5FF]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-[14px] truncate max-w-[150px]">
                        {activeSessionId ? (sessions.find(s => s.session_id === activeSessionId)?.title || "Đang chat...") : "AI Galaxy Admin"}
                      </h3>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full animate-pulse"></span>
                        <p className="text-[10px] text-[#4ade80]">Online</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 relative z-10">
                  <button onClick={handleNewChat} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white" title="Chat mới">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </button>
                </div>
              </div>

              {/* BODY (Messages) */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#FAF5FF] custom-scrollbar">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-[#7C3AED] space-y-5 opacity-80">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-[#E9D5FF]">
                      <CosmicLogoPurple className="w-12 h-12" />
                    </div>
                    <div className="text-center">
                      <p className="text-md font-bold text-[#5B21B6]">Xin chào Admin!</p>
                      <button onClick={() => setShowSessions(true)} className="mt-2 text-xs text-purple-600 hover:underline">Xem lịch sử chat cũ</button>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 w-full px-4">
                      <button onClick={() => setInput("Doanh thu hôm nay")} className="px-3 py-2 bg-white rounded-lg text-[10px] font-semibold text-[#6D28D9] shadow-sm border border-[#DDD6FE] hover:bg-[#F3E8FF]">Doanh thu hôm nay?</button>
                      <button onClick={() => setInput("Sản phẩm nào bán chạy nhất?")} className="px-3 py-2 bg-white rounded-lg text-[10px] font-semibold text-[#6D28D9] shadow-sm border border-[#DDD6FE] hover:bg-[#F3E8FF]">Top sản phẩm</button>
                    </div>
                  </div>
                )}

                {messages.map((msg, index) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div key={index} className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                      {!isUser && (
                        <div className="w-7 h-7 rounded-full bg-white border border-[#C4B5FD] flex items-center justify-center shrink-0 shadow-sm mt-1">
                          <CosmicLogoPurple className="w-4 h-4" />
                        </div>
                      )}
                      
                      <div className={`max-w-[75%] p-3 rounded-xl text-[14px] leading-relaxed whitespace-pre-line shadow-sm ${isUser
                        ? 'bg-gradient-to-r from-[#6D28D9] to-[#9333EA] text-white rounded-br-none'
                        : 'bg-white text-slate-700 border border-[#E9D5FF] rounded-bl-none'
                        }`}>
                        {msg.message}
                      </div>

                      {isUser && (
                        <div className="w-7 h-7 rounded-full bg-[#6D28D9] flex items-center justify-center shrink-0 mt-1 shadow-sm border border-white/20">
                          <UserCircleIcon className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
                {isLoading && (
                   <div className="flex justify-start gap-2">
                     <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0 border border-[#E9D5FF]">...</div>
                     <div className="bg-white px-4 py-2 rounded-xl rounded-bl-none border border-[#E9D5FF] shadow-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                     </div>
                   </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* FOOTER */}
              <div className="p-4 bg-white border-t border-[#E9D5FF] flex gap-2 relative z-20">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 bg-[#F5F3FF] border border-[#DDD6FE] rounded-lg px-4 py-2 text-[#4C1D95] text-[14px] outline-none focus:border-[#8B5CF6]"
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-[#6D28D9] to-[#D946EF] text-white w-10 h-10 rounded-lg transition-all shadow-md flex items-center justify-center"
                >
                   <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </>
          ) : (
            /* VIEW DANH SÁCH PHIÊN */
            <div className="flex flex-col h-full bg-slate-50">
               <div className="p-4 bg-white border-b border-purple-100 flex items-center gap-3">
                 <button onClick={() => setShowSessions(false)} className="p-2 hover:bg-purple-50 rounded-lg transition-colors">
                   <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                 </button>
                 <h3 className="font-bold text-slate-800">Lịch sử AI Admin</h3>
               </div>
               
               <div className="flex-grow overflow-y-auto p-3 space-y-2">
                 <button onClick={handleNewChat} className="w-full p-3 rounded-xl border-2 border-dashed border-purple-200 text-purple-600 hover:bg-purple-50 transition-all font-medium flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Cuộc trò chuyện mới
                 </button>

                 {sessions.map(s => (
                   <div 
                    key={s.session_id} 
                    className={`group relative w-full flex items-center mb-2`}
                   >
                     <button 
                      onClick={() => loadSession(s.session_id)}
                      className={`flex-grow text-left p-4 rounded-xl transition-all border ${activeSessionId === s.session_id ? 'bg-purple-600 text-white border-purple-600 shadow-lg' : 'bg-white text-slate-700 border-slate-100 hover:border-purple-200 hover:shadow-sm'}`}
                     >
                       <p className="font-bold text-[13px] truncate pr-8">{s.title || "Cuộc trò chuyện"}</p>
                       <p className={`text-[10px] mt-1 ${activeSessionId === s.session_id ? 'text-purple-100' : 'text-slate-400'}`}>
                          {new Date(s.last_active).toLocaleString('vi-VN')}
                       </p>
                     </button>
                     <button
                      onClick={(e) => handleDeleteSession(e, s.session_id)}
                      className={`absolute right-3 p-2 rounded-lg transition-all ${
                        activeSessionId === s.session_id 
                          ? 'text-purple-200 hover:bg-white/20 hover:text-white' 
                          : 'text-slate-300 hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100'
                      }`}
                      title="Xóa phiên"
                     >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                     </button>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>
      )}
      <style>{`
        @keyframes ripple { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(2.2); opacity: 0; } }
        .animate-ripple { animation: ripple 3s infinite cubic-bezier(0, 0, 0.2, 1); }
        .animate-fade-in-up { animation: fade-in-up 0.4s ease-out; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E9D5FF; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AdminChat;
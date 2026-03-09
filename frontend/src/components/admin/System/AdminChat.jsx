import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../utils/apiConfig';

const AdminChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem('admin_access_token');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) fetchHistory();
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/chat-history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Lỗi tải lịch sử chat", err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', message: input, thoi_gian: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/admin/chat`,
        { message: userMsg.message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(prev => [...prev, res.data]);
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
        <button
          onClick={() => setIsOpen(true)}
          className="group w-16 h-16 bg-gradient-to-br from-[#4C1D95] via-[#7C3AED] to-[#D946EF] rounded-full shadow-[0_4px_20px_rgba(124,58,237,0.5)] flex items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer border-[3px] border-[#E9D5FF] overflow-hidden"
        >
          <CosmicLogoWhite className="h-9 w-9 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] group-hover:rotate-[20deg] transition-transform duration-500" />
        </button>
      )}

      {/* 2. CỬA SỔ CHAT */}
      {isOpen && (
        <div className="w-[400px] h-[650px] bg-white border border-[#D8B4FE] rounded-2xl shadow-[0_20px_60px_rgba(76,29,149,0.25)] flex flex-col overflow-hidden animate-fade-in-up ring-1 ring-[#A78BFA]/40">

          {/* HEADER */}
          <div className="bg-gradient-to-r from-[#2E1065] via-[#5B21B6] to-[#9333EA] p-4 flex justify-between items-center shrink-0 relative shadow-md z-20">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-11 h-11 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-inner">
                <CosmicLogoWhite className="w-6 h-6 text-[#E9D5FF]" />
              </div>
              <div>
                <h3 className="font-bold text-white text-[16px] tracking-wide drop-shadow-sm">AI Galaxy Admin</h3>

                {/* 👇 KHU VỰC TRẠNG THÁI ONLINE ĐÃ SỬA MÀU XANH LÁ CÂY 👇 */}
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2.5 w-2.5">
                    {/* Vòng sóng tỏa ra: Màu xanh lá (#4ade80) */}
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-75"></span>
                    {/* Chấm tròn tĩnh: Màu xanh lá đậm hơn (#22c55e) */}
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22c55e] border border-white"></span>
                  </span>
                  {/* Chữ Trực tuyến: Màu xanh lá sáng (#4ade80) */}
                  <p className="text-[12px] text-[#4ade80] font-medium">Trực tuyến</p>
                </div>
                {/* 👆 KẾT THÚC CHỈNH SỬA 👆 */}

              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="relative z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm border border-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#FAF5FF] custom-scrollbar">

            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-[#7C3AED] space-y-5 opacity-80">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border border-[#E9D5FF]">
                  <CosmicLogoPurple className="w-14 h-14 drop-shadow-sm" />
                </div>
                <div className="text-center px-6">
                  <p className="text-lg font-bold text-[#5B21B6]">Xin chào Admin!</p>
                  <p className="text-[14px] mt-2 text-[#6D28D9]">Không gian làm việc đã sẵn sàng.<br />Tôi có thể giúp gì cho bạn?</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 w-full px-4">
                  <button onClick={() => setInput("Doanh thu hôm nay")} className="px-3 py-2 bg-white rounded-lg text-xs font-semibold text-[#6D28D9] shadow-sm border border-[#DDD6FE] hover:bg-[#F3E8FF] transition-colors hover:scale-105 transform duration-200">💰 Doanh thu hôm nay?</button>
                  <button onClick={() => setInput("Phân tích xu hướng 7 ngày qua")} className="px-3 py-2 bg-white rounded-lg text-xs font-semibold text-[#6D28D9] shadow-sm border border-[#DDD6FE] hover:bg-[#F3E8FF] transition-colors hover:scale-105 transform duration-200">📈 Xu hướng kinh doanh</button>
                  <button onClick={() => setInput("Sản phẩm nào bán chạy nhất?")} className="px-3 py-2 bg-white rounded-lg text-xs font-semibold text-[#6D28D9] shadow-sm border border-[#DDD6FE] hover:bg-[#F3E8FF] transition-colors hover:scale-105 transform duration-200">🔥 Top sản phẩm</button>
                  <button onClick={() => setInput("Có bao nhiêu khách hàng?")} className="px-3 py-2 bg-white rounded-lg text-xs font-semibold text-[#D946EF] shadow-sm border border-[#F0ABFC] hover:bg-[#FDF4FF] transition-colors hover:scale-105 transform duration-200">👥 Thống kê khách hàng</button>
                  <button onClick={() => setInput("Sản phẩm sắp hết hàng")} className="px-3 py-2 bg-white rounded-lg text-xs font-semibold text-[#D946EF] shadow-sm border border-[#F0ABFC] hover:bg-[#FDF4FF] transition-colors hover:scale-105 transform duration-200">⚠️ Cảnh báo tồn kho</button>
                  <button onClick={() => setInput("Làm thế nào để tăng doanh số?")} className="px-3 py-2 bg-white rounded-lg text-xs font-semibold text-[#8B5CF6] shadow-sm border border-[#C4B5FD] hover:bg-[#F5F3FF] transition-colors hover:scale-105 transform duration-200">💡 Tư vấn kinh doanh</button>
                  <button onClick={() => setInput("Viết mô tả cho xe đạp địa hình")} className="px-3 py-2 bg-white rounded-lg text-xs font-semibold text-[#8B5CF6] shadow-sm border border-[#C4B5FD] hover:bg-[#F5F3FF] transition-colors hover:scale-105 transform duration-200">📝 Viết content</button>
                </div>
              </div>
            )}

            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start gap-3'}`}>
                  {!isUser && (
                    <div className="w-9 h-9 rounded-full bg-white border border-[#C4B5FD] flex items-center justify-center shrink-0 shadow-sm mt-1">
                      <CosmicLogoPurple className="w-5 h-5" />
                    </div>
                  )}
                  <div className={`max-w-[85%] p-4 rounded-2xl text-[15px] leading-relaxed whitespace-pre-line shadow-sm ${isUser
                    ? 'bg-gradient-to-r from-[#6D28D9] to-[#9333EA] text-white rounded-br-none shadow-[#8B5CF6]/30'
                    : 'bg-white text-slate-700 border border-[#E9D5FF] rounded-bl-none shadow-[0_2px_8px_rgba(124,58,237,0.05)]'
                    }`}>
                    {msg.message}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start gap-3">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 border border-[#E9D5FF]">...</div>
                <div className="bg-white px-5 py-3 rounded-2xl rounded-bl-none border border-[#E9D5FF] shadow-sm flex items-center gap-2">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-[#8B5CF6] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#D946EF] rounded-full animate-bounce delay-150"></div>
                    <div className="w-2 h-2 bg-[#8B5CF6] rounded-full animate-bounce delay-300"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* FOOTER */}
          <div className="p-4 bg-white border-t border-[#E9D5FF] flex gap-3 relative z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Nhập tin nhắn..."
              className="flex-1 bg-[#F5F3FF] border border-[#DDD6FE] rounded-xl px-4 py-3 text-[#4C1D95] text-[15px] outline-none focus:border-[#8B5CF6] focus:bg-white focus:ring-2 focus:ring-[#8B5CF6]/20 transition-all placeholder:text-[#A78BFA]"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-[#6D28D9] to-[#D946EF] hover:from-[#5B21B6] hover:to-[#C026D3] text-white w-12 h-12 rounded-xl transition-all shadow-md shadow-[#D946EF]/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90 drop-shadow-sm" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChat;
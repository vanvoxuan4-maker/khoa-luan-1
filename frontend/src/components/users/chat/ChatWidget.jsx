import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  UserCircleIcon,
  SparklesIcon,
  PlusIcon,
  ClockIcon,
  ChevronLeftIcon,
  TrashIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import API_BASE_URL from '../../../utils/apiConfig';
import { getBestToken } from '../../../utils/auth';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null); // Luôn bắt đầu null khi load trang
  const [showSessions, setShowSessions] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef(null);
  const scrollRef = useRef(null);
  
  const token = getBestToken();
  
  // Helper hỗ trợ sửa link nếu AI lỡ gửi tên miền ảo
  const fixUrl = (url) => {
    if (url && url.includes('bikeshop.vn')) {
      return url.replace(/https?:\/\/bikeshop\.vn/, '');
    }
    return url;
  };

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollBtn(false);
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // Nếu cách đáy hơn 100px thì hiện nút
    const isFarFromBottom = scrollHeight - scrollTop - clientHeight > 100;
    setShowScrollBtn(isFarFromBottom);
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      if (token) {
        if (messages.length === 0) fetchHistory(activeSessionId);
        fetchSessions();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchSessions = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/chat/customer/sessions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions(res.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách phiên chat:", error);
    }
  };

  const fetchHistory = async (sessionId) => {
    if (!token) return;
    try {
      const url = sessionId 
        ? `${API_BASE_URL}/chat/customer/history?session_id=${sessionId}`
        : `${API_BASE_URL}/chat/customer/history`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (error) {
      console.error("Lỗi lấy lịch sử chat:", error);
    }
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
    localStorage.removeItem('chat_session_id');
    setMessages([]);
    setShowSessions(false);
    fetchSessions(); // Đồng bộ danh sách lịch sử khi tạo chat mới
  };

  const loadSession = (sessionId) => {
    setActiveSessionId(sessionId);
    localStorage.setItem('chat_session_id', sessionId);
    fetchHistory(sessionId);
    setShowSessions(false);
  };
  
  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation(); // Ngăn việc tải session khi bấm nút xóa
    if (!window.confirm("Bạn có chắc chắn muốn xóa cuộc trò chuyện này không?")) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/chat/customer/session/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Nếu xóa session đang active, reset về trạng thái mới
      if (activeSessionId === sessionId) {
        handleNewChat();
      } else {
        fetchSessions(); // Tải lại danh sách
      }
    } catch (error) {
      console.error("Lỗi khi xóa phiên chat:", error);
      alert("Không thể xóa cuộc trò chuyện lúc này.");
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!token) {
        setMessages(prev => [...prev, {
            role: 'assistant',
            message: 'Chào bạn! Bạn vui lòng đăng nhập để mình có thể hỗ trợ tra cứu đơn hàng và tư vấn kỹ hơn nhé! 😊',
            thoi_gian: new Date().toISOString()
        }]);
        setInput('');
        return;
    }

    const userMsg = { role: 'user', message: input, thoi_gian: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const url = activeSessionId 
        ? `${API_BASE_URL}/chat/customer?session_id=${activeSessionId}`
        : `${API_BASE_URL}/chat/customer`;
      
      const res = await axios.post(url, { message: input }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const aiReply = res.data;
      setMessages(prev => [...prev, aiReply]);
      
      // Nếu là session mới, cập nhật activeSessionId và reload sessions list
      if (!activeSessionId && aiReply.session_id) {
        setActiveSessionId(aiReply.session_id);
        localStorage.setItem('chat_session_id', aiReply.session_id);
        fetchSessions();
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        message: 'Xin lỗi, hệ thống AI đang bận một chút. Bạn thử lại sau nhé! 😅',
        thoi_gian: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm render tin nhắn với Link và Định dạng In đậm
  const renderMessage = (text, role) => {
    if (!text) return null;
    
    // 1. Phân tách link (Sản phẩm, URL, Đơn hàng, hoặc Markdown Link [text](url))
    const linkRegex = /(\[.*?\]\((?:https?:\/\/[^\s]+?|\/(?:products|my-orders)\/\d+)\)|https?:\/\/[^\s]+?|\/(?:products|my-orders)\/\d+)/g;
    const parts = text.split(linkRegex);

    return parts.map((part, index) => {
      if (!part) return null;
      
      // Nếu là markdown link [text](url) - hỗ trợ cả http và relative path (products/orders)
      const mdLinkMatch = part.match(/^\[(.*?)\]\((https?:\/\/[^\s]+?|\/(?:products|my-orders)\/\d+)\)$/);
      if (mdLinkMatch) {
        const url = fixUrl(mdLinkMatch[2]);
        const display = mdLinkMatch[1];
        const isInternal = !url.startsWith('http');
        
        return isInternal ? (
          <Link key={index} to={url} className="text-blue-200 hover:text-white underline font-bold transition-colors">
            {display}
          </Link>
        ) : (
          <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white underline font-bold transition-colors">
            {display}
          </a>
        );
      }
      
      // Nếu là link sản phẩm (path tương đối)
      if (part.startsWith('/products/')) {
        return (
          <Link key={index} to={part} className="text-blue-200 hover:text-white underline font-bold transition-colors">
            {part}
          </Link>
        );
      }
      
      // Nếu là URL bên ngoài (không có markdown)
      if (part.match(/^https?:\/\//)) {
        const url = fixUrl(part);
        const isInternal = !url.startsWith('http');

        return isInternal ? (
          <Link key={index} to={url} className="text-blue-200 hover:text-white underline font-bold transition-colors">
            {url}
          </Link>
        ) : (
          <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white underline font-bold transition-colors">
            {url}
          </a>
        );
      }

      // 2. Xử lý in đậm cho các phần văn bản thường (**text**)
      const boldRegex = /(\*\*.*?\*\*)/g;
      const subParts = part.split(boldRegex);
      
      return subParts.map((subPart, subIndex) => {
        if (subPart.startsWith('**') && subPart.endsWith('**')) {
          return (
            <strong 
              key={`${index}-${subIndex}`} 
              className={`font-bold ${role === 'user' ? 'text-white' : 'text-blue-600'}`}
            >
              {subPart.slice(2, -2)}
            </strong>
          );
        }
        return subPart;
      });
    });
  };

  const getActiveTitle = () => {
    if (!activeSessionId) return "Chat với AI";
    const current = sessions.find(s => s.session_id === activeSessionId);
    return current ? current.title : "Đang trò chuyện...";
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans group">
      {/* Hiệu ứng gợn sóng (Pulsing Ripples) */}
      {!isOpen && (
        <div className="absolute bottom-0 right-0 w-14 h-14 pointer-events-none">
          <div className="absolute inset-0 bg-blue-500 rounded-full animate-ripple"></div>
          <div className="absolute inset-0 bg-blue-500 rounded-full animate-ripple [animation-delay:1s]"></div>
        </div>
      )}

      {/* Nút Chat Nổi */}
      <button
        onClick={() => {
          const nextState = !isOpen;
          if (nextState) {
            handleNewChat(); // Bắt đầu phiên mới mỗi khi mở chatbot
          }
          setIsOpen(nextState);
        }}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 z-10 ${
          isOpen ? 'bg-slate-800 rotate-180' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isOpen ? <XMarkIcon className="w-8 h-8 text-white" /> : <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />}
      </button>

      {/* Cửa Sổ Chat */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[400px] max-h-[calc(100vh-100px)] h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-slide-up origin-bottom-right">
          
          {/* View chính (Messages) */}
          {!showSessions ? (
            <>
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <button onClick={() => setShowSessions(true)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors" title='Lịch sử chat'>
                    <ClockIcon className="w-5 h-5" />
                  </button>
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-base truncate max-w-[180px]">{getActiveTitle()}</h3>
                    <p className="text-[10px] text-blue-100 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                      AI Support Online
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={handleNewChat} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors" title="Chat mới">
                    <PlusIcon className="w-5 h-5" />
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Vùng Tin Nhắn và Nút Cuộn */}
              <div className="flex-grow relative overflow-hidden flex flex-col bg-slate-50">
                {/* List Tin Nhắn */}
                <div 
                  ref={scrollRef}
                  onScroll={handleScroll}
                  className="flex-grow overflow-y-auto p-4 space-y-4"
                >
                  {messages.length === 0 && !isLoading && (
                    <div className="text-center py-10 px-6">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <SparklesIcon className="w-8 h-8 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-slate-800">Bắt đầu trò chuyện! 🚲</h4>
                      <p className="text-sm text-slate-500 mt-2">
                        Đặt câu hỏi về thông số xe, giá cả hoặc tra cứu đơn hàng của bạn.
                      </p>
                      {token && (
                        <button 
                          onClick={() => setShowSessions(true)}
                          className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-bold block mx-auto underline"
                        >
                          Xem lịch sử trò chuyện cũ
                        </button>
                      )}
                      <button 
                        onClick={() => setInput("Chào bạn, mình muốn tìm một chiếc xe đạp leo núi tầm giá 10-15 triệu.")}
                        className="mt-4 text-xs bg-white border border-blue-200 text-blue-600 px-3 py-2 rounded-full hover:bg-blue-50 transition-colors"
                      >
                        "Tìm xe đạp leo núi..."
                      </button>
                    </div>
                  )}

                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}>
                      {/* Ảnh đại diện (Avatar) */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                        msg.role === 'user' ? 'bg-blue-100 border border-blue-200' : 'bg-indigo-100 border border-indigo-200'
                      }`}>
                        {msg.role === 'user' ? (
                          <UserCircleIcon className="w-5 h-5 text-blue-600" />
                        ) : (
                          <SparklesIcon className="w-4 h-4 text-indigo-600" />
                        )}
                      </div>

                      {/* Khung tin nhắn */}
                      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                          msg.role === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
                        }`}>
                        <p className="whitespace-pre-wrap">{renderMessage(msg.message, msg.role)}</p>
                        <span className={`text-[10px] mt-1 block opacity-70 ${msg.role === 'user' ? 'text-white' : 'text-slate-400'}`}>
                          {new Date(msg.thoi_gian).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex items-end gap-2 animate-fade-in">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center flex-shrink-0">
                        <SparklesIcon className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Nút Cuộn Xuống Nhanh (Cố định so với vùng tin nhắn) */}
                {showScrollBtn && (
                  <button
                    onClick={scrollToBottom}
                    className="absolute bottom-6 right-6 w-11 h-11 bg-white border border-blue-100 rounded-full shadow-2xl flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-all hover:scale-110 active:scale-95 animate-fade-in z-20 group/scroll"
                    title="Cuộn xuống cuối"
                  >
                    <ChevronDownIcon className="w-6 h-6 group-hover/scroll:translate-y-0.5 transition-transform" />
                  </button>
                )}
              </div>

              {/* Input Box */}
              <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-white">
                <div className="relative flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Nhập nội dung cần hỗ trợ..."
                    className="flex-grow bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none pr-12"
                  />
                  <button type="submit" disabled={!input.trim() || isLoading} className={`absolute right-1 w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                      input.trim() && !isLoading ? 'text-blue-600 hover:bg-blue-50' : 'text-slate-300'
                    }`}>
                    <PaperAirplaneIcon className="w-6 h-6" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            // View Lịch sử (Sessions)
            <div className="flex flex-col h-full bg-slate-50 animate-slide-left">
              <div className="p-4 bg-white border-b border-slate-200 flex items-center gap-3">
                <button onClick={() => setShowSessions(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <ChevronLeftIcon className="w-5 h-5 text-slate-600" />
                </button>
                <h3 className="font-bold text-slate-800">Lịch sử trò chuyện</h3>
              </div>
              
              <div className="flex-grow overflow-y-auto p-2 space-y-1">
                <button 
                  onClick={handleNewChat}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-blue-200 text-blue-600 hover:bg-blue-50 transition-all text-sm font-medium mb-4"
                >
                  <PlusIcon className="w-5 h-5" />
                  Bắt đầu cuộc trò chuyện mới
                </button>

                {sessions.length === 0 ? (
                  <div className="text-center py-10 opacity-50">
                    <ClockIcon className="w-10 h-10 mx-auto mb-2" />
                    <p className="text-sm">Chưa có lịch sử</p>
                  </div>
                ) : (
                  sessions.map((s) => (
                    <button
                      key={s.session_id}
                      onClick={() => loadSession(s.session_id)}
                      className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 group ${
                        activeSessionId === s.session_id 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${activeSessionId === s.session_id ? 'bg-white/20' : 'bg-blue-50 group-hover:bg-blue-100'}`}>
                        <ChatBubbleLeftRightIcon className={`w-4 h-4 ${activeSessionId === s.session_id ? 'text-white' : 'text-blue-600'}`} />
                      </div>
                      <div className="overflow-hidden flex-grow">
                        <p className="text-sm font-medium truncate">{s.title || "Cuộc trò chuyện mới"}</p>
                        <p className={`text-[10px] mt-0.5 ${activeSessionId === s.session_id ? 'text-blue-100' : 'text-slate-400'}`}>
                           Gần đây
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteSession(e, s.session_id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          activeSessionId === s.session_id 
                            ? 'hover:bg-white/20 text-white/70 hover:text-white' 
                            : 'hover:bg-red-50 text-slate-300 hover:text-red-500'
                        }`}
                        title="Xóa cuộc trò chuyện"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
      
      <style>{`
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes slide-left { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fade-in { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ripple { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(2.2); opacity: 0; } }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .animate-slide-left { animation: slide-left 0.2s ease-out; }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-ripple { animation: ripple 3s infinite cubic-bezier(0, 0, 0.2, 1); }
      `}</style>
    </div>
  );
};

export default ChatWidget;

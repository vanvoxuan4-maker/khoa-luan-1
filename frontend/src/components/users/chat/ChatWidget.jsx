import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  UserCircleIcon,
  PlusIcon,
  ClockIcon,
  ChevronLeftIcon,
  TrashIcon,
  ChevronDownIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import API_BASE_URL from '../../../utils/apiConfig';
import { getBestToken } from '../../../utils/auth';
import TypewriterText from './TypewriterText';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null); 
  const [showSessions, setShowSessions] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [isWide, setIsWide] = useState(false);
  const messagesEndRef = useRef(null);
  const scrollRef = useRef(null);
  const isFirstLoad = useRef(true);
  
  const token = getBestToken();
  
  // Helper hỗ trợ sửa link nếu AI lỡ gửi tên miền ảo
  const fixUrl = (url) => {
    if (url && url.includes('bikeshop.vn')) {
      return url.replace(/https?:\/\/bikeshop\.vn/, '');
    }
    return url;
  };

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  const scrollToBottom = (behavior = "smooth") => {
    const scrollBehavior = typeof behavior === 'string' ? behavior : "smooth";
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: scrollBehavior
      });
    }
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
      isFirstLoad.current = true;
      if (token) {
        if (messages.length === 0) fetchHistory(activeSessionId);
        fetchSessions();
      }
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
      const res = await axios.get(`${API_BASE_URL}/chat/customer/sessions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions(res.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách phiên chat:", error);
    }
  };

  const fetchHistory = async (sessionId) => {
    if (!token || !sessionId) return; // Chỉ tải lịch sử nếu có sessionId cụ thể
    try {
      const url = `${API_BASE_URL}/chat/customer/history?session_id=${sessionId}`;
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
    isFirstLoad.current = true;
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

  const handleSend = async (e, overrideMessage = null) => {
    if (e) e.preventDefault();
    const messageToSend = overrideMessage || input;
    if (!messageToSend.trim() || isLoading) return;
    
    // Clear input if sending from input box
    if (!overrideMessage) setInput('');

    if (!token) {
        setMessages(prev => [...prev, {
            role: 'assistant',
            message: 'Chào bạn! Bạn vui lòng đăng nhập để mình có thể hỗ trợ tra cứu đơn hàng và tư vấn kỹ hơn nhé! 😊',
            thoi_gian: new Date().toISOString()
        }]);
        return;
    }

    const userMsg = { role: 'user', message: messageToSend, thoi_gian: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const url = activeSessionId 
        ? `${API_BASE_URL}/chat/customer?session_id=${activeSessionId}`
        : `${API_BASE_URL}/chat/customer`;
      
      const res = await axios.post(url, { message: messageToSend }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const aiReply = { ...res.data, isNew: true };
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

  // Hàm render tin nhắn hỗ trợ Table, Link và Định dạng In đậm
  const renderMessage = (text, role) => {
    if (!text) return null;

    // ----- A. Xử lý Bảng Markdown (Simplistic Parser) -----
    // Kiểm tra xem có cấu trúc bảng |...| không
    if (text.includes('|') && text.includes('---')) {
        const lines = text.split('\n');
        const tableIndices = [];
        let inTable = false;

        lines.forEach((line, i) => {
            if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
                if (!inTable) {
                    tableIndices.push({ start: i, end: i });
                    inTable = true;
                } else {
                    tableIndices[tableIndices.length - 1].end = i;
                }
            } else {
                inTable = false;
            }
        });

        if (tableIndices.length > 0) {
            // Chỉ xử lý bảng đầu tiên tìm thấy để đơn giản, hoặc map qua tất cả
            // Ở đây ta giả định block tin nhắn chứa bảng
            const result = [];
            let lastIdx = 0;

            tableIndices.forEach((range, tIdx) => {
                // Thêm text trước bảng
                if (range.start > lastIdx) {
                    result.push(<div key={`text-pre-${tIdx}`}>{renderTextContent(lines.slice(lastIdx, range.start).join('\n'), role)}</div>);
                }

                // Render bảng
                const tableLines = lines.slice(range.start, range.end + 1);
                const headers = tableLines[0].split('|').filter(c => c.trim()).map(c => c.trim());
                const rows = tableLines.slice(2).filter(l => l.includes('|')).map(l => l.split('|').filter(c => c.trim()).map(c => c.trim()));

                result.push(
                    <div key={`table-${tIdx}`} className="my-3 overflow-x-auto border border-slate-200 rounded-lg bg-white shadow-inner">
                        <table className="min-w-full text-[12px] border-collapse">
                            <thead>
                                <tr className="bg-slate-100 border-b border-slate-200">
                                    {headers.map((h, i) => (
                                        <th key={i} className="px-3 py-2 text-left font-black text-slate-700 border-r border-slate-200 last:border-0">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, i) => (
                                    <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                        {row.map((cell, j) => (
                                            <td key={j} className="px-3 py-2 text-slate-600 border-r border-slate-100 last:border-0">{renderTextContent(cell, role)}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
                lastIdx = range.end + 1;
            });

            // Thêm text còn lại
            if (lastIdx < lines.length) {
                result.push(<div key="text-post">{renderTextContent(lines.slice(lastIdx).join('\n'), role)}</div>);
            }

            return result;
        }
    }

    return renderTextContent(text, role);
  };

  // Hàm helper render nội dung text (Link + Bold) - Tách ra từ renderMessage gốc
  const renderTextContent = (text, role) => {
    if (!text) return null;
    const linkRegex = /(\[.*?\]\((?:https?:\/\/[^\s]+?|\/(?:products|my-orders)\/\d+)\)|https?:\/\/[^\s]+?|\/(?:products|my-orders)\/\d+)/g;
    const parts = text.split(linkRegex);

    return parts.map((part, index) => {
      if (!part) return null;
      
      const mdLinkMatch = part.match(/^\[(.*?)\]\((https?:\/\/[^\s]+?|\/(?:products|my-orders)\/\d+)\)$/);
      if (mdLinkMatch) {
        const url = fixUrl(mdLinkMatch[2]);
        const display = mdLinkMatch[1];
        const isInternal = !url.startsWith('http');
        
        return isInternal ? (
          <Link key={index} to={url} className="text-blue-500 hover:text-blue-700 underline font-bold transition-colors">
            {display}
          </Link>
        ) : (
          <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 underline font-bold transition-colors">
            {display}
          </a>
        );
      }
      
      if (part.startsWith('/products/')) {
        return (
          <Link key={index} to={part} className="text-blue-500 hover:text-blue-700 underline font-bold transition-colors">
            {part}
          </Link>
        );
      }
      
      if (part.match(/^https?:\/\//)) {
        const url = fixUrl(part);
        const isInternal = !url.startsWith('http');

        return isInternal ? (
          <Link key={index} to={url} className="text-blue-500 hover:text-blue-700 underline font-bold transition-colors">
            {url}
          </Link>
        ) : (
          <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 underline font-bold transition-colors">
            {url}
          </a>
        );
      }

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
      {/* Nút Chat Nổi (Chỉ hiện khi chưa mở chat) */}
      {!isOpen && (
        <>
          {/* Hiệu ứng gợn sóng (Pulsing Ripples) */}
          <div className="absolute bottom-0 right-0 w-14 h-14 pointer-events-none">
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ripple"></div>
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ripple [animation-delay:1s]"></div>
          </div>

          <button
            onClick={() => {
              handleNewChat(); // Bắt đầu phiên mới mỗi khi mở chatbot
              setIsOpen(true);
            }}
            className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 z-10 bg-blue-600 hover:bg-blue-700"
          >
            <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
          </button>
        </>
      )}

      {/* Cửa Sổ Chat */}
      {isOpen && (
        <div className={`absolute bottom-16 right-0 max-h-[calc(100vh-100px)] h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-slide-up origin-bottom-right transition-all duration-500 ${
          isWide ? 'w-[800px] max-w-[90vw]' : 'w-[400px]'
        }`}>
          
          {/* View chính (Messages) */}
          {!showSessions ? (
            <>
              {/* Header Tối ưu diện tích */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-3 text-white flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2 min-w-0 flex-grow mr-2">
                  {/* AI Avatar */}
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/20 shadow-sm overflow-hidden transform transition-transform hover:scale-105">
                    <img src="/images/banner/ai-avatar.png" alt="AI Avatar" className="w-full h-full object-cover" />
                  </div>

                  <div className="overflow-hidden min-w-0">
                    <h3 className={`font-bold text-sm truncate ${isWide ? 'max-w-[500px]' : 'max-w-[120px]'}`}>{getActiveTitle()}</h3>
                    <p className="text-[10px] text-blue-100 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                      AI Support Online
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 flex-shrink-0">
                  <button onClick={() => setShowSessions(true)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors" title='Lịch sử chat'>
                    <ClockIcon className="w-5 h-5" />
                  </button>
                  <div className="w-[1px] h-4 bg-white/20 mx-1 hidden sm:block"></div>
                  <button onClick={() => setIsWide(!isWide)} className={`p-1.5 rounded-lg transition-all ${isWide ? 'bg-white text-blue-600 shadow-inner' : 'hover:bg-white/10 text-white'}`} title={isWide ? "Thu nhỏ" : "Phóng to"}>
                    <ArrowsRightLeftIcon className="w-5 h-5" />
                  </button>
                  <button onClick={handleNewChat} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors" title="Chat mới">
                    <PlusIcon className="w-5 h-5" />
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
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
                  style={{ overscrollBehavior: 'contain' }}
                >
                  {messages.length === 0 && !isLoading && (
                    <div className="text-center py-8 px-6">
                      <div className="w-20 h-20 bg-gradient-to-tr from-blue-50 to-white rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden border-2 border-white shadow-xl transform transition-transform hover:scale-110">
                        <img src="/images/banner/ai-avatar.png" alt="AI Avatar" className="w-full h-full object-cover" />
                      </div>
                      
                      <h4 className="font-black text-slate-800 text-lg mb-2">Chào bạn! Mình là AI Bike Shop 👋</h4>
                      <p className="text-xs text-slate-500 mb-8 leading-relaxed max-w-[240px] mx-auto">
                        Rất vui được gặp bạn! Bạn cần mình hỗ trợ thông tin gì về xe đạp hay đơn hàng không? ✨
                      </p>

                      <div className="grid grid-cols-2 gap-3 mb-8">
                        {[
                          { text: "🎁 Siêu ưu đãi hôm nay", query: "Cho mình biết các chương trình khuyến mãi hiện có" },
                          { text: "🚲 Sản phẩm mới nhất", query: "Những mẫu xe đạp mới nhất 2025 là gì?" },
                          { text: "🔍 Tra cứu đơn hàng", query: "Mình muốn kiểm tra tình trạng đơn hàng của mình" },
                          { text: "📞 Liên hệ tư vấn", query: "Mình muốn liên hệ trực tiếp với nhân viên hỗ trợ" }
                        ].map((btn, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(null, btn.query)}
                            className="bg-white border border-blue-100 text-slate-700 p-3 rounded-2xl text-[11px] font-bold hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm active:scale-95 text-center leading-tight flex items-center justify-center"
                          >
                            {btn.text}
                          </button>
                        ))}
                      </div>

                      {token && (
                        <button 
                          onClick={() => setShowSessions(true)}
                          className="text-[11px] text-slate-400 hover:text-blue-600 font-bold transition-colors flex items-center justify-center gap-1 mx-auto group"
                        >
                          <ClockIcon className="w-4 h-4 group-hover:rotate-[-45deg] transition-transform" />
                          Xem lại lịch sử trò chuyện cũ
                        </button>
                      )}
                    </div>
                  )}

                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}>
                      {/* Ảnh đại diện (Avatar) */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden ${
                        msg.role === 'user' ? 'bg-blue-100 border border-blue-200' : 'bg-slate-100 border border-slate-200'
                      }`}>
                        {msg.role === 'user' ? (
                          <UserCircleIcon className="w-5 h-5 text-blue-600" />
                        ) : (
                          <img src="/images/banner/ai-avatar.png" alt="AI" className="w-full h-full object-cover" />
                        )}
                      </div>

                      {/* Khung tin nhắn */}
                      <div className={`${isWide ? 'max-w-[90%]' : 'max-w-[85%]'} px-4 py-2.5 rounded-2xl text-sm shadow-md transition-all duration-300 ${
                          msg.role === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'
                        }`}>
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {msg.role === 'assistant' && msg.isNew ? (
                            <TypewriterText 
                              text={msg.message} 
                              renderContent={(txt) => renderMessage(txt, msg.role)}
                              onCharTyped={() => {
                                // Tự động cuộn nếu người dùng đang ở đáy
                                if (!showScrollBtn) scrollToBottom("auto");
                              }}
                              onComplete={() => {
                                msg.isNew = false;
                                // Cuộn mượt một lần cuối khi gõ xong
                                if (!showScrollBtn) scrollToBottom("smooth");
                              }}
                            />
                          ) : (
                            renderMessage(msg.message, msg.role)
                          )}
                        </div>
                        <span className={`text-[10px] mt-2 block opacity-60 font-medium ${msg.role === 'user' ? 'text-white' : 'text-slate-400'}`}>
                          {new Date(msg.thoi_gian).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex items-end gap-2 animate-pulse-slow">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
                        <img src="/images/banner/ai-avatar.png" alt="AI" className="w-full h-full object-cover" />
                      </div>
                      <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-md flex gap-1.5 items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-duration:0.8s]"></span>
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]"></span>
                        <span className="ml-1 text-[10px] font-bold text-blue-400 uppercase tracking-widest">AI đang nghĩ</span>
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
              
              <div className="flex-grow overflow-y-auto p-2 space-y-1" style={{ overscrollBehavior: 'contain' }}>
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
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ripple { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(2.2); opacity: 0; } }
        @keyframes pulse-slow { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-slide-left { animation: slide-left 0.3s ease-out; }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        .animate-ripple { animation: ripple 3s infinite cubic-bezier(0, 0, 0.2, 1); }
        .animate-pulse-slow { animation: pulse-slow 2s infinite ease-in-out; }
        
        /* Custom scrollbar cho cửa sổ chat */
        .overflow-y-auto::-webkit-scrollbar { width: 4px; }
        .overflow-y-auto::-webkit-scrollbar-track { background: transparent; }
        .overflow-y-auto::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default ChatWidget;

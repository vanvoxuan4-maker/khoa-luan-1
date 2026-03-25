import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import API_BASE_URL from '../../../utils/apiConfig';
import { useNavigate } from 'react-router-dom';
import TypewriterText from '../../users/chat/TypewriterText';
import CosmicLogo from '../../common/CosmicLogo';

const AdminChat = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [showSessions, setShowSessions] = useState(false);
  const [isWide, setIsWide] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const scrollRef = useRef(null);
  const messagesEndRef = useRef(null);
  const isFirstLoad = useRef(true);
  const token = localStorage.getItem('admin_access_token');

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
    const isFarFromBottom = scrollHeight - scrollTop - clientHeight > 100;
    setShowScrollBtn(isFarFromBottom);
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
    if (!token || !sessionId) return; // Chỉ tải nếu có sessionId cụ thể
    try {
      const url = `${API_BASE_URL}/admin/chat-history?session_id=${sessionId}`;
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

  const sendMessage = async (overrideMessage = null) => {
    const messageToSend = overrideMessage || input;
    if (!messageToSend.trim()) return;
    
    if (!overrideMessage) setInput('');
    const userMsg = { role: 'user', message: messageToSend, thoi_gian: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const url = activeSessionId 
        ? `${API_BASE_URL}/admin/chat/stream?session_id=${activeSessionId}`
        : `${API_BASE_URL}/admin/chat/stream`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: messageToSend })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      let streamStarted = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.session_id && !activeSessionId) {
                setActiveSessionId(data.session_id);
                localStorage.setItem('admin_chat_session_id', data.session_id);
                fetchSessions();
              }

              if (data.chunk) {
                fullContent += data.chunk;
                
                if (!streamStarted) {
                    streamStarted = true;
                    setIsLoading(false); // Tắt loading dots ngay khi có chữ
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        message: fullContent,
                        isStreaming: true,
                        thoi_gian: new Date()
                    }]);
                } else {
                    setMessages(prev => {
                        const newMsgs = [...prev];
                        const lastIdx = newMsgs.length - 1;
                        if (lastIdx >= 0 && newMsgs[lastIdx].role === 'assistant') {
                            newMsgs[lastIdx] = { ...newMsgs[lastIdx], message: fullContent };
                        }
                        return newMsgs;
                    });
                }
                if (!showScrollBtn) scrollToBottom("auto");
              }

              if (data.done) {
                setMessages(prev => {
                    const newMsgs = [...prev];
                    const lastIdx = newMsgs.length - 1;
                    if (lastIdx >= 0) newMsgs[lastIdx].isStreaming = false;
                    return newMsgs;
                });
              }
            } catch (e) {
              console.error("Error parsing SSE data", e);
            }
          }
        }
      }
    } catch (err) {
      console.error("Stream error:", err);
      setMessages(prev => {
        const newMsgs = [...prev];
        const lastIdx = newMsgs.length - 1;
        if (lastIdx >= 0 && newMsgs[lastIdx].isStreaming) {
            newMsgs[lastIdx].message = "Xin lỗi, đã có lỗi xảy ra khi kết nối với AI.";
            newMsgs[lastIdx].isStreaming = false;
        }
        return newMsgs;
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDERING HELPERS (Tương tự ChatWidget) ---
  const fixUrl = (url) => {
    if (!url) return '';
    let finalUrl = url;
    if (finalUrl.includes('bikeshop.vn')) {
      finalUrl = finalUrl.replace(/https?:\/\/bikeshop\.vn/, '');
    }
    if (finalUrl.startsWith('http')) return finalUrl;
    return finalUrl.startsWith('/') ? finalUrl : `/${finalUrl}`;
  };

  const renderMessage = (text, role) => {
    if (!text) return null;
    if (text.includes('|') && text.includes('---')) {
      const lines = text.split('\n');
      const tableIndices = [];
      let inTable = false;
      lines.forEach((line, i) => {
        if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
          if (!inTable) { tableIndices.push({ start: i, end: i }); inTable = true; }
          else { tableIndices[tableIndices.length - 1].end = i; }
        } else { inTable = false; }
      });
      if (tableIndices.length > 0) {
        const result = [];
        let lastIdx = 0;
        tableIndices.forEach((range, tIdx) => {
          if (range.start > lastIdx) {
            result.push(<div key={`text-pre-${tIdx}`}>{renderTextContent(lines.slice(lastIdx, range.start).join('\n'), role)}</div>);
          }
          const tableLines = lines.slice(range.start, range.end + 1);
          const headers = tableLines[0].split('|').filter(c => c.trim()).map(c => c.trim());
          const rows = tableLines.slice(2).filter(l => l.includes('|')).map(l => l.split('|').filter(c => c.trim()).map(c => c.trim()));
          result.push(
            <div key={`table-${tIdx}`} className="my-3 overflow-x-auto border border-purple-100 rounded-lg bg-white shadow-inner">
              <table className="min-w-full text-[12px] border-collapse">
                <thead>
                  <tr className="bg-purple-50 border-b border-purple-100">
                    {headers.map((h, i) => (
                      <th key={i} className="px-3 py-2 text-left font-black text-purple-700 border-r border-purple-100 last:border-0">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} className="border-b border-purple-50 last:border-0 hover:bg-purple-50/50 transition-colors">
                      {row.map((cell, j) => (
                        <td key={j} className="px-3 py-2 text-slate-600 border-r border-purple-50 last:border-0">{renderTextContent(cell, role)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          lastIdx = range.end + 1;
        });
        if (lastIdx < lines.length) {
          result.push(<div key="text-post">{renderTextContent(lines.slice(lastIdx).join('\n'), role)}</div>);
        }
        return result;
      }
    }
    return renderTextContent(text, role);
  };

  const renderTextContent = (text, role) => {
    if (!text) return null;
    const linkRegex = /(\[.*?\]\((?:https?:\/\/[^\s)]+|(?:\/admin|\/products|\/my-orders)[^\s)]+)\)|https?:\/\/[^\s]+|(?:\/admin|\/products|\/my-orders)[^\s]+)/g;
    const parts = text.split(linkRegex);
    return parts.map((part, index) => {
      if (!part) return null;
      const mdLinkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (mdLinkMatch) {
        const url = fixUrl(mdLinkMatch[2]);
        const display = mdLinkMatch[1];
        const isInternal = !url.startsWith('http');
        return isInternal ? (
          <span 
            key={index} 
            onClick={() => {
              setIsOpen(false);
              navigate(url);
            }}
            className="text-purple-600 hover:text-purple-800 underline font-bold cursor-pointer transition-all active:scale-95"
          >
            {display}
          </span>
        ) : (
          <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 underline font-bold">{display}</a>
        );
      }
      const lowerPart = part.toLowerCase();
      if (lowerPart.startsWith('/admin/') || lowerPart.startsWith('admin/') || 
          lowerPart.startsWith('/products/') || lowerPart.startsWith('products/') ||
          lowerPart.startsWith('/my-orders/') || lowerPart.startsWith('my-orders/')) {
        const targetUrl = part.startsWith('/') ? part : `/${part}`;
        return (
          <span 
            key={index} 
            onClick={() => {
              setIsOpen(false);
              navigate(targetUrl);
            }}
            className="text-purple-600 hover:text-purple-800 underline font-extrabold cursor-pointer transition-all active:scale-95"
          >
            {part}
          </span>
        );
      }
      if (part.match(/^https?:\/\//)) {
        const url = fixUrl(part);
        return <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline font-bold">{url}</a>;
      }
      const boldRegex = /(\*\*.*?\*\*)/g;
      const subParts = part.split(boldRegex);
      return subParts.map((subPart, subIndex) => {
        if (subPart.startsWith('**') && subPart.endsWith('**')) {
          return <strong key={`${index}-${subIndex}`} className={`font-bold ${role === 'user' ? 'text-white' : 'text-purple-700'}`}>{subPart.slice(2, -2)}</strong>;
        }
        return subPart;
      });
    });
  };


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
            <CosmicLogo className="h-9 w-9 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] group-hover:rotate-[20deg] transition-transform duration-500" color="white" />
          </button>
        </>
      )}

      {/* 2. CỬA SỔ CHAT */}
      {isOpen && (
        <div className={`fixed bottom-16 right-0 max-h-[calc(100vh-100px)] h-[650px] bg-white border border-[#D8B4FE] rounded-2xl shadow-[0_20px_60px_rgba(76,29,149,0.25)] flex flex-col overflow-hidden animate-fade-in-up ring-1 ring-[#A78BFA]/40 transition-all duration-500 ${
          isWide ? "w-[800px] max-w-[90vw]" : "w-[400px]"
        }`}>

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
                      <CosmicLogo className="w-5 h-5 text-[#E9D5FF]" color="white" />
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
                   <button onClick={() => setIsWide(!isWide)} className={`p-1.5 rounded-lg transition-all ${isWide ? 'bg-white text-purple-600' : 'hover:bg-white/20 text-white'}`} title={isWide ? "Thu nhỏ" : "Mở rộng"}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                  </button>
                  <button onClick={handleNewChat} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white" title="Chat mới">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </button>
                </div>
              </div>

              {/* BODY (Messages) */}
              <div className="flex-1 relative overflow-hidden flex flex-col bg-[#FAF5FF]">
                <div 
                  ref={scrollRef}
                  onScroll={handleScroll}
                  className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar"
                  style={{ overscrollBehavior: 'contain' }}
                >
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-[#7C3AED] space-y-5 opacity-80">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-[#E9D5FF]">
                      <CosmicLogo className="w-12 h-12" color="purple" />
                    </div>
                    <div className="text-center">
                      <p className="text-md font-bold text-[#5B21B6]">Xin chào Admin!</p>
                      <button onClick={() => setShowSessions(true)} className="mt-2 text-xs text-purple-600 hover:underline">Xem lịch sử chat cũ</button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 w-full px-4 mb-6">
                      <button onClick={() => sendMessage("Thống kê doanh thu hôm nay")} className="px-3 py-3 bg-white rounded-xl text-[11px] font-bold text-[#6D28D9] shadow-sm border border-[#DDD6FE] hover:bg-[#F3E8FF] hover:border-purple-300 active:scale-95 transition-all text-center leading-tight">📊 Doanh thu hôm nay</button>
                      <button onClick={() => sendMessage("Sản phẩm nào sắp hết hàng?")} className="px-3 py-3 bg-white rounded-xl text-[11px] font-bold text-[#6D28D9] shadow-sm border border-[#DDD6FE] hover:bg-[#F3E8FF] hover:border-purple-300 active:scale-95 transition-all text-center leading-tight">📦 Kiểm tra tồn kho</button>
                      <button onClick={() => sendMessage("Cập nhật giá sản phẩm ID 1 sang 15.000.000 VNĐ")} className="px-3 py-3 bg-white rounded-xl text-[11px] font-bold text-[#6D28D9] shadow-sm border border-[#DDD6FE] hover:bg-[#F3E8FF] hover:border-purple-300 active:scale-95 transition-all text-center leading-tight">💰 Cập nhật giá bán</button>
                      <button onClick={() => sendMessage("Vô hiệu hóa mã giảm giá KM2025")} className="px-3 py-3 bg-white rounded-xl text-[11px] font-bold text-[#6D28D9] shadow-sm border border-[#DDD6FE] hover:bg-[#F3E8FF] hover:border-purple-300 active:scale-95 transition-all text-center leading-tight">🎟️ Quản lý voucher</button>
                    </div>
                  </div>
                )}

                {messages.map((msg, index) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div key={index} className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'} items-end`}>
                      {!isUser && (
                        <div className="w-7 h-7 rounded-full bg-white border border-[#C4B5FD] flex items-center justify-center shrink-0 shadow-sm">
                          <CosmicLogo className="w-4 h-4" color="purple" />
                        </div>
                      )}
                      
                      <div className={`max-w-[75%] p-3 rounded-xl text-[14px] leading-relaxed shadow-md transition-all duration-300 ${isUser
                        ? 'bg-gradient-to-r from-[#6D28D9] to-[#9333EA] text-white rounded-br-none'
                        : 'bg-white text-slate-700 border border-[#DDD6FE] rounded-bl-none'
                        }`}>
                        {msg.role === 'assistant' && msg.isStreaming ? (
                          <div className="relative">
                            {renderMessage(msg.message, msg.role)}
                            <span className="inline-block w-1.5 h-4 bg-purple-500 ml-1 animate-blink align-middle"></span>
                          </div>
                        ) : msg.role === 'assistant' && msg.isNew ? (
                          <TypewriterText 
                            text={msg.message} 
                            renderContent={(txt) => renderMessage(txt, msg.role)}
                            onCharTyped={() => { if (!showScrollBtn) scrollToBottom("auto"); }}
                            onComplete={() => {
                              msg.isNew = false;
                              if (!showScrollBtn) scrollToBottom("smooth");
                            }}
                          />
                        ) : (
                          renderMessage(msg.message, msg.role)
                        )}
                      </div>

                      {isUser && (
                        <div className="w-7 h-7 rounded-full bg-[#6D28D9] flex items-center justify-center shrink-0 shadow-sm border border-white/20">
                          <UserCircleIcon className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
                 {isLoading && (
                    <div className="flex justify-start gap-2 items-end animate-pulse-slow">
                      <div className="w-7 h-7 rounded-full bg-white border border-purple-100 flex items-center justify-center shrink-0 shadow-sm">
                        <CosmicLogo className="w-4 h-4" color="purple" />
                      </div>
                      <div className="bg-white px-4 py-2.5 rounded-xl rounded-bl-none border border-purple-100 shadow-md flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-duration:0.8s]"></span>
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]"></span>
                        <span className="ml-1 text-[10px] font-bold text-purple-400 tracking-tighter uppercase">AI Galaxy</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* NÚT CUỘN XUỐNG NHANH */}
                {showScrollBtn && (
                  <button
                    onClick={scrollToBottom}
                    className="absolute bottom-4 right-4 w-10 h-10 bg-white border border-purple-100 rounded-full shadow-xl flex items-center justify-center text-purple-600 hover:bg-purple-50 transition-all hover:scale-110 active:scale-95 animate-fade-in z-20 group/scroll"
                    title="Cuộn xuống cuối"
                  >
                    <svg className="w-6 h-6 group-hover/scroll:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                )}
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
                      className={`flex-grow min-w-0 text-left p-4 rounded-xl transition-all border overflow-hidden ${activeSessionId === s.session_id ? 'bg-purple-600 text-white border-purple-600 shadow-lg' : 'bg-white text-slate-700 border-slate-100 hover:border-purple-200 hover:shadow-sm'}`}
                     >
                       <p className="font-bold text-[13px] truncate pr-10 block">{s.title || "Cuộc trò chuyện"}</p>
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
        .animate-fade-in-up { animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-slow { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }
        .animate-pulse-slow { animation: pulse-slow 2s infinite ease-in-out; }

        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .animate-blink { animation: blink 1s step-end infinite; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #DDD6FE; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #C4B5FD; }
      `}</style>
    </div>
  );
};

export default AdminChat;
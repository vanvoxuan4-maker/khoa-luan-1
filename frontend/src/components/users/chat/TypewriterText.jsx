import React, { useState, useEffect, useRef } from 'react';

/**
 * Component hiển thị văn bản với hiệu ứng gõ máy (typewriter effect).
 * @param {string} text - Nội dung văn bản cần hiển thị.
 * @param {number} speed - Tốc độ gõ (ms mỗi ký tự). Mặc định là 15ms.
 * @param {function} renderContent - Hàm callback để render nội dung (hỗ trợ markdown/html).
 * @param {function} onComplete - Gọi khi hoàn tất việc gõ.
 * @param {function} onCharTyped - Gọi mỗi khi có một ký tự mới được hiển thị.
 */
const TypewriterText = ({ text, speed = 15, renderContent, onComplete, onCharTyped }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    // Nếu text thay đổi hoặc reset, bắt đầu lại
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      timerRef.current = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
        if (onCharTyped) onCharTyped();
      }, speed);
    } else {
      if (onComplete) onComplete();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, text, speed, onComplete]);

  // Sử dụng hàm renderContent bên ngoài (như renderMessage trong ChatWidget)
  // để xử lý markdown sau khi đã lấy được chuỗi text hiện tại
  return renderContent ? renderContent(displayedText) : <span>{displayedText}</span>;
};

export default TypewriterText;

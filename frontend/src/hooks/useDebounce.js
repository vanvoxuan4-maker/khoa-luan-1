import { useState, useEffect } from 'react';

/**
 * useDebounce - Trì hoãn cập nhật giá trị đến sau khi người dùng ngừng thao tác.
 * @param {*} value - Giá trị cần debounce (ví dụ: từ khóa tìm kiếm)
 * @param {number} delay - Thời gian trì hoãn tính bằng mili-giây (ms)
 * @returns Giá trị đã được debounce
 * 
 * Example:
 * const debouncedSearch = useDebounce(searchTerm, 500);
 * // debouncedSearch chỉ thay đổi sau khi searchTerm không đổi trong 500ms
 */
const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Hủy timer nếu value thay đổi trong khoảng delay
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
};

export default useDebounce;

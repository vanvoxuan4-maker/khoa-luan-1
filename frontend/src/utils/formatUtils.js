/**
 * Formats a number as VND currency
 * @param {number} amount 
 * @returns {string}
 */
export const formatVND = (amount) => {
    return amount?.toLocaleString('vi-VN');
};

/**
 * Calculates final price after discount
 * @param {number} originalPrice 
 * @param {number} discountValue 
 * @param {string} discountType - 'percentage' or 'fixed_amount'
 * @returns {number}
 */
export const calculateFinalPrice = (originalPrice, discountValue = 0, discountType = 'percentage') => {
    if (!discountValue) return originalPrice;
    if (discountType === 'percentage') {
        return originalPrice * (1 - discountValue / 100);
    } else if (discountType === 'fixed_amount') {
        return originalPrice - discountValue;
    }
    return originalPrice;
};

/**
 * Gets consistent style for brand badges
 * @param {string} name 
 * @returns {string} Tailwind classes
 */
export const getBrandStyle = (name) => {
    if (!name) return 'bg-gray-100 text-gray-600 border-gray-200';
    const firstChar = name.charAt(0).toUpperCase();
    if (['G', 'H', 'I'].includes(firstChar)) return 'bg-green-100 text-green-700 border-green-200';
    if (['T', 'U', 'V'].includes(firstChar)) return 'bg-red-100 text-red-700 border-red-200';
    if (['R', 'S'].includes(firstChar)) return 'bg-orange-100 text-orange-700 border-orange-200';
    if (['J', 'K', 'L'].includes(firstChar)) return 'bg-purple-100 text-purple-700 border-purple-200';
    if (['A', 'B', 'C'].includes(firstChar)) return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-indigo-100 text-indigo-700 border-indigo-200';
};

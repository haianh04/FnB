import { useState, useEffect } from 'react';

// ... (Giữ nguyên các hàm logic cũ: timeToMinutes, parseTimeRange, isOverlapping, getRoleBadgeStyle, getTodayKey, canCheckIn)

export const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

export const parseTimeRange = (rangeStr) => {
  if (!rangeStr) return { start: 0, end: 0 };
  const standardized = rangeStr.replace('–', '-');
  const [startStr, endStr] = standardized.split('-').map(s => s.trim());
  return {
    start: timeToMinutes(startStr),
    end: timeToMinutes(endStr)
  };
};

export const isOverlapping = (range1, range2) => {
  return (range1.start < range2.end) && (range1.end > range2.start);
};

export const getRoleBadgeStyle = (roleName) => {
  // Logic cũ, có thể không dùng nếu giao diện mới hardcode style
  const role = (roleName || '').toLowerCase();
  if (role.includes("phục vụ")) return "bg-orange-50 text-orange-600 border-orange-200";
  else if (role.includes("pha chế")) return "bg-blue-50 text-blue-600 border-blue-200";
  else if (role.includes("bảo vệ")) return "bg-green-50 text-green-600 border-green-200";
  else if (role.includes("thu ngân")) return "bg-yellow-50 text-yellow-600 border-yellow-200";
  return "bg-gray-100 text-gray-600 border-gray-200";
};

export const getTodayKey = () => {
  const today = new Date(); // Lấy ngày hiện tại của máy tính
  // Trả về chuỗi ngày (ví dụ "09", "10", "25"). Cần padStart để đảm bảo luôn có 2 chữ số
  return String(today.getDate()).padStart(2, '0');
};

export const getFormattedDate = () => {
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  // Format sang tiếng Việt: "Thứ Ba, 9 tháng 12, 2025"
  return today.toLocaleDateString('vi-VN', options);
};

// Logic check-in mới
export const canCheckIn = (shiftTimeStr, currentTimeStr) => {
    if (!shiftTimeStr) return false;
    const { start } = parseTimeRange(shiftTimeStr);
    const current = timeToMinutes(currentTimeStr);
    const earliestTime = start - 15; // Trước 15p
    return current >= earliestTime;
};

// HOOK MỚI: Realtime Clock
export const useRealtimeClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
  };

  return formatTime(time);
};

// Helper đơn giản cho lúc không cần hook
export const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};
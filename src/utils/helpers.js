// Các hàm xử lý logic tách biệt

export const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

export const parseTimeRange = (rangeStr) => {
  if (!rangeStr) return { start: 0, end: 0 };
  const standardized = rangeStr.replace('–', '-'); // Xử lý dash khác nhau
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
  const role = (roleName || '').toLowerCase();
  if (role.includes("phục vụ")) return "bg-orange-100 text-orange-600 border-orange-200";
  if (role.includes("pha chế")) return "bg-blue-100 text-blue-600 border-blue-200";
  if (role.includes("thu ngân")) return "bg-emerald-100 text-emerald-600 border-emerald-200";
  return "bg-gray-100 text-gray-600 border-gray-200";
};
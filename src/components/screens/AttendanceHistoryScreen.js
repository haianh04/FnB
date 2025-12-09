import React, { useState, useMemo } from 'react';
import { ArrowLeft, Calendar, Clock, Trash2, AlertTriangle, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { getRoleBadgeStyle } from '../../utils/helpers';
// --- HELPERS ---

// Tính giờ làm
const getDurationNumber = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const startVal = startH * 60 + startM;
    const endVal = endH * 60 + endM;
    const diffMins = endVal - startVal;
    if (diffMins < 0) return 0; 
    return diffMins / 60; 
};

// Lấy ngày đầu tuần (Thứ 2)
const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
};

// Format ngày hiển thị: "24 thg 11, 2025"
const formatDateDisplay = (date) => {
    return `${date.getDate()} thg ${date.getMonth() + 1}, ${date.getFullYear()}`;
};

// --- MOCK DATA ---
const MOCK_HISTORY = [
  { 
    id: 1, 
    dateObj: new Date(2025, 10, 26), // 26/11 (Thứ 4)
    scheduledTime: "08:00 - 12:00",
    role: "Phục vụ",
    location: "CHÚ BI",
    inTime: "07:55",
    outTime: "12:05",
    status: "approved", 
    exceptions: null
  },
  { 
    id: 2, 
    dateObj: new Date(2025, 10, 25), // 25/11 (Thứ 3)
    scheduledTime: "13:30 - 17:30",
    role: "Pha chế",
    location: "CHÚ BI",
    inTime: "13:30",
    outTime: "17:30",
    status: "not approved", 
    exceptions: null
  },
  { 
    id: 3, 
    dateObj: new Date(2025, 10, 23), // 23/11 (Chủ nhật tuần trước) -> Sẽ bị lọc nếu chọn tuần 24-30
    scheduledTime: "18:00 - 22:00", 
    role: "Phục vụ",
    location: "CHÚ BI",
    inTime: "18:00",
    outTime: "20:40",
    status: "approved",
  },
  { 
    id: 4, 
    dateObj: new Date(2025, 11, 1), // 01/12 (Tuần sau) -> Sẽ bị lọc
    scheduledTime: "08:00 - 16:00", 
    role: "Phục vụ",
    location: "CHÚ BI",
    inTime: "08:00",
    outTime: "16:00",
    status: "approved",
  },
];

export default function AttendanceHistoryScreen({ onBack }) {
  // State: Tuần hiện tại (Mặc định tuần chứa ngày 26/11/2025)
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date(2025, 10, 26)));

  // Tính ngày kết thúc tuần (Chủ nhật)
  const currentWeekEnd = new Date(currentWeekStart);
  currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);
  currentWeekEnd.setHours(23, 59, 59, 999);

  // --- HANDLERS ---
  const handlePrevWeek = () => {
      const newDate = new Date(currentWeekStart);
      newDate.setDate(newDate.getDate() - 7);
      setCurrentWeekStart(newDate);
  };

  const handleNextWeek = () => {
      const newDate = new Date(currentWeekStart);
      newDate.setDate(newDate.getDate() + 7);
      setCurrentWeekStart(newDate);
  };

  // --- FILTER DATA ---
  const filteredHistory = useMemo(() => {
      return MOCK_HISTORY.filter(item => {
          return item.dateObj >= currentWeekStart && item.dateObj <= currentWeekEnd;
      }).sort((a, b) => b.dateObj - a.dateObj); // Sắp xếp mới nhất lên đầu
  }, [currentWeekStart, currentWeekEnd]);

  // --- HELPER FORMAT ---
  const formatDateBox = (date) => {
      const dayIndex = date.getDay(); 
      const dayLabel = dayIndex === 0 ? 'CN' : `THỨ ${dayIndex + 1}`;
      const d = String(date.getDate()).padStart(2, '0');
      const m = String(date.getMonth() + 1).padStart(2, '0');
      return { dayLabel, dateStr: `${d}/${m}` };
  };

  // --- CALCULATE TOTAL ---
  const totalHours = useMemo(() => {
      const total = filteredHistory.reduce((acc, item) => {
          if (item.status === 'approved') {
              return acc + getDurationNumber(item.inTime, item.outTime);
          }
          return acc;
      }, 0);
      return total.toFixed(2);
  }, [filteredHistory]);

  return (
    <div className="flex flex-col h-full bg-[#F5F5F5] font-sans relative overflow-hidden">
      
      {/* 1. HEADER */}
      <div className="bg-white pt-12 pb-2 px-4 shadow-sm relative z-20 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} className="text-gray-600"/>
                </button>
                <h1 className="text-[18px] font-bold text-gray-700">Lịch sử chấm công</h1>
            </div>
        </div>

        {/* 2. TUẦN FILTER (MỚI THÊM) */}
        <div className="flex items-center justify-between mb-4">
            <button onClick={handlePrevWeek} className="w-[36px] h-[36px] flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 active:scale-95 transition-all shadow-sm">
                <ChevronLeft size={20}/>
            </button>
            
            <div className="flex-1 mx-3 h-[36px] flex items-center justify-center bg-white rounded-full border border-gray-200 shadow-sm px-4">
                <span className="text-[13px] font-semibold text-gray-700 whitespace-nowrap">
                    {formatDateDisplay(currentWeekStart)} — {formatDateDisplay(currentWeekEnd)}
                </span>
            </div>

            <button onClick={handleNextWeek} className="w-[36px] h-[36px] flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 active:scale-95 transition-all shadow-sm">
                <ChevronRight size={20}/>
            </button>
        </div>

        {/* 3. USER INFO BAR */}
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
                    <div className="w-full h-full bg-orange-100 flex items-center justify-center text-[#E08C27] font-bold">T</div>
                </div>
                <span className="text-gray-700 font-medium text-sm">Hoàng Đức Tùng</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="bg-white border border-gray-200 px-3 py-1.5 rounded-md text-xs text-gray-600 font-bold shadow-sm">
                    Tổng: <span className="text-[#E08C27] text-sm">{totalHours}</span> giờ
                </div>
            </div>
        </div>
      </div>

      {/* 4. LIST (SCROLLABLE) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {filteredHistory.length > 0 ? (
            filteredHistory.map((item) => {
                const { dayLabel, dateStr } = formatDateBox(item.dateObj);
                const hoursVal = item.status === 'approved' 
                    ? getDurationNumber(item.inTime, item.outTime) 
                    : 0;
                const displayDuration = hoursVal.toFixed(2);

                return (
                    <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex animate-in slide-in-from-bottom-2 fade-in duration-300">
                        {/* Cột trái: Ngày */}
                        <div className="w-[85px] bg-[#E08C27] flex flex-col items-center justify-center text-white p-2 shrink-0 gap-1">
                            <span className="text-[13px] font-bold uppercase tracking-wide">{dayLabel}</span>
                            <span className="text-[15px] font-bold">{dateStr}</span>
                        </div>

                        {/* Cột phải: Nội dung */}
                        <div className="flex-1 p-3 flex flex-col gap-2 relative">
                            {/* Dòng 1: Thông tin ca */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-center flex-wrap gap-2 text-[11px] text-gray-500">
                                    <Calendar size={12}/>
                                    <span>{item.scheduledTime}</span>
                                    {/* Thêm khung bo tròn ở ngoài vai trò theo màu theo role, chữ theo màu của role */}
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getRoleBadgeStyle(item.role)}`}>{item.role}</span>
                                    <span>{item.location}</span>
                                </div>
                                <button className="text-gray-300 hover:text-red-500">
                                    <Trash2 size={14}/>
                                </button>
                            </div>

                            {/* Dòng 2: Giờ IN/OUT */}
                            <div className="flex items-center gap-4 text-sm font-bold mt-1">
                                <div className="flex items-center gap-1 text-[#26A69A]">
                                    <Clock size={14}/> 
                                    <span>Vào {item.inTime}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[#FF7043]">
                                    <Clock size={14}/> 
                                    <span>Ra {item.outTime}</span>
                                </div>
                            </div>

                            {/* Dòng 3: Cảnh báo */}
                            {item.exceptions && (
                                <div className="flex items-center gap-1 text-[11px] text-orange-500 mt-1">
                                    <AlertTriangle size={12}/> 
                                    <span>{item.exceptions}</span>
                                </div>
                            )}

                            {/* Dòng 4: Trạng thái & Tổng giờ */}
                            <div className="flex items-center justify-end gap-3 mt-2 border-t border-gray-50 pt-2">
                                {item.status === 'approved' ? (
                                    <span className="bg-[#E0F2F1] text-[#00695C] px-3 py-1 rounded-full text-[10px] font-bold border border-[#B2DFDB] flex items-center gap-1">
                                        <CheckCircle size={10}/> Quản lý đã duyệt
                                    </span>
                                ) : (
                                    <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold border border-red-100 flex items-center gap-1">
                                        <XCircle size={10}/> Không được duyệt
                                    </span>
                                )}
                                
                                <span className={`text-xs font-bold ${item.status === 'approved' ? 'text-gray-800' : 'text-gray-400 line-through'}`}>
                                    {displayDuration} giờ
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })
        ) : (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
                <Calendar size={48} strokeWidth={1} className="opacity-20"/>
                <p className="text-sm italic">Không có dữ liệu trong tuần này</p>
            </div>
        )}
      </div>
    </div>
  );
}
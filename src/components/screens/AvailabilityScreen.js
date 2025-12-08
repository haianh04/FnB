import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, Info, ChevronLeft, ChevronRight, CheckCircle, XCircle, Loader, Lock } from 'lucide-react';

// Helper để xử lý ngày tháng
const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Thứ 2 là đầu tuần
    return new Date(d.setDate(diff));
};

const formatDateKey = (date) => { // YYYY-MM-DD
    return date.toISOString().split('T')[0];
};

const formatDisplayDate = (date) => { // DD
    return String(date.getDate()).padStart(2, '0');
};

// Mock Data
const MOCK_SAVED_DATA = {
    '2025-11-26': { 
        type: 'temporary', 
        isFullDay: false, 
        busyFrom: '18:00', 
        busyTo: '21:00', 
        reason: 'Đi học', 
        note: 'Lớp tối', 
        status: 'approved' 
    },
    '2025-11-27': { 
        type: 'fixed', 
        isFullDay: true, 
        status: 'pending'
    }
};

export default function AvailabilityScreen({ onBack }) {
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date(2025, 10, 26)));
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 10, 26)); 
  const [availabilityData, setAvailabilityData] = useState(MOCK_SAVED_DATA);

  // Form State
  const [formState, setFormState] = useState({
      type: 'temporary',
      isFullDay: true,
      busyFrom: '08:00',
      busyTo: '17:00',
      reason: 'Bận việc cá nhân',
      note: '',
      status: null 
  });

  useEffect(() => {
      const key = formatDateKey(selectedDate);
      const savedData = availabilityData[key];

      if (savedData) {
          setFormState({ ...savedData });
      } else {
          setFormState({
              type: 'temporary',
              isFullDay: true,
              busyFrom: '08:00',
              busyTo: '17:00',
              reason: 'Bận việc cá nhân',
              note: '',
              status: null
          });
      }
  }, [selectedDate, availabilityData]);

  // Handlers
  const handlePrevWeek = () => {
      const newStart = new Date(currentWeekStart);
      newStart.setDate(newStart.getDate() - 7);
      setCurrentWeekStart(newStart);
  };

  const handleNextWeek = () => {
      const newStart = new Date(currentWeekStart);
      newStart.setDate(newStart.getDate() + 7);
      setCurrentWeekStart(newStart);
  };

  const handleSave = () => {
      const key = formatDateKey(selectedDate);
      const newData = { ...formState, status: 'pending' };
      setAvailabilityData(prev => ({ ...prev, [key]: newData }));
      setFormState(newData);
      // alert(`Đã lưu đăng ký cho ngày ${formatDisplayDate(selectedDate)}!`); // Bỏ alert cho đỡ phiền
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(currentWeekStart);
      d.setDate(d.getDate() + i);
      const key = formatDateKey(d);
      const data = availabilityData[key];
      
      let dotColor = 'bg-transparent';
      if (data) {
          dotColor = data.isFullDay ? 'bg-green-500' : 'bg-red-500';
      } else {
          dotColor = 'bg-orange-300'; 
      }

      return {
          dateObj: d,
          dayLabel: i === 6 ? 'CN' : `T${i + 2}`,
          dateNum: formatDisplayDate(d),
          dotColor
      };
  });

  const isLocked = formState.status === 'approved';

  const renderStatusBadge = () => {
      if (!formState.status) return null;
      const styles = {
          pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: Loader, label: 'Chờ duyệt' },
          approved: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: CheckCircle, label: 'Đã duyệt' },
          rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: XCircle, label: 'Từ chối' },
      };
      const style = styles[formState.status];
      const Icon = style.icon;
      return (
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border ${style.bg} ${style.border} ${style.text} text-[10px] font-bold animate-in fade-in`}>
              <Icon size={10} /> {style.label}
          </div>
      );
  };

  return (
    <div className="flex flex-col h-full bg-[#F2F2F7] font-sans relative overflow-hidden">
      
      {/* 1. HEADER */}
      <div className="bg-white pt-12 pb-3 px-4 shadow-sm relative z-20 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
            <button onClick={onBack} className="w-8 h-8 flex items-center justify-center -ml-1 hover:bg-gray-50 rounded-full transition-colors">
                <ArrowLeft size={20} className="text-gray-900"/>
            </button>
            <h1 className="text-[16px] font-bold text-gray-900">Đăng ký lịch rảnh</h1>
        </div>
        {!isLocked && (
            <button onClick={handleSave} className="text-[15px] font-semibold text-[#E08C27] active:opacity-60 px-2">
                Lưu
            </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        
        {/* 2. WEEK NAVIGATOR (Đã sửa size để không tràn) */}
        <div className="bg-white pb-3 pt-2 border-b border-gray-200 shadow-sm mb-5">
            <div className="flex justify-center mb-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                Tháng {currentWeekStart.getMonth() + 1}, {currentWeekStart.getFullYear()}
            </div>

            <div className="flex items-center px-1">
                {/* Nút Trái */}
                <button onClick={handlePrevWeek} className="p-1 text-gray-400 hover:text-gray-600 w-8 flex justify-center">
                    <ChevronLeft size={20}/>
                </button>

                {/* Dãy ngày (Dãn đều) */}
                <div className="flex-1 flex justify-between px-1">
                    {weekDays.map((item, index) => {
                        const isSelected = formatDateKey(item.dateObj) === formatDateKey(selectedDate);
                        return (
                            <button 
                                key={index}
                                onClick={() => setSelectedDate(item.dateObj)}
                                className="flex flex-col items-center gap-1 group w-9" // Cố định width nhỏ
                            >
                                <span className={`text-[10px] font-medium ${isSelected ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
                                    {item.dayLabel}
                                </span>
                                <div className={`w-8 h-8 flex items-center justify-center rounded-full text-[13px] font-semibold transition-all relative
                                    ${isSelected 
                                        ? 'bg-[#191919] text-white shadow-md' 
                                        : 'bg-transparent text-gray-900 group-hover:bg-gray-50'}
                                `}>
                                    {item.dateNum}
                                    {/* DOT */}
                                    <div className={`absolute -bottom-1 w-1 h-1 rounded-full ${item.dotColor}`}></div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Nút Phải */}
                <button onClick={handleNextWeek} className="p-1 text-gray-400 hover:text-gray-600 w-8 flex justify-center">
                    <ChevronRight size={20}/>
                </button>
            </div>
        </div>

        {/* 3. TYPE SELECTION */}
        <div className="px-4 mb-5">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider">Cấu hình</span>
                    <Info size={12} className="text-gray-400"/>
                </div>
                {renderStatusBadge()}
            </div>
            
            <div className="bg-white p-1 rounded-[10px] flex shadow-sm border border-gray-100">
                <button 
                    disabled={isLocked}
                    onClick={() => setFormState({...formState, type: 'temporary'})}
                    className={`flex-1 py-1.5 text-[12px] font-semibold rounded-[7px] transition-all
                        ${formState.type === 'temporary' 
                            ? 'bg-[#E08C27] text-white shadow-sm' 
                            : 'bg-transparent text-gray-500 hover:bg-gray-50'}
                        ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                    Tạm thời
                </button>
                <button 
                    disabled={isLocked}
                    onClick={() => setFormState({...formState, type: 'fixed'})}
                    className={`flex-1 py-1.5 text-[12px] font-semibold rounded-[7px] transition-all
                        ${formState.type === 'fixed' 
                            ? 'bg-[#E08C27] text-white shadow-sm' 
                            : 'bg-transparent text-gray-500 hover:bg-gray-50'}
                        ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                    Cố định
                </button>
            </div>
        </div>

        {/* 4. FORM SECTION */}
        <div className="px-4 space-y-4 relative">
            {/* Overlay khóa */}
            {isLocked && (
                <div className="absolute inset-0 bg-white/60 z-10 rounded-[12px] flex items-center justify-center backdrop-blur-[1px]">
                    <div className="bg-white/95 px-3 py-1.5 rounded-full shadow-sm border border-gray-100 flex items-center gap-1.5 text-gray-500 text-xs font-medium">
                        <Lock size={12}/> Đã duyệt
                    </div>
                </div>
            )}

            {/* Block 1: Full Day Toggle */}
            <div className="bg-white rounded-[12px] overflow-hidden shadow-sm border border-gray-100">
                <div className="flex items-center justify-between p-3.5 border-b border-gray-100">
                    <div>
                        <span className="text-[14px] text-gray-900 font-medium block">Rảnh cả ngày</span>
                        <span className="text-[11px] text-gray-400">Gạt tắt nếu bạn có giờ bận</span>
                    </div>
                    
                    <button 
                        disabled={isLocked}
                        onClick={() => setFormState({...formState, isFullDay: !formState.isFullDay})}
                        className={`w-[44px] h-[26px] rounded-full p-[2px] transition-colors duration-300 ease-in-out relative
                            ${formState.isFullDay ? 'bg-[#34C759]' : 'bg-[#E9E9EA]'}
                        `}
                    >
                        <div className={`w-[22px] h-[22px] bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out
                            ${formState.isFullDay ? 'translate-x-[18px]' : 'translate-x-0'}
                        `}></div>
                    </button>
                </div>

                {!formState.isFullDay && (
                    <div className="animate-in slide-in-from-top-2 duration-300 bg-gray-50/50">
                        <div className="flex items-center justify-between p-3 border-b border-gray-100">
                            <span className="text-[14px] text-gray-700 font-medium">Bận từ</span>
                            <div className="bg-white border border-gray-200 px-2 py-1 rounded-[6px]">
                                <input 
                                    type="time" 
                                    disabled={isLocked}
                                    value={formState.busyFrom}
                                    onChange={(e) => setFormState({...formState, busyFrom: e.target.value})}
                                    className="bg-transparent text-[14px] font-bold text-gray-900 outline-none w-[80px] text-center"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3">
                            <span className="text-[14px] text-gray-700 font-medium">Bận đến</span>
                            <div className="bg-white border border-gray-200 px-2 py-1 rounded-[6px]">
                                <input 
                                    type="time" 
                                    disabled={isLocked}
                                    value={formState.busyTo}
                                    onChange={(e) => setFormState({...formState, busyTo: e.target.value})}
                                    className="bg-transparent text-[14px] font-bold text-gray-900 outline-none w-[80px] text-center"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Block 2: Lý do & Ghi chú */}
            <div className="bg-white rounded-[12px] overflow-hidden shadow-sm border border-gray-100">
                <div className="flex items-center justify-between p-3.5 border-b border-gray-100">
                    <span className="text-[14px] text-gray-900 font-medium">Lý do bận</span>
                    <div className="relative">
                        <select 
                            disabled={isLocked}
                            value={formState.reason}
                            onChange={(e) => setFormState({...formState, reason: e.target.value})}
                            className="appearance-none bg-transparent text-[14px] text-[#E08C27] font-medium pr-5 text-right outline-none cursor-pointer disabled:text-gray-400"
                            dir="rtl"
                        >
                            <option>Bận việc cá nhân</option>
                            <option>Đi học</option>
                            <option>Về quê</option>
                            <option>Sức khỏe</option>
                            <option>Khác</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                    </div>
                </div>
                
                <div className="p-3.5">
                    <span className="text-[13px] text-gray-500 block mb-2 font-medium">Ghi chú thêm</span>
                    <textarea 
                        disabled={isLocked}
                        value={formState.note}
                        onChange={(e) => setFormState({...formState, note: e.target.value})}
                        placeholder="Nhập chi tiết..."
                        className="w-full h-[60px] p-2 rounded-[8px] bg-gray-50 border border-gray-100 text-[14px] text-gray-800 placeholder-gray-400 outline-none focus:border-[#E08C27] resize-none transition-all disabled:bg-gray-100 disabled:text-gray-400"
                    ></textarea>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}
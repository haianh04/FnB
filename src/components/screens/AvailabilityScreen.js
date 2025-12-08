import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, XCircle, Loader, Lock, Clock, ChevronRight as IconArrow, Edit3, Save } from 'lucide-react';

// --- HELPERS ---
const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
};

const formatDateKey = (date) => date.toISOString().split('T')[0];

const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

// CẬP NHẬT: Format hiển thị tuần có năm "24/11, 2025"
const formatWeekRange = (startDate, endDate) => {
    const format = (date) => `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}, ${date.getFullYear()}`;
    return `${format(startDate)} — ${format(endDate)}`;
};

const formatDayDisplay = (date) => {
    return `${String(date.getDate()).padStart(2, '0')}`; 
};

// Mock Data
const MOCK_DB = {
    '2025-11-24': { 
        id: 'week_2025_48',
        status: 'approved', 
        days: {
            '2025-11-24': { isFullDay: true }, 
            '2025-11-25': { isFullDay: false, busyFrom: '18:00', busyTo: '22:00', reason: 'Đi học' },
            '2025-11-26': { isFullDay: true },
            '2025-11-27': { isFullDay: true },
            '2025-11-28': { isFullDay: true },
            '2025-11-29': { isFullDay: true },
            '2025-11-30': { isFullDay: true },
        }
    }
};

export default function AvailabilityScreen({ onBack }) {
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date(2025, 10, 24)));
  const [weekData, setWeekData] = useState({ status: 'new', days: {} });
  const [editingDay, setEditingDay] = useState(null); 

  useEffect(() => {
      const key = formatDateKey(currentWeekStart);
      const savedWeek = MOCK_DB[key];

      if (savedWeek) {
          setWeekData(savedWeek);
      } else {
          const defaultDays = {};
          for (let i = 0; i < 7; i++) {
              const d = addDays(currentWeekStart, i);
              defaultDays[formatDateKey(d)] = { isFullDay: true, reason: 'Bận việc cá nhân' };
          }
          setWeekData({ status: 'new', days: defaultDays });
      }
  }, [currentWeekStart]);

  // --- HANDLERS ---
  const handlePrevWeek = () => setCurrentWeekStart(addDays(currentWeekStart, -7));
  const handleNextWeek = () => setCurrentWeekStart(addDays(currentWeekStart, 7));

  const handleOpenEdit = (dateStr, dayLabel) => {
      if (weekData.status === 'approved') return;
      const currentConfig = weekData.days[dateStr] || { isFullDay: true, reason: 'Bận việc cá nhân' };
      setEditingDay({ dateStr, dayLabel, ...currentConfig });
  };

  const handleSaveDay = () => {
      // FIX LỖI: Nếu người dùng không sửa giờ, lấy giá trị mặc định '08:00' và '17:00'
      // thay vì lưu undefined/null khiến màn hình ngoài hiển thị lỗi.
      const busyFromVal = editingDay.busyFrom || '08:00';
      const busyToVal = editingDay.busyTo || '17:00';
      const reasonVal = editingDay.reason || 'Bận việc cá nhân';

      setWeekData(prev => ({
          ...prev,
          days: {
              ...prev.days,
              [editingDay.dateStr]: {
                  isFullDay: editingDay.isFullDay,
                  busyFrom: busyFromVal,
                  busyTo: busyToVal,
                  reason: reasonVal,
                  note: editingDay.note
              }
          }
      }));
      setEditingDay(null);
  };

  const handleSubmitWeek = () => {
      setWeekData(prev => ({ ...prev, status: 'pending' }));
  };

  const currentWeekEnd = addDays(currentWeekStart, 6);
  const isLocked = weekData.status === 'approved'; 
  const isPending = weekData.status === 'pending'; 

  const getStatusBadge = () => {
      if (weekData.status === 'new') return null;
      switch(weekData.status) {
          case 'approved': return <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200"><CheckCircle size={12}/> Đã duyệt</div>;
          case 'pending': return <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200"><Loader size={12}/> Chờ duyệt</div>;
          case 'rejected': return <div className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-200"><XCircle size={12}/> Từ chối</div>;
          default: return null;
      }
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F5F5] font-sans relative overflow-hidden">
      
      {/* 1. HEADER */}
      <div className="bg-white pt-12 pb-3 px-4 shadow-sm relative z-20 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
            <button onClick={onBack} className="w-9 h-9 flex items-center justify-center -ml-1 hover:bg-gray-50 rounded-full transition-colors">
                <ArrowLeft size={22} className="text-gray-800"/>
            </button>
            <h1 className="text-[17px] font-bold text-gray-900">Lịch rảnh theo tuần</h1>
        </div>
        {getStatusBadge()}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        
        {/* 2. WEEK FILTER (Đã thêm năm) */}
        <div className="bg-white p-4 mb-4 border-b border-gray-200 sticky top-0 z-10 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-1 border border-gray-100">
                <button onClick={handlePrevWeek} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm rounded-lg transition-all active:scale-95">
                    <ChevronLeft size={20}/>
                </button>
                
                <span className="text-[13px] font-bold text-gray-800 tracking-tight">
                    {formatWeekRange(currentWeekStart, currentWeekEnd)}
                </span>
                
                <button onClick={handleNextWeek} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm rounded-lg transition-all active:scale-95">
                    <ChevronRight size={20}/>
                </button>
            </div>
            
            {isLocked && (
                <div className="mt-2 flex items-center justify-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 py-1.5 rounded-lg border border-green-100">
                    <Lock size={12}/> Tuần này đã được duyệt, không thể thay đổi.
                </div>
            )}
        </div>

        {/* 3. DANH SÁCH NGÀY */}
        <div className="px-4 space-y-3">
            {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                const date = addDays(currentWeekStart, offset);
                const dateKey = formatDateKey(date);
                const dayConfig = weekData.days[dateKey] || { isFullDay: true }; 
                
                const dayLabels = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
                const dayIndex = date.getDay();
                const label = dayLabels[dayIndex];
                const isToday = formatDateKey(new Date()) === dateKey;

                const borderClass = dayConfig.isFullDay 
                    ? 'border-l-4 border-l-green-500' 
                    : 'border-l-4 border-l-red-500';

                return (
                    <div 
                        key={dateKey}
                        onClick={() => handleOpenEdit(dateKey, `${label}, ${date.getDate()}/${date.getMonth() + 1}`)}
                        className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 relative overflow-hidden transition-all
                            ${isLocked ? 'opacity-70 cursor-default' : 'cursor-pointer active:scale-[0.99] hover:border-orange-200'}
                            ${borderClass}
                        `}
                    >   
                        {/* Cột Trái: Ngày */}
                        <div className="flex flex-col items-center min-w-[45px]">
                            <span className={`text-[11px] font-bold uppercase ${isToday ? 'text-[#E08C27]' : 'text-gray-400'}`}>
                                {label.split(' ')[0] === 'Thứ' ? label.replace('Thứ ', 'T') : label}
                            </span>
                            <span className={`text-[17px] font-bold ${isToday ? 'text-[#E08C27]' : 'text-gray-800'}`}>
                                {formatDayDisplay(date)}
                            </span>
                        </div>

                        {/* Cột Giữa: Nội dung */}
                        <div className="flex-1 border-l border-gray-100 pl-4 py-1">
                            {dayConfig.isFullDay ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-sm font-bold text-gray-700">Rảnh cả ngày</span>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                        <span className="text-sm font-bold text-gray-800">Có giờ bận</span>
                                    </div>
                                    
                                    {/* HIỂN THỊ GIỜ BẬN */}
                                    <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 w-fit px-2.5 py-1 rounded-md border border-gray-100">
                                        <Clock size={12} className="text-gray-400"/>
                                        <span className="font-mono font-bold">
                                            {/* Logic Fix: Luôn hiển thị giờ kể cả khi dùng mặc định */}
                                            {dayConfig.busyFrom || '08:00'} - {dayConfig.busyTo || '17:00'}
                                        </span>
                                    </div>
                                    
                                    {dayConfig.reason && (
                                        <p className="text-[11px] text-gray-400 mt-1 italic line-clamp-1">Lý do: {dayConfig.reason}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Cột Phải: Icon */}
                        {!isLocked ? <IconArrow size={18} className="text-gray-300"/> : <Lock size={16} className="text-gray-300"/>}
                    </div>
                );
            })}
        </div>
      </div>

      {/* 4. FOOTER */}
      {!isLocked && (
          <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 p-4 pb-8 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
              <button 
                onClick={handleSubmitWeek}
                className="w-full py-3.5 bg-[#E08C27] text-white font-bold rounded-xl shadow-lg shadow-orange-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                  <Save size={18}/> 
                  {isPending ? 'Cập nhật lại đăng ký' : 'Gửi đăng ký tuần này'}
              </button>
          </div>
      )}

      {/* 5. MODAL */}
      {editingDay && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-[2px]" onClick={() => setEditingDay(null)}>
            <div className="bg-white w-full rounded-t-[24px] p-5 animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-1">{editingDay.dayLabel}</h3>
                <p className="text-sm text-gray-500 mb-6">Cập nhật thời gian rảnh của bạn</p>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4 border border-gray-100">
                    <div>
                        <span className="text-sm font-bold text-gray-900 block">Rảnh cả ngày</span>
                        <span className="text-xs text-gray-500">Tắt nếu bạn có giờ bận</span>
                    </div>
                    <button 
                        onClick={() => setEditingDay({...editingDay, isFullDay: !editingDay.isFullDay})}
                        className={`w-[48px] h-[28px] rounded-full p-[2px] transition-colors duration-300 relative ${editingDay.isFullDay ? 'bg-[#34C759]' : 'bg-gray-300'}`}
                    >
                        <div className={`w-[24px] h-[24px] bg-white rounded-full shadow-sm transition-transform duration-300 ${editingDay.isFullDay ? 'translate-x-[20px]' : 'translate-x-0'}`}></div>
                    </button>
                </div>

                {!editingDay.isFullDay && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Bận từ</label>
                                <input 
                                    type="time" 
                                    // Giá trị mặc định khi mở modal là 08:00 nếu chưa set
                                    value={editingDay.busyFrom || '08:00'}
                                    onChange={(e) => setEditingDay({...editingDay, busyFrom: e.target.value})}
                                    className="w-full p-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 outline-none focus:border-orange-500 text-center"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Đến</label>
                                <input 
                                    type="time" 
                                    // Giá trị mặc định khi mở modal là 17:00 nếu chưa set
                                    value={editingDay.busyTo || '17:00'}
                                    onChange={(e) => setEditingDay({...editingDay, busyTo: e.target.value})}
                                    className="w-full p-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 outline-none focus:border-orange-500 text-center"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Lý do</label>
                            <select 
                                value={editingDay.reason || 'Bận việc cá nhân'}
                                onChange={(e) => setEditingDay({...editingDay, reason: e.target.value})}
                                className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none text-sm font-medium"
                            >
                                <option>Bận việc cá nhân</option>
                                <option>Đi học</option>
                                <option>Về quê</option>
                                <option>Khác</option>
                            </select>
                        </div>
                    </div>
                )}

                <button 
                    onClick={handleSaveDay}
                    className="w-full py-3.5 bg-[#191919] text-white font-bold rounded-xl mt-6 active:scale-95 transition-transform"
                >
                    Xác nhận
                </button>
            </div>
        </div>
      )}

    </div>
  );
}
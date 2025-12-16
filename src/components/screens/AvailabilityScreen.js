import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, Clock, Save, Lock, XCircle, Loader, AlertCircle } from 'lucide-react';

// ==========================================
// 1. MOCK DATA
// ==========================================
const API_RESPONSE = {
    "status": "success",
    "message": "",
    "data": [
        {
            "id": 37,
            "registration_date": "2025-12-16T00:00:00.000Z",
            "availability_type": "available",
            "start_time": "08:00",
            "end_time": "17:00",
            "status": "pending",
            "employee_note": null
        },
        // Ngày 18/12, 19/12, 20/12 sẽ được tự động điền trạng thái 'pending' theo logic "Cả tuần"
        {
            "id": 44,
            "registration_date": "2025-12-23T00:00:00.000Z", // Data tuần sau
            "availability_type": "unavailable",
            "start_time": null,
            "end_time": null,
            "status": "pending",
            "employee_note": "Đi học (08:00 - 12:00)"
        },
        {
            "id": 38,
            "registration_date": "2025-12-24T00:00:00.000Z", // Data tuần sau
            "availability_type": "unavailable",
            "start_time": null,
            "end_time": null,
            "status": "approved",
            "employee_note": "Về quê (08:00 - 12:00)"
        },
        {
            "id": 39,
            "registration_date": "2025-12-25T00:00:00.000Z", // Data tuần sau
            "availability_type": "unavailable",
            "start_time": null,
            "end_time": null,
            "status": "rejected",
            "employee_note": "Ốm (08:00 - 12:00)"
        }
    ]
};

const SUGGESTED_REASONS = ["Việc cá nhân", "Đi học", "Về quê", "Đám cưới", "Ốm", "Khác"];

// ==========================================
// 2. HELPERS
// ==========================================
const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
};

const formatDateKey = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

// Parse note: "Lý do (Start - End)" -> Đảm bảo format chuẩn
const parseNoteInfo = (noteString) => {
    if (!noteString) return { reason: '', from: '', to: '' };
    // Regex bắt format 24h: 08:00 - 17:00
    const regex = /^(.*?)\s*\((\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})\)$/;
    const match = noteString.match(regex);
    if (match) {
        return { reason: match[1].trim(), from: match[2], to: match[3] };
    }
    return { reason: noteString, from: '', to: '' };
};

export default function AvailabilityScreen({ onBack }) {
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date(2025, 11, 15))); 
  const [weekData, setWeekData] = useState({}); 
  const [editingDay, setEditingDay] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // --- TRANSFORM API DATA & AUTO-FILL MISSING DAYS ---
  const transformApiToState = (apiData, weekStart) => {
      const mapped = {};
      let weekStatus = null; 

      // Xác định khoảng thời gian của tuần hiện tại để lọc data
      const weekEnd = addDays(weekStart, 6);
      const startStr = formatDateKey(weekStart);
      const endStr = formatDateKey(weekEnd);

      // 1. Duyệt data từ API để tìm trạng thái chung của tuần NÀY
      apiData.forEach(record => {
          const dateKey = record.registration_date.split('T')[0];
          
          // Chỉ xét status của các record nằm trong tuần hiện tại
          if (dateKey >= startStr && dateKey <= endStr) {
              if (!weekStatus && record.status !== 'new') {
                  weekStatus = record.status;
              }
          }

          let dayConfig = {
              id: record.id,
              status: record.status,
              availability_type: record.availability_type,
              manager_note: record.manager_note
          };

          if (record.availability_type === 'available') {
              dayConfig.isFullDay = true; 
              dayConfig.busyFrom = '08:00';
              dayConfig.busyTo = '17:00';
          } else {
              const parsed = parseNoteInfo(record.employee_note);
              dayConfig.isFullDay = false;
              dayConfig.reason = parsed.reason;
              dayConfig.busyFrom = parsed.from;
              dayConfig.busyTo = parsed.to;
          }
          mapped[dateKey] = dayConfig;
      });

      // 2. Logic "Gửi cả tuần": Nếu tuần này đã có trạng thái (pending/approved...)
      // thì LẤP ĐẦY các ngày còn thiếu bằng trạng thái đó (Mặc định Rảnh)
      if (weekStatus) {
          for (let i = 0; i < 7; i++) {
              const d = addDays(weekStart, i);
              const key = formatDateKey(d);
              if (!mapped[key]) {
                  mapped[key] = {
                      status: weekStatus, // Thừa hưởng status (Đã đăng ký)
                      availability_type: 'available',
                      isFullDay: true,
                      busyFrom: '08:00',
                      busyTo: '17:00',
                      isImplicit: true
                  };
              }
          }
      }

      return mapped;
  };

  useEffect(() => {
      setLoading(true);
      setTimeout(() => {
          const transformed = transformApiToState(API_RESPONSE.data, currentWeekStart);
          setWeekData(transformed);
          setLoading(false);
      }, 500);
  }, [currentWeekStart]);

  // --- HANDLERS ---
  const handlePrevWeek = () => setCurrentWeekStart(addDays(currentWeekStart, -7));
  const handleNextWeek = () => setCurrentWeekStart(addDays(currentWeekStart, 7));
  const currentWeekEnd = addDays(currentWeekStart, 6);
  const formatWeekRange = (start, end) => `${start.getDate()}/${start.getMonth()+1} — ${end.getDate()}/${end.getMonth()+1}`;

  const isLocked = (status) => status === 'approved' || status === 'rejected';

  const handleOpenEdit = (dateStr, dayLabel) => {
      setErrorMsg('');
      const currentConfig = weekData[dateStr] || { 
          availability_type: 'available', 
          isFullDay: true, 
          status: 'new',
          busyFrom: '08:00',
          busyTo: '17:00',
          reason: ''
      };
      
      setEditingDay({ 
          dateStr, 
          dayLabel, 
          ...currentConfig
      });
  };

  const handleReasonClick = (reason) => {
      setEditingDay(prev => ({ ...prev, reason: reason === "Khác" ? "" : reason }));
      if (reason !== "Khác") setErrorMsg('');
  };

  const handleConfirmEdit = () => {
      // Validation bắt buộc cho trường hợp BẬN
      if (!editingDay.isFullDay) {
          if (!editingDay.reason || editingDay.reason.trim() === '') {
              setErrorMsg('Vui lòng chọn hoặc nhập lý do bận');
              return;
          }
          if (!editingDay.busyFrom || !editingDay.busyTo) {
             setErrorMsg('Vui lòng nhập đầy đủ thời gian bận');
             return;
          }
      }

      // Prepare Data
      let type = editingDay.isFullDay ? 'available' : 'unavailable';
      const finalFrom = editingDay.isFullDay ? '08:00' : editingDay.busyFrom;
      const finalTo = editingDay.isFullDay ? '17:00' : editingDay.busyTo;

      setWeekData(prev => ({
          ...prev,
          [editingDay.dateStr]: {
              ...prev[editingDay.dateStr],
              status: 'new', // Đánh dấu local change
              availability_type: type,
              isFullDay: editingDay.isFullDay,
              reason: editingDay.reason,
              busyFrom: finalFrom,
              busyTo: finalTo,
          }
      }));
      setEditingDay(null);
  };

  const handleSendWeekRegistration = () => {
      const newWeekData = { ...weekData };
      let hasChanges = false;

      // Logic: Khi gửi, quét toàn bộ tuần
      // 1. Những ngày 'new' (user vừa sửa) -> Giữ nguyên, chuyển status 'pending'
      // 2. Những ngày chưa có data (trống) -> Tự điền Rảnh, status 'pending'
      // 3. Những ngày đã có status cũ -> Giữ nguyên (hoặc update lại thành pending tuỳ logic BE)

      for (let i = 0; i < 7; i++) {
          const date = addDays(currentWeekStart, i);
          const dateKey = formatDateKey(date);
          const existingData = newWeekData[dateKey];

          if (!existingData || existingData.status === 'new') {
              hasChanges = true;
              newWeekData[dateKey] = {
                  ...existingData,
                  status: 'pending', 
                  availability_type: existingData?.availability_type || 'available',
                  isFullDay: existingData?.isFullDay !== false, 
                  busyFrom: existingData?.busyFrom || '08:00',
                  busyTo: existingData?.busyTo || '17:00'
              };
          }
      }

      if (hasChanges) {
        setWeekData(newWeekData);
        alert("Đã gửi đăng ký cho cả tuần!");
      } else {
        alert("Tuần này đã được gửi duyệt rồi.");
      }
  };

  // --- RENDERERS ---
  const renderStatusBadge = (status) => {
      switch (status) {
          case 'approved': return <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded border border-green-200 flex items-center gap-1"><CheckCircle size={10}/> Đã duyệt</span>;
          case 'rejected': return <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded border border-red-200 flex items-center gap-1"><XCircle size={10}/> Từ chối</span>;
          case 'pending': return <span className="text-[10px] font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded border border-yellow-200 flex items-center gap-1"><Clock size={10}/> Chờ duyệt</span>;
          default: return <span className="text-[10px] text-gray-400">Chưa đăng ký</span>;
      }
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F5F5] font-sans relative">
      
      {/* Header */}
      <div className="bg-white pt-12 pb-3 px-4 shadow-sm flex items-center gap-2 sticky top-0 z-20">
        <button onClick={onBack}><ArrowLeft size={22} className="text-gray-700"/></button>
        <h1 className="text-[17px] font-bold text-gray-900">Đăng ký lịch làm việc</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        {/* Navigator */}
        <div className="bg-white p-3 mb-3 border-b border-gray-100">
            <div className="flex justify-between items-center bg-gray-50 rounded-xl p-1 border border-gray-200">
                <button onClick={handlePrevWeek} className="p-2 text-gray-500 active:text-orange-500"><ChevronLeft size={20}/></button>
                <span className="font-bold text-sm text-gray-800">{formatWeekRange(currentWeekStart, currentWeekEnd)}</span>
                <button onClick={handleNextWeek} className="p-2 text-gray-500 active:text-orange-500"><ChevronRight size={20}/></button>
            </div>
        </div>

        {/* List Days */}
        <div className="px-4 space-y-3">
            {loading ? <div className="text-center py-10"><Loader className="animate-spin mx-auto text-gray-400"/></div> : 
            [0, 1, 2, 3, 4, 5, 6].map((offset) => {
                const date = addDays(currentWeekStart, offset);
                const dateKey = formatDateKey(date);
                const data = weekData[dateKey] || { status: 'new', availability_type: 'available', isFullDay: true, busyFrom: '08:00', busyTo: '17:00' };
                const isUnavailable = data.availability_type === 'unavailable';
                const dayLabels = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
                const label = dayLabels[date.getDay()];

                let borderClass = 'border-l-orange-300';
                if (data.status === 'approved') borderClass = 'border-l-green-500';
                else if (data.status === 'rejected') borderClass = 'border-l-red-500';
                else if (data.status === 'pending') borderClass = 'border-l-yellow-400';

                return (
                    <div 
                        key={dateKey}
                        onClick={() => handleOpenEdit(dateKey, `${label}, ${date.getDate()}/${date.getMonth() + 1}`)}
                        className={`bg-white p-4 rounded-xl border border-gray-100 border-l-4 ${borderClass} shadow-sm flex items-center gap-3 active:scale-[0.98] transition-all relative overflow-hidden`}
                    >
                        {isLocked(data.status) && <div className="absolute right-2 top-2"><Lock size={14} className="text-gray-300"/></div>}
                        <div className="flex flex-col items-center min-w-[45px]">
                            <span className="text-[10px] font-bold uppercase text-black-500">{label}</span>
                            <span className="text-lg font-bold text-black-600">{date.getDate()}</span>
                        </div>
                        <div className="flex-1 pl-3 border-l border-gray-100">
                            <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2.5 h-2.5 rounded-full ${!isUnavailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className={`text-sm font-bold ${!isUnavailable ? 'text-green-700' : 'text-red-600'}`}>
                                        {data.status === 'new' ? 'Chưa đăng ký' : (!isUnavailable ? 'Rảnh' : 'Bận')}
                                    </span>
                                </div>
                                {renderStatusBadge(data.status)}
                            </div>
                            
                            <div className="mt-1 flex flex-col gap-0.5">
                                {/* Hiển thị lý do nếu Bận */}
                                {isUnavailable && <span className="text-xs font-medium text-gray-800">{data.reason}</span>}
                                
                                {/* HIỂN THỊ GIỜ BẬN: Luôn hiển thị nếu là Unavailable (kể cả chưa gửi) */}
                                {isUnavailable && (
                                    <span className="text-[10px] text-gray-500 bg-gray-50 w-fit px-1.5 py-0.5 rounded font-mono">
                                        {data.busyFrom} - {data.busyTo}
                                    </span>
                                )}
                            </div>

                            {data.status === 'rejected' && data.manager_note && (
                                <p className="text-[10px] text-red-500 mt-1 bg-red-50 p-1 rounded">Note: {data.manager_note}</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white p-4 border-t border-gray-100 shadow-lg z-30">
        <button onClick={handleSendWeekRegistration} className="w-full py-3.5 bg-[#E08C27] text-white font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
            <Save size={18} /> Gửi đăng ký
        </button>
      </div>

      {/* Modal Edit */}
      {editingDay && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-[2px]" onClick={() => setEditingDay(null)}>
            <div className="bg-white w-full rounded-t-[24px] p-5 animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 shrink-0"></div>
                
                {/* Modal Header */}
                <div className="flex justify-between mb-4 shrink-0">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{editingDay.dayLabel}</h3>
                        <p className="text-xs text-gray-500">{isLocked(editingDay.status) ? 'Đã được xử lý (Không thể sửa)' : 'Cập nhật trạng thái'}</p>
                    </div>
                    {renderStatusBadge(editingDay.status)}
                </div>

                <div className="overflow-y-auto flex-1 no-scrollbar pb-4">
                    {errorMsg && (
                        <div className="mb-4 bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl flex items-center gap-2 border border-red-100 animate-in fade-in slide-in-from-top-1">
                            <AlertCircle size={14}/> {errorMsg}
                        </div>
                    )}

                    {/* Switch Available/Unavailable */}
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl mb-4 border border-gray-100">
                        <div>
                            <span className="font-bold text-sm block">Đăng ký Rảnh</span>
                            <span className="text-xs text-gray-500">Rảnh cả ngày (08:00 - 17:00)</span>
                        </div>
                        <button 
                            disabled={isLocked(editingDay.status)}
                            onClick={() => {
                                const newIsFullDay = !editingDay.isFullDay;
                                setEditingDay({
                                    ...editingDay, 
                                    isFullDay: newIsFullDay,
                                    reason: newIsFullDay ? '' : editingDay.reason
                                });
                                setErrorMsg('');
                            }}
                            className={`w-12 h-7 rounded-full p-1 transition-colors relative 
                                ${editingDay.isFullDay ? 'bg-green-500' : 'bg-gray-300'}
                                ${isLocked(editingDay.status) ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${editingDay.isFullDay ? 'translate-x-5' : ''}`}></div>
                        </button>
                    </div>

                    {/* Form Input: Chỉ hiện khi BẬN */}
                    {!editingDay.isFullDay && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-top-2">
                            
                            {/* Time Input (24h) */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[11px] font-bold text-gray-500 uppercase mb-1 block">Bận từ (24h)</label>
                                    <input 
                                        type="time" 
                                        disabled={isLocked(editingDay.status)}
                                        value={editingDay.busyFrom || ''} 
                                        onChange={(e) => setEditingDay({...editingDay, busyFrom: e.target.value})} 
                                        className="w-full p-3 border rounded-xl font-bold text-center outline-none focus:border-orange-500 bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-gray-500 uppercase mb-1 block">Đến (24h)</label>
                                    <input 
                                        type="time" 
                                        disabled={isLocked(editingDay.status)}
                                        value={editingDay.busyTo || ''} 
                                        onChange={(e) => setEditingDay({...editingDay, busyTo: e.target.value})} 
                                        className="w-full p-3 border rounded-xl font-bold text-center outline-none focus:border-orange-500 bg-white"
                                    />
                                </div>
                            </div>

                            {/* Suggested Reasons Chips */}
                            <div>
                                <label className="text-[11px] font-bold text-gray-500 uppercase mb-2 block">Lý do bận <span className="text-red-500">*</span></label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {SUGGESTED_REASONS.map(r => (
                                        <button
                                            key={r}
                                            disabled={isLocked(editingDay.status)}
                                            onClick={() => handleReasonClick(r)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors
                                                ${editingDay.reason === r ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'}
                                            `}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                                <input 
                                    type="text" 
                                    disabled={isLocked(editingDay.status)}
                                    placeholder="Nhập lý do cụ thể..." 
                                    value={editingDay.reason || ''} 
                                    onChange={(e) => {
                                        setEditingDay({...editingDay, reason: e.target.value});
                                        if(e.target.value) setErrorMsg('');
                                    }} 
                                    className={`w-full p-3 border rounded-xl outline-none focus:border-orange-500 transition-colors ${errorMsg ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {!isLocked(editingDay.status) ? (
                    <button onClick={handleConfirmEdit} className="w-full py-3.5 bg-[#191919] text-white font-bold rounded-xl active:scale-95 transition-transform shrink-0">Xác nhận</button>
                ) : (
                    <button onClick={() => setEditingDay(null)} className="w-full py-3.5 bg-gray-100 text-gray-600 font-bold rounded-xl active:scale-95 transition-transform shrink-0">Đóng</button>
                )}
            </div>
        </div>
      )}
    </div>
  );
}
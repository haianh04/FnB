import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, User, Clock, MapPin, X, ArrowRightLeft } from 'lucide-react';

const getRoleColor = (roleName) => {
  const role = roleName.toUpperCase();
  if (role.includes("PHỤC VỤ")) return "bg-[#F97316]"; 
  if (role.includes("PHA CHẾ") || role.includes("BAR")) return "bg-blue-500"; 
  if (role.includes("THU NGÂN")) return "bg-green-500"; 
  if (role.includes("BẾP") || role.includes("CHEF")) return "bg-red-500"; 
  if (role.includes("QUẢN LÝ") || role.includes("MANAGER")) return "bg-purple-500";
  return "bg-gray-400"; 
};

// --- HELPER: DATE LOGIC ---
const getDayOfWeekName = (date) => {
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return days[date.getDay()];
};

const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

const generateWeekForDate = (selectedDateObj) => {
  const monday = getStartOfWeek(selectedDateObj);
  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push({
      fullDate: new Date(d),
      day: getDayOfWeekName(d),
      date: d.getDate().toString(),
      month: d.getMonth() + 1,
      year: d.getFullYear()
    });
  }
  return week;
};

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

const formatDateKey = (dateObj) => {
    return dateObj.getDate().toString(); 
};

// --- MOCK DATA: ĐỒNG NGHIỆP (Đã cập nhật nhiều hơn) ---
const SCHEDULE_DATA = [
  // Ngày 25
  { id: 1, date: "25", name: "HUY HỒ THÁI", time: "08:00 – 16:00", role: "PHỤC VỤ", location: "CHÚ BI" },
  { id: 2, date: "25", name: "LAN NGUYỄN", time: "16:00 – 22:00", role: "THU NGÂN", location: "CHÚ BI" },
  
  // Ngày 26
  { id: 3, date: "26", name: "QUẢN LÝ TUẤN", time: "08:00 – 17:00", role: "QUẢN LÝ", location: "CHÚ BI" },
  { id: 4, date: "26", name: "BẾP TRƯỞNG HÙNG", time: "09:00 – 14:00", role: "BẾP", location: "CHÚ BI" },
  { id: 5, date: "26", name: "LY LÊ THỊ", time: "13:30 – 22:30", role: "THU NGÂN", location: "CHÚ BI" },
  { id: 6, date: "26", name: "HƯƠNG ĐẬU", time: "18:00 – 22:00", role: "PHỤC VỤ", location: "CHÚ BI" },

  // Ngày 27
  { id: 7, date: "27", name: "TUẤN NGUYỄN", time: "17:45 – 22:30", role: "PHỤC VỤ", location: "CHÚ BI" },
  { id: 8, date: "27", name: "ANH PHA CHẾ", time: "18:00 – 22:00", role: "PHA CHẾ", location: "CHÚ BI" },

  // Ngày 28
  { id: 9, date: "28", name: "BẢO ANH", time: "08:00 – 16:00", role: "BẾP", location: "CHÚ BI" },
  { id: 10, date: "28", name: "LINH LAN", time: "08:00 – 12:00", role: "THU NGÂN", location: "CHÚ BI" },
];

export default function ScheduleView({ data = [] }) {
  const [activeTab, setActiveTab] = useState('myshifts');
  const [currentDateObj, setCurrentDateObj] = useState(new Date(2025, 10, 26)); 
  const [viewDate, setViewDate] = useState(new Date(2025, 10, 1)); 
  
  const [weekDays, setWeekDays] = useState([]); 
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [shiftDetail, setShiftDetail] = useState(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferReason, setTransferReason] = useState('');

  const scrollContainerRef = useRef(null);
  const sectionRefs = useRef({});
  const isClickingRef = useRef(false);

  useEffect(() => {
    const newWeek = generateWeekForDate(currentDateObj);
    setWeekDays(newWeek);
  }, [currentDateObj]);

  useEffect(() => {
    if (isCalendarOpen) {
        setViewDate(new Date(currentDateObj.getFullYear(), currentDateObj.getMonth(), 1));
    }
  }, [isCalendarOpen, currentDateObj]);

  const handleDateStripClick = (dateItem) => {
    setCurrentDateObj(dateItem.fullDate);
    isClickingRef.current = true;
    if (activeTab === 'myshifts') {
      const key = formatDateKey(dateItem.fullDate);
      const section = sectionRefs.current[key];
      if (section && scrollContainerRef.current) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => { isClickingRef.current = false; }, 600);
      }
    } else {
        setTimeout(() => { isClickingRef.current = false; }, 100);
    }
  };

  const handleMonthCalendarClick = (day) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    setCurrentDateObj(newDate);
    setIsCalendarOpen(false);
  };

  const changeMonth = (offset) => {
      const newViewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
      setViewDate(newViewDate);
  };

  const handleScroll = () => {
    if (isClickingRef.current || activeTab !== 'myshifts') return;
    const container = scrollContainerRef.current;
    if (!container) return;

    let closestDate = null;
    let minDistance = Infinity;

    weekDays.forEach((dayItem) => {
      const key = formatDateKey(dayItem.fullDate);
      const element = sectionRefs.current[key];
      if (element) {
        const rect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const distance = Math.abs(rect.top - containerRect.top - 120); 
        if (distance < minDistance) {
          minDistance = distance;
          closestDate = dayItem;
        }
      }
    });

    if (closestDate && formatDateKey(closestDate.fullDate) !== formatDateKey(currentDateObj)) {
        setCurrentDateObj(closestDate.fullDate);
    }
  };

  const selectedDateStr = formatDateKey(currentDateObj);
  const myShiftDatesSet = new Set(data.map(g => g.date));
  
  const shiftsOnSelectedDate = data.find(g => g.date === selectedDateStr)?.shifts || [];
  const myShiftsAsStaff = shiftsOnSelectedDate.map(shift => ({
      id: `my_${shift.id}`, name: "Huỳnh Đức Tùng", time: shift.time, role: shift.role, location: shift.location, isMe: true
  }));
  
  const colleagues = SCHEDULE_DATA.filter(s => s.date === selectedDateStr);
  const fullSchedule = [...myShiftsAsStaff, ...colleagues].sort((a, b) => a.time.localeCompare(b.time));

  const numDays = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const startDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth()); 
  const adjustedStartDay = startDay === 0 ? 6 : startDay - 1; 
  const emptyDays = Array.from({ length: adjustedStartDay });
  const daysArray = Array.from({ length: numDays }, (_, i) => i + 1);

  const isDayInSelectedWeek = (day) => {
    const checkDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const startOfWeek = getStartOfWeek(currentDateObj);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    checkDate.setHours(0,0,0,0); startOfWeek.setHours(0,0,0,0); endOfWeek.setHours(0,0,0,0);
    return checkDate >= startOfWeek && checkDate <= endOfWeek;
  };

  return (
    <div className="flex flex-col w-full h-full bg-white font-sans text-left relative">
      <div className="pt-4 px-4 bg-white z-30 sticky top-0 border-b border-gray-100 shadow-[0_4px_10px_-5px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3 mb-4 select-none">
          <Calendar className="w-6 h-6 text-gray-500" />
          <div onClick={() => setIsCalendarOpen(!isCalendarOpen)} className="flex items-center gap-1 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 -ml-2 transition-colors relative">
            <span className="text-[20px] font-bold text-gray-900">Tháng {currentDateObj.getMonth() + 1}</span>
            {isCalendarOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
          </div>
        </div>

        {isCalendarOpen && (
            <div className="absolute top-[50px] left-4 bg-white shadow-2xl rounded-2xl border border-gray-100 p-4 w-[320px] z-50 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-4 px-1">
                    <button onClick={(e) => { e.stopPropagation(); changeMonth(-1); }} className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft className="w-5 h-5 text-gray-600"/></button>
                    <span className="font-bold text-gray-800">Tháng {viewDate.getMonth() + 1}, {viewDate.getFullYear()}</span>
                    <button onClick={(e) => { e.stopPropagation(); changeMonth(1); }} className="p-1 hover:bg-gray-100 rounded-full"><ChevronRight className="w-5 h-5 text-gray-600"/></button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">{['T2','T3','T4','T5','T6','T7','CN'].map(d => <div key={d} className="text-xs font-bold text-gray-400 py-1">{d}</div>)}</div>
                <div className="grid grid-cols-7 gap-y-2 gap-x-0">
                    {emptyDays.map((_, i) => <div key={`empty-${i}`}></div>)}
                    {daysArray.map(day => {
                        const isSelected = day === currentDateObj.getDate() && viewDate.getMonth() === currentDateObj.getMonth();
                        const inWeek = isDayInSelectedWeek(day);
                        return (
                            <div key={day} onClick={() => handleMonthCalendarClick(day)} className={`h-9 flex items-center justify-center text-sm font-medium cursor-pointer relative ${inWeek ? 'bg-orange-50 first:rounded-l-lg last:rounded-r-lg' : ''}`}>
                                <div className={`w-8 h-8 flex items-center justify-center rounded-full z-10 transition-all ${isSelected ? 'bg-[#F97316] text-white shadow-md scale-105' : inWeek ? 'text-[#F97316] font-bold' : 'text-gray-700 hover:bg-gray-100'}`}>{day}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}

        <div className="bg-[#F2F2F2] p-[3px] rounded-xl mb-4 flex relative z-10">
           <button onClick={() => { setActiveTab('myshifts'); setIsCalendarOpen(false); }} className={`flex-1 py-1.5 text-[13px] font-bold rounded-lg transition-all ${activeTab === 'myshifts' ? 'bg-[#191919] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Ca của tôi</button>
           <button onClick={() => { setActiveTab('schedule'); setIsCalendarOpen(false); }} className={`flex-1 py-1.5 text-[13px] font-bold rounded-lg transition-all ${activeTab === 'schedule' ? 'bg-[#191919] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Lịch làm việc</button>
        </div>

        <div className="flex justify-between pb-3 relative z-10 overflow-x-auto no-scrollbar touch-pan-x">
           {weekDays.map((item) => {
             const key = formatDateKey(item.fullDate);
             const isSelected = key === selectedDateStr;
             const hasShift = myShiftDatesSet.has(key);
             return (
               <div key={key} onClick={() => handleDateStripClick(item)} className="flex flex-col items-center gap-1 cursor-pointer select-none group min-w-[14%] shrink-0">
                 <span className={`text-[11px] font-medium ${isSelected ? 'text-[#F97316]' : 'text-gray-400'}`}>{item.day}</span>
                 <div className={`w-9 h-9 flex items-center justify-center rounded-xl text-[14px] font-bold transition-all duration-300 ${isSelected ? 'bg-[#F97316] text-white shadow-md shadow-orange-100 scale-110' : 'text-gray-600 hover:bg-gray-50'}`}>{item.date}</div>
                 <div className={`w-1.5 h-1.5 rounded-full mt-1 transition-colors duration-300 ${isSelected ? 'bg-[#F97316]' : (hasShift ? 'bg-gray-300' : 'bg-transparent')}`}></div>
               </div>
             )
           })}
        </div>
      </div>

      <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
        {activeTab === 'myshifts' && (
          <div className="flex flex-col pb-20 pt-2">
             {weekDays.map((dayItem) => {
               const key = formatDateKey(dayItem.fullDate);
               const dayGroup = data.find(g => g.date === key); 
               
               return (
                 <div key={key} ref={(el) => (sectionRefs.current[key] = el)} className="flex flex-col border-b border-gray-50 last:border-0 scroll-mt-[180px]">
                    {dayGroup ? (
                        dayGroup.shifts.map((shift, index) => (
                            <div key={shift.id} onClick={() => setShiftDetail(shift)} className="flex py-5 px-5 hover:bg-gray-50 transition-colors cursor-pointer group items-start text-left">
                                <div className="w-14 shrink-0 pt-0.5 text-left">
                                    {index === 0 && (
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-medium text-[#F97316]">{dayItem.day}</span>
                                            <span className="text-[22px] font-bold text-[#333] tracking-tight">{dayItem.date}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 flex justify-between items-center pl-2">
                                    <div className="flex flex-col gap-1.5 items-start text-left w-full">
                                        <span className="text-[16px] font-bold text-[#111]">{shift.time}</span>
                                        <span className="text-[13px] text-[#555] font-medium uppercase">{shift.location}</span>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <div className={`w-2 h-2 rounded-full ${getRoleColor(shift.role)}`}></div>
                                            <span className="text-[12px] text-gray-500 font-medium uppercase tracking-wide">{shift.role}</span>
                                        </div>
                                        {shift.transferFrom && (
                                            <div className="mt-2 text-[11px] text-purple-600 bg-purple-50 px-2 py-1 rounded border border-purple-100 flex items-center gap-1 w-fit animate-in fade-in zoom-in">
                                                <ArrowRightLeft size={10}/> 
                                                <span>Từ: <b>{shift.transferFrom}</b></span>
                                            </div>
                                        )}
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#F97316] transition-colors" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex py-5 px-5 opacity-50 min-h-[80px]">
                            <div className="w-14 shrink-0 pt-0.5 text-left">
                                <div className="flex flex-col">
                                    <span className="text-[13px] font-medium text-gray-400">{dayItem.day}</span>
                                    <span className="text-[22px] font-bold text-gray-300 tracking-tight">{dayItem.date}</span>
                                </div>
                            </div>
                            <div className="flex-1 flex items-center pl-2 text-sm text-gray-400 italic">Không có ca làm việc</div>
                        </div>
                    )}
                 </div>
               );
             })}
             <div className="h-[200px] flex items-center justify-center text-gray-300 text-xs italic">Hết tuần</div>
          </div>
        )}

        {activeTab === 'schedule' && (
           <div className="flex flex-col pb-20 pt-2">
              <div className="px-5 py-3 text-left">
                 <div className="flex items-baseline gap-2">
                    <span className="text-[#F97316] font-medium text-[14px]">{weekDays.find(d => formatDateKey(d.fullDate) === selectedDateStr)?.day || ''}</span>
                    <span className="text-[20px] font-bold text-[#333]">Ngày {selectedDateStr}</span>
                 </div>
              </div>
              {fullSchedule.length === 0 ? (
                <div className="px-5 py-10 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3"><User className="w-8 h-8 text-gray-300" /></div>
                    <p className="text-gray-500 font-medium text-sm">Không có lịch làm việc ngày này.</p>
                </div>
              ) : (
                fullSchedule.map((staff) => (
                  <div key={staff.id} className={`flex items-start gap-4 px-5 py-4 border-b border-gray-50 last:border-0 text-left ${staff.isMe ? 'bg-orange-50/50' : 'hover:bg-gray-50'}`}>
                     <div className="shrink-0 pt-1">
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center border ${staff.isMe ? 'bg-[#F97316] border-[#F97316] text-white' : 'bg-gray-100 border-gray-200 text-gray-400'}`}><User className="w-6 h-6" /></div>
                     </div>
                     <div className="flex flex-col gap-1 flex-1 items-start text-left">
                        <h3 className={`text-[14px] font-bold uppercase leading-tight ${staff.isMe ? 'text-[#F97316]' : 'text-[#333]'}`}>{staff.name}</h3>
                        <span className="text-[13px] text-[#666] font-medium">{staff.time}</span>
                        <div className="flex items-center gap-2 mt-1">
                           <div className={`w-2 h-2 rounded-full ${getRoleColor(staff.role)}`}></div>
                           <span className="text-[11px] text-gray-400 uppercase font-medium tracking-wide">{staff.role}</span>
                        </div>
                     </div>
                  </div>
                ))
              )}
           </div>
        )}
      </div>

      {shiftDetail && (
        <div className="absolute inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity" onClick={() => setShiftDetail(null)}></div>
          <div className="bg-white w-full rounded-t-[30px] p-6 relative z-10 animate-in slide-in-from-bottom-full duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
            <div className="flex justify-between items-start mb-6">
              <div><h2 className="text-[20px] font-bold text-gray-900">Chi tiết ca làm</h2><div className="flex items-center gap-2 mt-1"><div className={`w-2 h-2 rounded-full ${getRoleColor(shiftDetail.role)}`}></div><span className="text-sm text-gray-500 font-medium uppercase">{shiftDetail.role}</span></div></div>
              <button onClick={() => setShiftDetail(null)} className="bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-gray-200"><X size={20}/></button>
            </div>
            <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100"><div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#F97316] shadow-sm"><Clock className="w-5 h-5" /></div><div><p className="text-[11px] text-gray-400 uppercase font-bold tracking-wider">Thời gian</p><p className="font-bold text-[14px] text-gray-800">{shiftDetail.time}</p></div></div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100"><div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#F97316] shadow-sm"><MapPin className="w-5 h-5" /></div><div><p className="text-[11px] text-gray-400 uppercase font-bold tracking-wider">Địa điểm</p><p className="font-bold text-[14px] text-gray-800">{shiftDetail.location}</p></div></div>
                {shiftDetail.transferFrom && (
                    <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-2xl border border-purple-100"><div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-purple-500 shadow-sm"><ArrowRightLeft className="w-5 h-5" /></div><div><p className="text-[11px] text-gray-400 uppercase font-bold tracking-wider">Người chuyển ca</p><p className="font-bold text-[14px] text-gray-800">{shiftDetail.transferFrom}</p></div></div>
                )}
            </div>
            <button onClick={() => setIsTransferModalOpen(true)} className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-[#F97316] text-white shadow-lg shadow-orange-200 active:scale-95 transition-transform"><ArrowRightLeft size={20}/>Chuyển ca này đi</button>
          </div>
        </div>
      )}
      {isTransferModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsTransferModalOpen(false)}></div>
          <div className="bg-white w-full max-w-md rounded-lg p-6 relative z-10 shadow-lg">
            <h3 className="text-lg font-bold mb-3">Lý do chuyển ca</h3>
            <textarea value={transferReason} onChange={(e) => setTransferReason(e.target.value)} placeholder="Nhập lý do..." className="w-full h-28 p-3 border border-gray-200 rounded resize-none focus:outline-none"/>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setIsTransferModalOpen(false)} className="px-4 py-2 rounded-lg border bg-white text-gray-700">Hủy</button>
              <button onClick={() => { setIsTransferModalOpen(false); setTransferReason(''); }} className="px-4 py-2 rounded-lg bg-[#F97316] text-white font-bold">Gửi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
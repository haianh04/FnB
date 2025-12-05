import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Plus, 
  Clock, Trash2, Edit2, MapPin, 
  X, Calendar as ArrowRightLeft 
} from 'lucide-react';

// --- HELPER: STYLE MÀU THEO VAI TRÒ ---
const getShiftStyle = (shift) => {
  // 1. Ca CHUYỂN NHƯỢNG -> Xanh lá cây đậm
  if (shift.transferFrom) {
    return {
      container: 'bg-emerald-100 border-emerald-400 border-l-[4px] border-l-emerald-700',
      text: 'text-emerald-900',
      icon: 'text-emerald-700',
      footerBorder: 'border-emerald-300',
      footerText: 'text-emerald-800'
    };
  }

  // 2. Ca THƯỜNG -> Màu vàng nhạt
  return {
    container: 'bg-[#FFF7ED] border-orange-300 border-l-[3px] border-l-[#F97316]',
    text: 'text-gray-900',
    icon: 'text-[#F97316]',
    footerBorder: 'border-orange-200',
    footerText: 'text-gray-500'
  };
};

// Helper tạo màu Avatar Role
const getAvatarColor = (name) => {
  const colors = [
    'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 
    'bg-green-500', 'bg-yellow-500', 'bg-indigo-500',
    'bg-teal-500', 'bg-rose-500', 'bg-cyan-500'
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

// --- MOCK DATA ---
const EMPLOYEES = [
  { id: 'emp_1', name: 'Nguyễn Văn A' },
  { id: 'emp_2', name: 'Trần Thị B' },
  { id: 'emp_3', name: 'Lê Văn C' },
  { id: 'emp_4', name: 'Phạm Thị D' },
];

const DEPARTMENTS = [
  {
    id: 'dep_kitchen',
    name: 'Khu bếp',
    roles: [
      { id: 'role_chef', name: 'Đầu bếp' },
      { id: 'role_washer', name: 'Rửa bát' },
    ]
  },
  {
    id: 'dep_service',
    name: 'Khu phục vụ',
    roles: [
      { id: 'role_waiter', name: 'Phục vụ' },
      { id: 'role_reception', name: 'Lễ tân' },
    ]
  }
];

const INITIAL_SHIFTS = [
  { id: 's1', roleId: 'role_chef', date: '2025-12-01', name: 'Nguyễn Văn A', start: '09:00', end: '17:00' },
  { id: 's2', roleId: 'role_chef', date: '2025-12-02', name: 'Nguyễn Văn A', start: '09:00', end: '17:00' },
  { 
    id: 's3', roleId: 'role_waiter', date: '2025-12-03', name: 'Lê Văn C', 
    start: '17:00', end: '22:00', transferFrom: 'Trần Thị B', note: 'Đổi ca gấp'
  },
  { id: 's4', roleId: 'role_waiter', date: '2025-12-01', name: 'Trần Thị B', start: '08:00', end: '16:00' },
  { id: 's5', roleId: 'role_reception', date: '2025-12-05', name: 'Phạm Thị D', start: '16:00', end: '22:00' },
  { id: 's6', roleId: 'role_washer', date: '2025-12-02', name: 'Lê Văn C', start: '08:00', end: '14:00' },
];

const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
  return new Date(d.setDate(diff));
};

const formatDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const WEEK_DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export default function WebSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 1)); 
  const [shifts, setShifts] = useState(INITIAL_SHIFTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newShiftData, setNewShiftData] = useState({
    employeeId: '', roleId: '', date: '', start: '09:00', end: '17:00', note: '', applyDays: []
  });

  const startOfWeek = getStartOfWeek(currentDate);
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const handlePrevWeek = () => { const d = new Date(currentDate); d.setDate(d.getDate() - 7); setCurrentDate(d); };
  const handleNextWeek = () => { const d = new Date(currentDate); d.setDate(d.getDate() + 7); setCurrentDate(d); };

  const openCreateModal = () => {
    setNewShiftData({ employeeId: '', roleId: '', date: formatDateKey(new Date()), start: '09:00', end: '17:00', note: '', applyDays: [] });
    setIsModalOpen(true);
  };

  const openQuickAddModal = (dateStr, roleId) => {
    const d = new Date(dateStr);
    let dayIndex = d.getDay() === 0 ? 6 : d.getDay() - 1; 
    setNewShiftData({ employeeId: '', roleId: roleId, date: dateStr, start: '09:00', end: '17:00', note: '', applyDays: [dayIndex] });
    setIsModalOpen(true);
  };

  const handleSaveShift = () => {
    if(!newShiftData.employeeId || !newShiftData.roleId) return alert("Vui lòng chọn nhân viên và vị trí!");
    const empName = EMPLOYEES.find(e => e.id === newShiftData.employeeId)?.name;
    const newShift = {
        id: Date.now().toString(),
        roleId: newShiftData.roleId,
        date: newShiftData.date,
        name: empName,
        start: newShiftData.start,
        end: newShiftData.end,
        ...(newShiftData.note && { note: newShiftData.note }) 
    };
    setShifts([...shifts, newShift]);
    setIsModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 font-sans text-gray-800 p-6 overflow-hidden relative">
        
      {/* 1. HEADER & TOOLBAR */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Lịch làm việc</h1>
          <div className="flex items-center bg-white rounded-lg border border-gray-300 shadow-sm px-1 py-1">
            <button onClick={handlePrevWeek} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"><ChevronLeft size={18}/></button>
            <span className="px-4 text-sm font-semibold text-gray-700 min-w-[180px] text-center">
              {weekDates[0].getDate()}/{weekDates[0].getMonth() + 1} — {weekDates[6].getDate()}/{weekDates[6].getMonth() + 1}, {weekDates[0].getFullYear()}
            </span>
            <button onClick={handleNextWeek} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"><ChevronRight size={18}/></button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-orange-50 text-[#F97316] text-sm font-bold rounded-lg hover:bg-orange-100 transition-colors">Hôm nay</button>
          <div className="relative">
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                <MapPin size={16} className="text-[#F97316]"/>
                <span className="text-gray-700">Nhà hàng Chubi</span>
             </button>
          </div>
          <button onClick={openCreateModal} className="flex items-center gap-2 px-4 py-2 bg-[#F97316] text-white text-sm font-bold rounded-lg hover:bg-orange-700 shadow-md transition-transform active:scale-95">
            <Plus size={18} /> Tạo ca mới
          </button>
        </div>
      </div>

      {/* 2. MAIN SCHEDULE GRID */}
      <div className="flex-1 bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden flex flex-col">
        
        {/* A. TABLE HEADER */}
        <div className="flex border-b border-gray-300 shrink-0 bg-gray-50">
          <div className="w-48 flex-shrink-0 bg-gray-50 border-r border-gray-300"></div>
          <div className="flex-1 grid grid-cols-7 divide-x divide-gray-300">
            {weekDates.map((date, index) => {
              const isToday = formatDateKey(date) === formatDateKey(new Date());
              return (
                <div key={index} className="py-3 text-center">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">{WEEK_DAYS[index]}</p>
                  <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${isToday ? 'bg-[#F97316] text-white' : 'text-gray-800'}`}>
                    <span className="text-lg font-bold">{date.getDate()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* B. DEPARTMENTS LOOP */}
        <div className="flex-1 overflow-auto">
          {DEPARTMENTS.map((dept) => (
            <div key={dept.id} className="flex flex-col">
              <div className="bg-slate-700 text-white px-6 py-2.5 font-bold text-xs uppercase tracking-wide border-y border-slate-600 sticky left-0 z-10">
                {dept.name}
              </div>
              {dept.roles.map((role) => (
                <div key={role.id} className="flex border-b border-gray-300 hover:bg-orange-50/20 transition-colors min-h-[100px]">
                  
                  {/* Cột Tên Vai Trò */}
                  <div className="w-48 flex-shrink-0 p-4 flex items-center gap-3 border-r border-gray-300 bg-gray-50/30">
                    <div className={`w-9 h-9 rounded-lg ${getAvatarColor(role.name)} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                      {role.name.charAt(0)}
                    </div>
                    <span className="font-bold text-gray-700 text-sm">{role.name}</span>
                  </div>

                  {/* Lưới 7 ngày */}
                  <div className="flex-1 grid grid-cols-7 divide-x divide-gray-300">
                    {weekDates.map((date, index) => {
                      const dateStr = formatDateKey(date);
                      const dayShifts = shifts.filter(s => s.date === dateStr && s.roleId === role.id);

                      return (
                        <div key={index} className="p-2 relative group flex flex-col gap-2 min-h-[100px]">
                          {/* Nút + */}
                          <button onClick={() => openQuickAddModal(dateStr, role.id)} className="absolute inset-0 z-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-gray-50/50 cursor-pointer">
                             <div className="bg-white text-[#F97316] p-1.5 rounded-full border border-orange-300 shadow-sm hover:scale-110 transition-transform">
                                <Plus size={16} />
                             </div>
                          </button>

                          {dayShifts.map(shift => {
                            const style = getShiftStyle(shift);
                            
                            return (
                              <div 
                                key={shift.id} 
                                className={`
                                  relative z-10 border rounded-lg p-2 shadow-sm hover:shadow-md transition-all cursor-pointer group/card
                                  ${style.container}
                                `}
                              >
                                <p className={`font-bold text-xs truncate mb-1 ${style.text}`}>{shift.name}</p>
                                
                                <div className={`flex items-center text-[10px] gap-1 ${style.text} opacity-90`}>
                                  {/* --- ĐỔI ICON Ở ĐÂY --- */}
                                  {shift.transferFrom ? (
                                    // Nếu là ca chuyển -> Icon Mũi tên 2 chiều
                                    <Clock size={10} className={style.icon} />
                                  ) : (
                                    // Nếu là ca thường -> Icon Đồng hồ
                                    <Clock size={10} className={style.icon} /> 
                                  )}
                                  <span className="font-medium">{shift.start} - {shift.end}</span>
                                </div>

                                {shift.transferFrom && (
                                  <div className={`mt-1.5 pt-1.5 border-t ${style.footerBorder} flex items-start gap-1`}>
                                      <ArrowRightLeft size={10} className={`${style.icon} mt-0.5`}/>
                                      <p className={`text-[9px] ${style.footerText} italic leading-tight`}>
                                          Từ: <b>{shift.transferFrom}</b>
                                      </p>
                                  </div>
                                )}
                                
                                {/* Actions */}
                                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity bg-white/90 rounded px-1 shadow-sm border border-gray-200">
                                  <button className="p-0.5 hover:text-blue-600 text-gray-500"><Edit2 size={12}/></button>
                                  <button className="p-0.5 hover:text-red-600 text-gray-500"><Trash2 size={12}/></button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800">Tạo ca làm mới</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nhân Viên</label>
                            <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:border-[#F97316] outline-none bg-white" value={newShiftData.employeeId} onChange={(e) => setNewShiftData({...newShiftData, employeeId: e.target.value})}>
                                <option value="">Chọn nhân viên</option>
                                {EMPLOYEES.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Vị trí</label>
                            <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:border-[#F97316] outline-none bg-white" value={newShiftData.roleId} onChange={(e) => setNewShiftData({...newShiftData, roleId: e.target.value})}>
                                <option value="">Chọn vị trí</option>
                                {DEPARTMENTS.flatMap(d => d.roles).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Giờ bắt đầu</label>
                            <div className="relative"><input type="time" className="w-full border border-gray-300 rounded-lg pl-3 pr-10 py-2.5 text-sm focus:border-[#F97316] outline-none" value={newShiftData.start} onChange={(e) => setNewShiftData({...newShiftData, start: e.target.value})} /><Clock size={16} className="absolute right-3 top-3 text-gray-400"/></div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Giờ kết thúc</label>
                            <div className="relative"><input type="time" className="w-full border border-gray-300 rounded-lg pl-3 pr-10 py-2.5 text-sm focus:border-[#F97316] outline-none" value={newShiftData.end} onChange={(e) => setNewShiftData({...newShiftData, end: e.target.value})} /><Clock size={16} className="absolute right-3 top-3 text-gray-400"/></div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Ghi chú</label>
                        <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#F97316] outline-none resize-none" rows={2} placeholder="Thêm ghi chú..." value={newShiftData.note} onChange={(e) => setNewShiftData({...newShiftData, note: e.target.value})}></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Áp dụng cho</label>
                        <div className="flex gap-2">
                            {WEEK_DAYS.map((day, index) => {
                                const isActive = newShiftData.applyDays.includes(index);
                                return (
                                    <button key={index} onClick={() => {
                                            const current = newShiftData.applyDays;
                                            const newDays = current.includes(index) ? current.filter(i => i !== index) : [...current, index];
                                            setNewShiftData({...newShiftData, applyDays: newDays});
                                        }}
                                        className={`w-10 h-10 rounded-full text-xs font-bold transition-all border ${isActive ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
                                    >{day}</button>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                    <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors">Hủy</button>
                    <button onClick={handleSaveShift} className="px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-[#F97316] hover:bg-orange-700 shadow-md transition-colors">Lưu</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
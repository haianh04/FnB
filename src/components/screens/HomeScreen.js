import React, { useState } from 'react';
import { Bell, User, ChevronRight, LogIn, LogOut, Clock, Calendar } from 'lucide-react';
import CheckInCard from '../common/CheckInCard';
import LeaveRequestModal from '../LeaveRequest';
import { getTodayKey, getFormattedDate, getCurrentTime, getRoleBadgeStyle } from '../../utils/helpers';

export default function HomeScreen({ user, myShifts, onNavigate }) {
  const [attendanceStatus, setAttendanceStatus] = useState('none'); 
  const [logs, setLogs] = useState([]);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Logic lấy ca làm
  const todayKey = getTodayKey();
  const todayData = myShifts.find(d => d.date === todayKey);
  const todayShift = todayData?.shifts?.[0]; 

  const nextShift = myShifts
    .filter(d => d.date !== todayKey)
    .flatMap(d => d.shifts.map(s => ({ ...s, dateStr: d.date, dayStr: d.day })))
    .sort((a, b) => a.id - b.id)[0];

  const handleCheckIn = () => {
    const time = getCurrentTime();
    setAttendanceStatus('checked_in');
    setLogs(prev => [{ type: 'in', time: time, date: getFormattedDate() }, ...prev]);
  };

  const handleCheckOut = () => {
    const time = getCurrentTime();
    setAttendanceStatus('checked_out');
    setLogs(prev => [{ type: 'out', time: time, date: getFormattedDate() }, ...prev]);
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F5F5] font-sans relative overflow-hidden">
      
      {/* 1. HEADER CAM (Phần nền phía trên) */}
      <div className="bg-gradient-to-br from-[#FF8C00] to-[#E05900] pt-[56px] pb-[100px] px-[16px] rounded-b-[24px] relative shrink-0 z-0">
        {/* Date Badge (Nằm trong Header) */}
         <div className="inline-flex items-center gap-2">
            <Calendar size={14} className="text-white"/>
            <span className="text-[12px] font-semibold text-white">{getFormattedDate()}</span>
         </div>     
         {/* Top Info Row */}
         <div className="flex justify-between items-start mb-4">
             <div className="flex gap-3 items-center">
                 {/* Avatar */}
                 <div className="w-[48px] h-[48px] rounded-[28px] border-2 border-white p-[2px]">
                    <div className="w-full h-full rounded-[28px] bg-white flex items-center justify-center overflow-hidden text-[#E05900]">
                        <User size={24} strokeWidth={2.5}/>
                    </div>
                 </div>
                 {/* Text Info */}
                 <div className="text-white flex flex-col">
                     <p className="text-[14px] font-normal leading-[20px] opacity-90">Xin chào,</p>
                     <h2 className="text-[18px] font-bold leading-[24px]">{user.fullName}</h2>
                 </div>
             </div>
             
             {/* Bell */}
             <button 
                onClick={() => onNavigate('notifications')}
                className="w-[40px] h-[40px] bg-white/20 rounded-full flex items-center justify-center relative backdrop-blur-sm"
             >
                 <Bell size={20} className="text-white" strokeWidth={2}/>
                 <span className="absolute top-[8px] right-[10px] w-[8px] h-[8px] bg-red-500 rounded-full border border-[#E05900]"></span>
             </button>
         </div>
      </div>

      {/* 2. BODY CONTENT (Đè lên Header) */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden z-10 no-scrollbar flex flex-col gap-[16px] px-4 -mt-[80px]">
        
        {/* === THẺ CHẤM CÔNG (CheckInCard) === */}
        <CheckInCard 
            shift={todayShift}
            attendanceStatus={attendanceStatus}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onRequestLeave={() => setShowLeaveModal(true)}
        />

        {/* === THÔNG TIN CA LÀM (CurrentShiftInfo) - Màu xanh nhạt === */}
        {todayShift ? (
            <div className="bg-[#fff3e6] rounded-[16px] p-4 flex flex-col gap-2 relative border border-[#ffe5cc]">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 flex items-center justify-center">
                        <Clock size={20} className="text-[#c52c2c]" /> 
                    </div>
                    <p className="text-[14px] font-semibold text-[#c52c2c]">Bạn có 1 ca làm hôm nay</p>
                </div>

                <p className="text-[24px] font-bold text-[#191919] leading-[32px]">
                    {todayShift.time}
                </p>

                <div className="flex items-center gap-2 mt-1">
                    <div className="w-[6px] h-[6px] bg-[#D3602D] rounded-full"></div>
                    <p className="text-[14px] font-medium text-[#666b70] uppercase tracking-wide">
                        {todayShift.role} | {todayShift.location}
                    </p>
                </div>
            </div>
        ) : (
            <div className="bg-white rounded-[16px] p-4 text-center text-gray-400 text-sm italic shadow-sm">
                Hôm nay không có ca làm việc
            </div>
        )}

        {/* === HOẠT ĐỘNG HÔM NAY === */}
        <div className="mt-2">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-[16px] font-bold text-[#191919]">Hoạt động hôm nay</h3>
                <button className="text-[14px] font-semibold text-[#d3602d] flex items-center gap-1 hover:underline">
                    Xem lịch sử <ChevronRight size={16}/>
                </button>
            </div>

            <div className="bg-white rounded-[16px] border border-[#e5e7eb] shadow-sm overflow-hidden">
                {logs.length > 0 ? (
                    logs.map((log, index) => (
                        <div key={index} className="flex items-center gap-4 px-4 py-3 border-b border-[#e5e7eb] last:border-0">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${log.type === 'in' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
                                {log.type === 'in' ? <LogIn size={18}/> : <LogOut size={18}/>}
                            </div>
                            <div className="flex-1">
                                <p className="text-[14px] font-semibold text-[#191919]">
                                    {log.type === 'in' ? 'Chấm vào' : 'Chấm ra'}
                                </p>
                                <p className="text-[12px] text-[#666b70] mt-0.5">{log.date}</p>
                            </div>
                            <span className="text-[14px] font-mono font-medium text-[#191919]">
                                {log.time}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="py-6 text-center text-gray-400 text-sm">Chưa có hoạt động nào</div>
                )}
            </div>
        </div>

        {/* === CA LÀM SẮP TỚI === */}
        <div className="pb-8">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-[16px] font-bold text-[#191919]">Ca làm sắp tới</h3>
                <button onClick={() => onNavigate('schedule')} className="text-[14px] font-semibold text-[#d3602d] flex items-center gap-1 hover:underline">
                    View all <ChevronRight size={16}/>
                </button>
            </div>

            {nextShift ? (
                <div className="bg-white rounded-[16px] p-4 border border-[#e5e7eb] shadow-sm flex items-center gap-4">
                    <div className="bg-[#ffe5cc85] rounded-[12px] min-w-[64px] h-[72px] flex flex-col items-center justify-center border border-orange-100">
                        <span className="text-[11px] font-medium text-black uppercase">{nextShift.dayStr}</span>
                        <span className="text-[22px] font-bold text-[#191919] leading-none my-0.5">{nextShift.dateStr}</span>
                        <span className="text-[10px] font-medium text-black uppercase">THÁNG 11</span>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                        <p className="text-[16px] font-bold text-[#191919] mb-1">{nextShift.time}</p>
                        <p className="text-[13px] font-medium text-[#666b70] mb-1">UNCLE BI</p>
                        <div className="flex items-center gap-2">
                            <div className={`w-[5px] h-[5px] rounded-full ${getRoleBadgeStyle(nextShift.role)}`}></div>
                            <p className="text-[12px] font-medium text-[#666b70] uppercase">
                                {nextShift.role}
                            </p>
                        </div>
                    </div>
                    
                </div>
            ) : (
                <div className="text-center text-gray-400 text-sm py-4 border-2 border-dashed border-gray-200 rounded-[16px]">
                    Không có ca sắp tới
                </div>
            )}
        </div>

      </div>

      {/* --- MODALS --- */}
      {showLeaveModal && <LeaveRequestModal onClose={() => setShowLeaveModal(false)} />}

    </div>
  );
}
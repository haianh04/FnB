import React, { useState, useEffect } from 'react';
import { Bell, User, ChevronRight, LogIn, LogOut, Clock, Calendar } from 'lucide-react';
import CheckInCard from '../common/CheckInCard';
import LeaveRequestModal from '../LeaveRequest';
import { getTodayKey, getFormattedDate } from '../../utils/helpers';

export default function HomeScreen({ user, myShifts, onNavigate }) {
  const [attendanceStatus, setAttendanceStatus] = useState('none');
  const [logs, setLogs] = useState([]);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // State thời gian thực để kiểm tra logic mỗi phút
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    // Cập nhật thời gian mỗi phút để refresh logic check-in
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

// 1. Lấy ca làm hôm nay
  const todayKey = getTodayKey(); // Nó sẽ trả về "09" (nếu hôm nay mùng 9)
  
  // Tìm trong mockData xem có object nào date === "09" không
  const todayData = myShifts.find(d => d.date === todayKey);
  const todayShift = todayData?.shifts?.[0];

  // 2. Logic kiểm tra điều kiện Check-in
  let checkInDisabled = false;
  let warningMessage = null;

  if (!todayShift) {
      // Trường hợp 1: Không có ca làm
      checkInDisabled = true;
      warningMessage = "Hôm nay bạn không có lịch làm việc";
  } else {
      // Trường hợp 2: Có ca, kiểm tra thời gian (chỉ cho phép trước 15 phút)
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      
      // Parse giờ bắt đầu từ chuỗi "13:30 - 16:30" (Hỗ trợ cả dấu '-' và '–')
      const timeStr = todayShift.time.replace('–', '-');
      const startStr = timeStr.split('-')[0].trim();
      const [startH, startM] = startStr.split(':').map(Number);
      const startShiftMinutes = startH * 60 + startM;

      // Thời điểm được phép check-in
      const allowCheckInMinutes = startShiftMinutes - 15;

      if (currentMinutes < allowCheckInMinutes) {
          checkInDisabled = true;
          // Format giờ được phép checkin để hiển thị
          const h = Math.floor(allowCheckInMinutes / 60);
          const m = allowCheckInMinutes % 60;
          const timeString = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
          
          warningMessage = `Chỉ được chấm công từ ${timeString}`;
      }
  }

  // --- LOGIC CA SẮP TỚI ---
  const nextShift = myShifts
    .filter(d => d.date !== todayKey)
    .flatMap(d => d.shifts.map(s => ({ ...s, dateStr: d.date, dayStr: d.day })))
    .sort((a, b) => a.id - b.id)[0];

  // --- HANDLERS ---
  // Helper lấy giờ hiện tại dạng chuỗi
  const getCurrentTimeStr = () => {
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      return `${h}:${m}`;
  };

  const handleCheckIn = () => {
    if (checkInDisabled) return; // Chặn nếu logic không thỏa mãn
    setAttendanceStatus('checked_in');
    setLogs(prev => [{ type: 'in', time: getCurrentTimeStr(), date: getFormattedDate() }, ...prev]);
  };

  const handleCheckOut = () => {
    setAttendanceStatus('checked_out');
    setLogs(prev => [{ type: 'out', time: getCurrentTimeStr(), date: getFormattedDate() }, ...prev]);
  };

  return (
    <div className="flex flex-col h-full bg-[#f5f5f5] font-sans relative overflow-hidden">
      
      {/* 1. HEADER */}
      <div className="bg-gradient-to-br from-[#FF8C00] to-[#E05900] pt-[56px] pb-[100px] px-[16px] rounded-b-[24px] relative shrink-0 z-0 shadow-md">
         <div className="inline-flex items-center gap-2 mb-3 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <Calendar size={14} className="text-white"/>
            <span className="text-[12px] font-semibold text-white">{getFormattedDate()}</span>
         </div>
         
         <div className="flex justify-between items-start">
             <div className="flex gap-3 items-center">
                 <div className="w-[48px] h-[48px] rounded-[28px] border-2 border-white p-[2px]">
                    <div className="w-full h-full rounded-[28px] bg-white flex items-center justify-center overflow-hidden text-[#E05900]">
                        <User size={24} strokeWidth={2.5}/>
                    </div>
                 </div>
                 <div className="text-white flex flex-col">
                     <p className="text-[14px] font-normal leading-[20px] opacity-90">Xin chào,</p>
                     <h2 className="text-[18px] font-bold leading-[24px]">{user.fullName}</h2>
                 </div>
             </div>
             
             <button onClick={() => onNavigate('notifications')} className="w-[40px] h-[40px] bg-white/20 rounded-full flex items-center justify-center relative backdrop-blur-sm active:scale-95 transition-transform">
                 <Bell size={20} className="text-white" strokeWidth={2}/>
                 <span className="absolute top-[8px] right-[10px] w-[8px] h-[8px] bg-red-500 rounded-full border border-[#E05900]"></span>
             </button>
         </div>
      </div>

      {/* 2. BODY CONTENT */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 px-[16px] -mt-[80px] pb-[40px] flex flex-col gap-[16px]">
        
        {/* === CARD CHẤM CÔNG === */}
        {/* Truyền props checkInDisabled và warningMessage xuống */}
        <CheckInCard 
            shift={todayShift}
            attendanceStatus={attendanceStatus}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onRequestLeave={() => setShowLeaveModal(true)}
            checkInDisabled={checkInDisabled} 
            warningMessage={warningMessage}
        />

        {/* THÔNG TIN CA LÀM */}
        {todayShift && (
            <div className="bg-[rgba(255,229,204,0.52)] rounded-[16px] p-[16px] flex flex-col gap-[12px] relative shadow-sm">
                <div className="flex items-center gap-[8px]">
                    <Clock size={20} className="text-[#c52c2c]" /> 
                    <p className="text-[16px] font-semibold text-[#c52c2c] leading-[24px]">Bạn có 1 ca làm hôm nay</p>
                </div>
                <div className="flex flex-col gap-[4px] pl-[32px]">
                    <p className="text-[24px] font-semibold text-[#191919] leading-[32px]">{todayShift.time}</p>
                    <div className="flex items-center gap-[8px] mt-[4px]">
                        <div className="w-[6px] h-[6px] bg-[#D3602D] rounded-full"></div>
                        <p className="text-[14px] font-normal text-[#666b70] uppercase">
                            {todayShift.role} | {todayShift.location}
                        </p>
                    </div>
                </div>
            </div>
        )}

        {/* HOẠT ĐỘNG HÔM NAY */}
        <div className="mt-[8px]">
            <div className="flex justify-between items-center mb-[12px]">
                <h3 className="text-[16px] font-semibold text-[#191919]">Hoạt động hôm nay</h3>
                <button onClick={() => onNavigate('attendance')} className="text-[14px] font-semibold text-[#d3602d] flex items-center gap-1 active:opacity-60">
                    Xem lịch sử <ChevronRight size={16}/>
                </button>
            </div>
            <div className="bg-white rounded-[16px] border border-[#eaeaea] overflow-hidden shadow-sm">
                {logs.length > 0 ? (
                    logs.map((log, index) => (
                        <div key={index} className="flex items-center gap-4 px-[16px] py-[12px] border-b border-[#eaeaea] last:border-0">
                            <div className="rotate-180 shrink-0">
                                {log.type === 'in' ? <LogIn size={24} className="text-[#F98B05]"/> : <LogOut size={24} className="text-[#F98B05]"/>}
                            </div>
                            <div className="flex-1">
                                <p className="text-[16px] font-semibold text-[#191919]">{log.type === 'in' ? 'Chấm vào' : 'Chấm ra'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[12px] text-[#666b70] font-normal mb-0.5">{log.date}</p>
                                <div className="flex items-center justify-end gap-2">
                                    <div className="w-[6px] h-[6px] bg-[#D9D9D9] rounded-full"></div>
                                    <p className="text-[14px] text-[#666b70] font-normal">{log.time}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-[24px] text-center text-gray-400 text-sm italic">Chưa có hoạt động nào</div>
                )}
            </div>
        </div>

        {/* CA LÀM SẮP TỚI */}
        <div className="mt-[8px]">
            <div className="flex justify-between items-center mb-[12px]">
                <h3 className="text-[16px] font-semibold text-[#191919]">Ca làm sắp tới</h3>
                <button onClick={() => onNavigate('schedule')} className="text-[14px] font-semibold text-[#d3602d] active:opacity-60">Xem tất cả</button>
            </div>
            {nextShift ? (
                <div className="bg-white rounded-[16px] p-[12px] border border-[#eaeaea] shadow-sm">
                    <div className="flex items-center gap-[16px]">
                        <div className="bg-[rgba(255,229,204,0.52)] rounded-[12px] w-[71px] h-[80px] flex flex-col items-center justify-center shrink-0">
                            <span className="text-[12px] font-normal text-black text-center">{nextShift.dayStr}</span>
                            <span className="text-[20px] font-semibold text-[#191919] my-[4px]">{nextShift.dateStr}</span>
                            <span className="text-[12px] font-normal text-black text-center">THÁNG 11</span>
                        </div>
                        <div className="flex-1 flex flex-col gap-[4px]">
                            <p className="text-[16px] font-semibold text-[#191919]">{nextShift.time}</p>
                            <p className="text-[14px] font-semibold text-[#666b70]">UNCLE BI</p>
                            <div className="flex items-center gap-[6px] mt-[4px]">
                                <div className="w-[6px] h-[6px] bg-[#D3602D] rounded-full"></div>
                                <p className="text-[14px] font-normal text-[#666b70] uppercase">
                                    {nextShift.role} | {nextShift.location}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="py-[24px] text-center text-gray-400 text-sm bg-white rounded-[16px] border border-[#eaeaea]">Không có ca sắp tới</div>
            )}
        </div>
      </div>

      {showLeaveModal && <LeaveRequestModal onClose={() => setShowLeaveModal(false)} />}
    </div>
  );
}
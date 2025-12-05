import React, { useState } from "react";

// 1. IMPORT DATA & UTILS
// Đảm bảo đường dẫn này đúng với cấu trúc thư mục bạn đã tạo
import { CURRENT_USER, INITIAL_MY_SHIFTS, INITIAL_MARKET_SHIFTS } from "../data/mockData";
import { parseTimeRange, isOverlapping } from "../utils/helpers";

// 2. IMPORT COMPONENTS CŨ (Nằm cùng thư mục components)
import ScheduleView from "./ScheduleView"; 
import ShiftPool from "./ShiftPool";

// 3. IMPORT SCREENS (Nằm trong thư mục screens)
import LoginScreen from "./screens/LoginScreen";
import UserProfile from "./screens/UserProfile";
import MoreMenu from "./screens/MoreMenu";
import NotificationScreen from "./screens/NotificationScreen";

// 4. IMPORT COMMON (Nằm trong thư mục common)
import StatusBar from "./common/StatusBar";
import HomeIndicator from "./common/HomeIndicator";
import Navigator from "./common/Navigator";

export default function IPhone() {
  // --- STATE QUẢN LÝ ---
  const [currentTab, setCurrentTab] = useState('schedule');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  
  // State dữ liệu ca làm
  const [myShifts, setMyShifts] = useState(INITIAL_MY_SHIFTS);
  const [marketShifts, setMarketShifts] = useState(INITIAL_MARKET_SHIFTS);

  // --- LOGIC NHẬN CA (ĐÃ FIX LỖI DUPLICATE) ---
  const attemptAcceptShift = (shiftToAccept) => {
    // 1. Validate: Kiểm tra vai trò
    const normalizedRole = shiftToAccept.role.toLowerCase();
    const hasRole = CURRENT_USER.roles.some(r => r.toLowerCase() === normalizedRole);
    
    if (!hasRole) {
      return { success: false, message: `Bạn không có vai trò ${shiftToAccept.role}!` };
    }

    // 2. Validate: Kiểm tra trùng giờ
    const myDaySchedule = myShifts.find(d => d.date === shiftToAccept.date);
    if (myDaySchedule) {
      const newTimeRange = parseTimeRange(shiftToAccept.time);
      
      // Duyệt qua tất cả ca trong ngày đó
      for (let existingShift of myDaySchedule.shifts) {
        const existingTimeRange = parseTimeRange(existingShift.time);
        if (isOverlapping(newTimeRange, existingTimeRange)) {
           return { 
             success: false, 
             message: `Trùng giờ với ca: ${existingShift.time} (${existingShift.role})` 
           };
        }
      }
    }

    // 3. Xử lý dữ liệu (Immutable Update - Quan trọng để không bị lỗi x2)
    
    // A. Xóa khỏi kho ca làm (Market)
    setMarketShifts(prev => prev.filter(s => s.id !== shiftToAccept.id));

    // B. Thêm vào lịch của tôi (My Shifts)
    setMyShifts(prev => {
      const targetDate = shiftToAccept.date;
      const dayExists = prev.some(item => item.date === targetDate);
      
      const newShiftObj = {
        id: `accepted_${Date.now()}`, // Tạo ID mới unique
        time: shiftToAccept.time,
        location: shiftToAccept.location,
        role: shiftToAccept.role,
        transferFrom: shiftToAccept.owner // Lưu người chuyển để hiển thị ghi chú
      };

      if (dayExists) {
        // CÁCH SỬA: Dùng .map() để tạo mảng mới, KHÔNG dùng .push() vào mảng cũ
        return prev.map(dayGroup => {
          if (dayGroup.date === targetDate) {
            return {
              ...dayGroup, // Copy thuộc tính cũ của ngày (date, day...)
              shifts: [
                ...dayGroup.shifts, // Copy các ca cũ
                newShiftObj         // Thêm ca mới vào cuối
              ].sort((a, b) => 
                // Sắp xếp lại theo giờ bắt đầu
                parseTimeRange(a.time).start - parseTimeRange(b.time).start
              )
            };
          }
          return dayGroup;
        });
      } else {
        // Nếu ngày chưa có trong lịch, thêm ngày mới vào mảng
        return [...prev, {
          date: targetDate,
          day: shiftToAccept.day,
          shifts: [newShiftObj]
        }];
      }
    });

    // C. Chuyển hướng về lịch sau 1 giây
    setTimeout(() => setCurrentTab('schedule'), 1000);
    
    return { success: true, message: "Nhận ca thành công!" };
  };

  // --- NAVIGATION HANDLERS ---
  const handleNavigate = (tabName) => setCurrentTab(tabName);
  const handleLogout = () => { setIsLoggedIn(false); setCurrentTab('login'); };
  const handleLogin = () => { setIsLoggedIn(true); setCurrentTab('schedule'); };

  // --- RENDER LOGIN SCREEN ---
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-200 font-sans">
        <div className="relative w-full h-full bg-white flex flex-col box-border">
           <LoginScreen onLogin={handleLogin} />
           <div className="absolute bottom-0 w-full"><HomeIndicator /></div>
        </div>
      </div>
    )
  }

  // --- RENDER MAIN APP ---
  return (
    <div className="relative w-[375px] h-[812px] bg-white rounded-[40px] shadow-2xl overflow-hidden border-[8px] border-gray-900 flex flex-col box-border mx-auto">
      
      {/* Status Bar */}
      <div className="absolute top-0 w-full z-[60]"><StatusBar /></div>
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative bg-white mt-[44px]">
         {/* View 1: Lịch làm việc */}
         {currentTab === 'schedule' && <ScheduleView data={myShifts} />}
         
         {/* View 2: Menu mở rộng */}
         {currentTab === 'more' && <MoreMenu onNavigate={handleNavigate} onLogout={handleLogout} user={CURRENT_USER}/>}
         
         {/* View 3: Kho ca làm (Market) */}
         {currentTab === 'market' && (
            <ShiftPool 
                shiftsData={marketShifts} 
                onAcceptShift={attemptAcceptShift} 
                onBack={() => handleNavigate('more')} 
            />
         )}
         
         {/* View 4: Hồ sơ cá nhân */}
         {currentTab === 'profile' && <UserProfile user={CURRENT_USER} onBack={() => handleNavigate('more')} />}
         
         {/* View 5: Thông báo */}
         {currentTab === 'notifications' && <NotificationScreen onBack={() => handleNavigate('more')} />}
         
         {/* Placeholder cho các tab chưa phát triển (Home, Salary...) */}
         {['home', 'salary', 'attendance', 'availability'].includes(currentTab) && (
           <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3 bg-gray-50">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl">🚧</div>
              <span className="text-sm font-medium opacity-60">Tính năng đang phát triển</span>
              <button onClick={() => handleNavigate('more')} className="text-[#F97316] font-bold text-sm px-4 py-2 border border-orange-200 rounded-lg hover:bg-orange-50">
                  Quay lại
              </button>
           </div>
         )}
      </div>
      
      {/* Bottom Navigation */}
      <div className="bg-white z-50 shrink-0 shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
        <Navigator activeTab={currentTab} onTabChange={handleNavigate} />
        <HomeIndicator />
      </div>
    </div>
  );
}
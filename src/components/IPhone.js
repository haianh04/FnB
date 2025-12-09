import React, { useState } from "react";

// 1. IMPORT DATA & UTILS
import { CURRENT_USER, INITIAL_MY_SHIFTS, INITIAL_MARKET_SHIFTS } from "../data/mockData";
import { parseTimeRange, isOverlapping } from "../utils/helpers";

// 2. IMPORT COMPONENTS CŨ
import ScheduleView from "./ScheduleView"; 
import ShiftPool from "./ShiftPool";
import HomeScreen from "./screens/HomeScreen"; 
import LoginScreen from "./screens/LoginScreen";
import UserProfile from "./screens/UserProfile";
import MoreMenu from "./screens/MoreMenu";
import NotificationScreen from "./screens/NotificationScreen";
import SalaryScreen from "./screens/SalaryScreen";
import ChangePasswordScreen from "./screens/ChangePasswordScreen";

// --- IMPORT MỚI ---
import AttendanceHistoryScreen from "./screens/AttendanceHistoryScreen";
import AvailabilityScreen from "./screens/AvailabilityScreen";

// 3. IMPORT COMMON
import StatusBar from "./common/StatusBar";
import HomeIndicator from "./common/HomeIndicator";
import Navigator from "./common/Navigator";

export default function IPhone() {
  const [currentTab, setCurrentTab] = useState('home'); 
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  
  const [myShifts, setMyShifts] = useState(INITIAL_MY_SHIFTS);
  const [marketShifts, setMarketShifts] = useState(INITIAL_MARKET_SHIFTS);

  // --- LOGIC NHẬN CA (GIỮ NGUYÊN) ---
  const attemptAcceptShift = (shiftToAccept) => {
    // ... logic cũ ...
    const normalizedRole = shiftToAccept.role.toLowerCase();
    const hasRole = CURRENT_USER.roles.some(r => r.toLowerCase() === normalizedRole);
    if (!hasRole) return { success: false, message: `Bạn không có vai trò ${shiftToAccept.role}!` };
    const myDaySchedule = myShifts.find(d => d.date === shiftToAccept.date);
    if (myDaySchedule) {
      const newTimeRange = parseTimeRange(shiftToAccept.time);
      for (let existingShift of myDaySchedule.shifts) {
        if (isOverlapping(newTimeRange, parseTimeRange(existingShift.time))) {
           return { success: false, message: `Trùng giờ với ca: ${existingShift.time}` };
        }
      }
    }
    setMarketShifts(prev => prev.filter(s => s.id !== shiftToAccept.id));
    setMyShifts(prev => {
      const targetDate = shiftToAccept.date;
      const dayExists = prev.some(item => item.date === targetDate);
      const newShiftObj = {
        id: `accepted_${Date.now()}`,
        time: shiftToAccept.time,
        location: shiftToAccept.location,
        role: shiftToAccept.role,
        transferFrom: shiftToAccept.owner 
      };
      if (dayExists) {
        return prev.map(dayGroup => {
          if (dayGroup.date === targetDate) {
            return { ...dayGroup, shifts: [...dayGroup.shifts, newShiftObj].sort((a, b) => parseTimeRange(a.time).start - parseTimeRange(b.time).start) };
          }
          return dayGroup;
        });
      } else {
        return [...prev, { date: targetDate, day: shiftToAccept.day, shifts: [newShiftObj] }];
      }
    });
    setTimeout(() => setCurrentTab('schedule'), 1000);
    return { success: true, message: "Nhận ca thành công!" };
  };

  const handleNavigate = (tabName) => setCurrentTab(tabName);
  const handleLogout = () => { setIsLoggedIn(false); setCurrentTab('login'); };
  const handleLogin = () => { setIsLoggedIn(true); setCurrentTab('home'); };

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

  return (
    <div className="relative w-[375px] h-[812px] bg-white rounded-[40px] shadow-2xl overflow-hidden border-[8px] border-gray-900 flex flex-col box-border mx-auto">
      
      <div className="absolute top-0 w-full z-[60]"><StatusBar lightMode={currentTab !== 'home'} /></div>
      
      <div className="flex-1 overflow-hidden relative bg-white mt-[44px]">
         
         {currentTab === 'home' && (
            <HomeScreen user={CURRENT_USER} myShifts={myShifts} onNavigate={handleNavigate}/>
         )}

         {currentTab === 'schedule' && <ScheduleView data={myShifts} />}
         {currentTab === 'more' && <MoreMenu onNavigate={handleNavigate} onLogout={handleLogout} user={CURRENT_USER}/>}
         
         {currentTab === 'market' && (
            <ShiftPool 
                shiftsData={marketShifts} 
                onAcceptShift={attemptAcceptShift} 
                onBack={() => handleNavigate('more')} 
            />
         )}
         
         {currentTab === 'profile' && <UserProfile user={CURRENT_USER} onBack={() => handleNavigate('more')} />}
         
         {/* QUAN TRỌNG: Nút Back ở NotificationScreen quay về 'home' */}
         {currentTab === 'notifications' && <NotificationScreen onBack={() => handleNavigate('home')} />}
         
         {currentTab === 'attendance' && <AttendanceHistoryScreen onBack={() => handleNavigate('home')} />}
         {currentTab === 'availability' && <AvailabilityScreen onBack={() => handleNavigate('more')} />}
         {currentTab === 'salary' && <SalaryScreen onBack={() => handleNavigate('more')} />}
         {currentTab === 'change-password' && <ChangePasswordScreen user={CURRENT_USER} onBack={() => handleNavigate('more')} />}

      </div>
      
      <div className="bg-white z-50 shrink-0 shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
        <Navigator activeTab={currentTab} onTabChange={handleNavigate} />
        <HomeIndicator />
      </div>
    </div>
  );
}
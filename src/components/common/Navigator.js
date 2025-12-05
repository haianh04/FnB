import React from 'react';
import { Home, Calendar, Menu } from 'lucide-react';

export default function Navigator({ activeTab, onTabChange }) {
  const isHomeActive = activeTab === 'home';
  const isScheduleActive = activeTab === 'schedule';
  const isMoreActive = ['more', 'market', 'salary', 'attendance', 'availability', 'profile', 'notifications'].includes(activeTab);

  return (
    <div className="flex items-center justify-between px-8 pt-2 pb-1 bg-white border-t border-gray-200">
      <div onClick={() => onTabChange('home')} className="flex flex-col items-center justify-center gap-1 w-16 cursor-pointer py-1 transition-colors active:opacity-70">
        <Home className={`w-6 h-6 ${isHomeActive ? "text-[#E08C27]" : "text-gray-400"}`} strokeWidth={isHomeActive ? 2.5 : 2} />
        <span className={`text-[10px] font-medium ${isHomeActive ? "text-[#E08C27]" : "text-gray-400"}`}>Trang chủ</span>
      </div>
      <div onClick={() => onTabChange('schedule')} className="flex flex-col items-center justify-center gap-1 w-16 cursor-pointer py-1 transition-colors active:opacity-70">
        <Calendar className={`w-6 h-6 ${isScheduleActive ? "text-[#E08C27]" : "text-gray-400"}`} strokeWidth={isScheduleActive ? 2.5 : 2} />
        <span className={`text-[10px] font-medium ${isScheduleActive ? "text-[#E08C27]" : "text-gray-400"}`}>Lịch</span>
      </div>
      <div onClick={() => onTabChange('more')} className="flex flex-col items-center justify-center gap-1 w-16 cursor-pointer py-1 transition-colors active:opacity-70">
        <Menu className={`w-6 h-6 ${isMoreActive ? "text-[#E08C27]" : "text-gray-400"}`} strokeWidth={isMoreActive ? 2.5 : 2} />
        <span className={`text-[10px] font-medium ${isMoreActive ? "text-[#E08C27]" : "text-gray-400"}`}>Khác</span>
      </div>
    </div>
  );
}
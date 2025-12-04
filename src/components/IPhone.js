import React from "react";
import ScheduleView from "./ScheduleView";
import { Home, Calendar, Menu, Battery, Wifi, Signal } from "lucide-react";

// --- Sub-components (Giữ nguyên) ---
function StatusBar() {
  return (
    <div className="h-[44px] flex items-center justify-between px-6 bg-white shrink-0 relative z-50">
      <span className="text-[15px] font-semibold text-black">9:41</span>
      <div className="flex items-center gap-1.5">
        <Signal className="w-4 h-4 text-black" />
        <Wifi className="w-4 h-4 text-black" />
        <Battery className="w-5 h-5 text-black" />
      </div>
    </div>
  );
}

function NavigatorItem({ icon: Icon, label, active }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 w-16 cursor-pointer hover:bg-gray-50 rounded-lg py-1 transition-colors">
      <Icon
        className={`w-6 h-6 ${active ? "text-[#E08C27]" : "text-gray-400"}`}
        strokeWidth={active ? 2.5 : 2}
      />
      <span className={`text-[10px] font-medium ${active ? "text-[#E08C27]" : "text-gray-400"}`}>
        {label}
      </span>
    </div>
  );
}

function Navigator() {
  return (
    <div className="flex items-center justify-between px-6 pt-2 pb-1 bg-white border-t border-gray-200">
      <NavigatorItem icon={Home} label="Home" />
      <NavigatorItem icon={Calendar} label="Schedule" active={true} />
      <NavigatorItem icon={Menu} label="More" />
    </div>
  );
}

function HomeIndicator() {
  return (
    <div className="h-[20px] bg-white flex justify-center items-start pt-2 rounded-b-[40px]">
      <div className="w-[134px] h-[5px] bg-gray-300 rounded-full" />
    </div>
  );
}

// --- Component Chính ---
export default function IPhone() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 py-10 font-sans">
      {/* Khung iPhone */}
      <div className="relative w-[390px] h-[844px] bg-white rounded-[40px] shadow-2xl overflow-hidden border-[8px] border-gray-900 flex flex-col box-border">
        
        {/* Phần Tai thỏ & Status Bar */}
        <div className="bg-white pt-2 shrink-0 z-50">
            <StatusBar />
        </div>

        {/* Màn hình chính (Scroll container) */}
        {/* Lưu ý: Ta set flex-1 và overflow-hidden ở đây để ScheduleView tự quản lý scroll bên trong nó (hoặc scroll theo parent này) */}
        <div className="flex-1 overflow-hidden relative bg-white">
           <ScheduleView />
        </div>

        {/* Thanh điều hướng dưới cùng (Cố định) */}
        <div className="bg-white z-50 shrink-0">
          <Navigator />
          <HomeIndicator />
        </div>

      </div>
    </div>
  );
}
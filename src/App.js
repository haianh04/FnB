import React, { useState } from 'react';
// Import các components
import IPhone from './components/IPhone'; 
import WebEmploymentHistory from './components/WebEmploymentHistory';
import SettingsScreen from './components/SettingsScreen';
import WebSchedule from './components/WebSchedule';
import WebAvailability from './components/WebAvailability'; // IMPORT MỚI

// Import Icons
import { Calendar, DollarSign, Settings, Smartphone, Menu, Clock } from 'lucide-react';

function App() {
  const [view, setView] = useState('availability'); // Mặc định hiển thị Web Duyệt Lịch để bạn test ngay
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Danh sách menu
  const menuItems = [
    { id: 'mobile', label: 'Mobile App Demo', icon: <Smartphone size={20} /> },
    { id: 'schedule', label: 'Quản lý Lịch', icon: <Calendar size={20} /> },
    { id: 'availability', label: 'Duyệt lịch rảnh', icon: <Clock size={20} /> }, // MENU MỚI
    { id: 'salary', label: 'Lương & Hồ sơ', icon: <DollarSign size={20} /> },
    { id: 'settings', label: 'Cài đặt hệ thống', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      
      {/* --- SIDEBAR TRÁI --- */}
      <div 
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          {isSidebarOpen && (
            <span className="text-xl font-extrabold text-[#F97316] tracking-tight">XinK FnB</span>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                ${view === item.id 
                  ? 'bg-[#F97316] text-white shadow-md shadow-orange-200' 
                  : 'text-gray-600 hover:bg-orange-50 hover:text-[#F97316]'
                }
              `}
            >
              <div className="shrink-0">{item.icon}</div>
              {isSidebarOpen && (
                <span className="text-sm font-semibold whitespace-nowrap">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
           {isSidebarOpen ? (
             <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">AD</div>
                <div>
                    <p className="text-sm font-bold text-gray-800">Admin</p>
                    <p className="text-xs text-gray-400">Chủ cửa hàng</p>
                </div>
             </div>
           ) : (
             <div className="w-9 h-9 rounded-full bg-gray-200 mx-auto flex items-center justify-center font-bold text-gray-500">A</div>
           )}
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-gray-50">
        
        {view === 'mobile' && (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 overflow-auto py-10">
             <IPhone />
          </div>
        )}

        {view === 'schedule' && <WebSchedule />}

        {/* VIEW QUẢN LÝ LỊCH RẢNH */}
        {view === 'availability' && <WebAvailability />}

        {view === 'salary' && (
          <div className="w-full h-full overflow-auto">
             <WebEmploymentHistory />
          </div>
        )}

        {view === 'settings' && (
          <div className="w-full h-full overflow-auto">
             <SettingsScreen />
          </div>
        )}

      </div>

    </div>
  );
}

export default App;
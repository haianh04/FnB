import React, { useState } from 'react';
// import './App.css'; // Bỏ nếu bạn dùng Tailwind trực tiếp và không có file css này

// Import các components
// Lưu ý: Đảm bảo đường dẫn import đúng với cấu trúc file bạn đã tạo
import IPhone from './components/IPhone'; 
import WebEmploymentHistory from './components/WebEmploymentHistory';
import SettingsScreen from './components/SettingsScreen';
import WebSchedule from './components/WebSchedule';

// Import Icons
import { Calendar, DollarSign, Settings, Smartphone, Menu } from 'lucide-react';

function App() {
  const [view, setView] = useState('schedule'); // Mặc định hiển thị Lịch
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Toggle sidebar

  // Danh sách menu
  const menuItems = [
    { id: 'mobile', label: 'Mobile App Demo', icon: <Smartphone size={20} /> },
    { id: 'schedule', label: 'Quản lý Lịch', icon: <Calendar size={20} /> },
    { id: 'salary', label: 'Lương & Hồ sơ', icon: <DollarSign size={20} /> },
    { id: 'settings', label: 'Cài đặt hệ thống', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      
      {/* --- SIDEBAR TRÁI (MENU DỌC) --- */}
      <div 
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo / Header Sidebar */}
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

        {/* Menu Items */}
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

        {/* Footer Sidebar */}
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

      {/* --- KHU VỰC HIỂN THỊ NỘI DUNG CHÍNH (VIEWPORT) --- */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-gray-50">
        
        {/* Render View tương ứng */}
        {view === 'mobile' && (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 overflow-auto py-10">
             {/* Component IPhone (Mobile App) */}
             <IPhone />
          </div>
        )}

        {view === 'schedule' && <WebSchedule />}

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
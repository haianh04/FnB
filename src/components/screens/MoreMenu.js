import React from 'react';
import { 
  Briefcase, DollarSign, History, CalendarPlus, 
  Bell, ChevronRight, UserCircle, LogOut, Lock, FileClock 
} from 'lucide-react';

// --- HELPER (Nhúng trực tiếp để tránh lỗi import) ---
const getRoleBadgeStyle = (role) => {
    if (!role) return 'bg-gray-100 text-gray-700 border border-gray-200';
    const normalizeRole = role.toLowerCase();
    if (normalizeRole.includes('phục vụ')) return 'bg-orange-100 text-orange-700 border border-orange-200';
    if (normalizeRole.includes('pha chế')) return 'bg-blue-100 text-blue-700 border border-blue-200';
    if (normalizeRole.includes('thu ngân')) return 'bg-green-100 text-green-700 border border-green-200';
    return 'bg-gray-100 text-gray-700 border border-gray-200';
};

export default function MoreMenu({ onNavigate, onLogout, user }) {
  const menuItems = [
    { 
        id: 'market', 
        label: 'Kho ca làm', 
        icon: <Briefcase size={20} className="text-blue-500" />, 
    },
    { 
        id: 'salary', 
        label: 'Lương & Thưởng', 
        icon: <DollarSign size={20} className="text-green-500" />, 
    },
    { 
        id: 'attendance-history', 
        label: 'Lịch sử chấm công', 
        icon: <History size={20} className="text-orange-500" />,  
    },
    // --- MỚI THÊM VÀO ĐÂY ---
    { 
        id: 'leave-history', 
        label: 'Lịch sử nghỉ phép', 
        icon: <FileClock size={20} className="text-pink-500" />,  
    },
    // ------------------------
    { 
        id: 'availability', 
        label: 'Đăng ký lịch rảnh', 
        icon: <CalendarPlus size={20} className="text-purple-500" />,  
    },
    { 
        id: 'change-password', 
        label: 'Đổi mật khẩu', 
        icon: <Lock size={20} className="text-red-500" />, 
    },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50 pt-10 px-3 pb-2 font-sans relative">
      
      <div className="flex justify-between items-center mb-3 shrink-0">
        <h2 className="text-xl font-bold text-gray-900">Cài đặt</h2>
        <button 
            onClick={() => onNavigate('notifications')} 
            className="p-2 bg-white rounded-full shadow-sm border border-gray-100 relative active:scale-95 transition-transform hover:bg-gray-50"
        >
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>

      {/* User Card */}
      <div onClick={() => onNavigate('profile')} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-3 mb-3 cursor-pointer active:scale-[0.98] transition-transform hover:shadow-md shrink-0">
        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 shrink-0 border border-gray-200"><UserCircle size={36} /></div>
        <div className="flex-1">
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{user.fullName}</h3>
                <ChevronRight size={16} className="text-gray-300 mt-0.5"/>
            </div>
            <div className="flex flex-wrap gap-1">
              {user.roles.map((role, index) => (
                <span key={index} className={`text-[9px] px-2 py-0.5 rounded-lg border font-bold uppercase tracking-wide ${getRoleBadgeStyle(role)}`}>{role}</span>
              ))}
            </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-2 flex-1 overflow-y-auto no-scrollbar pb-20">
        {menuItems.map((item) => (
          <button key={item.id} onClick={() => onNavigate(item.id)} className="w-full bg-white p-3 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center justify-between active:scale-[0.98] transition-all hover:border-orange-200 group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-6 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-white transition-colors">{item.icon}</div>
              <div className="text-left"><p className="text-gray-800 text-base">{item.label}</p><p className="text-xs text-gray-400 mt-0">{item.desc}</p></div>
            </div>
            <ChevronRight size={16} className="text-gray-300 group-hover:text-orange-400 transition-colors" />
          </button>
        ))}
        
        <button onClick={onLogout} className="w-full bg-white p-3 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center justify-between active:scale-[0.98] transition-all hover:bg-gray-50 hover:border-gray-200 group mt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-6 rounded-full bg-red-50 flex items-center justify-center border border-red-100 group-hover:bg-white transition-colors"><LogOut size={18} className="text-red-500" /></div>
              <div className="text-left"><p className="text-gray-800 text-base">Đăng xuất</p></div>
            </div>
        </button>
      </div>
      
      <div className="text-center"><p className="text-[9px] text-gray-400">XinK FnB App v1.1.0</p></div>
    </div>
  );
}
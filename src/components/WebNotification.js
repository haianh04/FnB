import React, { useState } from 'react';
import { 
  Bell, CheckCircle, AlertCircle, UserPlus, 
  Calendar, FileText, Clock, X, Briefcase, User
} from 'lucide-react';

// --- MOCK DATA: Dữ liệu mẫu mô phỏng các thay đổi ---
const NOTIFICATIONS = [
  // Nhóm: Task / Duyệt đơn
  {
    id: 1,
    group: 'task', 
    title: 'Đơn xin nghỉ chờ duyệt',
    content: 'Nguyễn Văn A xin nghỉ ngày 20/12 (Lý do: Việc gia đình)',
    time: '5 phút trước',
    type: 'alert',
    isRead: false
  },
  {
    id: 2,
    group: 'task',
    title: 'Yêu cầu đổi ca',
    content: 'Trần Thị B muốn đổi ca T3 sang T5 với Lê Văn C',
    time: '10 phút trước',
    type: 'warning',
    isRead: false
  },
  // Nhóm: Lịch & Vận hành
  {
    id: 3,
    group: 'schedule', 
    title: 'Nhận ca thành công',
    content: 'Hoàng Văn Nam đã nhận ca trống ngày 18/12',
    time: '1 giờ trước',
    type: 'success',
    isRead: true
  },
  {
    id: 5,
    group: 'schedule',
    title: 'Đăng ký lịch rảnh mới',
    content: 'Có 3 nhân viên mới gửi đăng ký lịch tuần sau',
    time: '3 giờ trước',
    type: 'info',
    isRead: true
  },
  // Nhóm: Hồ sơ nhân sự
  {
    id: 4,
    group: 'hr', 
    title: 'Cập nhật hồ sơ',
    content: 'Phạm Thị D vừa cập nhật số điện thoại và địa chỉ mới',
    time: '2 giờ trước',
    type: 'info',
    isRead: true
  },
  {
    id: 6,
    group: 'hr', 
    title: 'Nhân viên mới',
    content: 'Đã thêm hồ sơ nhân viên: Lê Văn F (Bếp)',
    time: '1 ngày trước',
    type: 'success',
    isRead: true
  }
];

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  const unreadCount = notifs.filter(n => !n.isRead).length;

  // --- LOGIC GOM NHÓM (GROUP BY TASK) ---
  const groupedNotifs = {
    task: { 
      label: 'Cần xử lý (Duyệt đơn/Task)', 
      items: notifs.filter(n => n.group === 'task'), 
      icon: <FileText size={14} className="text-orange-600"/> 
    },
    schedule: { 
      label: 'Hoạt động Lịch & Ca', 
      items: notifs.filter(n => n.group === 'schedule'), 
      icon: <Calendar size={14} className="text-blue-600"/> 
    },
    hr: { 
      label: 'Hồ sơ Nhân sự', 
      items: notifs.filter(n => n.group === 'hr'), 
      icon: <User size={14} className="text-purple-600"/> 
    },
  };

  const handleMarkRead = (id) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const getIcon = (type) => {
    switch(type) {
      case 'alert': return <AlertCircle size={16} className="text-red-500"/>;
      case 'success': return <CheckCircle size={16} className="text-green-500"/>;
      case 'warning': return <Clock size={16} className="text-orange-500"/>;
      default: return <Bell size={16} className="text-gray-400"/>;
    }
  };

  return (
    <div className="relative z-50">
      {/* Button Chuông trên Header */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-full transition-all ${isOpen ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100 text-gray-600'}`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Overlay để click ra ngoài thì đóng */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          
          <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
            
            {/* Header Dropdown */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 text-sm">Thông báo</h3>
              <div className="flex gap-2">
                 {unreadCount > 0 && (
                    <button 
                        onClick={() => setNotifs(prev => prev.map(n => ({...n, isRead: true})))}
                        className="text-[10px] text-blue-600 font-bold hover:underline"
                    >
                        Đọc tất cả
                    </button>
                 )}
                 <button onClick={() => setIsOpen(false)}><X size={16} className="text-gray-400 hover:text-gray-600"/></button>
              </div>
            </div>

            {/* Notification List (Grouped) */}
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar bg-white">
              {Object.entries(groupedNotifs).map(([key, group]) => (
                group.items.length > 0 && (
                  <div key={key}>
                    {/* Group Header */}
                    <div className="px-4 py-2 bg-gray-50/80 border-y border-gray-100 flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider sticky top-0 backdrop-blur-sm z-10">
                      {group.icon} {group.label}
                    </div>
                    
                    {/* Group Items */}
                    <div>
                      {group.items.map(item => (
                        <div 
                          key={item.id} 
                          onClick={() => handleMarkRead(item.id)}
                          className={`px-4 py-3 border-b border-gray-50 hover:bg-orange-50 cursor-pointer flex gap-3 transition-colors ${!item.isRead ? 'bg-orange-50/40' : ''}`}
                        >
                          <div className="mt-1 shrink-0">{getIcon(item.type)}</div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <p className={`text-sm ${!item.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                {item.title}
                                </p>
                                {!item.isRead && <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0 ml-2"></div>}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.content}</p>
                            <p className="text-[10px] text-gray-400 mt-1.5 font-medium">{item.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
              
              {notifs.length === 0 && (
                <div className="p-8 text-center text-gray-400 text-sm">Không có thông báo mới</div>
              )}
            </div>
            
            <div className="bg-gray-50 p-2 text-center border-t border-gray-100">
                <button className="text-xs text-gray-500 hover:text-orange-600 font-medium">Xem tất cả lịch sử</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
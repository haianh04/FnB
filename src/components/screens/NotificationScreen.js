import React from 'react';
import { 
  ArrowLeft, CheckCheck, DollarSign, Calendar, 
  Briefcase, History, Bell, Clock 
} from 'lucide-react';

export default function NotificationScreen({ onBack }) {
    const notifications = [
        { id: 1, title: 'Lương tháng 10 đã về', desc: 'Bạn đã nhận được 12.850.000đ vào tài khoản.', time: '2 giờ trước', type: 'salary', read: false },
        { id: 2, title: 'Thay đổi ca làm việc', desc: 'Quản lý đã cập nhật ca làm ngày 28/11 của bạn.', time: '5 giờ trước', type: 'schedule', read: false },
        { id: 3, title: 'Ca mới thêm vào kho', desc: 'Trần Thị B vừa thêm một ca vào Kho ca làm.', time: '1 ngày trước', type: 'market', read: true },
        { id: 4, title: 'Chấm công thành công', desc: 'Bạn đã check-in lúc 08:55 tại Cơ sở 1.', time: '2 ngày trước', type: 'attendance', read: true },
        { id: 5, title: 'Thông báo nghỉ lễ', desc: 'Nhà hàng sẽ nghỉ lễ vào ngày 02/09.', time: '3 ngày trước', type: 'system', read: true },
    ];

    const getIcon = (type) => {
        switch(type) {
            case 'salary': return <DollarSign size={20} className="text-green-600"/>;
            case 'schedule': return <Calendar size={20} className="text-blue-600"/>;
            case 'market': return <Briefcase size={20} className="text-purple-600"/>;
            case 'attendance': return <History size={20} className="text-orange-600"/>;
            default: return <Bell size={20} className="text-gray-600"/>;
        }
    };
    const getBgColor = (type) => {
        switch(type) {
            case 'salary': return "bg-green-100";
            case 'schedule': return "bg-blue-100";
            case 'market': return "bg-purple-100";
            case 'attendance': return "bg-orange-100";
            default: return "bg-gray-100";
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 font-sans">
            <div className="bg-white px-4 pt-12 pb-4 border-b border-gray-100 sticky top-0 z-10 flex justify-between items-center shadow-[0_2px_10px_rgba(0,0,0,0.03)] shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-gray-600"/>
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Thông báo</h1>
                </div>
                <button className="text-xs font-bold text-[#F97316] flex items-center gap-1 px-2 py-1 rounded hover:bg-orange-50">
                    <CheckCheck size={14}/> Đã đọc hết thông báo
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {notifications.map(item => (
                    <div key={item.id} className={`p-4 rounded-2xl border transition-all active:scale-[0.98] ${item.read ? 'bg-white border-gray-100' : 'bg-orange-50/60 border-orange-100 shadow-sm'}`}>
                        <div className="flex gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getBgColor(item.type)}`}>
                                {getIcon(item.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className={`text-sm font-bold leading-tight mb-1 ${item.read ? 'text-gray-700' : 'text-gray-900'}`}>{item.title}</h4>
                                    {!item.read && <span className="w-2 h-2 rounded-full bg-[#F97316] shrink-0 mt-1"></span>}
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed mb-2 line-clamp-2">{item.desc}</p>
                                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                                    <Clock size={10}/> {item.time}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="h-6"></div>
            </div>
        </div>
    )
}
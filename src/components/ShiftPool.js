import React, { useState } from 'react';
import { 
  Search, Filter, Clock, MapPin, 
  ArrowRight, CheckCircle, User, Briefcase, ChevronLeft, AlertTriangle 
} from 'lucide-react';

const getRoleBadgeColor = (roleName) => {
  const role = roleName.toLowerCase();
  if (role.includes("phục vụ")) return "bg-orange-100 text-orange-700 border-orange-200";
  if (role.includes("pha chế")) return "bg-blue-100 text-blue-700 border-blue-200";
  if (role.includes("thu ngân")) return "bg-green-100 text-green-700 border-green-200";
  return "bg-gray-100 text-gray-600 border-gray-200";
};

export default function ShiftPool({ shiftsData, onAcceptShift, onBack }) {
  // State quản lý animation thành công/thất bại
  const [statusMap, setStatusMap] = useState({}); // { [id]: { type: 'success' | 'error', msg: '' } }

  const handleClickAccept = (shift) => {
    // Gọi hàm logic từ cha
    const result = onAcceptShift(shift);

    if (result.success) {
      setStatusMap({ ...statusMap, [shift.id]: { type: 'success', msg: result.message } });
      // Cha sẽ tự re-render và xóa item này sau timeout, ở đây chỉ cần hiện animation
    } else {
      setStatusMap({ ...statusMap, [shift.id]: { type: 'error', msg: result.message } });
      // Tự động tắt thông báo lỗi sau 2s
      setTimeout(() => {
        setStatusMap(prev => {
           const newState = { ...prev };
           delete newState[shift.id];
           return newState;
        });
      }, 2500);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 font-sans">
      {/* HEADER */}
      <div className="bg-white px-4 pt-12 pb-4 border-b border-gray-100 sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Kho ca làm</h1>
            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-[#F97316]">
                <span className="text-xs font-bold">{shiftsData.length}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Tìm theo ngày..." className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-[#F97316]"/>
          </div>
          <button className="bg-gray-50 border border-gray-200 p-2 rounded-xl text-gray-600 hover:bg-orange-50 hover:text-[#F97316]">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* LIST CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {shiftsData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Briefcase size={48} className="mb-3 opacity-20" />
            <p className="text-sm">Hiện không có ca nào trống.</p>
          </div>
        ) : (
          shiftsData.map((shift) => {
            const status = statusMap[shift.id];
            const isSuccess = status?.type === 'success';
            
            return (
              <div key={shift.id} className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-all duration-500 ${isSuccess ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${getRoleBadgeColor(shift.role)}`}>{shift.role}</span>
                  <div className="text-right">
                    <span className="block text-lg font-bold text-[#F97316]">{shift.salary}</span>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-[#F97316]" />
                    <div><p className="text-sm font-bold text-gray-800">{shift.time}</p><p className="text-xs text-gray-500">{shift.date}</p></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    <p className="text-sm text-gray-600">{shift.location}</p>
                  </div>
                  <div className="flex items-start gap-2 pt-2 border-t border-dashed border-gray-100 mt-2">
                    <User size={14} className="text-gray-400 mt-0.5"/>
                    <div className="text-xs">
                      <span className="text-gray-500">Từ: </span><span className="font-bold text-gray-700">{shift.owner}</span>
                      <p className="text-gray-800 italic mt-0.5">Lí do: {shift.reason}</p>
                    </div>
                  </div>
                </div>
                
                {/* BUTTON AREA & ERROR MESSAGE */}
                <div className="flex flex-col gap-2">
                    {status?.type === 'error' && (
                        <div className="flex items-center gap-2 text-red-500 bg-red-50 p-2 rounded-lg text-xs font-medium animate-in slide-in-from-top-2">
                            <AlertTriangle size={14}/> {status.msg}
                        </div>
                    )}
                    
                    <button 
                        onClick={() => handleClickAccept(shift)} 
                        disabled={isSuccess}
                        className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform 
                            ${isSuccess ? 'bg-green-500 text-white' : 'bg-[#F97316] text-white hover:bg-orange-600'}
                        `}
                    >
                        {isSuccess ? <><CheckCircle size={18} className="text-white"/> Đã nhận thành công!</> : <>Nhận ca này <ArrowRight size={16} className="opacity-60"/></>}
                    </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
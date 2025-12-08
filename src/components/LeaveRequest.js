import React, { useState } from 'react';
import { X, Calendar, ChevronDown } from 'lucide-react';

export default function LeaveRequestModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('one_day'); // one_day | many_days

  return (
    <div className="absolute inset-0 z-[60] flex items-end justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      {/* Content */}
      <div className="bg-white w-full h-[90%] rounded-t-[24px] p-5 relative z-10 flex flex-col animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
            <button onClick={onClose} className="p-1"><X size={24}/></button>
            <h2 className="text-lg font-bold flex-1 text-center pr-8">Đơn xin nghỉ phép</h2>
        </div>

        <div className="flex-1 overflow-y-auto space-y-5 no-scrollbar">
            {/* Loại nghỉ */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Loại nghỉ phép <span className="text-red-500">*</span></label>
                <div className="relative">
                    <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none outline-none focus:border-[#F97316] text-gray-700">
                        <option>Nghỉ phép năm</option>
                        <option>Nghỉ ốm</option>
                        <option>Nghỉ việc riêng</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={18}/>
                </div>
            </div>

            {/* Tab chọn ngày */}
            <div className="bg-gray-100 p-1 rounded-xl flex">
                <button 
                    onClick={() => setActiveTab('one_day')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'one_day' ? 'bg-[#005099] text-white shadow-sm' : 'text-gray-500'}`}
                >
                    Một ngày
                </button>
                <button 
                    onClick={() => setActiveTab('many_days')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'many_days' ? 'bg-[#005099] text-white shadow-sm' : 'text-gray-500'}`}
                >
                    Nhiều ngày
                </button>
            </div>

            {/* Date Picker Input */}
            {activeTab === 'one_day' ? (
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày nghỉ phép <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <input type="date" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#F97316] text-gray-700"/>
                        <Calendar className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={18}/>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Số ngày xin nghỉ: <span className="font-bold text-black">1 ngày</span></p>
                </div>
            ) : (
                <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Từ ngày <span className="text-red-500">*</span></label>
                        <input type="date" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Đến ngày <span className="text-red-500">*</span></label>
                        <input type="date" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"/>
                    </div>
                </div>
            )}

            {/* Reason */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Lý do nghỉ phép</label>
                <textarea 
                    placeholder="Nhập lý do..." 
                    className="w-full p-3 h-32 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#F97316] text-gray-700 resize-none"
                ></textarea>
            </div>
        </div>

        {/* Footer Button */}
        <div className="pt-4 border-t border-gray-100">
            <button onClick={onClose} className="w-full py-3.5 bg-[#009688] text-white font-bold rounded-xl active:scale-95 transition-transform">
                Gửi duyệt
            </button>
        </div>

      </div>
    </div>
  );
}
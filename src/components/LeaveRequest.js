import React, { useState } from 'react';
import { X, Calendar, ChevronDown, ChevronLeft } from 'lucide-react';

const LEAVE_TYPES = [
    'Nghỉ ốm',
    'Nghỉ việc riêng',
    'Nghỉ không lương',
    'Nghỉ thai sản',
    'Nghỉ hiếu/hỉ',
    'Nghỉ tai nạn lao động'
];

export default function LeaveRequestModal({ onClose }) {
    const [showTypeSheet, setShowTypeSheet] = useState(false);
    const [selectedType, setSelectedType] = useState('');
    const [leaveDate, setLeaveDate] = useState('');
    const [reason, setReason] = useState('');

    const handleSubmit = () => {
        // Mock submit
        console.log({ selectedType, leaveDate, reason });
        onClose();
    };

    return (
        <div className="absolute inset-0 z-[60] flex items-end justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Main Content */}
            <div className="bg-white w-full h-[90%] rounded-t-[24px] p-5 relative z-10 flex flex-col animate-in slide-in-from-bottom duration-300">

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={onClose} className="p-1 -ml-1 text-gray-800">
                        <ChevronLeft size={28} />
                    </button>
                    <h2 className="text-xl font-bold flex-1 text-gray-900">Đơn xin nghỉ phép</h2>
                </div>

                <div className="flex-1 overflow-y-auto space-y-5 no-scrollbar">
                    {/* Loại nghỉ phép */}
                    <div onClick={() => setShowTypeSheet(true)}>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Loại nghỉ phép <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className={`w-full p-4 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between ${selectedType ? 'text-gray-900' : 'text-gray-400'}`}>
                                <span className="font-medium text-[15px]">{selectedType || 'Chọn loại nghỉ phép'}</span>
                                <ChevronDown className="text-gray-400" size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Ngày nghỉ phép */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Ngày nghỉ phép <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                value={leaveDate}
                                onChange={(e) => setLeaveDate(e.target.value)}
                                className={`w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-gray-300 text-gray-900 font-medium text-[15px] ${!leaveDate && 'text-gray-400'}`}
                                placeholder="Chọn ngày nghỉ phép"
                            />
                        </div>
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Lý do nghỉ phép <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Nhập lý do nghỉ phép"
                            className="w-full p-4 h-32 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-gray-300 text-gray-900 font-medium text-[15px] resize-none placeholder:text-gray-400"
                        ></textarea>
                    </div>
                </div>

                {/* Footer Button */}
                <div className="pt-4 mt-auto">
                    <button
                        disabled={!selectedType || !leaveDate || !reason}
                        onClick={handleSubmit}
                        className={`w-full py-4 rounded-[20px] font-bold text-[16px] transition-all
                    ${(!selectedType || !leaveDate || !reason)
                                ? 'bg-gray-100 text-gray-300'
                                : 'bg-[#e08c27] text-white active:scale-[0.98] shadow-lg shadow-orange-100'}
                `}
                    >
                        Gửi duyệt
                    </button>
                </div>

                {/* Leave Type Selection Sheet (Nested Modal) */}
                {showTypeSheet && (
                    <div className="absolute inset-0 z-[70] flex items-end justify-center">
                        <div
                            className="absolute inset-0 bg-black/20 backdrop-blur-[1px] animate-in fade-in duration-200"
                            onClick={() => setShowTypeSheet(false)}
                        ></div>
                        <div className="bg-white w-full rounded-t-[24px] overflow-hidden flex flex-col max-h-[70%] animate-in slide-in-from-bottom duration-300 relative z-20 shadow-2xl">
                            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900">Loại nghỉ phép</h3>
                                <button onClick={() => setShowTypeSheet(false)} className="p-1 text-gray-500">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="overflow-y-auto p-2">
                                {LEAVE_TYPES.map((type, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setSelectedType(type);
                                            setShowTypeSheet(false);
                                        }}
                                        className="w-full text-left p-4 text-[16px] font-medium text-gray-700 border-b border-gray-50 last:border-0 active:bg-gray-50 rounded-xl"
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                            <div className="h-8 shrink-0"></div>{/* Safe area padding */}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
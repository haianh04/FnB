import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Clock, FileText, Calendar, Plus } from 'lucide-react';
import LeaveRequestModal from '../LeaveRequest';

// --- MOCK DATA ---
const MOCK_LEAVE_REQUESTS = [
    {
        id: 1,
        created_at: '2025-10-24T08:30:00',
        leave_date: '2025-11-20', // Changed to match image date roughly
        type: 'Nghỉ không lương',
        reason: 'Đi khám sức khỏe định kỳ',
        status: 'approved',
        manager_note: null,
    },
    {
        id: 2,
        created_at: '2025-11-02T14:00:00',
        leave_date: '2025-11-12',
        type: 'Nghỉ không lương',
        reason: 'Giải quyết việc gia đình',
        status: 'pending',
        manager_note: null,
    },
    {
        id: 3,
        created_at: '2025-11-10T09:15:00',
        leave_date: '2025-11-05',
        type: 'Nghỉ việc riêng',
        reason: 'Đi đám cưới bạn thân ở quê',
        status: 'rejected',
        manager_note: 'Ngày này quán đông khách, thiếu người em nhé',
    },
    {
        id: 4,
        created_at: '2025-11-20T10:00:00',
        leave_date: '2025-11-22',
        type: 'Nghỉ không lương',
        reason: 'Đi khám sức khỏe định kỳ',
        status: 'approved',
        manager_note: null,
    }
];

export default function LeaveHistoryScreen({ onBack }) {
    const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
    const [showRequestModal, setShowRequestModal] = useState(false);

    // Filter Logic
    const filteredList = MOCK_LEAVE_REQUESTS.filter(item => {
        if (filter === 'all') return true;
        return item.status === filter;
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Mới nhất lên đầu

    // Helpers
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'approved':
                return { label: 'ĐÃ DUYỆT', color: 'text-green-600', border: 'border-green-400', icon: <CheckCircle size={11} /> };
            case 'rejected':
                return { label: 'TỪ CHỐI', color: 'text-red-500', border: 'border-red-300', icon: <XCircle size={11} /> };
            case 'pending':
                return { label: 'CHỜ DUYỆT', color: 'text-yellow-600', border: 'border-yellow-400', icon: <Clock size={11} /> };
            default:
                return { label: 'KHÔNG RÕ', color: 'text-gray-500', border: 'border-gray-300', icon: <Clock size={11} /> };
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#F5F5F5] font-sans relative">

            {/* Header */}
            <div className="bg-white pt-12 pb-3 px-4 shadow-sm flex items-center gap-3 sticky top-0 z-10">
                <button onClick={onBack} className="p-1 -ml-1 active:bg-gray-100 rounded-full">
                    <ArrowLeft size={22} className="text-gray-700" />
                </button>
                <h1 className="text-[17px] font-bold text-gray-900">Lịch sử nghỉ phép</h1>
                <button
                    onClick={() => setShowRequestModal(true)}
                    className="ml-auto p-2 bg-orange-50 text-orange-600 rounded-full active:bg-orange-100 transition-colors"
                >
                    <Plus size={20} />
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="px-4 py-3 bg-white border-b border-gray-100 flex gap-2 overflow-x-auto no-scrollbar">
                {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 'pending', label: 'Chờ duyệt' },
                    { id: 'approved', label: 'Đã duyệt' },
                    { id: 'rejected', label: 'Từ chối' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setFilter(tab.id)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all
                            ${filter === tab.id
                                ? 'bg-orange-500 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
                        `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 pb-24 no-scrollbar">
                {filteredList.length > 0 ? (
                    filteredList.map((item) => {
                        const status = getStatusInfo(item.status);
                        const leaveDate = new Date(item.leave_date);

                        return (
                            <div key={item.id} className="bg-white p-3.5 rounded-[16px] active:scale-[0.99] transition-transform shadow-sm">

                                {/* Top Row */}
                                <div className="flex gap-3 items-start relative mb-2.5">
                                    {/* Date Box - SMALLER */}
                                    <div className="w-[56px] h-[56px] rounded-[14px] bg-[#FFF5EB] flex flex-col items-center justify-center shrink-0">
                                        <span className="text-[9px] font-bold text-[#FF6B00] uppercase mb-0.5">THÁNG {leaveDate.getMonth() + 1}</span>
                                        <span className="text-lg font-bold text-[#FF6B00] leading-none">{leaveDate.getDate()}</span>
                                    </div>

                                    {/* Title, Date & Badge - Use Flex to avoid overlap */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-1.5 mb-0.5">
                                            <h3 className="text-[15px] font-bold text-gray-900 leading-tight truncate">{item.type}</h3>
                                            <div className={`shrink-0 px-2 py-0.5 rounded-md border flex items-center gap-1 text-[9px] font-bold uppercase bg-white ${status.color} ${status.border}`}>
                                                {status.icon} {status.label}
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-gray-400 font-medium">
                                            {leaveDate.toLocaleString('vi-VN', { weekday: 'long' }).replace(/^Thứ/, 'Thứ ')}
                                        </p>
                                    </div>
                                </div>

                                {/* Content: Reason */}
                                <div className="bg-[#F9FAFB] rounded-lg mb-2">
                                    <p className="text-[12px] text-gray-600 font-medium leading-relaxed">
                                        <span className="text-gray-400 font-normal mr-1">Lý do:</span>
                                        {item.reason}
                                    </p>
                                </div>

                                {/* Manager Note: CHỈ HIỆN KHI TỪ CHỐI (REJECTED) */}
                                {item.status === 'rejected' && item.manager_note && (
                                    <div className="mb-2 p-2 rounded-lg bg-[#FFF5F5] border border-red-100">
                                        <div className="flex items-start gap-2">
                                            <FileText size={12} className="text-red-500 mt-0.5 shrink-0" />
                                            <p className="text-[12px] text-red-600">
                                                <span className="font-bold mr-1">Lý do từ chối:</span>
                                                {item.manager_note}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Footer: Created At */}
                                <div className="text-[10px] text-gray-400 text-right font-medium">
                                    Đã tạo: {formatDate(item.created_at)}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                        <Calendar size={48} className="text-gray-200 mb-3" />
                        <p className="text-sm font-medium">Chưa có đơn xin nghỉ nào</p>
                    </div>
                )}
            </div>

            {/* Leave Request Modal */}
            {showRequestModal && (
                <LeaveRequestModal onClose={() => setShowRequestModal(false)} />
            )}
        </div>
    );
}
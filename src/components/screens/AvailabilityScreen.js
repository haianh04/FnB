import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, Clock, Save, Lock, XCircle, Loader, AlertCircle, ChevronDown } from 'lucide-react';

// ==========================================
// 1. MOCK DATA
// ==========================================
const API_RESPONSE = {
    "status": "success",
    "message": "",
    "data": [
        {
            "id": 37,
            "registration_date": "2025-12-16T00:00:00.000Z",
            "availability_type": "available",
            "start_time": "08:00",
            "end_time": "17:00",
            "status": "pending",
            "employee_note": null
        },
        // Ngày 18/12, 19/12, 20/12 sẽ được tự động điền trạng thái 'pending' theo logic "Cả tuần"
        {
            "id": 44,
            "registration_date": "2025-12-23T00:00:00.000Z", // Data tuần sau
            "availability_type": "unavailable",
            "start_time": null,
            "end_time": null,
            "status": "pending",
            "employee_note": "Đi học (08:00 - 12:00)"
        },
        {
            "id": 38,
            "registration_date": "2025-12-24T00:00:00.000Z", // Data tuần sau
            "availability_type": "unavailable",
            "start_time": null,
            "end_time": null,
            "status": "approved",
            "employee_note": "Về quê (08:00 - 12:00)"
        },
        {
            "id": 39,
            "registration_date": "2025-12-25T00:00:00.000Z", // Data tuần sau
            "availability_type": "unavailable",
            "start_time": null,
            "end_time": null,
            "status": "rejected",
            "employee_note": "Ốm (08:00 - 12:00)"
        }
    ]
};

const SUGGESTED_REASONS = ["Việc cá nhân", "Đi học", "Về quê", "Đám cưới", "Ốm", "Khác"];

// ==========================================
// 2. HELPERS
// ==========================================
const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
};

const formatDateKey = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

// Parse note: "Lý do (Start - End)" -> Đảm bảo format chuẩn
const parseNoteInfo = (noteString) => {
    if (!noteString) return { reason: '', from: '', to: '' };
    // Regex bắt format 24h: 08:00 - 17:00
    const regex = /^(.*?)\s*\((\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})\)$/;
    const match = noteString.match(regex);
    if (match) {
        return { reason: match[1].trim(), from: match[2], to: match[3] };
    }
    return { reason: noteString, from: '', to: '' };
};

export default function AvailabilityScreen({ onBack }) {
    const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date(2025, 11, 15)));
    const [weekData, setWeekData] = useState({});
    const [editingDay, setEditingDay] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // --- TRANSFORM API DATA & AUTO-FILL MISSING DAYS ---
    const transformApiToState = (apiData, weekStart) => {
        const mapped = {};
        let weekStatus = null;

        // Xác định khoảng thời gian của tuần hiện tại để lọc data
        const weekEnd = addDays(weekStart, 6);
        const startStr = formatDateKey(weekStart);
        const endStr = formatDateKey(weekEnd);

        // 1. Duyệt data từ API để tìm trạng thái chung của tuần NÀY
        apiData.forEach(record => {
            const dateKey = record.registration_date.split('T')[0];

            // Chỉ xét status của các record nằm trong tuần hiện tại
            if (dateKey >= startStr && dateKey <= endStr) {
                if (!weekStatus && record.status !== 'new') {
                    weekStatus = record.status;
                }
            }

            let dayConfig = {
                id: record.id,
                status: record.status,
                availability_type: record.availability_type,
                manager_note: record.manager_note
            };

            if (record.availability_type === 'available') {
                dayConfig.isFullDay = true;
                dayConfig.busyFrom = '08:00';
                dayConfig.busyTo = '17:00';
            } else {
                // Unavailable
                const parsed = parseNoteInfo(record.employee_note);
                if (parsed.from && parsed.to) {
                    dayConfig.isFullDay = false;
                    dayConfig.busyFrom = parsed.from;
                    dayConfig.busyTo = parsed.to;
                } else {
                    dayConfig.isFullDay = true;
                    dayConfig.busyFrom = null;
                    dayConfig.busyTo = null;
                }
                dayConfig.reason = parsed.reason;
            }
            mapped[dateKey] = dayConfig;
        });

        // 2. Logic "Gửi cả tuần"
        if (weekStatus) {
            for (let i = 0; i < 7; i++) {
                const d = addDays(weekStart, i);
                const key = formatDateKey(d);
                if (!mapped[key]) {
                    mapped[key] = {
                        status: weekStatus,
                        availability_type: 'available',
                        isFullDay: true,
                        busyFrom: '08:00',
                        busyTo: '17:00',
                        isImplicit: true
                    };
                }
            }
        }

        return mapped;
    };

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            const transformed = transformApiToState(API_RESPONSE.data, currentWeekStart);
            setWeekData(transformed);
            setLoading(false);
        }, 500);
    }, [currentWeekStart]);

    // --- HANDLERS ---
    const handlePrevWeek = () => setCurrentWeekStart(addDays(currentWeekStart, -7));
    const handleNextWeek = () => setCurrentWeekStart(addDays(currentWeekStart, 7));
    const currentWeekEnd = addDays(currentWeekStart, 6);
    const formatWeekRange = (start, end) => `${start.getDate()}/${start.getMonth() + 1} — ${end.getDate()}/${end.getMonth() + 1}`;

    const isWeekLocked = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // If the end of the current view week is before today, it's a past week.
        // Or if you want to lock the current week as well after some deadline, adjust here.
        // Assuming "Past weeks" means strictly weeks before this one? 
        // Or "Past days"? Requirement says "những tuần đã qua rồi" -> Past weeks.
        const weekEnd = new Date(currentWeekEnd);
        weekEnd.setHours(23, 59, 59, 999);
        return weekEnd < today;
    };

    const isLocked = (status) => status === 'approved' || status === 'rejected' || isWeekLocked();

    const handleOpenEdit = (dateStr, dayLabel) => {
        setErrorMsg('');
        const currentConfig = weekData[dateStr] || {
            availability_type: 'available',
            isFullDay: true,
            status: 'new',
            busyFrom: '08:00',
            busyTo: '17:00',
            reason: ''
        };

        setEditingDay({
            dateStr,
            dayLabel,
            ...currentConfig
        });
    };

    const handleConfirmEdit = () => {
        // Validation
        if (editingDay.availability_type === 'unavailable') {
            if (!editingDay.reason || editingDay.reason.trim() === '') {
                setErrorMsg('Vui lòng chọn hoặc nhập lý do bận');
                return;
            }
            if (!editingDay.isFullDay && (!editingDay.busyFrom || !editingDay.busyTo)) {
                setErrorMsg('Vui lòng nhập đầy đủ thời gian bận');
                return;
            }
        }

        let type = editingDay.availability_type;
        const finalFrom = (type === 'unavailable' && editingDay.isFullDay) ? null : (editingDay.isFullDay ? '08:00' : editingDay.busyFrom);
        const finalTo = (type === 'unavailable' && editingDay.isFullDay) ? null : (editingDay.isFullDay ? '17:00' : editingDay.busyTo);

        setWeekData(prev => ({
            ...prev,
            [editingDay.dateStr]: {
                ...prev[editingDay.dateStr],
                status: 'new', // Đánh dấu local change
                availability_type: type,
                isFullDay: editingDay.isFullDay,
                reason: editingDay.reason,
                busyFrom: finalFrom,
                busyTo: finalTo,
            }
        }));
        setEditingDay(null);
    };

    const handleSendWeekRegistration = () => {
        const newWeekData = { ...weekData };
        let hasChanges = false;
        for (let i = 0; i < 7; i++) {
            const date = addDays(currentWeekStart, i);
            const dateKey = formatDateKey(date);
            const existingData = newWeekData[dateKey];

            if (!existingData || existingData.status === 'new') {
                hasChanges = true;
                newWeekData[dateKey] = {
                    ...existingData,
                    status: 'pending',
                    availability_type: existingData?.availability_type || 'available',
                    isFullDay: existingData?.isFullDay !== false,
                    busyFrom: existingData?.busyFrom || '08:00',
                    busyTo: existingData?.busyTo || '17:00'
                };
            }
        }

        if (hasChanges) {
            setWeekData(newWeekData);
            // alert("Đã gửi đăng ký cho cả tuần!");
        } else {
            // alert("Tuần này đã được gửi duyệt rồi.");
        }
    };

    // --- RENDERERS ---
    const renderStatusBadge = (status) => {
        switch (status) {
            case 'approved': return <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded border border-green-200 flex items-center gap-1"><CheckCircle size={10} /> Đã duyệt</span>;
            case 'rejected': return <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded border border-red-200 flex items-center gap-1"><XCircle size={10} /> Từ chối</span>;
            case 'pending': return <span className="text-[10px] font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded border border-yellow-200 flex items-center gap-1"><Clock size={10} /> Chờ duyệt</span>;
            default: return <span className="text-[10px] text-gray-400">Chưa đăng ký</span>;
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#F5F5F5] font-sans relative">

            {/* Header */}
            <div className="bg-white pt-12 pb-3 px-4 shadow-sm flex items-center gap-2 sticky top-0 z-20">
                <button onClick={onBack}><ArrowLeft size={22} className="text-gray-700" /></button>
                <h1 className="text-[17px] font-bold text-gray-900">Đăng ký lịch làm việc</h1>
            </div>

            <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
                {/* Navigator */}
                <div className="bg-white p-3 mb-3 border-b border-gray-100">
                    <div className="flex justify-between items-center bg-gray-50 rounded-xl p-1 border border-gray-200">
                        <button onClick={handlePrevWeek} className="p-2 text-gray-500 active:text-orange-500"><ChevronLeft size={20} /></button>
                        <span className="font-bold text-sm text-gray-800">{formatWeekRange(currentWeekStart, currentWeekEnd)}</span>
                        <button onClick={handleNextWeek} className="p-2 text-gray-500 active:text-orange-500"><ChevronRight size={20} /></button>
                    </div>
                </div>

                {/* List Days */}
                <div className="px-4 space-y-3">
                    {loading ? <div className="text-center py-10"><Loader className="animate-spin mx-auto text-gray-400" /></div> :
                        [0, 1, 2, 3, 4, 5, 6].map((offset) => {
                            const date = addDays(currentWeekStart, offset);
                            const dateKey = formatDateKey(date);
                            const data = weekData[dateKey] || { status: 'new', availability_type: 'available', isFullDay: true, busyFrom: '08:00', busyTo: '17:00' };
                            const isUnavailable = data.availability_type === 'unavailable';
                            const dayLabels = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
                            const label = dayLabels[date.getDay()];

                            let borderClass = 'border-l-orange-300';
                            if (data.status === 'approved') borderClass = 'border-l-green-500';
                            else if (data.status === 'rejected') borderClass = 'border-l-red-500';
                            else if (data.status === 'pending') borderClass = 'border-l-yellow-400';

                            return (
                                <div
                                    key={dateKey}
                                    onClick={() => handleOpenEdit(dateKey, `${label}, ${date.getDate()}/${date.getMonth() + 1}`)}
                                    className={`bg-white p-4 rounded-xl border border-gray-100 border-l-4 ${borderClass} shadow-sm flex items-center gap-3 active:scale-[0.98] transition-all relative overflow-hidden`}
                                >
                                    {isLocked(data.status) && <div className="absolute right-2 top-2"><Lock size={14} className="text-gray-300" /></div>}
                                    <div className="flex flex-col items-center min-w-[45px]">
                                        <span className="text-[10px] font-bold uppercase text-black-500">{label}</span>
                                        <span className="text-lg font-bold text-black-600">{date.getDate()}</span>
                                    </div>
                                    <div className="flex-1 pl-3 border-l border-gray-100">
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2.5 h-2.5 rounded-full ${!isUnavailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                <span className={`text-sm font-bold ${!isUnavailable ? 'text-green-700' : 'text-red-600'}`}>
                                                    {(!isUnavailable ? 'Rảnh' : 'Bận')}
                                                    { }
                                                </span>
                                            </div>
                                            {renderStatusBadge(data.status)}
                                        </div>

                                        <div className="mt-1 flex flex-col gap-0.5">
                                            {isUnavailable && <span className="text-xs font-medium text-gray-800">{data.reason}</span>}
                                            {
                                                <span className="text-[10px] text-gray-500 bg-gray-50 w-fit px-1.5 py-0.5 rounded font-bold">
                                                    {data.isFullDay ? "Cả ngày" : `${data.busyFrom} - ${data.busyTo}`}
                                                </span>
                                            }
                                        </div>
                                        {data.status === 'rejected' && data.manager_note && (
                                            <p className="text-[10px] text-red-500 mt-1 bg-red-50 p-1 rounded">Note: {data.manager_note}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Footer */}
            {!isWeekLocked() && (
                <div className="bg-white p-4 border-t border-gray-100 shadow-lg z-30">
                    <button onClick={handleSendWeekRegistration} className="w-full py-3.5 bg-[#E08C27] text-white font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
                        <Save size={18} /> Gửi đăng ký
                    </button>
                </div>
            )}

            {/* Modal Edit */}
            {editingDay && (
                <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-[2px]" onClick={() => setEditingDay(null)}>
                    <div className="bg-white w-full rounded-t-[24px] p-5 animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 shrink-0"></div>

                        {/* Modal Header */}
                        <div className="flex justify-between mb-4 shrink-0">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{editingDay.dayLabel}</h3>
                                <p className="text-xs text-gray-500">{isLocked(editingDay.status) ? 'Đã được xử lý' : 'Cập nhật trạng thái'}</p>
                            </div>
                            {renderStatusBadge(editingDay.status)}
                        </div>

                        {/* ========================================================= */}
                        {/* 3. NEW FORM UI: LIST VIEW STYLE */}
                        {/* ========================================================= */}
                        <div className="overflow-y-auto flex-1 no-scrollbar pb-4">
                            {errorMsg && (
                                <div className="mb-4 bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl flex items-center gap-2 border border-red-100">
                                    <AlertCircle size={14} /> {errorMsg}
                                </div>
                            )}

                            <div className="space-y-6">
                                {/* ROW 1: TRẠNG THÁI (DROPDOWN) */}
                                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                    <label className="text-sm font-medium text-gray-700">Trạng thái</label>
                                    <div className="relative">
                                        <select
                                            disabled={isLocked(editingDay.status)}
                                            value={editingDay.availability_type}
                                            onChange={(e) => {
                                                const newType = e.target.value;
                                                setEditingDay(prev => ({
                                                    ...prev,
                                                    availability_type: newType,
                                                    reason: newType === 'available' ? '' : (prev.reason || SUGGESTED_REASONS[0]),
                                                    isFullDay: true
                                                }));
                                            }}
                                            className="appearance-none bg-gray-50 border-none text-right pr-8 pl-4 py-2 rounded-lg text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-orange-100"
                                        >
                                            <option value="available">Rảnh cả ngày</option>
                                            <option value="unavailable">Bận</option>
                                        </select>
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <ChevronLeft size={16} className="-rotate-90 text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                {/* GROUP: HIỂN THỊ KHI CHỌN "BẬN" */}
                                {editingDay.availability_type === 'unavailable' && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                                        {/* ROW 2: FULL DAY TOGGLE */}
                                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                            <label className="text-sm font-medium text-gray-700">Cả ngày</label>
                                            <button
                                                type="button"
                                                disabled={isLocked(editingDay.status)}
                                                onClick={() => setEditingDay(prev => ({ ...prev, isFullDay: !prev.isFullDay }))}
                                                className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out relative ${editingDay.isFullDay ? 'bg-green-500' : 'bg-gray-200'}`}
                                            >
                                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${editingDay.isFullDay ? 'translate-x-5' : 'translate-x-0'}`} />
                                            </button>
                                        </div>

                                        {/* ROW 3: TIME PICKER (Chỉ hiện khi Tắt Full Day) */}
                                        {!editingDay.isFullDay && (
                                            <div className="space-y-4 border-b border-gray-100 pb-4">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-sm font-medium text-gray-700">Từ</label>
                                                    <input
                                                        type="time"
                                                        disabled={isLocked(editingDay.status)}
                                                        value={editingDay.busyFrom || ''}
                                                        onChange={(e) => setEditingDay({ ...editingDay, busyFrom: e.target.value })}
                                                        className="bg-gray-100 text-gray-900 text-sm font-bold rounded-lg p-2 outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 transition-all w-28 text-center"
                                                    />
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <label className="text-sm font-medium text-gray-700">Đến</label>
                                                    <input
                                                        type="time"
                                                        disabled={isLocked(editingDay.status)}
                                                        value={editingDay.busyTo || ''}
                                                        onChange={(e) => setEditingDay({ ...editingDay, busyTo: e.target.value })}
                                                        className="bg-gray-100 text-gray-900 text-sm font-bold rounded-lg p-2 outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 transition-all w-28 text-center"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* ROW 4: REASON (DROPDOWN) */}
                                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                            <label className="text-sm font-medium text-gray-700">Lý do</label>
                                            <div className="relative">
                                                <select
                                                    disabled={isLocked(editingDay.status)}
                                                    value={SUGGESTED_REASONS.includes(editingDay.reason) ? editingDay.reason : "Khác"}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        setEditingDay(prev => ({ ...prev, reason: val === "Khác" ? "" : val }));
                                                    }}
                                                    className="appearance-none bg-transparent text-right pr-6 py-2 rounded-lg text-sm text-gray-600 outline-none cursor-pointer hover:text-orange-600 font-medium"
                                                >
                                                    {SUGGESTED_REASONS.map(r => (
                                                        <option key={r} value={r}>{r}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <ChevronLeft size={14} className="-rotate-90 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* ROW 5: COMMENTS (TEXT AREA) */}
                                        <div className="pt-2">
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">Ghi chú thêm</label>
                                            <textarea
                                                disabled={isLocked(editingDay.status)}
                                                placeholder="Nhập ghi chú..."
                                                rows={3}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {!isLocked(editingDay.status) ? (
                            <button onClick={handleConfirmEdit} className="w-full py-3.5 bg-[#191919] text-white font-bold rounded-xl active:scale-95 transition-transform shrink-0">Xác nhận</button>
                        ) : (
                            <button onClick={() => setEditingDay(null)} className="w-full py-3.5 bg-gray-100 text-gray-600 font-bold rounded-xl active:scale-95 transition-transform shrink-0">Đóng</button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
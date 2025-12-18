'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    Check, X, Clock, RefreshCw, Loader2, 
    FileText, CheckSquare, Square, Calendar, ChevronDown,
    Search, ChevronLeft, ChevronRight, MapPin, Briefcase, AlertCircle
} from 'lucide-react';
// import api from '@/core/lib/api'; // Giữ import API theo yêu cầu

// --- MOCK DATA (GIỮ NGUYÊN TỪ FILE CŨ CỦA BẠN) ---
// Sử dụng let để có thể cập nhật trạng thái khi thao tác (giả lập DB)
let ALL_MOCK_DATA = [
    // =========================================================================
    // TUẦN 51: 15/12/2025 (Thứ 2) - 21/12/2025 (Chủ Nhật)
    // =========================================================================

    // 1. NGUYỄN VĂN CƯỜNG (Bếp)
    { "id": 101, "employee_id": 21, "employee_name": "Nguyễn Văn Cường", "branch": "CHÚ BI", "department": "Bếp", "role_name": "Bếp trưởng", "created_at": "2025-12-10T08:00:00Z", "registration_date": "2025-12-15T00:00:00Z", "availability_type": "available", "status": "approved" },
    { "id": 102, "employee_id": 21, "employee_name": "Nguyễn Văn Cường", "branch": "CHÚ BI", "department": "Bếp", "role_name": "Bếp trưởng", "created_at": "2025-12-10T08:00:00Z", "registration_date": "2025-12-16T00:00:00Z", "availability_type": "available", "status": "approved" },
    { "id": 103, "employee_id": 21, "employee_name": "Nguyễn Văn Cường", "branch": "CHÚ BI", "department": "Bếp", "role_name": "Bếp trưởng", "created_at": "2025-12-10T08:00:00Z", "registration_date": "2025-12-17T00:00:00Z", "availability_type": "unavailable", "start_time": "08:00", "end_time": "12:00", "status": "rejected", "employee_note": "Khám bệnh" },
    { "id": 104, "employee_id": 21, "employee_name": "Nguyễn Văn Cường", "branch": "CHÚ BI", "department": "Bếp", "role_name": "Bếp trưởng", "created_at": "2025-12-10T08:00:00Z", "registration_date": "2025-12-18T00:00:00Z", "availability_type": "available", "status": "pending" },
    { "id": 105, "employee_id": 21, "employee_name": "Nguyễn Văn Cường", "branch": "CHÚ BI", "department": "Bếp", "role_name": "Bếp trưởng", "created_at": "2025-12-10T08:00:00Z", "registration_date": "2025-12-19T00:00:00Z", "availability_type": "available", "status": "pending" },
    { "id": 106, "employee_id": 21, "employee_name": "Nguyễn Văn Cường", "branch": "CHÚ BI", "department": "Bếp", "role_name": "Bếp trưởng", "created_at": "2025-12-10T08:00:00Z", "registration_date": "2025-12-20T00:00:00Z", "availability_type": "available", "status": "pending" },
    { "id": 107, "employee_id": 21, "employee_name": "Nguyễn Văn Cường", "branch": "CHÚ BI", "department": "Bếp", "role_name": "Bếp trưởng", "created_at": "2025-12-10T08:00:00Z", "registration_date": "2025-12-21T00:00:00Z", "availability_type": "available", "status": "pending" },

    // 2. TRẦN THỊ MAI (Bàn)
    { "id": 201, "employee_id": 22, "employee_name": "Trần Thị Mai", "branch": "CHÚ BI", "department": "Bàn", "role_name": "Phục vụ", "created_at": "2025-12-12T09:00:00Z", "registration_date": "2025-12-15T00:00:00Z", "availability_type": "available", "status": "pending" },
    { "id": 202, "employee_id": 22, "employee_name": "Trần Thị Mai", "branch": "CHÚ BI", "department": "Bàn", "role_name": "Phục vụ", "created_at": "2025-12-12T09:00:00Z", "registration_date": "2025-12-16T00:00:00Z", "availability_type": "available", "status": "pending" },
    { "id": 203, "employee_id": 22, "employee_name": "Trần Thị Mai", "branch": "CHÚ BI", "department": "Bàn", "role_name": "Phục vụ", "created_at": "2025-12-12T09:00:00Z", "registration_date": "2025-12-17T00:00:00Z", "availability_type": "available", "status": "pending" },
    { "id": 204, "employee_id": 22, "employee_name": "Trần Thị Mai", "branch": "CHÚ BI", "department": "Bàn", "role_name": "Phục vụ", "created_at": "2025-12-12T09:00:00Z", "registration_date": "2025-12-18T00:00:00Z", "availability_type": "available", "status": "pending" },
    { "id": 205, "employee_id": 22, "employee_name": "Trần Thị Mai", "branch": "CHÚ BI", "department": "Bàn", "role_name": "Phục vụ", "created_at": "2025-12-12T09:00:00Z", "registration_date": "2025-12-19T00:00:00Z", "availability_type": "available", "status": "pending" },
    { "id": 206, "employee_id": 22, "employee_name": "Trần Thị Mai", "branch": "CHÚ BI", "department": "Bàn", "role_name": "Phục vụ", "created_at": "2025-12-12T09:00:00Z", "registration_date": "2025-12-20T00:00:00Z", "availability_type": "available", "status": "pending" },
    { "id": 207, "employee_id": 22, "employee_name": "Trần Thị Mai", "branch": "CHÚ BI", "department": "Bàn", "role_name": "Phục vụ", "created_at": "2025-12-12T09:00:00Z", "registration_date": "2025-12-21T00:00:00Z", "availability_type": "available", "status": "pending" },

    // =========================================================================
    // TUẦN 50: 08/12/2025 (Thứ 2) - 14/12/2025 (Chủ Nhật)
    // =========================================================================

    // 3. LÊ QUANG HUY (Bếp)
    { "id": 301, "employee_id": 14, "employee_name": "Lê Quang Huy", "branch": "CHÚ BI", "department": "Bếp", "role_name": "Bếp trưởng", "created_at": "2025-12-05T14:00:00Z", "registration_date": "2025-12-08T00:00:00Z", "availability_type": "available", "status": "approved" },
    { "id": 302, "employee_id": 14, "employee_name": "Lê Quang Huy", "branch": "CHÚ BI", "department": "Bếp", "role_name": "Bếp trưởng", "created_at": "2025-12-05T14:00:00Z", "registration_date": "2025-12-09T00:00:00Z", "availability_type": "available", "status": "approved" },
    { "id": 303, "employee_id": 14, "employee_name": "Lê Quang Huy", "branch": "CHÚ BI", "department": "Bếp", "role_name": "Bếp trưởng", "created_at": "2025-12-05T14:00:00Z", "registration_date": "2025-12-10T00:00:00Z", "availability_type": "available", "status": "approved" },
    { "id": 304, "employee_id": 14, "employee_name": "Lê Quang Huy", "branch": "CHÚ BI", "department": "Bếp", "role_name": "Bếp trưởng", "created_at": "2025-12-05T14:00:00Z", "registration_date": "2025-12-11T00:00:00Z", "availability_type": "unavailable", "start_time": "13:00", "end_time": "17:00", "status": "approved", "employee_note": "Về quê" },
    { "id": 305, "employee_id": 14, "employee_name": "Lê Quang Huy", "branch": "CHÚ BI", "department": "Bếp", "role_name": "Bếp trưởng", "created_at": "2025-12-05T14:00:00Z", "registration_date": "2025-12-12T00:00:00Z", "availability_type": "available", "status": "approved" },
    { "id": 306, "employee_id": 14, "employee_name": "Lê Quang Huy", "branch": "CHÚ BI", "department": "Bếp", "role_name": "Bếp trưởng", "created_at": "2025-12-05T14:00:00Z", "registration_date": "2025-12-13T00:00:00Z", "availability_type": "available", "status": "approved" },
    { "id": 307, "employee_id": 14, "employee_name": "Lê Quang Huy", "branch": "CHÚ BI", "department": "Bếp", "role_name": "Bếp trưởng", "created_at": "2025-12-05T14:00:00Z", "registration_date": "2025-12-14T00:00:00Z", "availability_type": "available", "status": "approved" },

    // =========================================================================
    // TUẦN 52: 22/12/2025 (Thứ 2) - 28/12/2025 (Chủ Nhật)
    // =========================================================================

    // 4. HOÀNG THẾ ANH (Phục vụ)
    { "id": 401, "employee_id": 17, "employee_name": "Hoàng Thế Anh", "branch": "CHÚ BI", "department": "Bàn", "role_name": "Phục vụ", "created_at": "2025-12-20T10:00:00Z", "registration_date": "2025-12-22T00:00:00Z", "availability_type": "unavailable", "start_time": "08:00", "end_time": "10:00", "status": "rejected", "employee_note": "Việc riêng" },
    { "id": 402, "employee_id": 17, "employee_name": "Hoàng Thế Anh", "branch": "CHÚ BI", "department": "Bàn", "role_name": "Phục vụ", "created_at": "2025-12-20T10:00:00Z", "registration_date": "2025-12-23T00:00:00Z", "availability_type": "available", "status": "rejected" },
    { "id": 403, "employee_id": 17, "employee_name": "Hoàng Thế Anh", "branch": "CHÚ BI", "department": "Bàn", "role_name": "Phục vụ", "created_at": "2025-12-20T10:00:00Z", "registration_date": "2025-12-24T00:00:00Z", "availability_type": "available", "status": "rejected" },
    { "id": 404, "employee_id": 17, "employee_name": "Hoàng Thế Anh", "branch": "CHÚ BI", "department": "Bàn", "role_name": "Phục vụ", "created_at":"2025-12-26T18:39:39.867Z","registration_date":"2025-12-31T18:39:39.867Z","availability_type":"available","status":"pending"}
];

// --- HELPER FUNCTIONS ---
const getMonday = (d) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - (day === 0 ? 6 : day - 1);
    return new Date(date.setDate(diff));
}

const getWeekDateRange = (d) => {
    const monday = getMonday(d);
    const sunday = new Date(new Date(monday).setDate(monday.getDate() + 6));
    const format = (dateObj) => `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
    return `${format(monday)} - ${format(sunday)}`;
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
};

const getDayName = (d) => {
    const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return days[d.getDay()];
};

const formatSubmissionTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2,'0')}/${(date.getMonth() + 1).toString().padStart(2,'0')}/${date.getFullYear()} - ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const getAvatarUrl = (name) => {
    const encodedName = encodeURIComponent(name || 'User');
    return `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&size=128&bold=true`;
};

// --- LOGIC GOM NHÓM ---
const groupAndFilterRegistrations = (data) => {
    const batches = {};
    
    data.forEach(item => {
        const regDate = new Date(item.registration_date);
        const weekRange = getWeekDateRange(regDate);
        const batchKey = `${item.employee_id}_${weekRange}`;
        
        if (!batches[batchKey]) {
            batches[batchKey] = {
                id: batchKey,
                employee_id: item.employee_id,
                employee_name: item.employee_name,
                role_name: item.role_name,
                department: item.department,
                branch: item.branch || 'Chưa cập nhật',
                created_at: item.created_at,
                week_range: weekRange, 
                items: [],
                count: 0 
            };
        }
        
        batches[batchKey].items.push(item);
        batches[batchKey].count++;
    });

    let result = Object.values(batches);
    result.forEach(batch => {
        batch.items.sort((a, b) => new Date(a.registration_date) - new Date(b.registration_date));
    });
    return result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

// --- MODAL COMPONENTS ---

const ConfirmationModal = ({ isOpen, type, employeeName, managerNote, setManagerNote, onConfirm, onCancel, isLoading }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
             <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!isLoading ? onCancel : undefined}></div>
            <div className="bg-white relative z-10 rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-scaleIn">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${type === 'approve' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                        {type === 'approve' ? <Check className="text-emerald-600" size={20}/> : <X className="text-red-600" size={20}/>}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{type === 'approve' ? 'Duyệt yêu cầu' : 'Từ chối yêu cầu'}</h3>
                </div>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    Bạn có chắc chắn muốn <span className="font-bold">{type === 'approve' ? 'duyệt' : 'từ chối'}</span> yêu cầu này của nhân viên <span className="font-bold text-gray-900">{employeeName}</span> không?
                </p>
                <div className="mb-6">
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Ghi chú của quản lý (Tùy chọn)</label>
                    <textarea 
                        value={managerNote}
                        onChange={(e) => setManagerNote(e.target.value)}
                        placeholder={type === 'approve' ? "VD: Đã xếp ca sáng..." : "VD: Ca này đã đủ người..."}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all resize-none"
                        rows={3}
                    />
                </div>
                <div className="flex justify-end gap-3">
                    <button disabled={isLoading} onClick={onCancel} className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors">Hủy</button>
                    <button disabled={isLoading} onClick={onConfirm} className={`px-4 py-2.5 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all ${type === 'approve' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200' : 'bg-red-500 hover:bg-red-600 shadow-red-200'} ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}>
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : null} {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function ScheduleRegistrationAdmin() {
    const [activeTab, setActiveTab] = useState('pending');
    const [registrations, setRegistrations] = useState([]);
    const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
    const [selectedIds, setSelectedIds] = useState([]);
    
    // Bulk Action State
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [bulkAction, setBulkAction] = useState('approve');
    const [bulkNote, setBulkNote] = useState('');

    // Loading & Error
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);

    // Expand/Collapse State
    const [expandedBatches, setExpandedBatches] = useState({});
    
    // Single Action Modal State
    const [confirmModal, setConfirmModal] = useState({ 
        isOpen: false, type: null, registrationId: null, employeeName: '', managerNote: '' 
    });

    // --- FILTERS STATE ---
    const [currentWeekStart, setCurrentWeekStart] = useState(() => getMonday(new Date('2025-12-15'))); // Default mock week
    const [searchName, setSearchName] = useState('');
    const [nameSuggestions, setNameSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');

    // --- MOCK API FETCH ---
    const fetchRegistrations = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Giả lập API call
            setTimeout(() => {
                const weekStart = new Date(currentWeekStart);
                weekStart.setHours(0,0,0,0);
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 7);

                // 1. Tính toán Stats dựa trên TOÀN BỘ dữ liệu của tuần (không lọc theo status)
                const weeklyData = ALL_MOCK_DATA.filter(d => {
                    const regDate = new Date(d.registration_date);
                    return regDate >= weekStart && regDate < weekEnd;
                });

                setStats({
                    pending: weeklyData.filter(r => r.status === 'pending').length,
                    approved: weeklyData.filter(r => r.status === 'approved').length,
                    rejected: weeklyData.filter(r => r.status === 'rejected').length
                });

                // 2. Lọc dữ liệu trả về cho bảng (dựa trên activeTab + Filters)
                // Trong thực tế API sẽ nhận params status. Ở đây ta giả lập điều đó.
                let filteredData = weeklyData.filter(d => d.status === activeTab);

                // Filter by Name
                if (searchName) {
                    filteredData = filteredData.filter(d => d.employee_name.toLowerCase().includes(searchName.toLowerCase()));
                }
                // Filter by Branch
                if (selectedBranch) {
                    filteredData = filteredData.filter(d => (d.branch || 'Chưa cập nhật') === selectedBranch);
                }
                // Filter by Department
                if (selectedDepartment) {
                    filteredData = filteredData.filter(d => d.department === selectedDepartment);
                }

                setRegistrations(filteredData);
                setSelectedIds([]);
                setLoading(false);
            }, 500);

            // NẾU SAU NÀY CÓ API THẬT, BẠN BỎ COMMENT KHỐI DƯỚI ĐÂY:
            /*
            const weekStart = new Date(currentWeekStart);
            const params = {
                status: activeTab,
                dateFrom: weekStart.toISOString().split('T')[0],
                dateTo: new Date(weekStart.setDate(weekStart.getDate() + 6)).toISOString().split('T')[0]
            };
            const res = await api.get('/api/schedule-registration', { params });
            if (res?.data?.status === 'success') {
                setRegistrations(res.data.data);
                setStats(res.data.stats);
            }
            */

        } catch (err) {
            console.error("Fetch error:", err);
            setError('Lỗi kết nối đến máy chủ');
            setLoading(false);
        }
    }, [currentWeekStart, activeTab, searchName, selectedBranch, selectedDepartment]);

    useEffect(() => {
        fetchRegistrations();
    }, [fetchRegistrations]);

    // --- HANDLERS ---
    const handleNameChange = (e) => {
        const val = e.target.value;
        setSearchName(val);
        if (val.length > 0) {
            const uniqueNames = [...new Set(ALL_MOCK_DATA.map(i => i.employee_name))];
            const filtered = uniqueNames.filter(name => name.toLowerCase().includes(val.toLowerCase()));
            setNameSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const selectSuggestion = (name) => {
        setSearchName(name);
        setShowSuggestions(false);
    };

    const changeWeek = (direction) => {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(newDate.getDate() + (direction * 7));
        setCurrentWeekStart(newDate);
    };

    // Derived lists
    const branches = useMemo(() => [...new Set(ALL_MOCK_DATA.map(i => i.branch || 'Chưa cập nhật'))].filter(Boolean), []);
    const departments = useMemo(() => [...new Set(ALL_MOCK_DATA.map(i => i.department))].filter(Boolean), []);

    // Grouping
    const batchedRegistrations = useMemo(() => {
        const grouped = groupAndFilterRegistrations(registrations);
        setExpandedBatches(prev => {
            const newState = { ...prev };
            grouped.forEach(batch => {
                if (newState[batch.id] === undefined) newState[batch.id] = true;
            });
            return newState;
        });
        return grouped;
    }, [registrations]);

    // Selection
    const toggleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    
    const toggleSelectBatch = (items) => {
        const itemIds = items.map(i => i.id);
        const isAllSelected = itemIds.every(id => selectedIds.includes(id));
        if (isAllSelected) setSelectedIds(prev => prev.filter(id => !itemIds.includes(id)));
        else setSelectedIds(prev => [...new Set([...prev, ...itemIds])]);
    };

    const toggleSelectAllGlobal = () => {
        const allIdsInView = batchedRegistrations.flatMap(b => b.items).map(i => i.id);
        if (allIdsInView.length > 0 && selectedIds.length === allIdsInView.length) setSelectedIds([]);
        else setSelectedIds(allIdsInView);
    };

    const toggleExpandBatch = (batchId) => {
        setExpandedBatches(prev => {
            const currentIsExpanded = prev[batchId] !== false;
            return { ...prev, [batchId]: !currentIsExpanded };
        });
    };

    // --- MOCK API ACTIONS ---
    const handleConfirmAction = async () => {
        if (!confirmModal.registrationId) return;
        setActionLoading(true);

        // MOCK: Cập nhật trực tiếp vào mảng ALL_MOCK_DATA để giả lập DB thay đổi
        setTimeout(() => {
            const targetIndex = ALL_MOCK_DATA.findIndex(r => r.id === confirmModal.registrationId);
            if (targetIndex !== -1) {
                ALL_MOCK_DATA[targetIndex].status = confirmModal.type === 'approve' ? 'approved' : 'rejected';
                ALL_MOCK_DATA[targetIndex].manager_note = confirmModal.managerNote;
                
                // Refresh lại list
                fetchRegistrations();
                setConfirmModal({ isOpen: false, type: null, registrationId: null, employeeName: '', managerNote: '' });
            } else {
                alert("Không tìm thấy dữ liệu (Mock Error)");
            }
            setActionLoading(false);
        }, 500);

        /* MÃ API THẬT (DÀNH CHO SAU NÀY):
        try {
            const endpoint = confirmModal.type === 'approve' 
                ? `/api/schedule-registration/${confirmModal.registrationId}/approve`
                : `/api/schedule-registration/${confirmModal.registrationId}/reject`;
            const res = await api.put(endpoint, { manager_note: confirmModal.managerNote });
            if (res?.data?.status === 'success') {
                await fetchRegistrations();
                setConfirmModal({ isOpen: false, type: null, registrationId: null, employeeName: '', managerNote: '' });
            }
        } catch (err) { console.error(err); }
        */
    };

    const handleApprove = (id, e, name) => { e?.stopPropagation(); setConfirmModal({isOpen: true, type: 'approve', registrationId: id, employeeName: name, managerNote: ''}); };
    const handleReject = (id, e, name) => { e?.stopPropagation(); setConfirmModal({isOpen: true, type: 'reject', registrationId: id, employeeName: name, managerNote: ''}); };
    
    const bulkApprove = async () => {
        if (selectedIds.length === 0) return;
        setActionLoading(true);

        // MOCK: Bulk Update
        setTimeout(() => {
            ALL_MOCK_DATA.forEach((item) => {
                if (selectedIds.includes(item.id)) {
                    item.status = bulkAction === 'approve' ? 'approved' : 'rejected';
                    item.manager_note = bulkNote;
                }
            });
            fetchRegistrations();
            setSelectedIds([]);
            setShowBulkModal(false);
            setBulkNote('');
            setActionLoading(false);
        }, 800);

        /* MÃ API THẬT (DÀNH CHO SAU NÀY):
        try {
            const res = await api.post('/api/schedule-registration/bulk-approve', {
                ids: selectedIds,
                action: bulkAction,
                manager_note: bulkNote
            });
            if (res?.data?.status === 'success') {
                await fetchRegistrations();
                // ... reset state
            }
        } catch (err) { console.error(err); }
        */
    };

    const allPendingSelected = batchedRegistrations.length > 0 && 
        batchedRegistrations.flatMap(b => b.items).every(i => selectedIds.includes(i.id));

    return (
        <div className="flex flex-col h-screen bg-gray-50/50 p-4 md:p-8 font-sans text-gray-800 overflow-hidden">
            <style>{`@keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } } .animate-scaleIn { animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1); }`}</style>
            
            <ConfirmationModal 
                isOpen={confirmModal.isOpen}
                type={confirmModal.type}
                employeeName={confirmModal.employeeName}
                managerNote={confirmModal.managerNote}
                setManagerNote={(val) => setConfirmModal(prev => ({...prev, managerNote: val}))}
                onConfirm={handleConfirmAction}
                onCancel={() => setConfirmModal({isOpen: false, type: null, registrationId: null, employeeName: '', managerNote: ''})}
                isLoading={actionLoading}
            />

            <div className="max-w-6xl mx-auto w-full flex flex-col h-full">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6 shrink-0">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                            <Calendar className="text-blue-600" size={24}/> Quản lý lịch rảnh
                        </h1>
                    </div>
                    <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm flex gap-1">
                        <button onClick={() => setActiveTab('pending')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'pending' ? 'bg-orange-500 text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}>
                            Chờ duyệt <span className={`text-xs px-2 py-0.5 rounded-md ${activeTab === 'pending' ? 'bg-white/20' : 'bg-gray-100 text-gray-600'}`}>{stats.pending}</span>
                        </button>
                        <button onClick={() => setActiveTab('approved')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'approved' ? 'bg-emerald-500 text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}>
                            Đã duyệt <span className={`text-xs px-2 py-0.5 rounded-md ${activeTab === 'approved' ? 'bg-white/20' : 'bg-gray-100 text-gray-600'}`}>{stats.approved}</span>
                        </button>
                        <button onClick={() => setActiveTab('rejected')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'rejected' ? 'bg-red-500 text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}>
                            Đã từ chối <span className={`text-xs px-2 py-0.5 rounded-md ${activeTab === 'rejected' ? 'bg-white/20' : 'bg-gray-100 text-gray-600'}`}>{stats.rejected}</span>
                        </button>
                    </div>
                </div>

                {/* Filters & Actions Bar */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-6 space-y-4 shrink-0">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-100 pb-4">
                        {/* Week Navigation */}
                        <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                            <button onClick={() => changeWeek(-1)} className="p-2 hover:bg-white rounded-lg transition-all text-gray-500 hover:text-blue-600 shadow-sm"><ChevronLeft size={20}/></button>
                            <div className="flex items-center gap-2 px-2">
                                <Calendar size={18} className="text-blue-600"/>
                                <span className="text-sm font-bold text-gray-700 min-w-[180px] text-center">
                                    {getWeekDateRange(currentWeekStart)}
                                </span>
                            </div>
                            <button onClick={() => changeWeek(1)} className="p-2 hover:bg-white rounded-lg transition-all text-gray-500 hover:text-blue-600 shadow-sm"><ChevronRight size={20}/></button>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Bulk Actions UI */}
                            {selectedIds.length > 0 && activeTab === 'pending' && (
                                <div className="flex items-center gap-2 animate-scaleIn">
                                    <span className="text-sm font-medium text-gray-600 mr-2">Đã chọn: <b className="text-gray-900">{selectedIds.length}</b></span>
                                    <button onClick={() => {setBulkAction('approve'); setShowBulkModal(true)}} className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-200 transition-colors flex items-center gap-1.5"><Check size={14}/> Duyệt</button>
                                    <button onClick={() => {setBulkAction('reject'); setShowBulkModal(true)}} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors flex items-center gap-1.5"><X size={14}/> Từ chối</button>
                                </div>
                            )}
                            
                            {activeTab === 'pending' && (
                                <button onClick={toggleSelectAllGlobal} className={`px-4 py-2 rounded-lg text-sm font-medium border flex items-center gap-2 transition-colors ${allPendingSelected ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                    {allPendingSelected ? <CheckSquare size={18}/> : <Square size={18}/>} Chọn tất cả
                                </button>
                            )}
                            <button onClick={fetchRegistrations} className="p-2.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition-colors"><RefreshCw size={18} className={loading ? 'animate-spin' : ''}/></button>
                        </div>
                    </div>

                    {/* Additional Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={16} className="text-gray-400"/>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Tìm tên nhân viên..." 
                                value={searchName}
                                onChange={handleNameChange}
                                className="pl-10 pr-4 py-2.5 w-full bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                            />
                            {showSuggestions && nameSuggestions.length > 0 && (
                                <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                    {nameSuggestions.map((name, idx) => (
                                        <div 
                                            key={idx} 
                                            onClick={() => selectSuggestion(name)}
                                            className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors"
                                        >
                                            {name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MapPin size={16} className="text-gray-400"/>
                            </div>
                            <select 
                                value={selectedBranch} 
                                onChange={e => setSelectedBranch(e.target.value)}
                                className="pl-10 pr-8 py-2.5 w-full bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none appearance-none cursor-pointer"
                            >
                                <option value="">Tất cả cơ sở</option>
                                {branches.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Briefcase size={16} className="text-gray-400"/>
                            </div>
                            <select 
                                value={selectedDepartment} 
                                onChange={e => setSelectedDepartment(e.target.value)}
                                className="pl-10 pr-8 py-2.5 w-full bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none appearance-none cursor-pointer"
                            >
                                <option value="">Tất cả bộ phận</option>
                                {departments.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                        </div>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 shrink-0">
                        <AlertCircle size={20} />
                        <span className="text-sm font-medium">{error}</span>
                        <button onClick={() => setError(null)} className="ml-auto hover:bg-red-100 p-1 rounded">
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Main List Area */}
                <div className="space-y-4 flex-1 overflow-y-auto pb-10">
                    {loading ? (
                        <div className="text-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-blue-500"/>
                            <p className="text-gray-500 font-medium">Đang tải dữ liệu...</p>
                        </div>
                    ) : batchedRegistrations.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="text-gray-300" size={40}/>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Không tìm thấy dữ liệu</h3>
                            <p className="text-gray-500">Danh sách {activeTab === 'pending' ? 'chờ duyệt' : activeTab === 'approved' ? 'đã duyệt' : 'đã từ chối'} trống trong tuần này.</p>
                        </div>
                    ) : (
                        batchedRegistrations.map(batch => {
                            // LOGIC MŨI TÊN EXPAND/COLLAPSE
                            const isExpanded = expandedBatches[batch.id] !== false; 
                            
                            const batchItemIds = batch.items.map(i => i.id);
                            const isAllBatchSelected = batchItemIds.length > 0 && batchItemIds.every(id => selectedIds.includes(id));
                            const isSomeBatchSelected = batchItemIds.some(id => selectedIds.includes(id)) && !isAllBatchSelected;

                            return (
                                <div key={batch.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md group-card">
                                    <div className="px-6 py-4 flex items-center gap-5 cursor-pointer select-none bg-white hover:bg-gray-50/80 transition-colors" onClick={() => toggleExpandBatch(batch.id)}>
                                        {activeTab === 'pending' && (
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <button 
                                                    onClick={() => toggleSelectBatch(batch.items)} 
                                                    className={`p-1 rounded-lg transition-colors ${isAllBatchSelected ? 'text-blue-600' : 'text-gray-300 hover:text-gray-500'}`}
                                                >
                                                    {isAllBatchSelected ? <CheckSquare size={22} className="text-blue-600"/> : isSomeBatchSelected ? <div className="w-[22px] h-[22px] relative flex items-center justify-center"><Square size={22} className="text-gray-300 absolute"/><div className="w-2.5 h-2.5 bg-blue-600 rounded-sm z-10"></div></div> : <Square size={22}/>}
                                                </button>
                                            </div>
                                        )}
                                        <div className="relative">
                                            <img src={getAvatarUrl(batch.employee_name)} alt="" className="w-12 h-12 rounded-full border-2 border-white shadow-sm bg-gray-100 object-cover"/>
                                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                                <div className={`w-3 h-3 rounded-full border-2 border-white ${activeTab === 'pending' ? 'bg-orange-500' : activeTab === 'approved' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-base font-bold text-gray-900 truncate flex items-center gap-2">
                                                    {batch.employee_name}
                                                    <span className="text-[12px] text-gray-500 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 hidden sm:block">Đã gửi lúc: {formatSubmissionTime(batch.created_at)}</span>
                                                </h3>
                                            </div>
                                            <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                                <span className="flex text-gray-600 font-semibold items-center gap-1"><MapPin size={12}/> {batch.branch}</span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                <span className="flex text-gray-600 font-semibold items-center gap-1"><Briefcase size={12}/> {batch.department}</span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                <span className="text-gray-600 font-semibold">{batch.week_range}</span>
                                            </p>
                                        </div>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${isExpanded ? 'bg-gray-100 border-gray-300 text-gray-600 rotate-180' : 'bg-white border-gray-100 text-gray-400'}`}><ChevronDown size={18}/></div>
                                    </div>

                                    {isExpanded && (
                                        <div className="border-t border-gray-100">
                                            {batch.items.map((item) => (
                                                <div key={item.id} className={`px-6 py-3.5 flex flex-col sm:flex-row sm:items-center gap-4 transition-colors border-b border-gray-50 last:border-0 ${selectedIds.includes(item.id) ? 'bg-blue-50/40' : 'hover:bg-gray-50/50'}`}>
                                                    <div className="flex items-center gap-4 w-full sm:w-48">
                                                        {activeTab === 'pending' ? (
                                                            <button onClick={() => toggleSelect(item.id)} className={`p-1 transition-colors ${selectedIds.includes(item.id) ? 'text-blue-600' : 'text-gray-300 hover:text-gray-500'}`}>
                                                                {selectedIds.includes(item.id) ? <CheckSquare size={20}/> : <Square size={20}/>}
                                                            </button>
                                                        ) : (
                                                            <div className="w-[28px] h-[28px] flex items-center justify-center">
                                                                {item.status === 'approved' ? <Check size={16} className="text-emerald-500"/> : item.status === 'rejected' ? <X size={16} className="text-red-500"/> : <Clock size={16} className="text-orange-400"/>}
                                                            </div>
                                                        )}
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-gray-800">{getDayName(new Date(item.registration_date))}</span>
                                                            <span className="text-xs text-gray-400">{formatDate(item.registration_date)}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pl-9 sm:pl-0">
                                                        <div className="sm:col-span-4">
                                                            {item.availability_type === 'available' ? (
                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 w-fit"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Rảnh</span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 text-xs font-bold border border-orange-100 w-fit"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> Bận</span>
                                                            )}
                                                        </div>

                                                        <div className="sm:col-span-5">
                                                            <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                                                                <Clock size={16} className="text-gray-400"/>
                                                                {item.availability_type === 'available' ? <span className="text-emerald-700 font-bold">Cả ngày</span> : <span className="text-red-700 font-bold">Bận: {item.start_time || '08:00'} - {item.end_time || '17:00'}</span>}
                                                            </div>
                                                            {item.employee_note && <div className="mt-1 text-xs text-gray-600 font-semibold bg-yellow-50 px-2 py-1 rounded border border-yellow-100 inline-block max-w-full truncate">Lý do: {item.employee_note}</div>}
                                                            {/* Hiển thị ghi chú của quản lý nếu có */}
                                                            {item.manager_note && <div className="mt-1 text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded border border-blue-100 inline-block max-w-full truncate">Note: {item.manager_note}</div>}
                                                        </div>

                                                        <div className="sm:col-span-3 flex justify-end gap-2">
                                                            {activeTab === 'pending' ? (
                                                                <>
                                                                    <button onClick={(e) => handleApprove(item.id, e, batch.employee_name)} className="w-8 h-8 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 bg-emerald-50 rounded-lg transition-colors border border-emerald-100" title="Duyệt"><Check size={16} strokeWidth={3}/></button>
                                                                    <button onClick={(e) => handleReject(item.id, e, batch.employee_name)} className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-100 bg-red-50 rounded-lg transition-colors border border-red-100" title="Từ chối"><X size={16} strokeWidth={3}/></button>
                                                                </>
                                                            ) : (
                                                                <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border flex items-center gap-1.5 ${item.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                                                    {item.status === 'approved' ? 'Đã duyệt' : 'Đã từ chối'}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Bulk Action Modal */}
            {showBulkModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !actionLoading && setShowBulkModal(false)}></div>
                    <div className="bg-white relative z-10 p-6 rounded-2xl shadow-xl w-full max-w-sm animate-scaleIn">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto ${bulkAction === 'approve' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                            {bulkAction === 'approve' ? <Check className="text-emerald-600" size={24}/> : <X className="text-red-600" size={24}/>}
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-gray-900 text-center">Xác nhận thao tác hàng loạt</h3>
                        <p className="text-gray-500 text-sm mb-6 text-center">Bạn đang chọn <b>{selectedIds.length}</b> mục để <span className={bulkAction === 'approve' ? 'text-emerald-600 font-bold' : 'text-red-600 font-bold'}>{bulkAction === 'approve' ? 'duyệt' : 'từ chối'}</span>.</p>
                        
                        {/* Textarea for Bulk Note */}
                        <div className="mb-6">
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Ghi chú chung (Tùy chọn)</label>
                            <textarea 
                                value={bulkNote}
                                onChange={(e) => setBulkNote(e.target.value)}
                                placeholder={bulkAction === 'approve' ? "VD: Đã duyệt tất cả..." : "VD: Ca này đã đủ người..."}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all resize-none"
                                rows={3}
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button disabled={actionLoading} onClick={() => setShowBulkModal(false)} className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold text-sm text-gray-600 transition-colors">Hủy</button>
                            <button disabled={actionLoading} onClick={bulkApprove} className={`px-4 py-2.5 text-white rounded-xl font-bold text-sm shadow-sm transition-colors flex items-center gap-2 ${bulkAction === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}>
                                {actionLoading && <Loader2 className="w-4 h-4 animate-spin"/>} Đồng ý
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
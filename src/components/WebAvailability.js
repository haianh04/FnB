import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Check, X, Eye, Calendar, User, Clock, ChevronLeft, ArrowLeft, 
  Inbox, Search, MapPin, Building2, Filter, AlertCircle, Briefcase, CalendarDays, Wallet, ArrowRight
} from 'lucide-react';
import NotificationDropdown from './WebNotification';

// --- MOCK DATA ---
const INITIAL_REQUESTS = [
  // 1. ĐƠN XIN NGHỈ (LEAVE)
  {
    id: 101,
    category: 'leave',
    employeeName: "Nguyễn Văn A",
    employeeId: "NV001",
    avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+A&background=random",
    department: "Bếp",
    location: "Nhà hàng Chú Bi",
    submittedDate: "2025-12-10",
    status: "pending",
    leaveType: "Nghỉ phép",
    startDate: "2025-12-20",
    endDate: "2025-12-22",
    totalDays: 3,
    reason: "Đi du lịch gia đình"
  },
  {
    id: 102,
    category: 'leave',
    employeeName: "Trần Thị B",
    employeeId: "NV002",
    avatar: "https://ui-avatars.com/api/?name=Tran+Thi+B&background=random",
    department: "Bàn",
    location: "Nhà hàng Chú Bi",
    submittedDate: "2025-12-11",
    status: "pending",
    leaveType: "Nghỉ không lương",
    startDate: "2025-12-12",
    endDate: "2025-12-12",
    totalDays: 1,
    reason: "Việc cá nhân đột xuất"
  },
  {
    id: 103,
    category: 'leave',
    employeeName: "Lê Văn C",
    employeeId: "NV004",
    avatar: "https://ui-avatars.com/api/?name=Le+Van+C&background=random",
    department: "Bảo vệ",
    location: "Chi nhánh 2",
    submittedDate: "2025-12-01",
    status: "approved",
    leaveType: "Nghỉ phép",
    startDate: "2025-12-05",
    endDate: "2025-12-05",
    totalDays: 1,
    reason: "Đám cưới bạn thân"
  },
  // 2. ĐĂNG KÝ LỊCH (AVAILABILITY)
  {
    id: 201,
    category: 'availability',
    employeeName: "Hoàng Đức Tùng",
    employeeId: "NV003",
    avatar: "https://ui-avatars.com/api/?name=Hoang+Tung&background=F97316&color=fff",
    department: "Bar",
    location: "Chi nhánh 2",
    submittedDate: "2025-12-09",
    status: "pending",
    availabilityWeekStart: "2025-12-15",
    availabilityWeekEnd: "2025-12-21",
    availabilityDetails: {
      'T2': { status: 'available' },
      'T3': { status: 'unavailable', from: '18:00', to: '23:00', reason: 'Đi học'},
    }
  },
   {
    id: 202,
    category: 'availability',
    employeeName: "Phạm Thị D",
    employeeId: "NV005",
    avatar: "https://ui-avatars.com/api/?name=Pham+Thi+D&background=random",
    department: "Bàn",
    location: "Nhà hàng Chú Bi",
    submittedDate: "2025-12-08",
    status: "approved",
    availabilityWeekStart: "2025-12-08",
    availabilityWeekEnd: "2025-12-14",
    availabilityDetails: {
      'T7': { status: 'unavailable', from: '08:00', to: '17:00', reason: 'Về quê' },
    }
  }
];

const WEEK_DAYS_MAP = [
    { key: 'CN', label: 'Chủ Nhật' },
    { key: 'T2', label: 'Thứ Hai' },
    { key: 'T3', label: 'Thứ Ba' },
    { key: 'T4', label: 'Thứ Tư' },
    { key: 'T5', label: 'Thứ Năm' },
    { key: 'T6', label: 'Thứ Sáu' },
    { key: 'T7', label: 'Thứ Bảy' },
];

export default function RequestManager() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  // --- TABS STATE ---
  const [activeCategory, setActiveCategory] = useState('leave');
  const [activeStatusTab, setActiveStatusTab] = useState('pending');
  
  // --- FILTERS STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filterDateStart, setFilterDateStart] = useState("");
  const [filterDateEnd, setFilterDateEnd] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");

  const searchContainerRef = useRef(null);

  // --- ACTIONS ---
  const handleApprove = (id, e) => {
    e?.stopPropagation();
    if(window.confirm('Bạn có chắc muốn DUYỆT yêu cầu này?')) {
      setRequests(prev => prev.map(item => item.id === id ? { ...item, status: 'approved' } : item));
      // Nếu đang xem chi tiết Availability mà duyệt, đóng modal (hoặc giữ lại tùy UX, ở đây đóng cho gọn)
      if (selectedRequest?.id === id) setSelectedRequest(null);
    }
  };

  const handleReject = (id, e) => {
    e?.stopPropagation();
    if(window.confirm('Bạn có chắc muốn TỪ CHỐI yêu cầu này?')) {
      setRequests(prev => prev.map(item => item.id === id ? { ...item, status: 'rejected' } : item));
      if (selectedRequest?.id === id) setSelectedRequest(null);
    }
  };

  // --- FILTER LOGIC ---
  const uniqueEmployees = useMemo(() => {
    const map = new Map();
    requests.forEach(r => map.set(r.employeeId, { name: r.employeeName, id: r.employeeId, avatar: r.avatar }));
    return Array.from(map.values());
  }, [requests]);

  const employeeSuggestions = uniqueEmployees.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredData = useMemo(() => {
    return requests.filter(item => {
      if (item.category !== activeCategory) return false;
      if (activeStatusTab === 'pending' && item.status !== 'pending') return false;
      if (activeStatusTab === 'history' && item.status === 'pending') return false;
      if (searchQuery && !item.employeeName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filterDept !== 'all' && item.department !== filterDept) return false;
      if (filterLocation !== 'all' && item.location !== filterLocation) return false;

      const targetDate = new Date(item.category === 'leave' ? item.startDate : item.availabilityWeekStart);
      if (filterDateStart && targetDate < new Date(filterDateStart)) return false;
      if (filterDateEnd && targetDate > new Date(filterDateEnd)) return false;

      return true;
    });
  }, [requests, activeCategory, activeStatusTab, searchQuery, filterDept, filterLocation, filterDateStart, filterDateEnd]);


  // --- SUB-COMPONENTS ---

  const StatusBadge = ({ status }) => {
    switch (status) {
      case 'pending': return <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold border border-orange-200 block text-center min-w-[80px]">Chờ duyệt</span>;
      case 'approved': return <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold border border-emerald-200 block text-center min-w-[80px]">Đã duyệt</span>;
      case 'rejected': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold border border-red-200 block text-center min-w-[80px]">Đã từ chối</span>;
      default: return null;
    }
  };

  const LeaveTypeBadge = ({ type }) => {
    if (type === 'Nghỉ phép') {
        return (
            <span className="text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100 text-xs font-bold flex items-center gap-1 w-fit">
                <Briefcase size={12} /> Nghỉ phép
            </span>
        );
    }
    return (
        <span className="text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200 text-xs font-bold flex items-center gap-1 w-fit">
            <Wallet size={12} /> Nghỉ không lương
        </span>
    );
  };

  // --- VIEW: DETAIL MODAL (Chỉ dùng cho Availability) ---
  if (selectedRequest && selectedRequest.category === 'availability') {
     return (
        <div className="flex flex-col h-full bg-gray-50 overflow-hidden animate-in slide-in-from-right duration-200 font-sans">
           {/* Header */}
           <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm shrink-0">
             <div className="flex items-center gap-4">
                <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                   <ArrowLeft size={20} className="text-gray-600"/>
                </button>
                <div className="flex items-center gap-3">
                   <img src={selectedRequest.avatar} alt="avt" className="w-10 h-10 rounded-full border border-gray-200"/>
                   <div>
                      <h2 className="text-lg font-bold text-gray-900 leading-tight">{selectedRequest.employeeName}</h2>
                      <div className="flex items-center gap-2 mt-0.5">
                         <span className="text-xs text-gray-500 flex items-center gap-1"><Building2 size={10}/> {selectedRequest.department}</span>
                         <span className="text-gray-300">|</span>
                         <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={10}/> {selectedRequest.location}</span>
                      </div>
                   </div>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <StatusBadge status={selectedRequest.status} />
                {selectedRequest.status === 'pending' && (
                  <>
                    <button onClick={() => handleApprove(selectedRequest.id)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 shadow-sm transition-all">
                       <Check size={16}/> Duyệt
                    </button>
                    <button onClick={() => handleReject(selectedRequest.id)} className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 transition-all">
                       <X size={16}/> Từ chối
                    </button>
                  </>
                )}
             </div>
           </div>

           {/* Content */}
           <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                   <div className="bg-indigo-50 px-6 py-3 border-b border-indigo-100 flex items-center gap-2">
                       <Calendar size={16} className="text-indigo-600"/>
                       <span className="text-indigo-900 font-bold text-sm uppercase">Chi tiết lịch đăng ký ({selectedRequest.availabilityWeekStart} - {selectedRequest.availabilityWeekEnd})</span>
                   </div>
                   <div className="divide-y divide-gray-100">
                      {WEEK_DAYS_MAP.map((day) => {
                         const info = selectedRequest.availabilityDetails[day.key] || { status: 'available' };
                         const isBusy = info.status === 'unavailable';
                         return (
                            <div key={day.key} className="flex min-h-[50px]">
                               <div className={`w-32 px-6 py-3 font-medium text-sm flex items-center ${isBusy ? 'bg-orange-50/50 text-orange-800' : 'bg-white text-gray-600'}`}>
                                  {day.label}
                               </div>
                               <div className="flex-1 px-6 py-3 flex items-center">
                                  {isBusy ? (
                                     <div className="flex items-center gap-3">
                                        <span className="text-orange-600 text-xs font-bold border border-orange-200 bg-orange-50 px-2 py-0.5 rounded">Bận</span>
                                        <span className="text-sm font-medium text-gray-800">{info.from} - {info.to}</span>
                                        <span className="text-xs text-gray-500 italic">({info.reason})</span>
                                     </div>
                                  ) : (
                                     <span className="text-emerald-600 text-xs font-bold border border-emerald-200 bg-emerald-50 px-2 py-0.5 rounded">Sẵn sàng</span>
                                  )}
                               </div>
                            </div>
                         );
                      })}
                   </div>
               </div>
           </div>
        </div>
     );
  }

  // --- VIEW: MAIN LIST ---
  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden font-sans text-gray-900">
      
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between shrink-0 shadow-sm z-20">
         <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-gray-200">
                <Inbox size={20} strokeWidth={2.5}/>
             </div>
             <div>
                 <h1 className="text-xl font-bold text-gray-900 tracking-tight">Quản lý Yêu cầu</h1>
                 <p className="text-xs text-gray-500 font-medium">Trung tâm xử lý đơn từ nhân viên</p>
             </div>
             {/* COMPONENT THÔNG BÁO */}
            <div className="flex items-center gap-3">
                <NotificationDropdown />
            </div>
         </div>
      </div>

      {/* CATEGORY TABS (LEVEL 1) */}
      <div className="px-6 pt-6 pb-0 bg-white border-b border-gray-200 shrink-0">
          <div className="flex gap-8">
              <button 
                  onClick={() => setActiveCategory('leave')}
                  className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                      activeCategory === 'leave' 
                      ? 'border-rose-500 text-rose-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                  <Briefcase size={18} />
                  Đơn xin nghỉ
                  <span className={`text-[10px] px-1.5 rounded-full ${activeCategory === 'leave' ? 'bg-rose-100 text-rose-600' : 'bg-gray-100'}`}>
                      {requests.filter(r => r.category === 'leave' && r.status === 'pending').length}
                  </span>
              </button>
              <button 
                  onClick={() => setActiveCategory('availability')}
                  className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                      activeCategory === 'availability' 
                      ? 'border-indigo-500 text-indigo-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                  <CalendarDays size={18} />
                  Đăng ký lịch
                  <span className={`text-[10px] px-1.5 rounded-full ${activeCategory === 'availability' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100'}`}>
                      {requests.filter(r => r.category === 'availability' && r.status === 'pending').length}
                  </span>
              </button>
          </div>
      </div>

      {/* TOOLBAR: STATUS TABS & FILTERS */}
      <div className="px-6 py-3 bg-white border-b border-gray-200 flex flex-wrap gap-3 items-center shrink-0 z-10 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
         
         {/* Status Tabs (Level 2) */}
         <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 mr-2">
            <button 
               onClick={() => setActiveStatusTab('pending')}
               className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeStatusTab === 'pending' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
               Cần xử lý
            </button>
            <button 
               onClick={() => setActiveStatusTab('history')}
               className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeStatusTab === 'history' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
               Lịch sử
            </button>
         </div>

         <div className="h-6 w-px bg-gray-200 mx-1"></div>

         {/* 1. Name Search */}
         <div className="relative group" ref={searchContainerRef}>
            <div className={`flex items-center border rounded-lg px-3 py-1.5 bg-gray-50 w-48 focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-orange-400 focus-within:bg-white transition-all ${showSuggestions ? 'ring-2 ring-orange-200 border-orange-400 bg-white' : 'border-gray-200'}`}>
                <Search size={14} className="text-gray-400 mr-2"/>
                <input 
                  type="text"
                  placeholder="Tìm nhân viên..." 
                  className="bg-transparent outline-none text-xs w-full placeholder-gray-400 text-gray-700 font-medium"
                  value={searchQuery}
                  onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                />
                {searchQuery && <button onClick={() => setSearchQuery("")}><X size={12} className="text-gray-400 hover:text-gray-600"/></button>}
            </div>
            
            {showSuggestions && searchQuery && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-50">
                    {employeeSuggestions.length > 0 ? (
                        employeeSuggestions.map(emp => (
                            <div key={emp.id} className="px-3 py-2 hover:bg-orange-50 cursor-pointer flex items-center gap-2" onClick={() => { setSearchQuery(emp.name); setShowSuggestions(false); }}>
                                <img src={emp.avatar} alt="" className="w-5 h-5 rounded-full"/>
                                <span className="text-xs text-gray-700 font-medium">{emp.name}</span>
                            </div>
                        ))
                    ) : (
                        <div className="px-3 py-2 text-xs text-gray-400 italic">Không tìm thấy nhân viên</div>
                    )}
                </div>
            )}
         </div>

         {/* 2. Date Filter */}
         <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 bg-white">
             <Calendar size={14} className="text-gray-400"/>
             <input type="date" className="text-xs outline-none text-gray-600 font-medium" value={filterDateStart} onChange={e => setFilterDateStart(e.target.value)} />
             <span className="text-gray-400 text-xs">-</span>
             <input type="date" className="text-xs outline-none text-gray-600 font-medium" value={filterDateEnd} onChange={e => setFilterDateEnd(e.target.value)} />
         </div>

         {/* 3. Dropdown Filters */}
         <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white outline-none focus:border-orange-400 text-gray-600 font-medium cursor-pointer" value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
             <option value="all">Tất cả bộ phận</option>
             <option value="Bếp">Bếp</option>
             <option value="Bar">Bar</option>
             <option value="Bàn">Bàn</option>
             <option value="Bảo vệ">Bảo vệ</option>
         </select>

         <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white outline-none focus:border-orange-400 text-gray-600 font-medium cursor-pointer" value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)}>
             <option value="all">Tất cả địa điểm</option>
             <option value="Nhà hàng Chú Bi">Nhà hàng Chú Bi</option>
             <option value="Chi nhánh 2">Chi nhánh 2</option>
         </select>

         {/* Clear Filters */}
         {(filterDept !== 'all' || filterLocation !== 'all' || searchQuery || filterDateStart) && (
             <button onClick={() => { setFilterDept('all'); setFilterLocation('all'); setSearchQuery(''); setFilterDateStart(''); setFilterDateEnd(''); }} className="text-xs text-red-500 hover:text-red-700 font-medium underline px-2">
                 Xóa lọc
             </button>
         )}
      </div>

      {/* TABLE DATA */}
      <div className="flex-1 overflow-auto bg-gray-50 p-6">
         <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden min-w-[1000px]">
            {/* Table Header - Dynamic based on Category */}
            <div className="grid grid-cols-12 gap-4 bg-gray-50 border-b border-gray-200 px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider sticky top-0 z-10">
               {activeCategory === 'leave' ? (
                   <>
                       <div className="col-span-3">Nhân viên</div>
                       <div className="col-span-2">Loại nghỉ</div>
                       <div className="col-span-3">Thời gian nghỉ</div>
                       <div className="col-span-1 text-center">Số ngày</div>
                       <div className="col-span-2">Lý do</div>
                       <div className="col-span-1 text-right">Hành động</div>
                   </>
               ) : (
                   <>
                       <div className="col-span-3">Nhân viên</div>
                       <div className="col-span-3">Thời gian đăng ký</div>
                       <div className="col-span-2">Ngày gửi</div>
                       {/* Bỏ cột Ghi chú */}
                       <div className="col-span-4 text-right">Hành động</div>
                   </>
               )}
            </div>
            
            {/* Table Body */}
            <div className="divide-y divide-gray-100 text-sm"> {/* Set base font size for table */}
               {filteredData.length === 0 ? (
                   <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                       <Filter size={48} className="mb-4 opacity-20"/>
                       <p className="text-sm">Không tìm thấy yêu cầu nào.</p>
                   </div>
               ) : (
                   filteredData.map(item => (
                       <div 
                          key={item.id} 
                          // Xóa onClick select request ở row level để tránh conflict với nút Xem
                          className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors group animate-in fade-in duration-300`}
                       >
                           {/* Col 1: Employee */}
                           <div className="col-span-3 flex items-center gap-3">
                               <div className="relative">
                                   <img src={item.avatar} alt="" className="w-10 h-10 rounded-full border border-gray-200"/>
                                   <div className={`absolute -bottom-1 -right-1 rounded-full p-0.5 border border-gray-200 shadow-sm bg-white`}>
                                        {item.category === 'leave' ? <Briefcase size={10} className="text-rose-500"/> : <Calendar size={10} className="text-indigo-500"/>}
                                   </div>
                               </div>
                               <div className="min-w-0">
                                   <p className="text-sm font-bold text-gray-900 truncate">{item.employeeName}</p>
                                   <p className="text-xs text-gray-500 truncate flex items-center gap-1 font-medium">
                                      {item.department} • {item.location}
                                   </p>
                               </div>
                           </div>

                           {/* Dynamic Columns based on Category */}
                           {activeCategory === 'leave' ? (
                               // --- LEAVE COLUMNS ---
                               <>
                                   {/* Loại nghỉ */}
                                   <div className="col-span-2">
                                       <LeaveTypeBadge type={item.leaveType} />
                                   </div>
                                   {/* Thời gian nghỉ (Pretty Format) */}
                                   <div className="col-span-3">
                                       <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                                                <Calendar size={14} className="text-gray-400"/>
                                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                                    <span>{(item.startDate)}</span>
                                                    <ArrowRight size={12} className="text-gray-300"/>
                                                    <span>{(item.endDate)}</span>
                                                </div>
                                            </div>
                                       </div>
                                   </div>
                                   {/* Số ngày (Chỉ số) */}
                                   <div className="col-span-1 text-center">
                                       <span className="text-lg font-bold text-gray-900">{item.totalDays}</span>
                                   </div>
                                   {/* Lý do (Màu đen) */}
                                   <div className="col-span-2">
                                       <p className="text-sm text-gray-900 truncate font-medium" title={item.reason}>
                                           {item.reason || "-"}
                                       </p>
                                   </div>
                               </>
                           ) : (
                               // --- AVAILABILITY COLUMNS ---
                               <>
                                   {/* Thời gian đăng ký (7 ngày) */}
                                   <div className="col-span-3">
                                       <div className="flex items-center gap-2 text-indigo-700 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100 w-fit">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold">{item.availabilityWeekStart} ➝ {item.availabilityWeekEnd}</span>
                                            </div>
                                       </div>
                                   </div>
                                   {/* Ngày gửi */}
                                   <div className="col-span-2 text-sm text-gray-600 font-medium">
                                       {item.submittedDate}
                                   </div>
                                   {/* Bỏ cột Ghi chú */}
                               </>
                           )}

                           {/* Col Action (Shared) */}
                           <div className={`flex items-center justify-end gap-2 ${activeCategory === 'leave' ? 'col-span-1' : 'col-span-4'}`}>
                               
                               {/* Nút Xem (Luôn hiện cho Availability) */}
                               {item.category === 'availability' && (
                                   <button 
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm hover:text-slate-900"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedRequest(item);
                                        }}
                                        title="Xem chi tiết lịch"
                                   >
                                        <Eye size={14} className="text-slate-500"/> Xem
                                   </button>
                               )}

                               {item.status === 'pending' ? (
                                   <div className="flex gap-2">
                                       <button 
                                          onClick={(e) => handleApprove(item.id, e)}
                                          title="Duyệt"
                                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded shadow-sm hover:bg-emerald-700 transition-colors text-xs font-bold"
                                       >
                                           <Check size={14}/>
                                       </button>
                                       <button 
                                          onClick={(e) => handleReject(item.id, e)}
                                          title="Từ chối"
                                          className="flex items-center gap-1 px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded hover:bg-red-50 transition-colors text-xs font-bold"
                                       >
                                           <X size={14}/>
                                       </button>
                                   </div>
                               ) : (
                                   <StatusBadge status={item.status} />
                               )}
                           </div>
                       </div>
                   ))
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
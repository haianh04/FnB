import React, { useState } from 'react';
import { Check, X, Eye, Calendar, User, Clock, ChevronLeft, ArrowLeft } from 'lucide-react';

// --- MOCK DATA ---
const REQUESTS = [
  {
    id: 1,
    employeeName: "Hoàng Đức Tùng",
    avatar: "https://ui-avatars.com/api/?name=Hoang+Tung&background=F97316&color=fff",
    type: "Lặp lại",
    submittedDate: "26 thg 11, 2025 10:10 AM",
    status: "pending", // pending, approved, rejected
    details: {
      'T2': { status: 'available' },
      'T3': { status: 'unavailable', from: '18:00', to: '23:00', reason: 'Đi học'},
      'T4': { status: 'available' },
      'T5': { status: 'unavailable', from: '18:00', to: '23:00', reason: 'Đi học'},
      'T6': { status: 'available' },
      'T7': { status: 'available' },
      'CN': { status: 'available' },
    }
  },
  {
    id: 2,
    employeeName: "Nguyễn Thị Lan",
    avatar: "https://ui-avatars.com/api/?name=Nguyen+Lan&background=random&color=fff",
    type: "Tạm thời (24/11 - 30/11)",
    submittedDate: "25 thg 11, 2025 09:30 AM",
    status: "pending",
    details: {
      'T2': { status: 'available' },
      'T3': { status: 'available' },
      'T4': { status: 'unavailable', from: '08:00', to: '17:00', reason: 'Về quê'},
      'T5': { status: 'available' },
      'T6': { status: 'available' },
      'T7': { status: 'available' },
      'CN': { status: 'unavailable', from: '08:00', to: '12:00', reason: 'Bận việc riêng' },
    }
  },
  {
    id: 3,
    employeeName: "Trần Văn Ba",
    avatar: "https://ui-avatars.com/api/?name=Tran+Ba&background=random&color=fff",
    type: "Lặp lại",
    submittedDate: "20 thg 11, 2025 14:00 PM",
    status: "approved",
    details: {}
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

export default function WebAvailability() {
  const [activeTab, setActiveTab] = useState('pending'); // pending | history
  const [selectedRequest, setSelectedRequest] = useState(null); // Request đang xem chi tiết
  const [data, setData] = useState(REQUESTS);

  // --- ACTIONS ---
  const handleApprove = (id, e) => {
      e?.stopPropagation();
      if(window.confirm('Bạn có chắc muốn duyệt lịch này?')) {
          setData(prev => prev.map(item => item.id === id ? { ...item, status: 'approved' } : item));
          if (selectedRequest?.id === id) setSelectedRequest(null);
      }
  };

  const handleReject = (id, e) => {
      e?.stopPropagation();
      if(window.confirm('Bạn có chắc muốn từ chối lịch này?')) {
          setData(prev => prev.map(item => item.id === id ? { ...item, status: 'rejected' } : item));
          if (selectedRequest?.id === id) setSelectedRequest(null);
      }
  };

  // Filter data theo tab
  const displayData = data.filter(item => 
      activeTab === 'pending' ? item.status === 'pending' : item.status !== 'pending'
  );

  // --- RENDER DETAIL VIEW ---
  if (selectedRequest) {
      return (
          <div className="p-8 h-full bg-gray-50 overflow-y-auto">
              {/* Detail Header */}
              <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                      <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-gray-200">
                          <ArrowLeft size={24} className="text-gray-600"/>
                      </button>
                      <div className="flex items-center gap-3">
                          <img src={selectedRequest.avatar} alt="Ava" className="w-12 h-12 rounded-full"/>
                          <div>
                              <h2 className="text-xl font-bold text-gray-900">{selectedRequest.employeeName}</h2>
                              <p className="text-sm text-gray-500">{selectedRequest.type}</p>
                          </div>
                      </div>
                  </div>
                  
                  {/* Action Buttons (Only for pending) */}
                  {selectedRequest.status === 'pending' && (
                      <div className="flex gap-3">
                          <button 
                            onClick={() => handleApprove(selectedRequest.id)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 transition-colors shadow-sm"
                          >
                              <Check size={18}/> Duyệt
                          </button>
                          <button 
                            onClick={() => handleReject(selectedRequest.id)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                          >
                              <X size={18}/> Từ chối
                          </button>
                      </div>
                  )}
              </div>

              {/* Detail Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-4xl mx-auto">
                  <div className="bg-gray-900 text-white px-6 py-3 font-bold text-sm uppercase tracking-wide">
                      Chi tiết yêu cầu
                  </div>
                  <div className="divide-y divide-gray-100">
                      {WEEK_DAYS_MAP.map((day) => {
                          const info = selectedRequest.details[day.key] || { status: 'available' };
                          const isBusy = info.status === 'unavailable';

                          return (
                              <div key={day.key} className="flex min-h-[60px]">
                                  {/* Day Column */}
                                  <div className={`w-40 p-4 font-bold text-sm flex items-center border-l-4 ${isBusy ? 'border-l-orange-400 bg-orange-50/30' : 'border-l-emerald-400 bg-emerald-50/30'}`}>
                                      {day.label}
                                  </div>
                                  
                                  {/* Info Column */}
                                  <div className="flex-1 p-4 flex items-center">
                                      {isBusy ? (
                                          <div>
                                              <div className="text-gray-900 font-medium mb-1">
                                                  Bận từ {info.from} - {info.to}
                                              </div>
                                              <div className="text-sm text-gray-500 flex items-center gap-2">
                                                  <span>Lý do: {info.reason}</span>
                                                  {info.note && (
                                                      <span className="bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                                          {info.note}
                                                      </span>
                                                  )}
                                              </div>
                                          </div>
                                      ) : (
                                          <span className="text-gray-400 font-medium italic">Rảnh (Available)</span>
                                      )}
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              </div>
          </div>
      );
  }

  // --- RENDER LIST VIEW ---
  return (
    <div className="p-8 h-full bg-gray-50 overflow-hidden flex flex-col">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8 shrink-0">
          <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý lịch rảnh</h1>
              <p className="text-gray-500 text-sm mt-1">Duyệt các yêu cầu đăng ký lịch làm việc của nhân viên</p>
          </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white p-1 rounded-lg w-fit border border-gray-200 shadow-sm shrink-0">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'pending' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
          >
              Yêu cầu mới ({data.filter(i => i.status === 'pending').length})
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
          >
              Lịch sử đã duyệt
          </button>
      </div>

      {/* Table List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 overflow-hidden flex flex-col">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 bg-gray-900 text-white px-6 py-4 text-xs font-bold uppercase tracking-wider shrink-0">
              <div className="col-span-3">Nhân viên</div>
              <div className="col-span-3">Loại đăng ký</div>
              <div className="col-span-3">Ngày gửi</div>
              <div className="col-span-3 text-right">Hành động</div>
          </div>

          {/* Table Body */}
          <div className="overflow-y-auto flex-1 divide-y divide-gray-100">
              {displayData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Clock size={32} className="opacity-20"/>
                      </div>
                      <p>Không có yêu cầu nào.</p>
                  </div>
              ) : (
                  displayData.map((item) => (
                      <div key={item.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors">
                          
                          {/* Col 1: Employee */}
                          <div className="col-span-3 flex items-center gap-3">
                              <img src={item.avatar} alt="avatar" className="w-10 h-10 rounded-full border border-gray-200"/>
                              <span className="font-bold text-gray-800 text-sm">{item.employeeName}</span>
                          </div>

                          {/* Col 2: Type */}
                          <div className="col-span-3">
                              <span className="text-sm text-gray-600 font-medium underline decoration-dotted underline-offset-4">
                                  {item.type}
                              </span>
                          </div>

                          {/* Col 3: Date */}
                          <div className="col-span-3 text-sm text-gray-500">
                              {item.submittedDate}
                          </div>

                          {/* Col 4: Actions */}
                          <div className="col-span-3 flex justify-end gap-2">
                              <button 
                                onClick={() => setSelectedRequest(item)}
                                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-bold text-gray-600 hover:bg-white hover:border-gray-400 hover:text-gray-800 transition-all bg-gray-50"
                              >
                                  <Eye size={14}/> Xem
                              </button>
                              
                              {item.status === 'pending' && (
                                  <>
                                      <button 
                                        onClick={(e) => handleApprove(item.id, e)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-200 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-50 transition-all"
                                      >
                                          <Check size={14}/> Duyệt
                                      </button>
                                      <button 
                                        onClick={(e) => handleReject(item.id, e)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-50 transition-all"
                                      >
                                          <X size={14}/> Từ chối
                                      </button>
                                  </>
                              )}

                              {item.status === 'approved' && (
                                  <span className="flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                                      <Check size={12}/> Đã duyệt
                                  </span>
                              )}
                              {item.status === 'rejected' && (
                                  <span className="flex items-center gap-1 text-red-600 font-bold text-xs bg-red-50 px-2 py-1 rounded border border-red-100">
                                      <X size={12}/> Đã từ chối
                                  </span>
                              )}
                          </div>
                      </div>
                  ))
              )}
          </div>
      </div>
    </div>
  );
}
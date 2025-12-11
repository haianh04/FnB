import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Download, Edit, Check, X, 
  Clock, User, MapPin, Camera
} from 'lucide-react';
import { getRoleBadgeStyle } from 'C:/HOC_DAI_HOC/Work/my-app/src/utils/helpers.js';

/**
 * CẤU HÌNH & HÀM TIỆN ÍCH
 */

const CONFIG = {
  ALLOWED_LATE_MINUTES: 0, 
  ALLOWED_EARLY_MINUTES: 0, 
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const formatDecimal = (num) => {
  return typeof num === 'number' ? num.toFixed(2) : '0.00';
};

/**
 * COMPONENT CHÍNH
 */
const WebAttendance = () => {
  // --- 1. STATE & DATA ---
  
  const initialData = [
    {
      id: 1,
      date: '2023-10-25',
      employeeName: 'Nguyễn Văn A',
      department: 'Bếp',
      role: 'Phục vụ',
      hourlyRate: 50000,
      shiftStart: '08:00',
      shiftEnd: '17:00',
      checkIn: '07:55',
      checkOut: '17:30',
      breakTime: 60,
      checkInImage: 'https://via.placeholder.com/150',
      status: 'approved',
      isAutoCheckout: false,
      note: '',
      location: 'Cơ sở 1',
    },
    {
      id: 2,
      date: '2023-10-25',
      employeeName: 'Trần Thị B',
      department: 'Thu ngân',
      role: 'Thu ngân',
      hourlyRate: 35000,
      shiftStart: '08:00',
      shiftEnd: '17:00',
      checkIn: '08:15', // Đi muộn 15p
      checkOut: '17:00',
      breakTime: 60,
      checkInImage: 'https://via.placeholder.com/150',
      status: 'pending',
      isAutoCheckout: false,
      note: 'Xe hỏng',
      location: 'Cơ sở 1',
    },
    {
      id: 3,
      date: '2023-10-25',
      employeeName: 'Lê Văn C',
      department: 'Phục vụ',
      role: 'Phục vụ',
      hourlyRate: 30000,
      shiftStart: '14:00',
      shiftEnd: '22:00',
      checkIn: '14:00',
      checkOut: '23:00', // OT 1 tiếng
      breakTime: 30,
      checkInImage: 'https://via.placeholder.com/150',
      status: 'rejected', // Đã bị từ chối
      isAutoCheckout: false, 
      note: 'Check-in sai vị trí',
      location: 'Cơ sở 2',
    },
    {
      id: 4,
      date: '2023-10-26',
      employeeName: 'Nguyễn Văn A',
      department: 'Bếp',
      role: 'Pha chế',
      hourlyRate: 50000,
      shiftStart: '08:00',
      shiftEnd: '17:00',
      checkIn: '08:00',
      checkOut: '17:00',
      breakTime: 60,
      checkInImage: 'https://via.placeholder.com/150',
      status: 'approved',
      isAutoCheckout: false,
      note: '',
      location: 'Cơ sở 1',
    },
    {
      id: 5,
      date: '2023-10-25',
      employeeName: 'Phạm Thị D',
      department: 'Bar',
      role: 'Pha chế',
      hourlyRate: 45000,
      shiftStart: '18:00',
      shiftEnd: '23:00',
      checkIn: null,
      checkOut: null,
      breakTime: 0,
      checkInImage: null,
      status: 'missing', // Vắng
      isAutoCheckout: false,
      note: '',
      location: 'Cơ sở 1',
    },
    {
      id: 6,
      date: '2023-10-25',
      employeeName: 'Hoàng Văn E',
      department: 'Bảo vệ',
      role: 'Bảo vệ',
      hourlyRate: 25000,
      shiftStart: '06:00',
      shiftEnd: '14:00',
      checkIn: '06:00',
      checkOut: '15:00',
      breakTime: 30,
      checkInImage: 'https://via.placeholder.com/150',
      status: 'pending',
      isAutoCheckout: true, // Auto checkout
      note: 'Quên checkout',
      location: 'Cơ sở 1',
    }
  ];

  const [attendanceData, setAttendanceData] = useState(initialData);
  
  // Bộ lọc
  const [filters, setFilters] = useState({
    startDate: '2023-10-01',
    endDate: '2023-10-31',
    location: 'All',
    department: 'All',
    role: 'All',
    searchName: ''
  });

  const [editingItem, setEditingItem] = useState(null);
  const [viewingImage, setViewingImage] = useState(null);

  // --- 2. LOGIC TÍNH TOÁN ---
  
  const calculateRowData = (item) => {
    // Nếu vắng
    if (!item.checkIn || !item.checkOut) {
      return {
        ...item,
        scheduledHours: (timeToMinutes(item.shiftEnd) - timeToMinutes(item.shiftStart)) / 60,
        lateMinutes: 0,
        earlyMinutes: 0,
        missingMinutes: 0,
        standardHours: 0,
        otHours: 0,
        estimatedSalary: 0
      };
    }

    const shiftStart = timeToMinutes(item.shiftStart);
    const shiftEnd = timeToMinutes(item.shiftEnd);
    const checkIn = timeToMinutes(item.checkIn);
    const checkOut = timeToMinutes(item.checkOut);
    const breakTime = item.breakTime || 0;

    const scheduledHours = (shiftEnd - shiftStart) / 60;

    const late = Math.max(0, checkIn - shiftStart - CONFIG.ALLOWED_LATE_MINUTES);
    const early = Math.max(0, shiftEnd - checkOut - CONFIG.ALLOWED_EARLY_MINUTES);
    const missingMinutes = late + early;

    const effectiveStart = Math.max(checkIn, shiftStart);
    const effectiveEndStandard = Math.min(checkOut, shiftEnd);
    
    let standardMinutes = Math.max(0, effectiveEndStandard - effectiveStart - breakTime);
    const standardHours = standardMinutes / 60;

    let otMinutes = 0;
    if (checkOut > shiftEnd) {
      otMinutes = checkOut - shiftEnd;
    }
    const otHours = otMinutes / 60;

    const totalPaidHours = standardHours + otHours;
    let estimatedSalary = totalPaidHours * item.hourlyRate;

    // QUY TẮC: Nếu trạng thái là 'rejected' thì lương bằng 0
    if (item.status === 'rejected') {
      estimatedSalary = 0;
    }

    return {
      ...item,
      scheduledHours,
      lateMinutes: late,
      earlyMinutes: early,
      missingMinutes,
      standardHours,
      otHours,
      estimatedSalary
    };
  };

  const calculatedData = useMemo(() => {
    return attendanceData.map(calculateRowData);
  }, [attendanceData]);

  // --- 3. DỮ LIỆU HIỂN THỊ ---

  const stats = useMemo(() => {
    const today = '2023-10-25'; 
    const todayData = calculatedData.filter(i => i.date === today);
    
    const totalWorking = todayData.filter(i => i.checkIn && !i.checkOut).length;
    const notCheckedIn = todayData.filter(i => !i.checkIn && i.status !== 'leave').length; 
    const onLeave = todayData.filter(i => i.status === 'leave').length; 

    return { totalWorking, notCheckedIn, onLeave };
  }, [calculatedData]);

  const filteredData = useMemo(() => {
    let data = calculatedData;
    if (filters.startDate && filters.endDate) {
      data = data.filter(i => i.date >= filters.startDate && i.date <= filters.endDate);
    }
    if (filters.location !== 'All') data = data.filter(i => i.location === filters.location);
    if (filters.department !== 'All') data = data.filter(i => i.department === filters.department);
    if (filters.searchName) {
      data = data.filter(i => i.employeeName.toLowerCase().includes(filters.searchName.toLowerCase()));
    }
    
    data.sort((a, b) => {
      if (a.date !== b.date) return a.date > b.date ? -1 : 1;
      return a.employeeName.localeCompare(b.employeeName);
    });

    return data;
  }, [calculatedData, filters]);

  // --- 4. ACTIONS ---

  // Xử lý nút Duyệt / Từ chối
  const handleStatusChange = (id, newStatus) => {
    setAttendanceData(prev => prev.map(item => {
      if (item.id !== id) return item;
      // Nếu bấm lại vào trạng thái đang chọn -> Reset về pending
      const nextStatus = item.status === newStatus ? 'pending' : newStatus;
      return { ...item, status: nextStatus };
    }));
  };

  const handleApproveAll = () => {
    const idsToApprove = filteredData
      .filter(i => i.checkIn && i.checkOut && i.status !== 'rejected') // Không duyệt những cái đã bị từ chối
      .map(i => i.id);
      
    setAttendanceData(prev => prev.map(item => 
      idsToApprove.includes(item.id) ? { ...item, status: 'approved' } : item
    ));
  };

  const handleSaveEdit = (formData) => {
    setAttendanceData(prev => prev.map(item => 
      item.id === formData.id ? { ...item, ...formData } : item
    ));
    setEditingItem(null);
  };

  // Logic màu nền cho dòng
  const getRowStyleInfo = (row) => {
    if (row.status === 'rejected') {
      return {
        rowClass: 'bg-gray-100 text-gray-400', // Xám toàn bộ
        stickyBg: 'bg-gray-100', // Cột sticky cũng xám
        isRejected: true
      };
    }
    if (!row.checkIn) {
      return {
        rowClass: 'bg-red-50 hover:bg-red-100', // Đỏ nhạt
        stickyBg: 'bg-red-50',
        isRejected: false
      };
    }
    if (row.isAutoCheckout) {
      return {
        rowClass: 'bg-yellow-50 hover:bg-yellow-100', // Vàng nhạt
        stickyBg: 'bg-yellow-50',
        isRejected: false
      };
    }
    return {
      rowClass: 'hover:bg-gray-50', // Mặc định
      stickyBg: 'bg-white',
      isRejected: false
    };
  };

  // --- RENDER ---

  return (
    <div className="min-h-screen bg-gray-50 text-sm font-sans text-gray-800 p-4">
      {/* HEADER & STATS */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          Quản Lý Chấm Công
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard 
            title="Đang làm việc" 
            value={stats.totalWorking} 
            color="bg-green-100 text-green-700" 
            icon={<Clock className="w-5 h-5" />}
            desc="Hôm nay"
          />
          <StatCard 
            title="Chưa Check-in" 
            value={stats.notCheckedIn} 
            color="bg-orange-100 text-orange-700" 
            icon={<User className="w-5 h-5" />}
            desc="Hôm nay"
          />
          <StatCard 
            title="Xin nghỉ" 
            value={stats.onLeave} 
            color="bg-purple-100 text-purple-700" 
            icon={<MapPin className="w-5 h-5" />}
            desc="Hôm nay"
          />
        </div>
      </div>

      {/* FILTER */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="lg:col-span-2 flex gap-2">
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Từ ngày</label>
              <input 
                type="date" 
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Đến ngày</label>
              <input 
                type="date" 
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              />
            </div>
          </div>
          <FilterSelect 
            label="Cơ sở" 
            options={['All', 'Cơ sở 1', 'Cơ sở 2']} 
            value={filters.location}
            onChange={(v) => setFilters({...filters, location: v})}
          />
          <FilterSelect 
            label="Bộ phận" 
            options={['All', 'Bếp', 'Bar', 'Thu ngân', 'Phục vụ']} 
            value={filters.department}
            onChange={(v) => setFilters({...filters, department: v})}
          />
           <div className="relative">
             <label className="text-xs font-semibold text-gray-500 mb-1 block">Tìm nhân viên</label>
              <input 
                type="text" 
                placeholder="Nhập tên..." 
                className="w-full pl-9 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                value={filters.searchName}
                onChange={(e) => setFilters({...filters, searchName: e.target.value})}
              />
              <Search className="w-4 h-4 absolute left-3 top-8 text-gray-400" />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium text-xs uppercase">
              <Download className="w-4 h-4" /> Xuất Excel
            </button>
            <button 
              onClick={handleApproveAll}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium shadow-sm text-xs uppercase"
            >
              <Check className="w-4 h-4" /> Chấp nhận tất cả
            </button>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-gray-100 text-gray-600 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3 text-left border-r sticky left-0 z-20 bg-gray-100 w-[100px] min-w-[100px]">Thời gian</th>
                <th className="p-3 text-left border-r sticky left-[100px] z-20 bg-gray-100 min-w-[150px]">Tên nhân viên</th>
                <th className="p-3 text-left">Bộ phận</th>
                <th className="p-3 text-left ">Vai trò</th>
                <th className="p-3 text-right">Lương/h</th>
                <th className="p-3 text-center">Ca làm việc</th>
                <th className="p-3 text-center bg-blue-50">Thực tế</th>
                <th className="p-3 text-right text-red-600">Thiếu</th>
                <th className="p-3 text-right">Giờ công</th>
                <th className="p-3 text-right text-purple-600">Giờ OT</th>
                <th className="p-3 text-right">Giờ nghỉ</th>
                <th className="p-3 text-right bg-green-50 font-bold text-green-700">Lương dự kiến</th>
                <th className="p-3 text-left min-w-[150px]">Ghi chú</th>
                <th className="p-3 text-center">Trạng thái</th>
                <th className="p-3 text-center sticky right-0 bg-gray-100 z-10 border-l min-w-[100px]">Duyệt</th>
                <th className="p-3 text-center sticky right-0 bg-gray-100 z-10 border-l">Sửa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((row) => {
                const { rowClass, stickyBg, isRejected } = getRowStyleInfo(row);
                
                return (
                  <tr key={row.id} className={`transition-colors ${rowClass}`}>
                    
                    {/* Cột 1 Sticky: Thời gian */}
                    <td className={`p-3 sticky left-0 z-20 border-r font-medium ${stickyBg}`}>
                      {row.date}
                    </td>
                    
                    {/* Cột 2 Sticky: Tên nhân viên - ĐÃ BỎ line-through */}
                    <td className={`p-3 sticky left-[100px] z-20 border-r font-medium ${stickyBg}`}>
                      {row.employeeName}
                    </td>
                    
                    <td className="p-3">{row.department}</td>
                    
                    {/* Vai trò với badge màu */ }
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isRejected ? 'bg-gray-200 text-gray-500' : getRoleBadgeStyle(row.role)}`}>
                        {row.role}
                      </span>
                    </td>
                    
                    <td className="p-3 text-right">{formatCurrency(row.hourlyRate)}</td>
                    <td className="p-3 text-center">
                      <div>{row.shiftStart} - {row.shiftEnd}</div>
                      <div className="text-[12px] opacity-90">({formatDecimal(row.scheduledHours)}h)</div>
                    </td>
                    <td className={`p-3 text-center ${row.checkIn && !isRejected ? 'bg-blue-50/30' : ''}`}>
                      {row.checkIn ? (
                        <span className={!isRejected ? 'font-semibold text-blue-700' : ''}>
                          {row.checkIn} - {row.checkOut || '--:--'}
                          <div>
                          <button 
                          onClick={() => setViewingImage(row.checkInImage)}
                          className={`${isRejected ? 'text-gray-300' : 'text-red-400 hover:text-red-600'}`}
                        >
                          Xem ảnh
                        </button>
                        </div>
                        </span>
                      ) : (
                        <span className="text-red-500 italic text-xs font-semibold">Vắng</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                    {/* Quy đổi thiếu phút thành giờ */}
                    <div>{formatDecimal(row.missingMinutes / 60)}h</div>
                      {row.missingMinutes > 0 ? (
                        <span className={!isRejected ? 'text-red-600 font-bold' : ''}>-{row.missingMinutes}p</span>
                      ) : '-'}
                    </td>
                    <td className="p-3 text-right font-medium">{formatDecimal(row.standardHours)}h</td>
                    <td className="p-3 text-right font-medium text-purple-700">{formatDecimal(row.otHours)}h</td>
                    {/* Quy dổi phút nghỉ thành giờ */}
                    <td className="p-3 text-right text-gray-500">{formatDecimal(row.breakTime / 60)}h</td>
                    
                    {/* Lương dự kiến - Logic 0đ nếu Rejected, ĐÃ BỎ line-through */}
                    <td className={`p-3 text-right font-bold ${isRejected ? 'text-gray-400' : 'bg-green-50/50 text-green-700'}`}>
                      {formatCurrency(row.estimatedSalary)}
                    </td>
                    
                    <td className="p-3 text-xs opacity-70 truncate max-w-[150px]" title={row.note}>
                      {row.isAutoCheckout && <span className="text-red-500 font-bold mr-1">[Auto-Out]</span>}
                      {row.note}
                    </td>
                    <td className="p-3 text-center">
                      <StatusBadge status={row.status} />
                    </td>
                    
                    {/* Cột Hành động: Check & Cross */}
                    <td className={`p-3 sticky right-0 z-10 border-l text-center ${stickyBg}`}>
                      <div className="flex items-center justify-center gap-2">
                        {/* Nút Approve */}
                        <button 
                          onClick={() => handleStatusChange(row.id, 'approved')}
                          className={`p-1 sticky right-0 rounded-full border transition-all ${
                            row.status === 'approved' 
                              ? 'bg-green-100 border-green-500 text-green-600 shadow-sm' 
                              : 'bg-white border-gray-200 text-gray-300 hover:border-green-300 hover:text-green-500'
                          }`}
                          title="Chấp nhận"
                          disabled={!row.checkIn} // Vắng thì không cho duyệt
                        >
                          <Check className="w-4 h-4" strokeWidth={3} />
                        </button>

                        {/* Nút Reject */}
                        <button 
                          onClick={() => handleStatusChange(row.id, 'rejected')}
                          className={`p-1 sticky right-0 rounded-full border transition-all ${
                            row.status === 'rejected' 
                              ? 'bg-red-100 border-red-500 text-red-600 shadow-sm' 
                              : 'bg-white border-gray-200 text-gray-300 hover:border-red-300 hover:text-red-500'
                          }`}
                          title="Từ chối"
                          disabled={!row.checkIn}
                        >
                          <X className="w-4 h-4" strokeWidth={3} />
                        </button>
                      </div>
                    </td>

                    <td className={`p-3 sticky right-0 z-10 border-l text-center w-[50px] ${stickyBg}`}>
                      <button 
                          onClick={() => setEditingItem(row)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded" 
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                    </td>
                  </tr>
                );
              })}
              
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="17" className="p-8 text-center text-gray-500">
                    Không tìm thấy dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      {editingItem && (
        <EditModal 
          item={editingItem} 
          onClose={() => setEditingItem(null)} 
          onSave={handleSaveEdit} 
        />
      )}

      {viewingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setViewingImage(null)}>
          <div className="bg-white p-2 rounded-lg max-w-lg w-full relative" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setViewingImage(null)}
              className="absolute -top-3 -right-3 bg-red-500 text-white p-1 rounded-full shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={viewingImage} alt="Checkin Proof" className="w-full h-auto rounded" />
            <p className="text-center mt-2 font-medium text-gray-600">Hình ảnh Check-in: {viewingImage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ... Các component phụ ...

const StatCard = ({ title, value, color, icon, desc }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-gray-500 text-xs font-medium uppercase mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-xs text-gray-400 mt-1">{desc}</p>
    </div>
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
  </div>
);

const FilterSelect = ({ label, options, value, onChange }) => (
  <div className="flex flex-col gap-1 min-w-[120px]">
    <label className="text-xs font-semibold text-gray-500 mb-1">{label}</label>
    <select 
      className="w-full px-3 py-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    approved: 'bg-green-100 text-green-800 border-green-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    missing: 'bg-gray-100 text-gray-600 border-gray-200',
    leave: 'bg-purple-100 text-purple-800 border-purple-200'
  };

  const labels = {
    approved: 'Đã duyệt',
    pending: 'Chờ duyệt',
    rejected: 'Từ chối',
    missing: 'Thiếu công',
    leave: 'Nghỉ phép'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${styles[status] || styles.missing}`}>
      {labels[status] || status}
    </span>
  );
};

const EditModal = ({ item, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...item });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Chỉnh sửa chấm công</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="bg-blue-50 p-4 rounded-md mb-6 grid grid-cols-2 gap-4">
             <div>
              <label className="text-xs text-gray-500 uppercase">Ngày</label>
              <div className="font-bold text-gray-900">{item.date}</div>
            </div>
             <div>
              <label className="text-xs text-gray-500 uppercase">Nhân viên</label>
              <div className="font-bold text-gray-900">{item.employeeName}</div>
            </div>
             <div className="col-span-2">
              <label className="text-xs text-gray-500 uppercase">Ca làm việc</label>
              <div className="font-medium text-gray-900">{item.shiftStart} - {item.shiftEnd}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giờ vào</label>
              <input 
                type="time" 
                name="checkIn"
                value={formData.checkIn || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giờ ra</label>
              <input 
                type="time" 
                name="checkOut"
                value={formData.checkOut || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nghỉ (phút)</label>
              <input 
                type="number" 
                name="breakTime"
                value={formData.breakTime}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
              <textarea 
                name="note"
                rows="2"
                value={formData.note || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Lý do chỉnh sửa..."
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100">
            Hủy
          </button>
          <button onClick={() => onSave(formData)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm">
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebAttendance;
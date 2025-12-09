import React, { useState, useMemo } from 'react';
import { 
  Search, Calendar, MapPin, Briefcase, User, 
  Clock, XCircle, AlertCircle, Eye, Edit2, 
  Save, X, Download 
} from 'lucide-react';

// --- MOCK DATA ---
const ATTENDANCE_DATA = [
    { 
        id: 1, 
        employeeName: "Hoàng Đức Tùng", 
        avatar: "https://ui-avatars.com/api/?name=Hoang+Tung&background=F97316&color=fff",
        date: "26/11/2025",
        department: "Bếp",
        role: "Phụ bếp",
        shift: "08:00 - 12:00",
        checkIn: "07:55",
        checkOut: "12:05",
        checkInImg: "https://via.placeholder.com/150",
        lateEarlyMinutes: 0,
        workHours: 4.0,
        otHours: 0.5,
        estimatedSalary: 120000,
        status: "working", // working, checked_out, absent, leave
        isApproved: true,
        note: ""
    },
    { 
        id: 2, 
        employeeName: "Nguyễn Thị Lan", 
        avatar: "https://ui-avatars.com/api/?name=Nguyen+Lan&background=random&color=fff",
        date: "26/11/2025",
        department: "Phục vụ",
        role: "Phục vụ",
        shift: "08:00 - 16:00",
        checkIn: "08:15",
        checkOut: null, // Đang làm việc
        checkInImg: "https://via.placeholder.com/150",
        lateEarlyMinutes: 15,
        workHours: 0, // Chưa tính xong
        otHours: 0,
        estimatedSalary: 0,
        status: "working", 
        isApproved: false,
        note: "Đi muộn do tắc đường"
    },
    { 
        id: 3, 
        employeeName: "Trần Văn Ba", 
        avatar: "https://ui-avatars.com/api/?name=Tran+Ba&background=random&color=fff",
        date: "26/11/2025",
        department: "Pha chế",
        role: "Bartender",
        shift: "14:00 - 22:00",
        checkIn: null,
        checkOut: null,
        checkInImg: null,
        lateEarlyMinutes: 0,
        workHours: 0,
        otHours: 0,
        estimatedSalary: 0,
        status: "not_checked_in", // Chưa checkin
        isApproved: false,
        note: ""
    },
    { 
        id: 4, 
        employeeName: "Lê Thị Cúc", 
        avatar: "https://ui-avatars.com/api/?name=Le+Cuc&background=random&color=fff",
        date: "26/11/2025",
        department: "Phục vụ",
        role: "Thu ngân",
        shift: "08:00 - 17:00",
        checkIn: null,
        checkOut: null,
        checkInImg: null,
        lateEarlyMinutes: 0,
        workHours: 0,
        otHours: 0,
        estimatedSalary: 0,
        status: "leave", // Xin nghỉ
        isApproved: true,
        note: "Nghỉ phép năm"
    },
];

const LOCATIONS = ["Tất cả cơ sở", "Cơ sở 1 - 48 NCT", "Cơ sở 2 - 123 ABC"];
const DEPARTMENTS = ["Tất cả bộ phận", "Bếp", "Phục vụ", "Pha chế", "Văn phòng"];
const ROLES = ["Tất cả vai trò", "Quản lý", "Thu ngân", "Phục vụ", "Đầu bếp", "Phụ bếp", "Bartender"];

export default function WebAttendance() {
  // State Filter
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
  const [selectedDept, setSelectedDept] = useState(DEPARTMENTS[0]);
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [searchTerm, setSearchTerm] = useState('');

  // State Modal Edit
  const [editingItem, setEditingItem] = useState(null);

  // --- STATS ---
  const stats = useMemo(() => {
      return {
          working: ATTENDANCE_DATA.filter(i => i.status === 'working').length,
          notCheckedIn: ATTENDANCE_DATA.filter(i => i.status === 'not_checked_in').length,
          leave: ATTENDANCE_DATA.filter(i => i.status === 'leave').length,
      };
  }, []);

  // --- FILTER LOGIC ---
  const filteredData = ATTENDANCE_DATA.filter(item => {
      // Demo logic search simple
      const matchName = item.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDept = selectedDept === DEPARTMENTS[0] || item.department === selectedDept;
      const matchRole = selectedRole === ROLES[0] || item.role === selectedRole;
      return matchName && matchDept && matchRole;
  });

  // --- HANDLERS ---
  const handleEdit = (item) => {
      setEditingItem({ ...item }); // Clone object to avoid direct mutation
  };

  const handleSaveEdit = () => {
      // Logic lưu lên server
      alert(`Đã cập nhật chấm công cho ${editingItem.employeeName}`);
      setEditingItem(null);
  };

  // Helper render status
  const renderStatus = (status) => {
      switch(status) {
          case 'working': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold border border-green-200">Đang làm việc</span>;
          case 'checked_out': return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold border border-gray-200">Đã ra về</span>;
          case 'not_checked_in': return <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold border border-orange-200">Chưa Checkin</span>;
          case 'leave': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold border border-red-200">Nghỉ phép</span>;
          default: return null;
      }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 font-sans overflow-hidden">
        
        {/* HEADER & OVERVIEW */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 shrink-0">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Chấm công</h1>
                    <p className="text-sm text-gray-500 mt-1">Theo dõi tình hình đi làm và duyệt công nhân viên</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">
                        <Download size={16}/> Xuất Excel
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 p-4 rounded-xl flex items-center justify-between">
                    <div>
                        <p className="text-sm text-green-700 font-bold uppercase tracking-wide opacity-80">Đang làm việc</p>
                        <p className="text-3xl font-extrabold text-green-800 mt-1">{stats.working}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center text-green-700">
                        <User size={24}/>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 p-4 rounded-xl flex items-center justify-between">
                    <div>
                        <p className="text-sm text-orange-700 font-bold uppercase tracking-wide opacity-80">Chưa Checkin</p>
                        <p className="text-3xl font-extrabold text-orange-800 mt-1">{stats.notCheckedIn}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center text-orange-700">
                        <Clock size={24}/>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-100 p-4 rounded-xl flex items-center justify-between">
                    <div>
                        <p className="text-sm text-red-700 font-bold uppercase tracking-wide opacity-80">Xin nghỉ</p>
                        <p className="text-3xl font-extrabold text-red-800 mt-1">{stats.leave}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center text-red-700">
                        <XCircle size={24}/>
                    </div>
                </div>
            </div>
        </div>

        {/* FILTERS TOOLBAR */}
        <div className="px-8 py-4 bg-white border-b border-gray-200 flex flex-wrap gap-4 items-center shrink-0">
            {/* Search */}
            <div className="relative w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input 
                    type="text" 
                    placeholder="Tìm nhân viên..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#E08C27] transition-colors"
                />
            </div>
            
            {/* Location */}
            <div className="relative">
                <select 
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="appearance-none pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:border-[#E08C27] cursor-pointer"
                >
                    {LOCATIONS.map(opt => <option key={opt}>{opt}</option>)}
                </select>
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
            </div>

            {/* Date Picker */}
            <div className="relative">
                <input 
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:border-[#E08C27] cursor-pointer"
                />
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
            </div>

            {/* Department */}
            <select 
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="py-2 px-4 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:border-[#E08C27] cursor-pointer"
            >
                {DEPARTMENTS.map(opt => <option key={opt}>{opt}</option>)}
            </select>

            {/* Role */}
            <select 
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="py-2 px-4 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:border-[#E08C27] cursor-pointer"
            >
                {ROLES.map(opt => <option key={opt}>{opt}</option>)}
            </select>
        </div>

        {/* DATA TABLE */}
        <div className="flex-1 overflow-auto p-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nhân viên</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Thông tin</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Giờ vào/ra</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Chi tiết công</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ghi chú & Duyệt</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredData.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                {/* Employee Info */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={item.avatar} alt="Ava" className="w-10 h-10 rounded-full border border-gray-200 object-cover"/>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">{item.employeeName}</p>
                                            <p className="text-xs text-gray-500">{item.id}</p>
                                        </div>
                                    </div>
                                </td>
                                
                                {/* Job Info */}
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                                            <Briefcase size={12} className="text-gray-400"/> {item.department}
                                        </div>
                                        <span className="inline-block bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded border border-gray-200 w-fit">
                                            {item.role}
                                        </span>
                                        <p className="text-[10px] text-gray-400 mt-0.5">Ca: {item.shift}</p>
                                    </div>
                                </td>

                                {/* Time In/Out */}
                                <td className="px-6 py-4 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        {item.checkIn ? (
                                            <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                                                <span className="text-green-600">{item.checkIn}</span>
                                                <span className="text-gray-300">-</span>
                                                <span className={item.checkOut ? "text-orange-600" : "text-gray-400 italic"}>
                                                    {item.checkOut || '--:--'}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Chưa check-in</span>
                                        )}
                                        
                                        {item.checkIn && (
                                            <button className="text-[10px] text-blue-500 font-medium hover:underline flex items-center gap-1">
                                                <Eye size={10}/> Ảnh Checkin
                                            </button>
                                        )}
                                    </div>
                                </td>

                                {/* Stats */}
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1.5 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Giờ công:</span>
                                            <span className="font-bold text-gray-900">{item.workHours}h</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Giờ OT:</span>
                                            <span className="font-bold text-blue-600">{item.otHours}h</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Đi muộn/Về sớm:</span>
                                            <span className={`font-bold ${item.lateEarlyMinutes > 0 ? 'text-red-500' : 'text-green-600'}`}>
                                                {item.lateEarlyMinutes}p
                                            </span>
                                        </div>
                                        <div className="border-t border-dashed border-gray-200 mt-1 pt-1 flex justify-between">
                                            <span className="text-gray-500 font-medium">Tạm tính:</span>
                                            <span className="font-bold text-[#E08C27]">{item.estimatedSalary.toLocaleString()}đ</span>
                                        </div>
                                    </div>
                                </td>

                                {/* Note & Approve */}
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-gray-500 uppercase">Duyệt công:</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" checked={item.isApproved} readOnly />
                                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                                            </label>
                                        </div>
                                        {item.note && (
                                            <div className="bg-yellow-50 p-2 rounded border border-yellow-100 text-xs text-yellow-800 italic flex gap-1">
                                                <AlertCircle size={12} className="shrink-0 mt-0.5"/> 
                                                <span>{item.note}</span>
                                            </div>
                                        )}
                                        {renderStatus(item.status)}
                                    </div>
                                </td>

                                {/* Action */}
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => handleEdit(item)}
                                        className="p-2 bg-gray-50 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors border border-gray-200"
                                    >
                                        <Edit2 size={16}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* MODAL EDIT (Hiển thị khi editingItem != null) */}
        {editingItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white w-[500px] rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                        <h3 className="text-lg font-bold text-gray-900">Chỉnh sửa chấm công</h3>
                        <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-red-500"><X size={20}/></button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Giờ vào</label>
                                <input 
                                    type="time" 
                                    value={editingItem.checkIn || ''} 
                                    onChange={e => setEditingItem({...editingItem, checkIn: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounded-lg font-mono"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Giờ ra</label>
                                <input 
                                    type="time" 
                                    value={editingItem.checkOut || ''} 
                                    onChange={e => setEditingItem({...editingItem, checkOut: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounded-lg font-mono"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Giờ công</label>
                                <input 
                                    type="number" 
                                    step="0.1"
                                    value={editingItem.workHours} 
                                    onChange={e => setEditingItem({...editingItem, workHours: parseFloat(e.target.value)})}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Giờ OT</label>
                                <input 
                                    type="number" 
                                    step="0.1"
                                    value={editingItem.otHours} 
                                    onChange={e => setEditingItem({...editingItem, otHours: parseFloat(e.target.value)})}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ghi chú quản lý</label>
                            <textarea 
                                value={editingItem.note}
                                onChange={e => setEditingItem({...editingItem, note: e.target.value})}
                                placeholder="Nhập lý do chỉnh sửa..."
                                className="w-full p-3 border border-gray-300 rounded-lg h-24 resize-none text-sm"
                            ></textarea>
                        </div>
                        
                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 flex gap-2 text-xs text-yellow-800">
                             <AlertCircle size={16}/>
                             <span>Lưu ý: Mọi chỉnh sửa sẽ được lưu vào lịch sử hệ thống để đối soát sau này.</span>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                        <button onClick={() => setEditingItem(null)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg">Hủy bỏ</button>
                        <button onClick={handleSaveEdit} className="px-4 py-2 bg-[#E08C27] text-white text-sm font-bold rounded-lg hover:bg-orange-600 flex items-center gap-2 shadow-sm">
                            <Save size={16}/> Lưu thay đổi
                        </button>
                    </div>
                </div>
            </div>
        )}

    </div>
  );
}
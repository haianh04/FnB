import React, { useState, useMemo, useEffect, useCallback } from 'react';

// --- ICONS DEFINITION (Inline SVG) ---
const IconWrapper = ({ children, size = 16, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {children}
  </svg>
);

const Plus = (props) => <IconWrapper {...props}><path d="M5 12h14" /><path d="M12 5v14" /></IconWrapper>;
const Clock = (props) => <IconWrapper {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></IconWrapper>;
const Trash2 = (props) => <IconWrapper {...props}><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></IconWrapper>;
const Edit2 = (props) => <IconWrapper {...props}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></IconWrapper>;
const Send = (props) => <IconWrapper {...props}><line x1="22" x2="11" y1="2" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></IconWrapper>;
const AlertTriangle = (props) => <IconWrapper {...props}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" /></IconWrapper>;
const ChevronLeft = (props) => <IconWrapper {...props}><path d="m15 18-6-6 6-6" /></IconWrapper>;
const ChevronRight = (props) => <IconWrapper {...props}><path d="m9 18 6-6-6-6" /></IconWrapper>;
const Search = (props) => <IconWrapper {...props}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></IconWrapper>;
const Briefcase = (props) => <IconWrapper {...props}><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></IconWrapper>;
const CheckCircle = (props) => <IconWrapper {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></IconWrapper>;
const X = (props) => <IconWrapper {...props}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></IconWrapper>;
const Store = (props) => <IconWrapper {...props}><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" /></IconWrapper>;
const Cake = (props) => <IconWrapper {...props}><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" /><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" /><path d="M2 21h20" /><path d="M7 8v2" /><path d="M12 8v2" /><path d="M17 8v2" /><path d="M7 4h.01" /><path d="M12 4h.01" /><path d="M17 4h.01" /></IconWrapper>;

// --- HELPER FUNCTIONS ---
const getAvatarColor = (name) => {
  const colors = ['bg-orange-500', 'bg-slate-600', 'bg-purple-600', 'bg-blue-500', 'bg-emerald-500', 'bg-pink-500', 'bg-indigo-500', 'bg-amber-500'];
  return colors[(name?.charCodeAt(0) || 0) % colors.length];
};

const formatDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const isBirthday = (currentDate, birthdayString) => {
  if (!birthdayString) return false;
  const current = new Date(currentDate);
  const birth = new Date(birthdayString);
  return current.getDate() === birth.getDate() && current.getMonth() === birth.getMonth();
};

const toMinutes = (t) => {
  const [h, m] = (t || '00:00').split(':').map(s => parseInt(s, 10));
  return (isNaN(h) ? 0 : h) * 60 + (isNaN(m) ? 0 : m);
};

const getFirstName = (fullName) => {
  if (!fullName) return "bạn";
  const parts = fullName.trim().split(' ');
  return parts[parts.length - 1];
};

const scrollToEmployee = (employeeId) => {
  const rowId = `emp-row-${employeeId}`;
  const element = document.getElementById(rowId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    element.classList.remove('animate-highlight');
    void element.offsetWidth;
    element.classList.add('animate-highlight');
    setTimeout(() => element.classList.remove('animate-highlight'), 2000);
  } else {
    alert("Nhân viên này không hiển thị trong danh sách lọc hiện tại.");
  }
};

const getShiftTimeStatus = (dateStr, endTimeStr) => {
  if (!dateStr || !endTimeStr) return 'upcoming';
  const shiftEnd = new Date(`${dateStr}T${endTimeStr}:00`);
  const now = new Date();
  if (shiftEnd < now) return 'past';
  return 'upcoming';
};

// --- STYLE & COLOR LOGIC ---
const getStripedStyle = (colorCode) => {
  return {
    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 5px, ${colorCode} 5px, ${colorCode} 10px)`
  };
};

// --- COMPONENTS ---
const AvailabilityTag = ({ type, note, timeRange }) => {
  // type: 'free' (Green), 'busy_all' (Red), 'busy_part' (Yellow)
  let colorClass, warningClass;
  if (type === 'free') {
    colorClass = 'border-t-emerald-500 border-r-emerald-500';
    warningClass = 'text-emerald-600 bg-emerald-50';
  } else if (type === 'busy_all') {
    colorClass = 'border-t-red-500 border-r-red-500';
    warningClass = 'text-red-600 bg-red-50';
  } else { // busy_part
    colorClass = 'border-t-yellow-500 border-r-yellow-500';
    warningClass = 'text-yellow-600 bg-yellow-50';
  }

  return (
    <div className="absolute top-0 right-0 z-10 group/tag">
      {/* Triangular Tag - Reduced size from 12px to 8px */}
      <div className={`w-0 h-0 border-l-[4px] border-l-transparent border-b-[4px] border-b-transparent border-t-[4px] border-r-[4px] ${colorClass} rounded-bl-[2px] shadow-sm`}></div>

      {/* Tooltip */}
      {(note || timeRange) && (
        <div className="absolute top-full right-0 mt-1 min-w-[150px] bg-white border border-gray-100 p-2 rounded-lg shadow-xl opacity-0 group-hover/tag:opacity-100 transition-opacity pointer-events-none z-50">
          <p className={`text-[8px] font-bold uppercase mb-1 ${warningClass.split(' ')[0]}`}>
            {type === 'free' ? 'Rảnh cả ngày' : (type === 'busy_all' ? 'Bận cả ngày' : 'Bận theo giờ')}
          </p>
          {timeRange && <p className="text-[8px] font-mono text-gray-500 mb-0.5">{timeRange}</p>}
          {note && <p className="text-[8px] text-gray-700 italic">"{note}"</p>}
        </div>
      )}
    </div>
  );
};

const getShiftCardStyles = (shift, isConflict) => {
  let style = {};
  let className = "relative group/card rounded border p-2 shadow-sm hover:shadow-md transition-all";

  // 1. Conflict (Màu đỏ)
  if (isConflict) {
    className += " bg-red-50 border-red-300 border-l-[4px] border-l-red-500";
    return { className, style };
  }

  // 2. Ca Nhận từ Kho (Màu Vàng)
  if (shift.transferFrom && !shift.attendanceStatus) {
    className += " bg-yellow-50 border-yellow-300 border-l-[4px] border-l-yellow-500";
    return { className, style };
  }

  // 3. Trạng thái Chấm công
  if (shift.attendanceStatus) {
    switch (shift.attendanceStatus) {
      case 'late':
        // Sọc màu xanh dương (Blue stripes)
        style = { ...getStripedStyle('rgba(59, 130, 246, 0.25)'), backgroundColor: 'rgba(239, 246, 255, 0.9)', borderColor: '#ef4444' }; // Border đỏ để cảnh báo
        break;
      case 'early_leave':
        // Sọc màu xanh dương (Blue stripes)
        style = { ...getStripedStyle('rgba(59, 130, 246, 0.25)'), backgroundColor: 'rgba(255, 247, 237, 0.9)', borderColor: '#f97316' }; // Border cam
        break;
      case 'absent':
        style = { ...getStripedStyle('rgba(239, 68, 68, 0.15)'), backgroundColor: 'rgba(254, 242, 242, 0.9)', borderColor: '#ef4444' };
        break;
      case 'working':
        style = { ...getStripedStyle('rgba(34, 197, 94, 0.25)'), backgroundColor: 'rgba(240, 253, 244, 0.9)', borderColor: '#22c55e' };
        break;
      case 'completed':
        style = { ...getStripedStyle('rgba(148, 163, 184, 0.25)'), backgroundColor: 'rgba(248, 250, 252, 0.9)', borderColor: '#94a3b8' };
        break;
      default:
        className += " bg-white border-gray-200 border-l-[4px] border-l-purple-500";
    }
  } else {
    // 4. Logic thời gian: Ca đã qua -> Sọc xám
    const timeStatus = getShiftTimeStatus(shift.days[0], shift.end);
    if (timeStatus === 'past') {
      style = { ...getStripedStyle('rgba(148, 163, 184, 0.25)'), backgroundColor: 'rgba(248, 250, 252, 0.9)', borderColor: '#94a3b8' };
    } else {
      className += " bg-white border-gray-200 border-l-[4px] border-l-purple-500";
    }
  }

  return { className, style };
};

const getPoolItemClasses = (status) => {
  const base = "relative rounded-lg border p-2.5 shadow-sm transition-all group";
  if (status === 'picked') return `${base} bg-yellow-50 border-yellow-200 opacity-90 cursor-pointer hover:border-yellow-400 hover:shadow-md`;
  return `${base} bg-yellow-50 border-yellow-500 cursor-default`;
};

const getDraftItemClasses = (isConflict) => {
  const base = "relative rounded border border-dashed p-2 shadow-sm opacity-90 z-10 group/card";
  if (isConflict) return `${base} border-red-300 bg-red-50`;
  return `${base} border-orange-300 bg-orange-50`;
};

// --- MOCK API SERVICE (MAPPING 1:1 VỚI FILE TXT) ---
const ShiftPoolAPI = {
  // Kho ca làm (giả lập 2 ca open để test, vì trong file txt danh sách này rỗng)
  getOpenShifts: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { id: 905, shift_date: '2025-12-16', start_time: '08:00', end_time: '16:00', role_name: 'Phục vụ', department: 'Bàn', offered_by: 22, offered_by_name: 'Mai', offer_reason: 'Bận việc gia đình', status: 'open' },
      { id: 906, shift_date: '2025-12-18', start_time: '17:00', end_time: '22:00', role_name: 'Phụ bếp', department: 'Bếp', offered_by: 21, offered_by_name: 'Cường', offer_reason: 'Đi học thêm', status: 'open' }
    ];
  },
  // Lịch sử chuyển đổi ca (Lấy từ file txt)
  getHistory: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      {
        id: 5, shift_date: '2025-12-17', start_time: '09:00', end_time: '17:00', role_name: 'Phụ bếp', department: 'Bếp',
        offered_by: 16, offered_by_name: 'Thế Anh 21', offer_reason: 'Không ranh nữa ',
        status: 'picked', picked_by: 21, picked_by_name: 'Cường', picked_at: '2025-12-16T02:28:07.223Z'
      }
    ];
  },
  getRoles: async () => {
    return {
      data: [
        { id: 1, name: 'Phục vụ', dept: 'Bàn', salary: 20000 },
        { id: 2, name: 'Đầu bếp', dept: 'Bếp', salary: 30000 },
        { id: 3, name: 'Phụ bếp', dept: 'Bếp', salary: 22000 },
        { id: 4, name: 'Thu ngân', dept: 'Bàn', salary: 25000 },
        { id: 5, name: 'Kiểm Kho', dept: 'Kho', salary: 30000 },
      ]
    };
  },
  // Nhân viên (Map trường meta.department và meta.birthday)
  getEmployees: async () => {
    return {
      data: {
        results: [
          { id: 26, name: "Hải Anh", meta: { department: null, birthday: null }, roles: [] },
          { id: 23, name: "Việt Hoàng", meta: { department: "Bếp ", birthday: "2000-12-17" }, roles: [{ name: "Phục vụ" }] }, // Mock Birthday 17/12
          { id: 22, name: "Mai", meta: { department: "Bàn", birthday: null }, roles: [{ name: "Phục vụ" }] },
          { id: 21, name: "Cường", meta: { department: "Bếp", birthday: null }, roles: [{ name: "Phụ bếp" }] },
          { id: 20, name: "Quỳnh Châu", meta: { department: "Bàn", birthday: null }, roles: [{ name: "Phục vụ" }] },
          { id: 18, name: "Lê My", meta: { department: null, birthday: null }, roles: [{ name: "Đầu bếp" }] },
          { id: 17, name: "Thế Anh 22", meta: { department: null, birthday: null }, roles: [{ name: "Phục vụ" }] },
          { id: 16, name: "Thế Anh 21", meta: { department: null, birthday: null }, roles: [{ name: "Phụ bếp" }] },
          { id: 14, name: "Quang Huy", meta: { department: "Kho", birthday: null }, roles: [{ name: "Phụ bếp" }] },
          { id: 4, name: "Nguyễn Quang Huy", meta: { department: null, birthday: null }, roles: [{ name: "Phục vụ" }] }
        ]
      }
    };
  },
  getSuggestions: async () => {
    return {
      data: [
        { date: '2025-12-17', unavailable: [{ employee_id: 14, start_time: null, end_time: null, note: 'Về quê (08:00 - 12:00)' }, { employee_id: 23, start_time: null, end_time: null, note: 'Đi học (08:00 - 17:00)' }] },
        { date: '2025-12-18', unavailable: [{ employee_id: 14, start_time: null, end_time: null, note: 'Bận việc cá nhân (08:00 - 12:00)' }] }
      ]
    };
  },
  // Danh sách Ca làm (Map từ file txt)
  getShifts: async () => {
    return {
      data: [
        { id: 68, employee_id: 23, employee_name: "Việt Hoàng", role_name: "Phục vụ", start_time: "09:00", end_time: "17:00", notes: "", date_key: "2025-12-16" },
        { id: 62, employee_id: 17, employee_name: "Thế Anh 22", role_name: "Phục vụ", start_time: "09:00", end_time: "17:00", notes: "", date_key: "2025-12-19" },
        // Ca này của Cường là ca nhận từ pool (dựa vào history id 5)
        { id: 999, employee_id: 21, employee_name: "Cường", role_name: "Phụ bếp", start_time: "09:00", end_time: "17:00", notes: "Ca nhận từ pool", date_key: "2025-12-17", transferFrom: "Thế Anh 21" },
        { id: 66, employee_id: 18, employee_name: "Lê My", role_name: "Đầu bếp", start_time: "09:00", end_time: "17:00", notes: "", date_key: "2025-12-15" },
        { id: 70, employee_id: 14, employee_name: "Quang Huy", role_name: "Phụ bếp", start_time: "09:00", end_time: "17:00", notes: "", date_key: "2025-12-17" },
        { id: 53, employee_id: 16, employee_name: "Thế Anh 21", role_name: "Phụ bếp", start_time: "09:00", end_time: "17:00", notes: "", date_key: "2025-12-16" },
        { id: 65, employee_id: 22, employee_name: "Mai", role_name: "Phục vụ", start_time: "09:00", end_time: "17:00", notes: "", date_key: "2025-12-15" },
        { id: 50, employee_id: 21, employee_name: "Cường", role_name: "Phụ bếp", start_time: "09:00", end_time: "17:00", notes: "", date_key: "2025-12-14" }
      ]
    }
  },
  getAttendance: async () => {
    return {
      status: "success",
      message: "",
      data: {
        results: [
          {
            employeeId: 23,
            employeeName: "Việt Hoàng",
            checkInCount: 1,
            histories: [
              {
                id: 20,
                status: "pending",
                checkIn: "2025-12-16T09:05:00.000+07:00",
                checkOut: "2025-12-16T17:00:00.000+07:00",
                lateMinutes: 5,
                earlyMinutes: 0
              }
            ]
          },
          {
            employeeId: 18,
            employeeName: "Lê My",
            histories: []
          },
          {
            employeeId: 14,
            employeeName: "Quang Huy",
            histories: [
              {
                id: 25,
                checkIn: "2025-12-17T08:55:00.000+07:00",
                checkOut: null,
                lateMinutes: 0,
                earlyMinutes: 0
              }
            ]
          },
          {
            employeeId: 16,
            employeeName: "Thế Anh 21",
            histories: [
              {
                checkIn: "2025-12-16T08:50:00.000+07:00",
                checkOut: "2025-12-16T16:55:00.000+07:00",
                lateMinutes: 0,
                earlyMinutes: 5
              }
            ]
          }
        ]
      }
    };
  }
};

const WEEK_DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

// --- MAIN COMPONENT ---
export default function ScheduleGrid({ onNavigate }) {
  const [dateRange, setDateRange] = useState({ start: new Date(2025, 11, 15), end: new Date(2025, 11, 21) });
  const [shifts, setShifts] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [shiftPoolItems, setShiftPoolItems] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draftShifts, setDraftShifts] = useState([]);
  const [selectedDept, setSelectedDept] = useState("all");
  const [searchPoolQuery, setSearchPoolQuery] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [editFormData, setEditFormData] = useState({ employeeId: '', role: '', start: '', end: '', note: '', selectedDays: [] });

  const initData = useCallback(async () => {
    setLoading(true);
    const getDay = (offset) => {
      const d = new Date(dateRange.start);
      d.setDate(d.getDate() + offset);
      return formatDateKey(d);
    };

    try {
      const [rolesRes, empRes, shiftsRes, attendanceRes] = await Promise.all([
        ShiftPoolAPI.getRoles(),
        ShiftPoolAPI.getEmployees(),
        ShiftPoolAPI.getShifts(),
        ShiftPoolAPI.getAttendance()
      ]);

      const rolesList = rolesRes.data;
      setRoles(rolesList);

      const empListRaw = empRes.data.results;
      const mappedEmployees = empListRaw.map(e => ({
        id: String(e.id),
        name: e.name,
        // Map đúng trường meta.department từ file txt
        dept: e.meta?.department ? e.meta.department.trim() : (e.roles?.[0] ? e.roles[0].wageType : 'Khác'),
        birthday: e.meta?.birthday
      }));
      setAllEmployees(mappedEmployees);

      // Map Attendance
      const attendanceMap = new Map();
      attendanceRes.data.results.forEach(empAtt => {
        empAtt.histories.forEach(hist => {
          if (hist.checkIn) {
            const dateObj = new Date(hist.checkIn);
            const dateStr = formatDateKey(dateObj);
            const key = `${empAtt.employeeId}-${dateStr}`;

            let status = 'completed';
            if (hist.lateMinutes > 0) status = 'late';
            else if (hist.earlyMinutes > 0) status = 'early_leave';
            else if (!hist.checkOut) status = 'working';

            attendanceMap.set(key, status);
          }
        });

        if (empAtt.histories.length === 0 && empAtt.employeeName === 'Lê My') {
          attendanceMap.set(`${empAtt.employeeId}-2025-12-15`, 'absent');
        }
      });

      const roleToDept = {};
      rolesList.forEach(r => roleToDept[r.name] = r.dept || 'Khác');

      const deptMap = new Map();
      mappedEmployees.forEach(emp => {
        let empDept = emp.dept || 'Khác';
        if (empDept === 'Theo giờ') empDept = 'Khác';
        emp.dept = empDept;
        if (!deptMap.has(empDept)) deptMap.set(empDept, []);
        deptMap.get(empDept).push(emp);
      });

      const deptsList = Array.from(deptMap.entries()).map(([name, employees]) => ({ name, employees }));
      deptsList.sort((a, b) => a.name.localeCompare(b.name));
      setDepartments(deptsList);

      const mappedShifts = shiftsRes.data.map(s => {
        const attStatus = attendanceMap.get(`${s.employee_id}-${s.date_key}`);
        return {
          id: String(s.id),
          employeeId: String(s.employee_id),
          employeeName: s.employee_name,
          role: s.role_name,
          start: s.start_time,
          end: s.end_time,
          days: [s.date_key],
          note: s.notes,
          transferFrom: s.transferFrom, // Map trường transferFrom
          createdAt: Date.now(),
          attendanceStatus: attStatus
        };
      });
      setShifts(mappedShifts);

      const [openShifts, historyShifts, suggRes] = await Promise.all([
        ShiftPoolAPI.getOpenShifts(), ShiftPoolAPI.getHistory(), ShiftPoolAPI.getSuggestions()
      ]);
      setShiftPoolItems([...openShifts, ...historyShifts]);
      setSuggestions(suggRes.data);

    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => { initData(); }, [initData]);

  // --- ACTIONS ---
  const handlePoolItemClick = (item) => {
    if (item.status === 'picked' && item.picked_by) {
      scrollToEmployee(item.picked_by);
    }
  };

  const handleShiftClick = (e, shift) => {
    if (e) e.stopPropagation();
    setEditingShift(shift);
    const currentDays = shift.days || [];
    const activeIndices = [];
    const current = new Date(dateRange.start);
    for (let i = 0; i < 7; i++) {
      if (currentDays.includes(formatDateKey(current))) activeIndices.push(i);
      current.setDate(current.getDate() + 1);
    }
    setEditFormData({ employeeId: String(shift.employeeId), role: shift.role, start: shift.start, end: shift.end, note: shift.note || '', selectedDays: activeIndices });
    setIsEditModalOpen(true);
  };

  const handleSaveShift = () => {
    if (!editingShift) return;
    const selectedEmp = allEmployees.find(e => e.id === editFormData.employeeId);
    const newEmpName = selectedEmp ? selectedEmp.name : editingShift.employeeName;
    const newDays = [];
    const current = new Date(dateRange.start);
    for (let i = 0; i < 7; i++) {
      if (editFormData.selectedDays.includes(i)) newDays.push(formatDateKey(current));
      current.setDate(current.getDate() + 1);
    }
    setShifts(prev => prev.map(s => s.id === editingShift.id ? { ...s, employeeId: editFormData.employeeId, employeeName: newEmpName, role: editFormData.role, start: editFormData.start, end: editFormData.end, note: editFormData.note, days: newDays.length > 0 ? newDays : s.days } : s));
    setIsEditModalOpen(false);
    setEditingShift(null);
  };

  const handleDeleteClick = (e, id) => {
    if (e) e.stopPropagation();
    if (window.confirm("Bạn có chắc muốn xóa ca này?")) {
      setShifts(prev => prev.filter(s => s.id !== id));
      setIsEditModalOpen(false);
    }
  };

  const handleQuickAdd = (dateStr, date, employeeId) => {
    const newDraft = { id: `draft_${Date.now()}`, employeeId: String(employeeId), role: 'Phục vụ', start: '08:00', end: '17:00', days: [dateStr], createdAt: Date.now() };
    setDraftShifts(prev => [...prev, newDraft]);
  };

  const onDeleteDraft = (id) => setDraftShifts(prev => prev.filter(s => s.id !== id));

  const toggleDay = (index) => {
    setEditFormData(prev => {
      const exists = prev.selectedDays.includes(index);
      if (exists) return { ...prev, selectedDays: prev.selectedDays.filter(i => i !== index) };
      return { ...prev, selectedDays: [...prev.selectedDays, index] };
    });
  };

  // --- COMPUTED DATA ---
  const weekDates = useMemo(() => {
    const dates = [];
    const current = new Date(dateRange.start);
    while (current <= dateRange.end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }, [dateRange]);

  const filteredShiftPoolItems = useMemo(() => {
    let result = shiftPoolItems;
    if (searchPoolQuery.trim()) result = result.filter(item => item.offered_by_name.toLowerCase().includes(searchPoolQuery.toLowerCase()));
    if (selectedDept !== 'all' && selectedDept !== 'Shift Pool') result = result.filter(item => item.department === selectedDept);
    return result;
  }, [shiftPoolItems, searchPoolQuery, selectedDept]);

  const shiftPoolByOwner = useMemo(() => {
    const grouped = new Map();
    filteredShiftPoolItems.forEach(item => {
      if (!grouped.has(item.offered_by)) grouped.set(item.offered_by, { id: item.offered_by, name: item.offered_by_name, items: [] });
      grouped.get(item.offered_by).items.push(item);
    });
    return Array.from(grouped.values());
  }, [filteredShiftPoolItems]);

  const filteredDepartments = useMemo(() => {
    let result = selectedDept === 'all' ? departments : selectedDept === 'Kho ca làm' ? [] : departments.filter(dept => dept.name === selectedDept);
    if (searchPoolQuery.trim()) {
      const lowerQuery = searchPoolQuery.toLowerCase();
      result = result.map(dept => ({ ...dept, employees: dept.employees.filter(emp => emp.name.toLowerCase().includes(lowerQuery)) })).filter(dept => dept.employees.length > 0);
    }
    return result;
  }, [departments, selectedDept, searchPoolQuery]);

  const getShiftsForCell = (employeeId, dateStr) => shifts.filter(s => String(s.employeeId) === String(employeeId) && s.days.includes(dateStr));
  const getDraftShiftsForCell = (employeeId, dateStr) => draftShifts.filter(s => String(s.employeeId) === String(employeeId) && s.days.includes(dateStr));

  const getAvailabilityInfo = (employeeId, dateStr) => {
    // Logic Mock for Testing:
    // - Employee 23 (Việt Hoàng): Bận sáng 17/12 (Yellow)
    // - Employee 14 (Quang Huy): Rảnh cả ngày 15/12 (Green), Bận cả ngày 18/12 (Red)
    if (String(employeeId) === '23' && dateStr === '2025-12-17') return { type: 'busy_part', note: 'Đi học', timeRange: '08:00 - 12:00' };
    if (String(employeeId) === '14' && dateStr === '2025-12-15') return { type: 'free' };
    if (String(employeeId) === '14' && dateStr === '2025-12-18') return { type: 'busy_all', note: 'Về quê' };
    return null;
  };

  const hasConflictWithUnavailable = (employeeId, dateStr, shiftStart, shiftEnd) => {
    const avail = getAvailabilityInfo(employeeId, dateStr);
    if (!avail) return false;
    if (avail.type === 'busy_all') return true;
    if (avail.type === 'busy_part' && avail.timeRange) {
      // Parse time range and check overlap
      const [start, end] = avail.timeRange.split(' - ').map(s => s.trim());
      const busyStart = toMinutes(start);
      const busyEnd = toMinutes(end);
      const shiftStartMin = toMinutes(shiftStart);
      const shiftEndMin = toMinutes(shiftEnd);
      return Math.max(shiftStartMin, busyStart) < Math.min(shiftEndMin, busyEnd);
    }
    return false;
  };

  const totalEmployees = departments.reduce((acc, d) => acc + d.employees.length, 0);
  const filteredEmpCount = filteredDepartments.reduce((acc, d) => acc + d.employees.length, 0);
  const showShiftPool = selectedDept === 'all' || selectedDept === 'Shift Pool';
  const hasDrafts = draftShifts.length > 0;

  // YellowWarningIcon removed in favor of AvailabilityTag

  if (loading) return <div className="h-full flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div></div>;

  return (
    <div className="h-full flex flex-col bg-white font-sans text-gray-800 overflow-hidden relative">

      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 z-40 shadow-sm flex flex-col">
        <div className="px-6 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">Lịch làm việc</h1>
          <div className="flex items-center gap-3">
            <button className="bg-[#F97316] hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 shadow-lg shadow-orange-200 transition-all active:scale-95">
              <Plus size={16} /> Tạo ca mới
            </button>
          </div>
        </div>
        <div className="px-6 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 border border-gray-200 shadow-sm transition-all"><ChevronLeft size={16} /></button>
            <div className="px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 min-w-[200px] text-center">
              15 thg 12, 2025 — 21 thg 12, 2025
            </div>
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 border border-gray-200 shadow-sm transition-all"><ChevronRight size={16} /></button>
            <button className="px-3 py-1.5 bg-orange-50 text-orange-600 text-xs font-bold rounded-lg hover:bg-orange-100 transition-colors">Hôm nay</button>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-gray-300 bg-white">
            <Store size={14} className="text-gray-400" /> Nhà hàng Chú Bi <ChevronRight size={12} className="rotate-90" />
          </button>
        </div>

        <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
          <div className="text-xs font-medium text-gray-500">
            {selectedDept === 'all' && !searchPoolQuery
              ? `${departments.length} phòng ban • ${totalEmployees} nhân viên`
              : `${filteredDepartments.length} phòng ban • ${filteredEmpCount} nhân viên`}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-1.5 shadow-sm">
              <span className="text-xs text-gray-400">Bộ phận:</span>
              <select
                className="text-sm font-medium text-gray-700 bg-transparent outline-none cursor-pointer hover:text-orange-600 transition-colors"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
              >
                <option value="all">Tất cả</option>
                {departments.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                {shiftPoolItems.length > 0 && <option value="Shift Pool">Kho ca làm</option>}
              </select>
            </div>
            <div className={`flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-1.5 shadow-sm w-48 transition-all ${searchPoolQuery ? 'ring-2 ring-orange-500 border-transparent' : 'focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-200'}`}>
              <Search size={14} className="text-gray-400" />
              <input
                type="text"
                placeholder="Tìm nhân viên..."
                className="text-sm w-full outline-none bg-transparent placeholder-gray-400"
                value={searchPoolQuery}
                onChange={(e) => setSearchPoolQuery(e.target.value)}
              />
              {searchPoolQuery && <button onClick={() => setSearchPoolQuery("")}><X size={12} className="text-gray-400 hover:text-gray-600" /></button>}
            </div>
            <button className={`ml-2 flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold shadow-md transition-all ${hasDrafts ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-200' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
              <Send size={14} /> Publish schedule
              {hasDrafts && <span className="bg-white/20 px-1.5 rounded-full text-[10px]">{draftShifts.length}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* SCHEDULE GRID */}
      <div className="flex-1 bg-white flex flex-col mx-6 mb-6 border border-gray-200 overflow-hidden rounded-lg shadow-sm mt-4">
        <div className="flex-1 overflow-auto relative custom-scrollbar">

          {/* HEADER DATES */}
          <div className="flex border-b border-gray-200 bg-white sticky top-0 z-30 shadow-sm">
            <div className="w-60 flex-shrink-0 bg-white border-r border-gray-200 p-4 flex items-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nhân viên</span>
            </div>
            <div className="flex-1 grid grid-cols-7 divide-x divide-gray-200">
              {weekDates.map((date, index) => {
                const isToday = formatDateKey(date) === formatDateKey(new Date());
                const birthdayEmployees = allEmployees.filter(e => isBirthday(date, e.birthday));
                const hasBirthday = birthdayEmployees.length > 0;

                return (
                  <div key={index} className="py-3 text-center bg-white group hover:bg-gray-50 transition-colors relative">
                    <p className={`text-xs font-bold uppercase mb-1 ${isToday ? 'text-[#F97316]' : 'text-gray-400'}`}>{WEEK_DAYS[index]}</p>
                    <div className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-xl font-bold ${isToday ? 'bg-[#F97316] text-white shadow-md' : 'text-gray-700'}`}>
                      {date.getDate()}
                    </div>
                    {hasBirthday && (
                      <div className="absolute top-2 right-2 z-20 group/bd">
                        <div
                          className="cursor-pointer p-1 hover:scale-110 transition-transform animate-bounce text-pink-500"
                          onClick={() => scrollToEmployee(birthdayEmployees[0].id)}
                        >
                          <Cake size={14} className="fill-pink-100" />
                        </div>
                        <div className="absolute top-full right-0 mt-2 w-max max-w-[220px] bg-white p-3 rounded-xl shadow-xl border border-pink-100 opacity-0 group-hover/bd:opacity-100 transition-opacity pointer-events-none z-30 text-left">
                          <div className="text-xs font-bold text-pink-500 mb-2 flex items-center gap-1">
                            <Cake size={12} /> Happy Birthday!
                          </div>
                          <div className="space-y-1">
                            {birthdayEmployees.map(emp => (
                              <div key={emp.id} className="text-xs text-slate-700 flex justify-between gap-4">
                                <span className="font-semibold">{emp.name}</span>
                                <span className="text-slate-400">{new Date(emp.birthday).getDate()}/{new Date(emp.birthday).getMonth() + 1}</span>
                              </div>
                            ))}
                          </div>
                          <div className="text-[10px] text-pink-400 mt-2 italic border-t border-pink-50 pt-1">
                            Cùng chúc {birthdayEmployees.map(e => getFirstName(e.name)).join(', ')} tuổi mới rực rỡ! 🎉
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* --- KHO CA LÀM SECTION --- */}
          {showShiftPool && filteredShiftPoolItems.length > 0 && (
            <div className="bg-slate-50 border-b-4 border-slate-200">
              <div className="bg-[#334155] text-white px-4 py-2 sticky top-[82px] z-20 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider">
                  KHO CA LÀM {searchPoolQuery && `(Tìm kiếm: "${searchPoolQuery}")`}
                  <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {filteredShiftPoolItems.filter(i => i.status === 'open').length}
                  </span>
                </div>
              </div>

              {shiftPoolByOwner.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <Briefcase size={32} className="mb-2 opacity-50" />
                  <p className="text-sm">Hiện không có ca nào trống</p>
                </div>
              ) : (
                shiftPoolByOwner.map((owner) => (
                  <div key={`pool-owner-${owner.id}`} className="flex border-b border-gray-200 hover:bg-slate-100 transition-colors min-h-[90px]">
                    <div className="w-60 flex-shrink-0 p-4 flex items-center gap-3 border-r border-gray-200 bg-slate-50">
                      <div className={`w-9 h-9 rounded-full ${getAvatarColor(owner.name)} flex items-center justify-center text-white text-xs font-bold shadow-sm ring-2 ring-white`}>
                        {owner.name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-gray-700 text-sm truncate block">{owner.name}</span>
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-7 divide-x divide-gray-200">
                      {weekDates.map((date, index) => {
                        const dateStr = formatDateKey(date);
                        const items = owner.items.filter(i => i.shift_date === dateStr);
                        return (
                          <div key={index} className="p-2 relative flex flex-col gap-2 bg-slate-50/50">
                            {items.map(item => {
                              const isPicked = item.status === 'picked';
                              return (
                                <div
                                  key={item.id}
                                  onClick={() => handlePoolItemClick(item)}
                                  className={getPoolItemClasses(item.status)}
                                  title={isPicked ? "Click để xem người nhận" : ""}
                                >
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-bold truncate text-slate-800 pr-4">
                                      {item.role_name}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-gray-600 space-y-0.5">
                                    <div className="flex items-center gap-1 font-medium">
                                      <Clock size={10} /> {item.start_time} - {item.end_time}
                                    </div>
                                  </div>
                                  {item.offer_reason && (
                                    <div className="mt-1.5 pt-1.5 border-t border-dashed border-gray-200 text-[10px] text-black font-medium italic">
                                      "{item.offer_reason}"
                                    </div>
                                  )}
                                  {isPicked && item.picked_by_name && (
                                    <div className="mt-2 flex flex-col gap-1 text-[10px] font-bold text-green-700 bg-green-50 px-1.5 py-1 rounded border border-green-200">
                                      <div className="flex items-center gap-1">
                                        <CheckCircle size={10} /> {item.picked_by_name}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* DEPARTMENTS & EMPLOYEES */}
          {filteredDepartments.map((dept) => (
            <div key={dept.name}>
              <div className="bg-gray-100 text-gray-600 px-4 py-2 font-bold text-xs uppercase tracking-wider sticky top-[82px] z-20 shadow-sm border-t border-gray-300">
                {dept.name}
              </div>
              {dept.employees.map((emp) => (
                <div
                  key={emp.id}
                  id={`emp-row-${emp.id}`}
                  className="flex border-b border-gray-200 hover:bg-gray-50 transition-colors min-h-[90px] group/row duration-300"
                >
                  {/* EMPLOYEE INFO CELL with Tooltip & Navigation */}
                  <div className="w-60 flex-shrink-0 p-4 flex items-center gap-3 border-r border-gray-200 bg-white relative z-10 hover:z-50">
                    <div className={`w-9 h-9 rounded-full ${getAvatarColor(emp.name)} flex items-center justify-center text-white text-xs font-bold shadow-sm ring-2 ring-white`}>
                      {emp.name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                      {/* NAVIGATION LINK */}
                      <span
                        onClick={() => onNavigate && onNavigate('salary', { employeeId: emp.id })}
                        className="font-semibold text-gray-700 text-sm truncate cursor-pointer hover:text-orange-600 hover:underline"
                      >
                        {emp.name}
                      </span>
                      {emp.birthday && (
                        <span className="text-[10px] text-black-400 flex items-center gap-1 mt-0.5">
                          <Cake size={10} className="text-pink-400" />
                          {new Date(emp.birthday).getDate()}/{new Date(emp.birthday).getMonth() + 1}
                        </span>
                      )}

                      {/* EMPLOYEE TOOLTIP */}
                      <div className="absolute left-1/2 bottom-full mb-2 w-64 bg-slate-800 text-white text-xs rounded-lg p-3 shadow-xl opacity-0 group-hover/row:opacity-100 transition-opacity pointer-events-none z-50 -translate-x-1/2">
                        <div className="flex items-center gap-3 mb-2 border-b border-slate-700 pb-2">
                          <div className={`w-8 h-8 rounded-full ${getAvatarColor(emp.name)} flex items-center justify-center font-bold`}>
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{emp.name}</p>
                            <p className="text-slate-400">{emp.dept}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p><span className="text-slate-400">Vai trò:</span> {emp.roles?.[0]?.name || 'N/A'}</p>
                          <p><span className="text-slate-400">Ngày vào làm:</span> 01/01/2025</p>
                          <p><span className="text-slate-400">Email:</span> {emp.email || 'user@example.com'}</p>
                          <p><span className="text-slate-400">Di động:</span> {emp.phone || '0901234567'}</p>
                        </div>
                        <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                      </div>
                    </div>

                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-gray-100 text-gray-400 opacity-0 group-hover/row:opacity-100 hover:bg-orange-100 hover:text-orange-600 transition-all">
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="flex-1 grid grid-cols-7 divide-x divide-gray-200">
                    {weekDates.map((date, index) => {
                      const dateStr = formatDateKey(date);
                      const cellShifts = getShiftsForCell(emp.id, dateStr);
                      const dayDraftShifts = getDraftShiftsForCell(emp.id, dateStr);
                      const availability = getAvailabilityInfo(emp.id, dateStr);
                      const hasShifts = cellShifts.length > 0 || dayDraftShifts.length > 0;

                      const isBirthdayToday = isBirthday(date, emp.birthday);

                      return (
                        <div
                          key={index}
                          className={`p-2 relative flex flex-col gap-2 min-h-[90px] cursor-pointer transition-colors group/cell
                              ${isBirthdayToday ? 'bg-pink-50/50 hover:bg-pink-100' : 'hover:bg-gray-50'}
                          `}
                          onClick={() => handleQuickAdd(dateStr, date, emp.id)}
                        >
                          {/* BIRTHDAY DECO */}
                          {isBirthdayToday && (
                            <div className="absolute top-1 right-1 pointer-events-none z-0 opacity-60">
                              <Cake size={14} className="text-pink-400 fill-pink-100" />
                            </div>
                          )}

                          {/* AVAILABILITY TAG (Triangular) */}
                          {availability && !hasShifts && (
                            <AvailabilityTag
                              type={availability.type}
                              note={availability.note}
                              timeRange={availability.timeRange}
                            />
                          )}

                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/cell:opacity-100 pointer-events-none">
                            {cellShifts.length === 0 && dayDraftShifts.length === 0 && (
                              <Plus size={20} className="text-gray-300" />
                            )}
                          </div>

                          {/* Published Shifts */}
                          {cellShifts.map(shift => {
                            const isConflict = hasConflictWithUnavailable(emp.id, dateStr, shift.start, shift.end);
                            const { className, style } = getShiftCardStyles(shift, isConflict);
                            return (
                              <div
                                key={shift.id}
                                onClick={(e) => {
                                  handleShiftClick(e, shift)
                                }}
                                style={style}
                                className={`${className} z-10`}
                              >
                                <div className="absolute top-1 right-1 flex gap-1 z-20 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                  {/* Icon Edit */}
                                  <button
                                    className="p-1 text-gray-500 hover:text-blue-600 bg-white/70 hover:bg-white rounded-full shadow-sm"
                                    onClick={(e) => handleShiftClick(e, shift)}
                                    title="Sửa ca"
                                  >
                                    <Edit2 size={12} />
                                  </button>
                                  {/* Icon Delete */}
                                  <button
                                    className="p-1 text-gray-500 hover:text-red-600 bg-white/70 hover:bg-white rounded-full shadow-sm"
                                    onClick={(e) => handleDeleteClick(e, shift.id)}
                                    title="Xóa ca"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>

                                {shift.transferFrom && (
                                  <div className="flex items-center gap-1 mb-1 max-w-full">
                                    <span className="bg-yellow-100 text-yellow-800 text-[9px] px-1 rounded font-bold border border-yellow-200 truncate block w-full" title={`Nhận từ: ${shift.transferFrom}`}>
                                      Từ: {shift.transferFrom}
                                    </span>
                                  </div>
                                )}

                                <div className="flex justify-between items-start">
                                  <p className={`text-xs font-bold truncate pr-6 ${isConflict ? 'text-red-700' : 'text-gray-700'}`}>{shift.role}</p>
                                </div>
                                <div className={`flex items-center gap-1 mt-1 text-[10px] ${isConflict ? 'text-red-600' : 'text-black-500'}`}>
                                  <Clock size={10} /> {shift.start} - {shift.end}
                                </div>

                                {/* Trạng thái chấm công */}
                                {shift.attendanceStatus === 'late' && <div className="text-[9px] font-bold text-red-600 mt-0.5">Đi muộn</div>}
                                {shift.attendanceStatus === 'early_leave' && <div className="text-[9px] font-bold text-orange-600 mt-0.5">Về sớm</div>}
                                {shift.attendanceStatus === 'absent' && <div className="text-[9px] font-bold text-red-600 mt-0.5">Vắng</div>}
                                {shift.attendanceStatus === 'working' && <div className="text-[9px] font-bold text-green-600 mt-0.5">Đang làm</div>}
                              </div>
                            );
                          })}

                          {/* Draft Shifts */}
                          {dayDraftShifts.map(shift => {
                            const isConflict = hasConflictWithUnavailable(emp.id, dateStr, shift.start, shift.end);
                            const draftClass = getDraftItemClasses(isConflict);
                            return (
                              <div key={shift.id} className={`${draftClass} z-10`}>
                                <span className={`absolute -top-1.5 -right-1.5 text-white text-[6px] px-1 rounded-sm ${isConflict ? 'bg-red-500' : 'bg-orange-500'}`}>Nháp</span>
                                <p className={`text-xs font-bold truncate mb-1 ${isConflict ? 'text-red-800' : 'text-orange-800'}`}>{shift.role}</p>
                                <div className={`text-[11px] font-medium ${isConflict ? 'text-red-700' : 'text-orange-700'}`}>{shift.start} - {shift.end}</div>
                                <button onClick={(e) => { e.stopPropagation(); onDeleteDraft(shift.id); }} className="absolute bottom-1 right-1 text-orange-400 hover:text-red-500"><Trash2 size={12} /></button>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* === FORM CHỈNH SỬA CA LÀM === */}
      {isEditModalOpen && editingShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-[500px] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Chỉnh sửa ca làm</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Nhân Viên</label>
                  <select
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white"
                    value={editFormData.employeeId}
                    onChange={(e) => setEditFormData({ ...editFormData, employeeId: e.target.value })}
                  >
                    {allEmployees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Vị trí</label>
                  <select
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white"
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                  >
                    {roles.map(r => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Giờ bắt đầu</label>
                  <div className="relative">
                    <input
                      type="time"
                      className="w-full border border-gray-200 rounded-lg pl-3 pr-8 py-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
                      value={editFormData.start}
                      onChange={(e) => setEditFormData({ ...editFormData, start: e.target.value })}
                    />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Giờ kết thúc</label>
                  <div className="relative">
                    <input
                      type="time"
                      className="w-full border border-gray-200 rounded-lg pl-3 pr-8 py-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
                      value={editFormData.end}
                      onChange={(e) => setEditFormData({ ...editFormData, end: e.target.value })}
                    />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Ghi chú</label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-orange-500 outline-none resize-none h-24"
                  placeholder="Thêm ghi chú cho ca làm"
                  value={editFormData.note}
                  onChange={(e) => setEditFormData({ ...editFormData, note: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Áp dụng cho</label>
                <div className="flex gap-2">
                  {WEEK_DAYS.map((day, index) => {
                    const isSelected = editFormData.selectedDays.includes(index);
                    return (
                      <button
                        key={day}
                        onClick={() => toggleDay(index)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
                                    ${isSelected
                            ? 'bg-slate-800 text-white shadow-md'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-100 transition-colors bg-white"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveShift}
                className="px-8 py-2.5 rounded-full bg-[#F97316] text-white font-bold text-sm hover:bg-orange-600 shadow-md shadow-orange-200 transition-all"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { 
  Building2, Clock, Wallet, Plus, Trash2, Save, Info, 
  CalendarDays, MapPin, Users, X
} from 'lucide-react';

// --- 1. CÁC COMPONENT DÙNG CHUNG (UI KITS) ---

const ToggleSwitch = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
      checked ? 'bg-[#F97316]' : 'bg-gray-300'
    }`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}/>
  </button>
);

const InputField = ({ label, type = "text", value, onChange, unit, min, note, placeholder, disabled }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative rounded-md shadow-sm">
      <input
        type={type}
        className="block w-full rounded-md border-gray-300 pl-3 pr-12 py-2 border focus:ring-[#F97316] focus:border-[#F97316] sm:text-sm outline-none"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        min={min}
        disabled={disabled}
      />
      {unit && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-gray-500 sm:text-sm bg-gray-50 px-2 py-1 rounded">{unit}</span>
        </div>
      )}
    </div>
    {note && <p className="mt-1 text-xs text-gray-500 flex items-start gap-1"><Info size={12} className="mt-0.5 shrink-0"/> {note}</p>}
  </div>
);

const Modal = ({ isOpen, onClose, title, children, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all scale-100">
        <div className="flex justify-between items-center px-5 py-4 border-b bg-gray-50">
          <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-white p-1 rounded-full"><X size={20}/></button>
        </div>
        <div className="p-5 max-h-[70vh] overflow-y-auto">{children}</div>
        <div className="flex justify-end gap-3 px-5 py-4 border-t bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">Hủy</button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm font-bold text-white bg-[#F97316] hover:bg-orange-700 rounded-lg shadow-md transition-colors">Lưu lại</button>
        </div>
      </div>
    </div>
  );
};

// --- 2. TAB NỘI DUNG ---

// === TAB 1: THÔNG TIN & CƠ CẤU ===
const GeneralTab = () => {
  const [branches, setBranches] = useState(["Cơ sở 1 - Quận 1", "Cơ sở 2 - Thủ Đức"]);
  const [depts, setDepts] = useState(["Bếp", "Bàn", "Bar", "Thu ngân"]);
  const [roles, setRoles] = useState([
    { id: 1, name: "Phục vụ", dept: "Bàn", type: "Tháng", salary: 6000000 },
    { id: 2, name: "Phụ bếp", dept: "Bếp", type: "Giờ", salary: 25000 },
  ]);

  // Modal State cho Role
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', dept: 'Bàn', type: 'Tháng', salary: '' });

  // Logic Thêm/Xóa cơ bản
  const handleAddBranch = () => {
    const name = prompt("Nhập tên chi nhánh mới:");
    if (name) setBranches([...branches, name]);
  };
  const handleDeleteBranch = (idx) => setBranches(branches.filter((_, i) => i !== idx));

  const handleAddDept = () => {
    const name = prompt("Nhập tên bộ phận mới:");
    if (name) setDepts([...depts, name]);
  };
  const handleDeleteDept = (idx) => setDepts(depts.filter((_, i) => i !== idx));

  // Logic Thêm Vai trò (Qua Modal)
  const handleSaveRole = () => {
    if (!newRole.name || !newRole.salary) return alert("Vui lòng nhập đủ thông tin!");
    setRoles([...roles, { ...newRole, id: Date.now() }]);
    setIsRoleModalOpen(false);
    setNewRole({ name: '', dept: 'Bàn', type: 'Tháng', salary: '' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Thông tin chung */}
        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Building2 className="text-[#F97316]" size={20} /> Thông tin chung
          </h3>
          <InputField label="Tên nhà hàng" value="Nhà hàng ABC" onChange={()=>{}} />
        </div>

        {/* Quản lý Cơ sở */}
        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <MapPin className="text-[#F97316]" size={20} /> Quản lý Cơ sở
            </h3>
            <button onClick={handleAddBranch} className="text-xs flex items-center gap-1 bg-orange-50 text-[#F97316] px-2 py-1 rounded hover:bg-orange-100">
              <Plus size={14}/> Thêm
            </button>
          </div>
          <ul className="space-y-2">
            {branches.map((b, i) => (
              <li key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-200">
                <span className="text-sm text-gray-700">{b}</span>
                <button onClick={() => handleDeleteBranch(i)} className="text-red-400 hover:text-red-600"><Trash2 size={14}/></button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quản lý Vai trò & Bộ phận */}
      <div className="bg-white p-5 rounded-lg border shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Users className="text-[#F97316]" size={20} /> Cơ cấu & Vai trò
        </h3>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Bộ phận</label>
          <div className="flex flex-wrap gap-2">
            {depts.map((d, i) => (
              <span key={i} className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full border flex items-center gap-2">
                {d} <button onClick={() => handleDeleteDept(i)} className="text-gray-400 hover:text-red-500"><X size={12}/></button>
              </span>
            ))}
            <button onClick={handleAddDept} className="border-2 border-dashed border-gray-300 text-gray-500 text-xs px-3 py-1.5 rounded-full hover:border-orange-400 hover:text-[#F97316] flex items-center gap-1">
              <Plus size={12}/> Thêm bộ phận
            </button>
          </div>
        </div>

        {/* Bảng Vai trò */}
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên vai trò</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bộ phận</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại lương</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Lương khởi điểm</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {roles.map((role) => (
                <tr key={role.id}>
                  <td className="px-4 py-2 text-sm font-medium text-gray-900">{role.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-500">{role.dept}</td>
                  <td className="px-4 py-2 text-sm text-gray-500"><span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{role.type}</span></td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right">{role.salary.toLocaleString()} đ</td>
                  <td className="px-4 py-2 text-center"><button onClick={() => setRoles(roles.filter(r => r.id !== role.id))} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
             <button onClick={() => setIsRoleModalOpen(true)} className="text-sm font-bold text-[#F97316] flex items-center gap-1 hover:underline">
                <Plus size={16}/> Thêm vai trò mới
             </button>
          </div>
        </div>
      </div>

      {/* MODAL THÊM VAI TRÒ */}
      <Modal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} onConfirm={handleSaveRole} title="Thêm Vai trò mới">
         <div className="space-y-4">
            <InputField label="Tên vai trò" placeholder="VD: Phục vụ Full-time" value={newRole.name} onChange={(e) => setNewRole({...newRole, name: e.target.value})} />
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Thuộc bộ phận</label>
               <select className="w-full border-gray-300 border rounded-md p-2 text-sm focus:border-[#F97316] outline-none" value={newRole.dept} onChange={(e) => setNewRole({...newRole, dept: e.target.value})}>
                  {depts.map(d => <option key={d} value={d}>{d}</option>)}
               </select>
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Loại lương mặc định</label>
               <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-2 text-sm"><input type="radio" name="salaryType" checked={newRole.type === 'Tháng'} onChange={() => setNewRole({...newRole, type: 'Tháng'})}/> Theo tháng</label>
                  <label className="flex items-center gap-2 text-sm"><input type="radio" name="salaryType" checked={newRole.type === 'Giờ'} onChange={() => setNewRole({...newRole, type: 'Giờ'})}/> Theo giờ</label>
               </div>
            </div>
            <InputField label="Mức lương khởi điểm" type="number" placeholder="0" value={newRole.salary} onChange={(e) => setNewRole({...newRole, salary: Number(e.target.value)})} unit="VNĐ" />
         </div>
      </Modal>
    </div>
  );
};

// === TAB 2: QUY ĐỊNH CHẤM CÔNG (CẬP NHẬT TRẠNG THÁI HOẠT ĐỘNG) ===
const AttendanceTab = () => {
  const [strictMode, setStrictMode] = useState(true);
  const [autoBreak, setAutoBreak] = useState(false);

  // -- STATE MỚI ĐỂ THAO TÁC --
  const [autoCheckoutTime, setAutoCheckoutTime] = useState("04:00");
  const [registerDay, setRegisterDay] = useState("Thứ 5");
  const [registerTime, setRegisterTime] = useState("17:00");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
      <div className="bg-white p-5 rounded-lg border shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
          <Clock className="text-[#F97316]" size={20} /> Vào ca & Ra ca
        </h3>
        <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-900 uppercase">Check-in</h4>
            <InputField label="Giới hạn check-in sớm" type="number" value="15" unit="Phút" min="0" note="Nút Check-in chỉ sáng lên trước giờ vào ca 15 phút." onChange={()=>{}} />
            <div className="flex items-start justify-between bg-orange-50 p-3 rounded-md border border-orange-100">
                <div className="pr-4">
                    <span className="block text-sm font-medium text-orange-900">Quy tắc tính giờ bắt đầu</span>
                    <p className="text-xs text-orange-700 mt-1">{strictMode ? "ON: Check-in sớm -> Tính từ giờ quy định." : "OFF: Tính từ giờ thực tế."}</p>
                </div>
                <ToggleSwitch checked={strictMode} onChange={setStrictMode} />
            </div>
            <InputField label="Số phút đi trễ (Cho phép)" type="number" value="5" unit="Phút" min="0" note="Đi trễ < 5p vẫn tính là đúng giờ." onChange={()=>{}} />
        </div>
        <div className="border-t pt-4 space-y-4">
            <h4 className="text-sm font-bold text-gray-900 uppercase">Check-out</h4>
            <InputField label="Số phút về sớm (Cho phép)" type="number" value="5" unit="Phút" min="0" note="Về sớm < 5p không bị phạt." onChange={()=>{}} />
            
            {/* THAY ĐỔI: Có thể nhập liệu Thời gian check out tự động */}
            <div>
              <InputField 
                  label="Check-out tự động" 
                  type="time" 
                  value={autoCheckoutTime} 
                  onChange={(e) => setAutoCheckoutTime(e.target.value)}
                  note="Hệ thống tự động đóng ca và highlight vàng nhạt."
              />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Làm tròn giờ</label>
                <select className="block w-full rounded-md border-gray-300 py-2 px-3 border text-sm focus:border-[#F97316] outline-none">
                    <option>Không làm tròn</option>
                    <option>Làm tròn xuống 15p</option>
                </select>
            </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-5 rounded-lg border shadow-sm">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h3 className="text-lg font-bold text-gray-800">Giờ nghỉ (Break Time)</h3>
                <ToggleSwitch checked={autoBreak} onChange={setAutoBreak} />
            </div>
            <div className={`space-y-4 transition-all ${autoBreak ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                <InputField label="Điều kiện áp dụng (Ca >)" type="number" value="6" unit="Giờ" min="0" onChange={()=>{}} />
                <InputField label="Thời gian trừ" type="number" value="30" unit="Phút" min="0" note="Tự động trừ vào tổng công." onChange={()=>{}}/>
            </div>
        </div>

        {/* THAY ĐỔI: Có thể chọn Thứ và Giờ cho Hạn đăng ký */}
        <div className="bg-white p-5 rounded-lg border shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Đăng ký Lịch làm</h3>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hạn chốt đăng ký (Hàng tuần)</label>
                <div className="flex gap-3">
                    <select 
                        value={registerDay}
                        onChange={(e) => setRegisterDay(e.target.value)}
                        className="block w-1/2 rounded-md border-gray-300 py-2 px-3 border text-sm focus:border-[#F97316] outline-none bg-white"
                    >
                        <option>Thứ 2</option>
                        <option>Thứ 3</option>
                        <option>Thứ 4</option>
                        <option>Thứ 5</option>
                        <option>Thứ 6</option>
                        <option>Thứ 7</option>
                        <option>Chủ nhật</option>
                    </select>
                    <input 
                        type="time" 
                        value={registerTime}
                        onChange={(e) => setRegisterTime(e.target.value)}
                        className="block w-1/2 rounded-md border-gray-300 py-2 px-3 border focus:border-[#F97316] sm:text-sm outline-none" 
                    />
                </div>
                <p className="mt-2 text-xs text-gray-500 flex items-start gap-1">
                  <Info size={12} className="mt-0.5 shrink-0"/> 
                  Đến {registerTime} {registerDay} hàng tuần, hệ thống sẽ khóa đăng ký.
                </p>
            </div>
        </div>

        <div className="bg-white p-5 rounded-lg border shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Nghỉ phép</h3>
            <InputField label="Deadline gửi đơn xin nghỉ" type="number" value="2" unit="Ngày trước" min="1" note="Gửi muộn hơn hệ thống sẽ cảnh báo." onChange={()=>{}} />
        </div>
      </div>
    </div>
  );
};

// === TAB 3: LƯƠNG & PHÚC LỢI ===
const PayrollTab = () => {
  // 1. Phụ cấp (Inline Adding)
  const [allowances, setAllowances] = useState([{ id: 1, hours: 8, amount: 20000 }]);
  const handleAddAllowance = () => setAllowances([...allowances, { id: Date.now(), hours: '', amount: '' }]);
  const handleAllowanceChange = (id, field, val) => setAllowances(allowances.map(i => i.id === id ? {...i, [field]: val} : i));
  const handleDeleteAllowance = (id) => setAllowances(allowances.filter(i => i.id !== id));

  // 2. Holiday (Modal Adding)
  const [holidays, setHolidays] = useState([{ id: 1, name: "Tết Nguyên Đán", start: "2024-02-09", end: "2024-02-12", multiplier: 3.0 }]);
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
  const [newHoliday, setNewHoliday] = useState({ name: '', start: '', end: '', multiplier: 1.5 });
  const handleSaveHoliday = () => {
      if(!newHoliday.name) return;
      setHolidays([...holidays, {...newHoliday, id: Date.now()}]);
      setIsHolidayModalOpen(false);
      setNewHoliday({ name: '', start: '', end: '', multiplier: 1.5 });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg border shadow-sm md:col-span-1">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Wallet className="text-[#F97316]" size={20} /> Hệ số & Phạt
                </h3>
                <InputField label="Hệ số lương OT" type="number" value="1.5" unit="x" min="1.0" note="150% lương cơ bản." onChange={()=>{}} />
                <InputField label="Hệ số phạt Đi trễ / Về sớm" type="number" value="1.0" unit="x" min="0" note="(Phút vi phạm - Cho phép) * Lương * Hệ số." onChange={()=>{}} />
            </div>

            <div className="bg-white p-5 rounded-lg border shadow-sm md:col-span-2">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Phúc lợi & Phụ cấp</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <InputField label="Nghỉ phép năm" type="number" value="12" unit="Ngày/Năm" min="0" note="Chỉ áp dụng cho nhân viên Lương Tháng." onChange={()=>{}} />
                    </div>
                    
                    {/* Phụ cấp Inline */}
                    <div className="bg-gray-50 p-3 rounded-lg border">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Phụ cấp theo giờ (Thêm trực tiếp)</label>
                        <div className="space-y-2 mb-3">
                            {allowances.map((item) => (
                                <div key={item.id} className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-500 whitespace-nowrap">&gt;</span>
                                    <input type="number" value={item.hours} onChange={(e)=>handleAllowanceChange(item.id, 'hours', e.target.value)} className="w-16 p-1 border rounded text-center focus:border-[#F97316] outline-none" placeholder="Giờ"/>
                                    <span className="text-gray-500 whitespace-nowrap">h =</span>
                                    <input type="number" value={item.amount} onChange={(e)=>handleAllowanceChange(item.id, 'amount', e.target.value)} className="w-24 p-1 border rounded text-right font-medium text-green-700 focus:border-[#F97316] outline-none" placeholder="VNĐ"/>
                                    <button onClick={() => handleDeleteAllowance(item.id)} className="text-gray-400 hover:text-red-500 ml-auto"><Trash2 size={16}/></button>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleAddAllowance} className="text-xs flex items-center gap-1 text-[#F97316] font-medium hover:underline"><Plus size={14}/> Thêm dòng</button>
                    </div>
                </div>
            </div>
        </div>

        {/* Holiday Table */}
        <div className="bg-white p-5 rounded-lg border shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><CalendarDays className="text-[#F97316]" size={20} /> Ngày lễ</h3>
                <button onClick={() => setIsHolidayModalOpen(true)} className="bg-[#F97316] text-white text-sm px-3 py-2 rounded-md flex items-center gap-1 hover:bg-orange-700"><Plus size={16} /> Thêm ngày lễ</button>
            </div>
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên dịp lễ</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hệ số lương (x)</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {holidays.map((h) => (
                            <tr key={h.id}>
                                <td className="px-4 py-2 text-sm font-medium text-gray-900">{h.name}</td>
                                <td className="px-4 py-2 text-sm text-gray-500">{h.start} {h.end ? `- ${h.end}` : ''}</td>
                                <td className="px-4 py-2 text-sm text-[#F97316] font-bold">{h.multiplier}</td>
                                <td className="px-4 py-2 text-right"><button onClick={() => setHolidays(holidays.filter(x => x.id !== h.id))} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Modal Holiday */}
        <Modal isOpen={isHolidayModalOpen} onClose={() => setIsHolidayModalOpen(false)} onConfirm={handleSaveHoliday} title="Thêm Ngày lễ">
            <div className="space-y-4">
                <InputField label="Tên dịp lễ" placeholder="VD: Quốc khánh" value={newHoliday.name} onChange={(e) => setNewHoliday({...newHoliday, name: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="Từ ngày" type="date" value={newHoliday.start} onChange={(e) => setNewHoliday({...newHoliday, start: e.target.value})} />
                    <InputField label="Đến ngày (Tùy chọn)" type="date" value={newHoliday.end} onChange={(e) => setNewHoliday({...newHoliday, end: e.target.value})} />
                </div>
                <InputField label="Hệ số lương" type="number" step="0.1" value={newHoliday.multiplier} onChange={(e) => setNewHoliday({...newHoliday, multiplier: e.target.value})} unit="x" />
            </div>
        </Modal>
    </div>
  );
};

// --- 3. MÀN HÌNH CHÍNH ---
const SettingsScreen = () => {
  const [activeTab, setActiveTab] = useState('general');
  const tabs = [
    { id: 'general', label: 'Thông tin & Cơ cấu' },
    { id: 'attendance', label: 'Quy định Chấm công' },
    { id: 'payroll', label: 'Lương & Phúc lợi' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-50 py-2 z-10">
          <h1 className="text-2xl font-bold text-gray-900">Thiết lập hệ thống</h1>
          <button className="flex items-center gap-2 bg-[#F97316] text-white px-5 py-2.5 rounded-lg shadow hover:bg-orange-700 active:scale-95 transition-transform"><Save size={18} /> Lưu thay đổi</button>
        </div>
        <div className="bg-white rounded-t-xl border-b border-gray-200 px-6 pt-2 shadow-sm mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id ? 'border-[#F97316] text-[#F97316]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>{tab.label}</button>
            ))}
          </nav>
        </div>
        <div className="min-h-[500px]">
          {activeTab === 'general' && <GeneralTab />}
          {activeTab === 'attendance' && <AttendanceTab />}
          {activeTab === 'payroll' && <PayrollTab />}
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
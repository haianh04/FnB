import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ChevronDown, 
  Plus, 
  Trash2, 
  Edit2, 
  X, 
  Search, 
  Eye, 
  User, 
  CreditCard, 
  Shield, 
  ArrowLeft,
  ToggleLeft,
  ToggleRight,
  MapPin,
  Briefcase,
  Save,
  XCircle,
  AlertCircle,
  AlertTriangle,
  MoreVertical, 
  RotateCcw, 
  FileEdit,
  Filter
} from 'lucide-react';

// --- MOCK DATA ---

const mockEmployees = [
  {
    id: '1',
    name: 'Quỳnh Châu',
    email: 'cquynh585@gmail.com',
    dob: '1995-05-12',
    startDate: '2023-01-15', // Thêm ngày bắt đầu
    base: 'Cơ sở 1',
    department: 'Bếp nóng',
    position: 'Bếp thịt',
    status: 'active',
    avatar: 'Q',
    phone: '0912345678',
    cccd: '001234567890',
    address: '123 Đường ABC, 1, TP.HCM',
    emergencyContactName: 'Nguyễn Văn A',
    emergencyContactPhone: '0987654321'
  },
  {
    id: '2',
    name: 'Phạm Văn Huy',
    email: 'huyhoangbt773@gmail.com',
    dob: '1998-08-20',
    startDate: '2023-03-01', // Thêm ngày bắt đầu
    base: 'Cơ sở 2',
    department: 'Bếp nóng',
    position: 'Bếp thịt',
    status: 'active',
    avatar: 'P',
    phone: '0923456789',
    cccd: '001234567891',
    address: '456 Đường DEF, 2, TP.HCM'
  },
  {
    id: '3',
    name: 'Nguyễn Thị Quỳnh Chi',
    email: 'chintq12996@gmail.com',
    dob: '1996-02-14',
    startDate: '2022-06-10', // Thêm ngày bắt đầu
    base: 'Văn phòng chính',
    department: 'Nhân sự',
    position: 'HR',
    status: 'inactive',
    avatar: 'N',
    phone: '0934567890',
    deactivationDate: '2025-11-15',
    deactivationReason: 'Nhân viên xin nghỉ việc',
    deactivationNote: 'Đã bàn giao công việc.'
  },
  {
    id: '4',
    name: 'Thế Anh',
    email: 'theanhntp21@gmail.com',
    dob: '2000-11-01',
    startDate: '2024-01-05', // Thêm ngày bắt đầu
    base: 'Cơ sở 1',
    department: 'Thu ngân',
    position: 'Thu ngân',
    status: 'active',
    avatar: 'T',
    phone: '0945678901',
    cccd: '001234567893'
  }
];

const mockAllowancesData = [
  {
    id: '1',
    name: 'Phụ cấp ăn trưa',
    type: 'ngày',
    condition: 'Làm việc hơn 6 giờ/ngày',
    amount: 30000,
    isActive: true
  },
  {
    id: '2',
    name: 'Phụ cấp xăng xe',
    type: 'tháng',
    condition: 'Nhân viên giao hàng',
    amount: 500000,
    isActive: true
  },
  {
    id: '3',
    name: 'Phụ cấp bảo hiểm',
    type: 'tháng',
    condition: 'Làm hơn 20 ngày/tháng',
    amount: 500000,
    isActive: false
  },
  {
    id: '4',
    name: 'Phụ cấp điện thoại',
    type: 'tháng',
    condition: 'Gọi hơn 100 phút/tháng',
    amount: 100000,
    isActive: false
  }
];

const mockSalaryPeriods = [
  {
    id: '1',
    period: 'Tháng 12/2025',
    payDate: '05/12/2025',
    base: 0,
    bonusPenalty: 0,
    actualPay: 0,
    status: 'paid'
  },
  {
    id: '2',
    period: 'Tháng 11/2025',
    payDate: '05/11/2025',
    base: 0,
    bonusPenalty: -200000,
    actualPay: -200000,
    status: 'paid'
  },
  {
    id: '3',
    period: 'Tháng 10/2025',
    payDate: '05/10/2025',
    base: 0,
    bonusPenalty: 500000,
    actualPay: 500000,
    status: 'paid'
  },
  {
    id: '4',
    period: 'Tháng 09/2025',
    payDate: '-',
    base: 0,
    bonusPenalty: -200000,
    actualPay: -200000,
    status: 'unpaid'
  }
];

const mockAdjustments = [
  {
    id: '1',
    date: '22/12/2025',
    type: 'add',
    role: 'Thu ngân',
    amount: 50000,
    status: 'pending'
  },
  {
    id: '2',
    date: '22/12/2025',
    type: 'deduct',
    role: 'Bếp nóng',
    amount: 20000,
    status: 'cancelled'
  },
  {
    id: '3',
    date: '8/9',
    type: 'add',
    role: 'Bếp nóng',
    amount: 20000,
    status: 'paid'
  }
];

const deactivationReasons = [
  'Nhân viên xin nghỉ việc',
  'Kết thúc hợp đồng',
  'Cắt giảm nhân sự',
  'Không đạt yêu cầu công việc',
  'Vi phạm nội quy nghiêm trọng',
  'Vi phạm thời gian làm việc nhiều lần',
  'Gian lận, thiếu trung thực',
  'Thỏa thuận hai bên',
  'Lý do cá nhân',
  'Sức khoẻ không đáp ứng công việc',
  'Khác'
];

// --- COMPONENTS ---

// 1. CCCD Modal Component
function CCCDModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Chi tiết CCCD</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto bg-gray-50 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <span className="text-sm font-medium text-gray-500 block">Mặt trước</span>
              <div className="aspect-[1.58/1] bg-gray-200 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <span>[Ảnh mặt trước CCCD]</span>
                </div>
                <img 
                  src="https://placehold.co/400x250/png" 
                  alt="Mặt trước CCCD" 
                  className="w-full h-full object-cover opacity-0 group-hover:opacity-10 transition-opacity" 
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <span className="text-sm font-medium text-gray-500 block">Mặt sau</span>
              <div className="aspect-[1.58/1] bg-gray-200 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden group">
                 <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <span>[Ảnh mặt sau CCCD]</span>
                </div>
                <img 
                  src="https://placehold.co/400x250/png" 
                  alt="Mặt sau CCCD" 
                  className="w-full h-full object-cover opacity-0 group-hover:opacity-10 transition-opacity" 
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Thông tin trích xuất</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Số CCCD:</span>
                <span className="ml-2 text-gray-900 font-medium">001234567890</span>
              </div>
              <div>
                <span className="text-gray-500">Họ và tên:</span>
                <span className="ml-2 text-gray-900 font-medium">NGUYỄN VĂN A</span>
              </div>
              <div>
                <span className="text-gray-500">Ngày sinh:</span>
                <span className="ml-2 text-gray-900 font-medium">12/05/1995</span>
              </div>
              <div>
                <span className="text-gray-500">Ngày cấp:</span>
                <span className="ml-2 text-gray-900 font-medium">10/10/2021</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. SalaryHistory Component
function SalaryHistory({ employee }) {
  const [activeRoleTab, setActiveRoleTab] = useState('cashier-monthly');
  const [year, setYear] = useState('2025');
  const [allowances, setAllowances] = useState(mockAllowancesData);
  
  const [isAddingAllowance, setIsAddingAllowance] = useState(false);
  const [newAllowanceData, setNewAllowanceData] = useState({
    name: '', type: 'ngày', condition: '', amount: 0, isActive: true
  });

  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
  };

  const getStatusBadge = (status) => {
    const styles = {
      paid: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      unpaid: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    const labels = {
      paid: 'Đã trả',
      pending: 'Chưa trả',
      unpaid: 'Chưa trả',
      cancelled: 'Đã hủy'
    };
    return (
      <span className={`px-3 py-1 rounded text-xs ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const handleAddNew = () => {
    if (!newAllowanceData.name || !newAllowanceData.amount) {
      alert('Vui lòng điền tên và số tiền phụ cấp');
      return;
    }
    const newItem = {
      id: Date.now().toString(),
      ...newAllowanceData,
      amount: Number(newAllowanceData.amount)
    };
    setAllowances([...allowances, newItem]);
    setIsAddingAllowance(false);
    setNewAllowanceData({ name: '', type: 'ngày', condition: '', amount: 0, isActive: true });
  };

  const startEdit = (allowance) => {
    setEditingId(allowance.id);
    setEditFormData({ ...allowance });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const saveEdit = () => {
    setAllowances(prev => prev.map(a => 
      a.id === editingId ? { ...editFormData, amount: Number(editFormData.amount) } : a
    ));
    setEditingId(null);
    setEditFormData({});
  };

  const handleDeleteAllowance = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phụ cấp này?')) {
      setAllowances(allowances.filter((a) => a.id !== id));
    }
  };

  const toggleAllowanceStatus = (id) => {
    setAllowances(allowances.map(a => 
      a.id === id ? { ...a, isActive: !a.isActive } : a
    ));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-gray-900 mb-4">Phân công vai trò</h2>

        <div className="flex gap-2 mb-6 flex-wrap">
          <button onClick={() => setActiveRoleTab('kitchen')} className={`px-4 py-2 rounded-lg text-sm transition-colors ${activeRoleTab === 'kitchen' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Bếp nóng</button>
          <button onClick={() => setActiveRoleTab('salad')} className={`px-4 py-2 rounded-lg text-sm transition-colors ${activeRoleTab === 'salad' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Bếp Salad</button>
          <button onClick={() => setActiveRoleTab('host')} className={`px-4 py-2 rounded-lg text-sm transition-colors ${activeRoleTab === 'host' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Host</button>
          <button onClick={() => setActiveRoleTab('mod')} className={`px-4 py-2 rounded-lg text-sm transition-colors ${activeRoleTab === 'mod' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>MOD</button>
          <button onClick={() => setActiveRoleTab('cashier')} className={`px-4 py-2 rounded-lg text-sm transition-colors ${activeRoleTab === 'cashier' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>NV Phục vụ</button>
          <button onClick={() => setActiveRoleTab('cashier-monthly')} className={`px-4 py-2 rounded-lg text-sm transition-colors ${activeRoleTab === 'cashier-monthly' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Thu ngân</button>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-gray-600">Vai trò hiện tại</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Loại lương</label>
              <input type="text" value="Thu ngân" readOnly className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Chọn...</label>
              <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"><option>Chọn...</option></select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Mức lương</label>
              <input type="text" value="50000" readOnly className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Ngày có hiệu lực</label>
              <input type="date" value="2025-12-22" readOnly className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-900">Phụ cấp</h2>
          <button onClick={() => setIsAddingAllowance(true)} className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm">
            <Plus className="w-4 h-4" /> Thêm phụ cấp
          </button>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm text-gray-600 w-1/4">Tên</th>
                <th className="px-4 py-3 text-left text-sm text-gray-600 w-1/6">Loại</th>
                <th className="px-4 py-3 text-left text-sm text-gray-600 w-1/4">Điều kiện</th>
                <th className="px-4 py-3 text-left text-sm text-gray-600 w-1/6">Mức phụ cấp</th>
                <th className="px-4 py-3 text-center text-sm text-gray-600 w-1/6">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {allowances.map((allowance) => {
                const isEditing = editingId === allowance.id;
                if (isEditing) {
                  return (
                    <tr key={allowance.id} className="bg-blue-50 border-b border-blue-100">
                      <td className="px-4 py-3"><input type="text" className="w-full px-2 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:border-blue-500" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} /></td>
                      <td className="px-4 py-3"><select className="w-full px-2 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:border-blue-500" value={editFormData.type} onChange={(e) => setEditFormData({...editFormData, type: e.target.value})}><option value="ngày">ngày</option><option value="tháng">tháng</option></select></td>
                      <td className="px-4 py-3"><input type="text" className="w-full px-2 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:border-blue-500" value={editFormData.condition} onChange={(e) => setEditFormData({...editFormData, condition: e.target.value})} /></td>
                      <td className="px-4 py-3"><input type="number" className="w-full px-2 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:border-blue-500" value={editFormData.amount} onChange={(e) => setEditFormData({...editFormData, amount: e.target.value})} /></td>
                      <td className="px-4 py-3"><div className="flex items-center justify-center gap-2"><button onClick={saveEdit} className="p-1 bg-green-500 text-white rounded hover:bg-green-600" title="Lưu"><Save className="w-4 h-4" /></button><button onClick={cancelEdit} className="p-1 bg-gray-400 text-white rounded hover:bg-gray-500" title="Hủy"><XCircle className="w-4 h-4" /></button></div></td>
                    </tr>
                  );
                }
                return (
                  <tr key={allowance.id} className={`border-b border-gray-100 hover:bg-gray-50 ${!allowance.isActive ? 'bg-gray-50 opacity-60' : ''}`}>
                    <td className="px-4 py-3 text-sm font-medium">{allowance.name}</td>
                    <td className="px-4 py-3 text-sm"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs border border-blue-100">{allowance.type}</span></td>
                    <td className="px-4 py-3 text-sm text-gray-600">{allowance.condition}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(allowance.amount)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => toggleAllowanceStatus(allowance.id)} className={`transition-colors ${allowance.isActive ? 'text-green-500' : 'text-gray-400'}`} title={allowance.isActive ? "Đang hoạt động (Nhấn để tắt)" : "Đã tắt (Nhấn để bật)"}>{allowance.isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}</button>
                        <div className="h-4 w-px bg-gray-300"></div>
                        <button onClick={() => startEdit(allowance)} className="p-1 hover:bg-gray-200 rounded transition-colors text-blue-600" title="Sửa"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteAllowance(allowance.id)} className="p-1 hover:bg-gray-200 rounded transition-colors text-red-500" title="Xóa"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {isAddingAllowance && (
                <tr className="bg-orange-50 border-b border-orange-100">
                  <td className="px-4 py-3"><input type="text" placeholder="Tên phụ cấp" value={newAllowanceData.name} onChange={(e) => setNewAllowanceData({ ...newAllowanceData, name: e.target.value })} className="w-full px-2 py-1 border border-orange-200 rounded text-sm focus:outline-none focus:border-orange-500" autoFocus /></td>
                  <td className="px-4 py-3"><select value={newAllowanceData.type} onChange={(e) => setNewAllowanceData({ ...newAllowanceData, type: e.target.value })} className="w-full px-2 py-1 border border-orange-200 rounded text-sm focus:outline-none focus:border-orange-500"><option value="ngày">ngày</option><option value="tháng">tháng</option></select></td>
                  <td className="px-4 py-3"><input type="text" placeholder="Điều kiện" value={newAllowanceData.condition} onChange={(e) => setNewAllowanceData({ ...newAllowanceData, condition: e.target.value })} className="w-full px-2 py-1 border border-orange-200 rounded text-sm focus:outline-none focus:border-orange-500" /></td>
                  <td className="px-4 py-3"><input type="number" placeholder="Số tiền" value={newAllowanceData.amount || ''} onChange={(e) => setNewAllowanceData({ ...newAllowanceData, amount: e.target.value })} className="w-full px-2 py-1 border border-orange-200 rounded text-sm focus:outline-none focus:border-orange-500" /></td>
                  <td className="px-4 py-3"><div className="flex items-center justify-center gap-2"><button onClick={handleAddNew} className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs font-medium">Thêm</button><button onClick={() => setIsAddingAllowance(false)} className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded text-xs font-medium">Hủy</button></div></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-900">Kỳ lương gần đây</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{year}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs text-gray-600">KỲ LƯƠNG</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">NGÀY TRẢ</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">CƠ BẢN</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">THƯỞNG/PHẠT</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">THỰC NHẬN</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody>
              {mockSalaryPeriods.map((period) => (
                <tr key={period.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{period.period}</td>
                  <td className="px-4 py-3 text-sm">{period.payDate}</td>
                  <td className="px-4 py-3 text-sm">{formatCurrency(period.base)}</td>
                  <td className={`px-4 py-3 text-sm ${period.bonusPenalty > 0 ? 'text-green-600' : period.bonusPenalty < 0 ? 'text-red-600' : ''}`}>{period.bonusPenalty > 0 && '+'}{formatCurrency(period.bonusPenalty)}</td>
                  <td className="px-4 py-3 text-sm">{formatCurrency(period.actualPay)}</td>
                  <td className="px-4 py-3">{getStatusBadge(period.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-gray-900 mb-1">Lịch sử điều chỉnh lương & Vai trò</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockAdjustments.map((adjustment) => (
            <div key={adjustment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2 py-1 rounded text-xs ${adjustment.type === 'add' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{adjustment.type === 'add' ? 'PHÂN CÔNG MỚI' : 'KẾT THÚC VAI TRÒ'}</span>
                <span className="text-xs text-gray-500">{adjustment.date}</span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-gray-500 mb-1">VAI TRÒ</div>
                  <div className="text-sm">{adjustment.role}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">MỨC LƯƠNG</div>
                  <div className={`${adjustment.type === 'add' ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(adjustment.amount)}<span className="text-gray-500 text-xs ml-1">{adjustment.status === 'pending' ? 'tháng' : 'lần'}</span></div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Hiệu lực từ</div>
                  <div className="text-sm text-orange-600">{adjustment.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 3. AddEmployeeModal Component
const employeeTypes = ['Nhân viên', 'Quản lý', 'Thực tập'];
const baseOptions = ['Cơ sở 1', 'Cơ sở 2', 'Văn phòng chính'];
const roleOptions = ['Bếp nóng', 'Bếp Salad', 'Thu ngân', 'NV Phục vụ'];

function AddEmployeeModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Nhân viên',
    dob: '',
    startDate: '', // Khởi tạo startDate
    base: 'Cơ sở 1',
    roles: []
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    onAdd(formData);
    onClose();
  };

  const handleRoleToggle = (role) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role) ? prev.roles.filter(r => r !== role) : [...prev.roles, role]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-gray-900 text-lg font-semibold">Thêm nhân viên mới</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Thông tin cá nhân</h3>
            <div>
              <label className="block text-gray-700 mb-1.5 text-sm font-medium">Họ và tên <span className="text-red-500">*</span></label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1.5 text-sm font-medium">Email <span className="text-red-500">*</span></label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-gray-700 mb-1.5 text-sm font-medium">Số điện thoại</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
              </div>
            </div>
             <div>
              <label className="block text-gray-700 mb-1.5 text-sm font-medium">Ngày sinh</label>
              <input type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                <label className="block text-gray-700 mb-1.5 text-sm font-medium">Cơ sở</label>
                <select value={formData.base} onChange={(e) => setFormData({...formData, base: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg">
                  {baseOptions.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1.5 text-sm font-medium">Loại nhân viên</label>
                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg">
                  {employeeTypes.map((type) => (<option key={type} value={type}>{type}</option>))}
                </select>
              </div>
            </div>
            
            {/* Thêm ô Ngày bắt đầu làm việc */}
            <div>
              <label className="block text-gray-700 mb-1.5 text-sm font-medium">Ngày bắt đầu làm việc</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={formData.startDate} 
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                />
              </div>
            </div>

             <div>
                <label className="block text-gray-700 mb-1.5 text-sm font-medium">Vai trò chính</label>
                <div className="flex flex-wrap gap-2">
                  {roleOptions.map(r => (
                    <button key={r} onClick={() => handleRoleToggle(r)} className={`px-3 py-1 rounded text-sm border ${formData.roles.includes(r) ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-300'}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 sticky bottom-0 bg-white">
          <button onClick={onClose} className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700">Hủy</button>
          <button onClick={handleSubmit} className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium shadow-sm">Thêm nhân viên</button>
        </div>
      </div>
    </div>
  );
}

// 4. DeactivateEmployeeModal Component
function DeactivateEmployeeModal({ employee, onClose, onDeactivate }) {
  const [date, setDate] = useState(employee.deactivationDate || '');
  const [reason, setReason] = useState(employee.deactivationReason || '');
  const [note, setNote] = useState(employee.deactivationNote || '');

  const handleSubmit = () => {
    if (!date || !reason) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    onDeactivate(employee.id, date, reason, note);
    onClose();
  };

  const isEditing = employee.status === 'inactive' || (employee.deactivationDate && new Date(employee.deactivationDate) > new Date());

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-gray-900 text-lg font-semibold">{isEditing ? 'Cập nhật thông tin nghỉ việc' : 'Vô hiệu hóa nhân viên'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Ngày nghỉ việc <span className="text-red-500">*</span></label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">Lý do <span className="text-red-500">*</span></label>
            <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="">Chọn lý do</option>
              {deactivationReasons.map((r) => (<option key={r} value={r}>{r}</option>))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">Ghi chú (nếu có)</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Nhập ghi chú..." rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">ℹ️ Nếu chưa đến ngày nghỉ việc, tài khoản nhân viên sẽ chưa bị vô hiệu hóa ngay.</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Hủy</button>
          <button onClick={handleSubmit} className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">{isEditing ? 'Cập nhật' : 'Vô hiệu hóa'}</button>
        </div>
      </div>
    </div>
  );
}

// 5. ReactivateEmployeeModal (NEW)
function ReactivateEmployeeModal({ employee, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Kích hoạt lại nhân viên</h2>
        <p className="text-gray-600 mb-6">
          Bạn có chắc chắn muốn kích hoạt lại nhân viên <span className="font-bold text-gray-900">{employee.name}</span> không?
          <br/>
          Trạng thái nhân viên sẽ chuyển về <span className="text-green-600 font-medium">Hoạt động</span>.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Hủy</button>
          <button onClick={() => onConfirm(employee.id)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">Kích hoạt lại</button>
        </div>
      </div>
    </div>
  );
}

// 6. EmployeeDetail Component
function EmployeeDetail({ employee, onClose, onUpdate, onAddEmployee }) {
  const [activeTab, setActiveTab] = useState('personal');
  const [editedEmployee, setEditedEmployee] = useState(employee);
  const [showCCCDModal, setShowCCCDModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const baseOptions = ['Cơ sở 1', 'Cơ sở 2', 'Văn phòng chính'];

  const handleSave = () => {
    onUpdate(editedEmployee);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-orange-500" />
                <h2 className="text-gray-900 text-lg font-medium">Thông tin cá nhân</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Họ và tên</label>
                  <input type="text" value={editedEmployee.name} onChange={(e) => setEditedEmployee({ ...editedEmployee, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Email</label>
                    <input type="email" value={editedEmployee.email} onChange={(e) => setEditedEmployee({ ...editedEmployee, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Di động</label>
                    <input type="tel" value={editedEmployee.phone || ''} onChange={(e) => setEditedEmployee({ ...editedEmployee, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Cơ sở làm việc</label>
                    <select value={editedEmployee.base} onChange={(e) => setEditedEmployee({...editedEmployee, base: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                      {baseOptions.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                   <div>
                    <label className="block text-gray-700 mb-2 font-medium">CCCD</label>
                    <div className="flex items-center gap-2">
                       <input type="text" value={editedEmployee.cccd || ''} onChange={(e) => setEditedEmployee({ ...editedEmployee, cccd: e.target.value })} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium tracking-wide" placeholder="Số CCCD" />
                      <button onClick={() => setShowCCCDModal(true)} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-200 text-sm font-medium transition-colors flex-shrink-0">Xem ảnh</button>
                    </div>
                  </div>
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                    <label className="block text-gray-700 mb-2 font-medium">Ngày sinh</label>
                    <input type="date" value={editedEmployee.dob || ''} onChange={(e) => setEditedEmployee({ ...editedEmployee, dob: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Ngày bắt đầu làm việc</label>
                    <input type="date" value={editedEmployee.startDate || ''} onChange={(e) => setEditedEmployee({ ...editedEmployee, startDate: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Địa chỉ</label>
                  <input type="text" value={editedEmployee.address || ''} onChange={(e) => setEditedEmployee({ ...editedEmployee, address: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-red-500 text-lg">📞</span>
                </div>
                <h2 className="text-gray-900 text-lg font-medium">Liên hệ khẩn cấp</h2>
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Tên liên hệ</label>
                  <input type="text" value={editedEmployee.emergencyContactName || ''} onChange={(e) => setEditedEmployee({...editedEmployee, emergencyContactName: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Số liên hệ</label>
                  <input type="tel" value={editedEmployee.emergencyContactPhone || ''} onChange={(e) => setEditedEmployee({...editedEmployee, emergencyContactPhone: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'salary':
        return <SalaryHistory employee={employee} />;

      case 'permissions':
        return (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-orange-500" />
              <h2 className="text-gray-900 text-lg font-medium">Phân quyền</h2>
            </div>
            <p className="text-gray-500">Nội dung phân quyền sẽ được cập nhật</p>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-gray-900 text-2xl font-bold">Quản lý nhân viên</h1>
          <button onClick={() => setShowAddModal(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
            <span className="text-xl">+</span>
            <span className="hidden md:inline">Thêm nhân viên</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-xl">{employee.avatar}</div>
                <div className="min-w-0">
                  <div className="text-gray-900 font-medium truncate">{employee.name}</div>
                  <div className="text-sm text-gray-500 truncate">{employee.email}</div>
                   <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                     <MapPin className="w-3 h-3" />
                     {employee.base}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button onClick={() => setActiveTab('personal')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'personal' ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <User className="w-5 h-5" /> <span>Thông tin cá nhân</span>{activeTab === 'personal' && <div className="ml-auto w-2 h-2 bg-orange-500 rounded-full" />}
                </button>
                <button onClick={() => setActiveTab('salary')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'salary' ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <CreditCard className="w-5 h-5" /> <span>Lịch sử lương</span>{activeTab === 'salary' && <div className="ml-auto w-2 h-2 bg-orange-500 rounded-full" />}
                </button>
                <button onClick={() => setActiveTab('permissions')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'permissions' ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <Shield className="w-5 h-5" /> <span>Phân quyền</span>
                </button>
              </div>
            </div>
            <button onClick={onClose} className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 py-3 bg-white border border-gray-200 rounded-lg lg:bg-transparent lg:border-0"><ArrowLeft className="w-4 h-4" /> <span>Quay lại danh sách</span></button>
          </div>

          <div className="space-y-4">
            {employee.status === 'inactive' && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm animate-in fade-in slide-in-from-top-2">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-red-800">Nhân viên này đã nghỉ việc</h3>
                    <div className="mt-1 text-sm text-red-700 space-y-1">
                      <p><span className="font-medium">Ngày nghỉ:</span> {employee.deactivationDate}</p>
                      <p><span className="font-medium">Lý do:</span> {employee.deactivationReason}</p>
                      {employee.deactivationNote && <p><span className="font-medium">Ghi chú:</span> {employee.deactivationNote}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {employee.status === 'active' && employee.deactivationDate && new Date(employee.deactivationDate) > new Date() && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg shadow-sm animate-in fade-in slide-in-from-top-2">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-yellow-800">Nhân viên dự kiến nghỉ việc</h3>
                    <div className="mt-1 text-sm text-yellow-700 space-y-1">
                      <p><span className="font-medium">Ngày nghỉ dự kiến:</span> {employee.deactivationDate}</p>
                      <p><span className="font-medium">Lý do:</span> {employee.deactivationReason}</p>
                      {employee.deactivationNote && <p><span className="font-medium">Ghi chú:</span> {employee.deactivationNote}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg p-4 md:p-8 shadow-sm border border-gray-100">
              {renderTabContent()}
              {activeTab === 'personal' && (
                <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                  <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Đóng</button>
                  <button onClick={handleSave} className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">Lưu thay đổi</button>
                </div>
              )}
              {activeTab === 'salary' && (
                <div className="flex items-center justify-end mt-8">
                  <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">Lưu thay đổi</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showAddModal && <AddEmployeeModal onClose={() => setShowAddModal(false)} onAdd={onAddEmployee} />}
      {showCCCDModal && <CCCDModal onClose={() => setShowCCCDModal(false)} />}
    </div>
  );
}

// 7. EmployeeList Component (UPDATED with Tabs and Reactivate Modal)
function EmployeeList({
  employees,
  searchTerm,
  onSearchChange,
  onSelectEmployee,
  onDeactivateEmployee,
  onReactivateEmployee, 
  onAddEmployee,
  filterBase,
  onFilterBaseChange,
  filterPosition,
  onFilterPositionChange,
  bases,
  positions
}) {
  const [deactivatingEmployee, setDeactivatingEmployee] = useState(null);
  const [reactivatingEmployee, setReactivatingEmployee] = useState(null); // New state for reactivation modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeMenuEmployeeId, setActiveMenuEmployeeId] = useState(null);
  const menuRef = useRef(null);

  // --- TAB STATE ---
  const [viewTab, setViewTab] = useState('current'); // 'current' | 'former'
  const [filterReason, setFilterReason] = useState('all'); // Inactive specific filter
  const [filterMonth, setFilterMonth] = useState(''); // Inactive specific filter (YYYY-MM)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuEmployeeId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const getStatusColor = (employee) => {
    if (employee.status === 'inactive') return 'bg-red-100 text-red-700';
    if (employee.deactivationDate && new Date(employee.deactivationDate) > new Date()) {
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    }
    return 'bg-green-100 text-green-700';
  };

  const getStatusText = (employee) => {
    if (employee.status === 'inactive') return 'Đã nghỉ việc';
    if (employee.deactivationDate && new Date(employee.deactivationDate) > new Date()) {
      return 'Sắp nghỉ việc';
    }
    return 'Hoạt động';
  };

  const handleToggleMenu = (e, employeeId) => {
    e.stopPropagation();
    setActiveMenuEmployeeId(activeMenuEmployeeId === employeeId ? null : employeeId);
  };

  // Filter Logic based on Tab
  const filteredEmployeesByTab = employees.filter(emp => {
    // 1. Filter by Tab
    if (viewTab === 'current') {
      if (emp.status === 'inactive') return false;
    } else { // 'former'
      if (emp.status !== 'inactive') return false;
    }

    // 2. Filter by Inactive Specifics (only for 'former' tab)
    if (viewTab === 'former') {
      if (filterReason !== 'all' && emp.deactivationReason !== filterReason) return false;
      if (filterMonth && emp.deactivationDate) {
        // Compare YYYY-MM
        if (!emp.deactivationDate.startsWith(filterMonth)) return false;
      }
    }

    return true; // Search/Base/Position filtering is handled in parent App component passed via props, but we need to re-apply if we want complete isolation or rely on parent. 
    // Currently parent filters by search/base/pos. So `employees` prop is ALREADY filtered by those.
    // We just add the tab layer on top.
  });

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-gray-900 text-2xl font-bold">Quản lý nhân viên</h1>
        <button onClick={() => setShowAddModal(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
          <span className="text-xl">+</span>
          <span className="hidden md:inline">Thêm nhân viên</span>
        </button>
      </div>

      {/* --- TABS --- */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button 
          onClick={() => setViewTab('current')} 
          className={`pb-3 px-2 text-sm font-medium transition-colors border-b-2 ${viewTab === 'current' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Đang làm việc
        </button>
        <button 
          onClick={() => setViewTab('former')} 
          className={`pb-3 px-2 text-sm font-medium transition-colors border-b-2 ${viewTab === 'former' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Đã nghỉ việc
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 flex-wrap">
        {/* Search - Always Visible */}
        <div className="flex-1 relative min-w-[250px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Tìm kiếm theo tên, email, sđt..." value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        
        {/* Filters for 'current' tab */}
        {viewTab === 'current' && (
          <>
            <div className="relative min-w-[180px]">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"><MapPin className="w-4 h-4" /></div>
              <select value={filterBase} onChange={(e) => onFilterBaseChange(e.target.value)} className="w-full pl-9 pr-8 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white appearance-none cursor-pointer">
                <option value="all">Tất cả cơ sở</option>
                {bases.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative min-w-[180px]">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"><Briefcase className="w-4 h-4" /></div>
              <select value={filterPosition} onChange={(e) => onFilterPositionChange(e.target.value)} className="w-full pl-9 pr-8 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white appearance-none cursor-pointer">
                <option value="all">Tất cả vị trí</option>
                {positions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </>
        )}

        {/* Filters for 'former' tab */}
        {viewTab === 'former' && (
          <>
            <div className="relative min-w-[180px]">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"><Filter className="w-4 h-4" /></div>
              <select value={filterReason} onChange={(e) => setFilterReason(e.target.value)} className="w-full pl-9 pr-8 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white appearance-none cursor-pointer">
                <option value="all">Tất cả lý do</option>
                {deactivationReasons.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative min-w-[180px]">
              <input 
                type="month" 
                value={filterMonth} 
                onChange={(e) => setFilterMonth(e.target.value)} 
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              />
            </div>
          </>
        )}
      </div>

      <div className="space-y-3">
        {filteredEmployeesByTab.length === 0 ? (
          <div className="text-center py-10 text-gray-500">Không tìm thấy nhân viên nào phù hợp.</div>
        ) : (
          filteredEmployeesByTab.map((employee) => (
            <div key={employee.id} className="bg-white rounded-lg p-5 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-100 relative group" onClick={() => onSelectEmployee(employee)}>
              <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 text-xl font-bold">{employee.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                  <span className="text-orange-500 font-medium">{employee.name}</span>
                  <span className={`px-3 py-1 rounded text-xs font-medium ${getStatusColor(employee)}`}>{getStatusText(employee)}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-sm mb-1 truncate">
                  <span>✉</span>
                  <span className="truncate">{employee.email}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-sm mb-1 truncate">
                   <MapPin className="w-3.5 h-3.5" />
                   <span className="truncate">{employee.base}</span>
                </div>
                {(employee.department || employee.position) && (
                  <div className="flex items-center gap-1 text-gray-500 text-sm truncate">
                    <span>👥</span>
                    <span className="truncate">
                      {employee.department}
                      {employee.department && employee.position && ', '}
                      {employee.position}
                    </span>
                  </div>
                )}
                {/* Show deactivation reason/date in former tab */}
                {viewTab === 'former' && (
                  <div className="text-xs text-red-600 mt-1">
                    <p> Đã nghỉ: {employee.deactivationDate} </p>
                    <p> Lý do: {employee.deactivationReason} </p>
                  </div>
                )}
              </div>

              <div className="relative" ref={activeMenuEmployeeId === employee.id ? menuRef : null}>
                <button onClick={(e) => handleToggleMenu(e, employee.id)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
                
                {activeMenuEmployeeId === employee.id && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    <button onClick={(e) => { e.stopPropagation(); onSelectEmployee(employee); setActiveMenuEmployeeId(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Eye className="w-4 h-4" /> Xem chi tiết</button>
                    
                    {/* Logic menu items based on status */}
                    {viewTab === 'current' && (
                      employee.deactivationDate && new Date(employee.deactivationDate) > new Date() ? (
                        <>
                          <button onClick={(e) => { e.stopPropagation(); setDeactivatingEmployee(employee); setActiveMenuEmployeeId(null); }} className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2"><FileEdit className="w-4 h-4" /> Sửa thông tin nghỉ</button>
                          <button onClick={(e) => { e.stopPropagation(); setReactivatingEmployee(employee); setActiveMenuEmployeeId(null); }} className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Hủy lịch nghỉ</button>
                        </>
                      ) : (
                        <button onClick={(e) => { e.stopPropagation(); setDeactivatingEmployee(employee); setActiveMenuEmployeeId(null); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Vô hiệu hóa</button>
                      )
                    )}

                    {viewTab === 'former' && (
                      <button onClick={(e) => { e.stopPropagation(); setReactivatingEmployee(employee); setActiveMenuEmployeeId(null); }} className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Kích hoạt lại</button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center justify-between mt-6 text-sm text-gray-600">
        <span>Hiển thị {filteredEmployeesByTab.length} nhân viên</span>
        <div className="flex gap-2">
          <button className="px-4 py-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50">Trước</button>
          <button className="px-4 py-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50">Sau</button>
        </div>
      </div>

      {deactivatingEmployee && <DeactivateEmployeeModal employee={deactivatingEmployee} onClose={() => setDeactivatingEmployee(null)} onDeactivate={onDeactivateEmployee} />}
      {reactivatingEmployee && <ReactivateEmployeeModal employee={reactivatingEmployee} onClose={() => setReactivatingEmployee(null)} onConfirm={(id) => { onReactivateEmployee(id); setReactivatingEmployee(null); }} />}
      {showAddModal && <AddEmployeeModal onClose={() => setShowAddModal(false)} onAdd={onAddEmployee} />}
    </div>
  );
}

// 8. MAIN APP COMPONENT
export default function App() {
  const [employees, setEmployees] = useState(mockEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBase, setFilterBase] = useState('all');
  const [filterPosition, setFilterPosition] = useState('all');

  const uniqueBases = useMemo(() => Array.from(new Set(employees.map(e => e.base))).filter(Boolean).sort(), [employees]);
  const uniquePositions = useMemo(() => Array.from(new Set(employees.map(e => e.position))).filter(Boolean).sort(), [employees]);
  
  const handleSelectEmployee = (employee) => setSelectedEmployee(employee);
  const handleCloseDetail = () => setSelectedEmployee(null);
  const handleUpdateEmployee = (updatedEmployee) => {
    setEmployees(prev => prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp));
    setSelectedEmployee(updatedEmployee);
  };

  const handleDeactivateEmployee = (id, date, reason, note) => {
    const shouldDeactivate = new Date(date) <= new Date();
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, status: shouldDeactivate ? 'inactive' : emp.status, deactivationDate: date, deactivationReason: reason, deactivationNote: note } : emp));
    if (selectedEmployee?.id === id) {
      setSelectedEmployee(prev => prev ? { ...prev, status: shouldDeactivate ? 'inactive' : prev.status, deactivationDate: date, deactivationReason: reason, deactivationNote: note } : null);
    }
  };

  const handleReactivateEmployee = (id) => {
      setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, status: 'active', deactivationDate: undefined, deactivationReason: undefined, deactivationNote: undefined } : emp));
      if (selectedEmployee?.id === id) {
        setSelectedEmployee(prev => prev ? { ...prev, status: 'active', deactivationDate: undefined, deactivationReason: undefined, deactivationNote: undefined } : null);
      }
  };

  const handleAddEmployee = (data) => {
    const newEmployee = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      dob: data.dob,
      base: data.base,
      department: data.roles[0] || '',
      position: data.roles[1] || data.roles[0] || '',
      status: 'active',
      avatar: data.name.charAt(0).toUpperCase(),
      startDate: data.startDate // Lưu startDate
    };
    setEmployees(prev => [newEmployee, ...prev]);
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || emp.email.toLowerCase().includes(searchTerm.toLowerCase()) || (emp.phone && emp.phone.includes(searchTerm));
    const matchesBase = filterBase === 'all' || emp.base === filterBase;
    const matchesPosition = filterPosition === 'all' || emp.position === filterPosition;
    return matchesSearch && matchesBase && matchesPosition;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {!selectedEmployee ? (
        <EmployeeList
          employees={filteredEmployees}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSelectEmployee={handleSelectEmployee}
          onDeactivateEmployee={handleDeactivateEmployee}
          onReactivateEmployee={handleReactivateEmployee}
          onAddEmployee={handleAddEmployee}
          filterBase={filterBase}
          onFilterBaseChange={setFilterBase}
          filterPosition={filterPosition}
          onFilterPositionChange={setFilterPosition}
          bases={uniqueBases}
          positions={uniquePositions}
        />
      ) : (
        <EmployeeDetail
          employee={selectedEmployee}
          onClose={handleCloseDetail}
          onUpdate={handleUpdateEmployee}
          onAddEmployee={handleAddEmployee}
        />
      )}
    </div>
  );
}
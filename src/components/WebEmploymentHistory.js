import React, { useState } from 'react';
import { 
  Briefcase, Clock, 
  History, CreditCard, X, CheckCircle, 
  Edit3, AlertCircle, Plus
} from 'lucide-react';

// --- HELPER FORMAT TIỀN ---
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// --- MOCK DATA (Cấu trúc mới: Đa vai trò, đa mức lương) ---

const CURRENT_INFO = {
  employeeId: "NV-001",
  name: "Hoàng Đức Tùng",
  type: "Toàn thời gian",
  department: "Bếp (Kitchen)",
  effectiveDate: "01/01/2025",
  // Mảng chứa các vai trò và lương riêng biệt
  roles: [
    { title: "Bếp trưởng", salary: 12000000, type: "Chính" },
    { title: "Quản lý kho", salary: 3000000, type: "Kiêm nhiệm" }
  ]
};

const SALARY_HISTORY = [
  { 
    id: 1, 
    changeDate: "01/01/2025",     
    effectiveDate: "01/01/2025",
    roles: [
        { title: "Bếp trưởng", salary: 12000000 },
        { title: "Quản lý kho", salary: 3000000 }
    ],
    note: "Thăng chức & Nhận thêm việc"
  },
  { 
    id: 2, 
    changeDate: "15/06/2024", 
    effectiveDate: "01/07/2024",
    roles: [
        { title: "Bếp phó", salary: 10000000 }
    ],
    note: "Tăng lương định kỳ"
  }
];

const PAYMENT_HISTORY = [
  { id: 1, time: "Tháng 10/2025", amount: 15500000, status: "Đã trả lương" }, // 15tr lương + 500k thưởng
  { id: 2, time: "Tháng 09/2025", amount: 15000000, status: "Đã trả lương" },
];

export default function WebEmploymentHistory() {
  const [showModal, setShowModal] = useState(false);

  // Tính tổng lương hiện tại
  const totalSalary = CURRENT_INFO.roles.reduce((sum, item) => sum + item.salary, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Lịch sử việc làm</h1>
            <p className="text-sm text-gray-500">Thông tin lương và hợp đồng nhân viên</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#F97316] text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors shadow-sm"
          >
            <Edit3 size={18} />
            Thay đổi lương/Vai trò
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* --- CỘT TRÁI --- */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* SECTION 1: CHI TIẾT LƯƠNG HIỆN TẠI */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-orange-50 px-5 py-3 border-b border-orange-100 flex items-center gap-2">
                <Briefcase size={18} className="text-[#F97316]"/>
                <h3 className="font-bold text-gray-800">Cấu trúc lương hiện tại</h3>
              </div>
              
              <div className="p-5 space-y-5">
                {/* Tổng lương */}
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Tổng thu nhập (Cơ bản)</p>
                  <p className="text-4xl font-extrabold text-[#F97316]">{formatCurrency(totalSalary)}</p>
                  <div className="flex justify-center items-center gap-1 mt-2 text-xs text-gray-500">
                     <Clock size={12}/> Hiệu lực từ: {CURRENT_INFO.effectiveDate}
                  </div>
                </div>

                <hr className="border-dashed border-gray-200"/>

                {/* Danh sách vai trò & Lương */}
                <div className="space-y-3">
                    <p className="text-xs font-bold text-gray-400 uppercase">Chi tiết theo vai trò</p>
                    {CURRENT_INFO.roles.map((role, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <div>
                                <p className="text-sm font-bold text-gray-800">{role.title}</p>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${role.type === 'Chính' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>
                                    {role.type}
                                </span>
                            </div>
                            <p className="text-sm font-bold text-gray-600">{formatCurrency(role.salary)}</p>
                        </div>
                    ))}
                </div>

                <div className="pt-2 space-y-2 text-sm border-t border-gray-100">
                   <div className="flex justify-between">
                      <span className="text-gray-500">Phân loại</span>
                      <span className="font-medium text-gray-800">{CURRENT_INFO.type}</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-gray-500">Bộ phận</span>
                      <span className="font-medium text-gray-800">{CURRENT_INFO.department}</span>
                   </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: LỊCH SỬ THAY ĐỔI */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
                <History size={18} className="text-[#F97316]"/>
                <h3 className="font-bold text-gray-800">Lịch sử thay đổi</h3>
              </div>
              
              <div className="relative border-l-2 border-gray-100 ml-3 space-y-8 pl-6 py-1">
                {SALARY_HISTORY.map((item, index) => {
                    // Tính tổng lương tại thời điểm lịch sử
                    const totalHistorySalary = item.roles.reduce((sum, r) => sum + r.salary, 0);
                    
                    return (
                      <div key={item.id} className="relative">
                        <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm ${index === 0 ? 'bg-[#F97316]' : 'bg-gray-300'}`}></div>
                        
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between items-center">
                             <span className="text-xs text-gray-400 font-medium">{item.changeDate}</span>
                             <span className={`text-sm font-bold ${index === 0 ? 'text-[#F97316]' : 'text-gray-600'}`}>
                                {formatCurrency(totalHistorySalary)}
                             </span>
                          </div>
                          
                          {/* List các role trong lịch sử */}
                          <div className="mt-1 space-y-1">
                             {item.roles.map((r, idx) => (
                                 <div key={idx} className="flex justify-between text-xs text-gray-700">
                                     <span>• {r.title}</span>
                                     <span className="text-gray-500">{formatCurrency(r.salary)}</span>
                                 </div>
                             ))}
                          </div>
                          
                          <div className="text-[11px] text-gray-400 italic mt-1 bg-gray-50 px-2 py-1 rounded w-fit">
                             {item.note}
                          </div>
                        </div>
                      </div>
                    );
                })}
              </div>
            </div>

          </div>

          {/* --- CỘT PHẢI: SECTION 3 (Giữ nguyên) --- */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <CreditCard size={18} className="text-[#F97316]"/> Lịch sử trả lương
                </h3>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">Thời gian</th>
                      <th className="px-6 py-4 font-semibold text-right">Tổng thực nhận</th>
                      <th className="px-6 py-4 font-semibold text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {PAYMENT_HISTORY.map((item) => (
                      <tr key={item.id} className="hover:bg-orange-50/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-800">
                            {item.time}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-[#F97316] text-base">
                            {item.amount > 0 ? formatCurrency(item.amount) : '---'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {item.status === 'Đã trả lương' ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                              <CheckCircle size={12} /> {item.status}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                              <AlertCircle size={12} /> {item.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- POPUP FORM THAY ĐỔI LƯƠNG (Cập nhật để thêm nhiều vai trò) --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold text-gray-800">Cập nhật lương & Vai trò</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20}/>
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto">
               
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hiệu lực</label>
                  <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#F97316]"/>
               </div>

               {/* Khu vực thêm vai trò động */}
               <div>
                  <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Danh sách vai trò</label>
                      <button className="text-xs flex items-center gap-1 text-[#F97316] font-bold hover:underline">
                          <Plus size={14}/> Thêm vai trò
                      </button>
                  </div>
                  
                  {/* Mô phỏng dòng 1: Vai trò chính */}
                  <div className="flex gap-2 mb-2">
                      <input type="text" value="Bếp trưởng" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50" readOnly/>
                      <input type="number" value="12000000" className="w-1/3 border border-gray-300 rounded-lg px-3 py-2 text-sm text-right font-bold text-gray-700"/>
                  </div>
                  
                  {/* Mô phỏng dòng 2: Vai trò phụ */}
                  <div className="flex gap-2">
                      <input type="text" placeholder="Tên vai trò..." className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#F97316] outline-none"/>
                      <input type="number" placeholder="Mức lương..." className="w-1/3 border border-gray-300 rounded-lg px-3 py-2 text-sm text-right focus:border-[#F97316] outline-none"/>
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                  <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#F97316] text-sm" rows={2} placeholder="Lý do thay đổi..."></textarea>
               </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 shrink-0 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200">
                Hủy
              </button>
              <button className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-[#F97316] hover:bg-orange-600">
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
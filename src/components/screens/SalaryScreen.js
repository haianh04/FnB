import React, { useState, useMemo } from 'react';
import { ArrowLeft, ChevronRight, ChevronLeft, Clock, MapPin, ChevronDown, TrendingUp, AlertCircle, Gift } from 'lucide-react';

// --- MOCK DATA ---

// 1. Thưởng Tháng (Tính nguyên tháng)
const CURRENT_MONTH_BONUS = {
    amount: 500000,
    reason: 'Thưởng doanh thu tháng 12'
};

// 2. Lịch sử trả lương
const SALARY_HISTORY = [
    { id: 1, month: 'Tháng 11/2025', date: '05/12/2025', total: 6850000, status: 'Chưa trả' },
    { id: 2, month: 'Tháng 10/2025', date: '05/11/2025', total: 6200000, status: 'Đã trả' },
    { id: 3, month: 'Tháng 09/2025', date: '05/10/2025', total: 5900000, status: 'Đã trả' },
    { id: 4, month: 'Tháng 08/2025', date: '05/09/2025', total: 6100000, status: 'Đã trả' },
    { id: 5, month: 'Tháng 07/2025', date: '05/08/2025', total: 5800000, status: 'Đã trả' },
];

// 3. Chi tiết chấm công (Kèm thông tin Phạt)
const SHIFT_DETAILS = [
    // Tuần 1
    { id: 101, date: '01/12/2025', day: 'T2', role: 'Phục vụ', location: 'CHÚ BI', rate: 25000, regHours: 4, otHours: 0, penalty: 0, week: 1 },
    { id: 102, date: '02/12/2025', day: 'T3', role: 'Pha chế', location: 'CHÚ BI', rate: 30000, regHours: 8, otHours: 2, penalty: 0, week: 1 },
    // Tuần 2
    { id: 103, date: '08/12/2025', day: 'T2', role: 'Phục vụ', location: 'CHÚ BI', rate: 25000, regHours: 4, otHours: 0, penalty: 50000, penaltyReason: 'Đi muộn 30p', week: 2 }, // Bị phạt
    // Tuần 4
    { id: 106, date: '24/12/2025', day: 'T4', role: 'Phục vụ', location: 'CHÚ BI', rate: 25000, regHours: 4, otHours: 0, penalty: 0, week: 4 },
    { id: 107, date: '25/12/2025', day: 'T5', role: 'Pha chế', location: 'CHÚ BI', rate: 30000, regHours: 5, otHours: 0, penalty: 0, week: 4 },
    { id: 108, date: '26/12/2025', day: 'T6', role: 'Pha chế', location: 'CHÚ BI', rate: 28000, regHours: 8, otHours: 2, penalty: 100000, penaltyReason: 'Về sớm không báo', week: 4 }, // Bị phạt
];

const ITEMS_PER_PAGE = 5;

// --- LOGIC TÍNH TOÁN ---

// Tính lương 1 ca: (Thường + OT) - Phạt
const calculateShiftPay = (shift) => {
    const regularPay = shift.regHours * shift.rate;
    const otPay = shift.otHours * shift.rate;
    return regularPay + otPay - (shift.penalty || 0);
};

const formatCurrency = (val) => val.toLocaleString('vi-VN');

export default function SalaryScreen({ onBack }) {
  const [view, setView] = useState('overview'); 
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(12);
  const [selectedWeek, setSelectedWeek] = useState('all'); 

  // --- LOGIC PHÂN TRANG ---
  const totalPages = Math.ceil(SALARY_HISTORY.length / ITEMS_PER_PAGE);
  const currentHistory = SALARY_HISTORY.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
  );

  // --- LOGIC LỌC & TỔNG HỢP ---
  const filteredShifts = useMemo(() => {
      if (selectedWeek === 'all') return SHIFT_DETAILS;
      return SHIFT_DETAILS.filter(s => s.week === parseInt(selectedWeek));
  }, [selectedWeek, selectedMonth]);

  // Tổng hợp cho View Chi tiết (Theo bộ lọc)
  const summaryDetail = useMemo(() => {
      return filteredShifts.reduce((acc, shift) => {
          acc.totalPay += calculateShiftPay(shift);
          acc.totalRegHours += shift.regHours;
          acc.totalOT += shift.otHours;
          acc.totalPenalty += (shift.penalty || 0);
          return acc;
      }, { totalPay: 0, totalRegHours: 0, totalOT: 0, totalPenalty: 0 });
  }, [filteredShifts]);

  // Tổng hợp cho View Tổng quan (Toàn bộ tháng)
  const summaryOverview = useMemo(() => {
      const shiftStats = SHIFT_DETAILS.reduce((acc, shift) => {
          acc.basePay += (shift.regHours + shift.otHours) * shift.rate;
          acc.totalRegHours += shift.regHours;
          acc.totalOT += shift.otHours;
          acc.totalPenalty += (shift.penalty || 0);
          return acc;
      }, { basePay: 0, totalRegHours: 0, totalOT: 0, totalPenalty: 0 });

      // Tổng thực nhận = Lương ca (đã trừ phạt) + Thưởng tháng
      // Lưu ý: Lương ca ở trên (basePay) chưa trừ phạt để hiển thị breakdown
      // Thực tế nhận = basePay - Penalty + Bonus
      const totalNet = shiftStats.basePay - shiftStats.totalPenalty + CURRENT_MONTH_BONUS.amount;

      return { ...shiftStats, totalNet };
  }, []);

  // --- HELPER UI ---
  const getRoleBadgeColor = (role) => {
      const r = role.toLowerCase();
      if(r.includes('phục vụ')) return 'text-[#E08C27] bg-orange-50 border-orange-100';
      if(r.includes('pha chế')) return 'text-blue-600 bg-blue-50 border-blue-100';
      return 'text-gray-600 bg-gray-50 border-gray-100';
  };

  // --- VIEW: CHI TIẾT (DETAIL) ---
  if (view === 'detail') {
      // Nếu chọn "Tất cả các tuần" thì cộng thêm thưởng tháng vào tổng, ngược lại chỉ hiện lương ca
      const displayTotal = selectedWeek === 'all' 
          ? summaryDetail.totalPay + CURRENT_MONTH_BONUS.amount 
          : summaryDetail.totalPay;

      return (
        <div className="flex flex-col h-full bg-[#F5F5F5] font-sans relative overflow-hidden">
            {/* Header Detail */}
            <div className="bg-white pt-12 pb-3 px-4 shadow-sm relative z-20 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <button onClick={() => setView('overview')} className="w-9 h-9 flex items-center justify-center -ml-1 hover:bg-gray-50 rounded-full transition-colors">
                        <ArrowLeft size={22} className="text-gray-800"/>
                    </button>
                    <h1 className="text-[17px] font-bold text-gray-900">Chi tiết lương</h1>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
                
                {/* 1. Filter Bar */}
                <div className="bg-white px-4 py-4 mb-4 border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm font-bold py-2.5 pl-3 pr-8 rounded-xl outline-none appearance-none focus:border-[#E08C27]">
                                <option value="12">Tháng 12/2025</option>
                                <option value="11">Tháng 11/2025</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"/>
                        </div>

                        <div className="relative flex-1">
                            <select value={selectedWeek} onChange={(e) => setSelectedWeek(e.target.value)} className="w-full bg-orange-50 border border-orange-200 text-[#E08C27] text-sm font-bold py-2.5 pl-3 pr-8 rounded-xl outline-none appearance-none focus:border-orange-300">
                                <option value="all">Tất cả các tuần</option>
                                <option value="1">Tuần 1</option>
                                <option value="2">Tuần 2</option>
                                <option value="3">Tuần 3</option>
                                <option value="4">Tuần 4</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#E08C27] pointer-events-none"/>
                        </div>
                    </div>
                </div>

                {/* 2. Total Card (Detail) */}
                <div className="mx-4 mb-6">
                    <div className="bg-gradient-to-br from-[#E08C27] to-[#D35400] rounded-[24px] p-6 text-white shadow-xl shadow-orange-200 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                        <div className="relative z-10">
                            <p className="text-xs font-medium opacity-90 mb-1 uppercase tracking-wider">Tổng lương</p>
                            <div className="flex items-baseline gap-1 mb-5">
                                <h2 className="text-4xl font-bold tracking-tight">{formatCurrency(displayTotal)}</h2>
                                <span className="text-xl font-medium"> đ</span>
                            </div>
                            
                            <div className="flex gap-2">
                                <div className="flex-1 bg-black/10 px-2 py-2 rounded-xl backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                                    <Clock size={16} className="text-white opacity-80"/>
                                    <div><p className="text-[9px] opacity-70">Giờ làm</p><p className="text-xs font-bold">{summaryDetail.totalRegHours}h</p></div>
                                </div>
                                <div className="flex-1 bg-black/10 px-2 py-2 rounded-xl backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                                    <TrendingUp size={16} className="text-white opacity-80"/>
                                    <div><p className="text-[9px] opacity-70">Giờ OT</p><p className="text-xs font-bold">{summaryDetail.totalOT}h</p></div>
                                </div>
                                {/* Hiển thị tổng phạt trong tuần */}
                                <div className="flex-1 bg-red-900/30 px-2 py-2 rounded-xl backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                                    <AlertCircle size={16} className="text-red-200 opacity-90"/>
                                    <div><p className="text-[9px] text-red-100 opacity-90">Phạt</p><p className="text-xs font-bold text-red-50">-{formatCurrency(summaryDetail.totalPenalty)}</p></div>
                                </div>
                            </div>
                            
                            {/* Hiển thị thưởng tháng nếu xem tất cả */}
                            {selectedWeek === 'all' && (
                                <div className="mt-3 bg-green-600/30 px-3 py-2 rounded-xl backdrop-blur-md border border-white/10 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Gift size={16} className="text-green-100"/>
                                        <span className="text-xs font-medium text-green">Thưởng tháng</span>
                                    </div>
                                    <span className="text-sm font-bold text-white">+{formatCurrency(CURRENT_MONTH_BONUS.amount)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. Daily List */}
                <div className="px-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Bảng kê chi tiết</h3>
                        <span className="text-xs text-gray-400 font-medium">{filteredShifts.length} bản ghi</span>
                    </div>

                    {filteredShifts.map((item) => {
                        const totalPay = calculateShiftPay(item);
                        return (
                            <div key={item.id} className="bg-white p-4 rounded-[20px] border border-gray-100 shadow-sm flex flex-col gap-3">
                                {/* Header */}
                                <div className="flex justify-between items-start border-b border-dashed border-gray-100 pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gray-50 w-[50px] h-[50px] rounded-2xl flex flex-col items-center justify-center shrink-0 border border-gray-100">
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">{item.day}</span>
                                            <span className="text-lg font-bold text-gray-800 leading-none mt-0.5">{item.date.split('/')[0]}</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border uppercase tracking-wide ${getRoleBadgeColor(item.role)}`}>{item.role}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                                                <MapPin size={10}/> {item.location}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[16px] font-bold text-[#191919] block">{formatCurrency(totalPay)}đ</span>
                                        <span className="text-[10px] text-gray-400 font-medium">Thực nhận</span>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-[#E08C27] flex items-center gap-1.5 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-[#E08C27]"></div> Giờ công ({item.regHours} giờ x {formatCurrency(item.rate)})</span>
                                        <span className="font-bold text-[#E08C27]">{formatCurrency(item.regHours * item.rate)}đ</span>
                                    </div>

                                    {item.otHours > 0 && (
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-[#E08C27] flex items-center gap-1.5 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-[#E08C27]"></div> OT ({item.otHours} giờ x {formatCurrency(item.rate)})</span>
                                            <span className="font-bold text-[#E08C27]">{formatCurrency(item.otHours * item.rate)}đ</span>
                                        </div>
                                    )}

                                    {item.penalty > 0 && (
                                        <div className="flex justify-between items-center text-xs bg-red-50 px-2 py-1.5 rounded-md border border-red-100">
                                            <span className="text-red-600 flex items-center gap-1.5 font-medium"><AlertCircle size={10}/> Phạt: {item.penaltyReason}</span>
                                            <span className="font-bold text-red-600">-{formatCurrency(item.penalty)}đ</span>
                                        </div>
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

  // --- VIEW: TỔNG QUAN (OVERVIEW) ---
  return (
    <div className="flex flex-col h-full bg-[#F5F5F5] font-sans relative overflow-hidden">
      
      {/* Header */}
      <div className="bg-white pt-12 pb-4 px-4 shadow-sm relative z-20 flex items-center gap-3 shrink-0">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-gray-900"/>
        </button>
        <h1 className="text-[17px] font-bold text-gray-900">Lương & Thưởng</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        
        {/* 1. ESTIMATED WAGES CARD */}
        <div className="m-4 mt-6">
            <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-orange-50 rounded-full -mr-16 -mt-16 opacity-60 blur-3xl pointer-events-none"></div>
                
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Tháng 12</p>
                            <div className="flex items-baseline gap-1">
                                <h2 className="text-[32px] font-extrabold text-[#E08C27] tracking-tight">{formatCurrency(summaryOverview.totalNet)}</h2>
                                <span className="text-xl font-bold"> đ</span>
                            </div>
                        </div>
                        <div className="bg-orange-50 text-[#E08C27] px-2.5 py-1 rounded-lg text-[10px] font-bold border border-orange-100 flex items-center gap-1">
                            Tạm tính
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                            <Clock size={12} className="text-blue-500"/> {summaryOverview.totalRegHours} giờ thường
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                            <TrendingUp size={12} className="text-orange-500"/> {summaryOverview.totalOT} giờ OT
                        </div>
                    </div>

                    {/* Breakdown Thưởng / Phạt (Overview) */}
                    <div className="flex gap-2 mb-6">
                        <div className="flex-1 bg-green-50 px-2 py-1.5 rounded-lg border border-green-100 flex items-center justify-between">
                            <span className="text-[10px] text-green-700 font-bold">Thưởng</span>
                            <span className="text-xs font-bold text-green-700">+{formatCurrency(CURRENT_MONTH_BONUS.amount)}</span>
                        </div>
                        {summaryOverview.totalPenalty > 0 && (
                            <div className="flex-1 bg-red-50 px-2 py-1.5 rounded-lg border border-red-100 flex items-center justify-between">
                                <span className="text-[10px] text-red-700 font-bold">Tổng phạt</span>
                                <span className="text-xs font-bold text-red-700">-{formatCurrency(summaryOverview.totalPenalty)}</span>
                            </div>
                        )}
                    </div>

                    <div className="h-[1px] w-full bg-gray-100 mb-4"></div>

                    <div className="flex justify-between items-center">
                        <p className="text-[11px] text-gray-400 italic">Cập nhật: Vừa xong</p>
                        <button onClick={() => setView('detail')} className="text-[13px] font-bold text-[#E08C27] flex items-center gap-1 active:opacity-60 hover:underline">
                            Xem chi tiết <ChevronRight size={14}/>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* 2. HISTORY LIST */}
        <div className="px-4">
            <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-[15px] font-bold text-gray-900 flex items-center gap-2">
                    Lịch sử trả lương
                </h3>
            </div>
            
            <div className="bg-white rounded-[20px] shadow-sm border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-12 gap-2 bg-gray-50 px-4 py-3 border-b border-gray-100 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                    <div className="col-span-4">Kỳ lương</div>
                    <div className="col-span-4 text-right">Thực nhận</div>
                    <div className="col-span-4 text-right">Trạng thái</div>
                </div>

                <div className="divide-y divide-gray-100">
                    {currentHistory.map((item) => (
                        <div key={item.id} className="grid grid-cols-12 gap-2 px-4 py-4 items-center hover:bg-gray-50 transition-colors cursor-pointer group">
                            <div className="col-span-4">
                                <p className="text-[13px] font-bold text-gray-900 group-hover:text-[#E08C27] transition-colors">{item.month}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5 font-medium">{item.date}</p>
                            </div>
                            <div className="col-span-4 text-right">
                                <p className="text-[13px] font-bold text-gray-900">{formatCurrency(item.total)}đ</p>
                            </div>
                            <div className="col-span-4 flex justify-end">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide whitespace-nowrap ${
                                    item.status === 'Đã trả' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-100 text-gray-500 border-gray-200'
                                }`}>
                                    {item.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50">
                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:border-gray-300 disabled:opacity-40 shadow-sm transition-all"><ChevronLeft size={16}/></button>
                    <span className="text-xs font-bold text-gray-600">Trang {currentPage} / {totalPages}</span>
                    <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:border-gray-300 disabled:opacity-40 shadow-sm transition-all"><ChevronRight size={16}/></button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
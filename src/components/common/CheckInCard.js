// CheckInCard.js
import React from 'react';
import { FilePlus, AlertCircle } from 'lucide-react';
import { useRealtimeClock } from '../../utils/helpers';

// Nhận thêm props: checkInDisabled, warningMessage
export default function CheckInCard({ 
    shift, 
    attendanceStatus, 
    onCheckIn, 
    onCheckOut, 
    onRequestLeave, 
    checkInDisabled, 
    warningMessage 
}) {
  const realtime = useRealtimeClock();

  // Logic disable
  // 1. Nếu đã checkin -> Disable nút checkin
  // 2. Nếu checkInDisabled = true (do logic từ Home truyền xuống) -> Disable
  const isCheckInBtnDisabled = attendanceStatus !== 'none' || checkInDisabled;
  
  // Nút Checkout chỉ sáng khi đã Check In
  const isCheckOutDisabled = attendanceStatus !== 'checked_in';

  return (
    <div className="bg-white rounded-[16px] p-[12px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.15)] relative z-20 w-full flex flex-col gap-[24px]">
      
      {/* 1. KHU VỰC HIỂN THỊ GIỜ (Realtime) */}
      <div className="flex items-start justify-between w-full">
        {/* Giờ bắt đầu */}
        <div className="flex-1 flex flex-col items-center gap-[12px]">
            <span className="text-[16px] text-[#191919] font-normal leading-[24px]">Giờ bắt đầu</span>
            <span className="text-[20px] text-black font-semibold leading-[32px]">
                {attendanceStatus === 'checked_in' ? shift?.startTimeLogged || '--:--:--' : realtime}
            </span>
        </div>
        
        {/* Đường kẻ dọc */}
        <div className="flex h-[64px] items-center justify-center">
             <div className="h-[64px] w-[1px] bg-[#EAEAEA]"></div>
        </div>

        {/* Giờ kết thúc */}
        <div className="flex-1 flex flex-col items-center gap-[12px]">
             <span className="text-[16px] text-[#191919] font-normal leading-[24px]">Giờ kết thúc</span>
             <span className="text-[20px] text-black font-semibold leading-[32px]">
                {attendanceStatus === 'checked_out' ? shift?.endTimeLogged || '--:--:--' : realtime}
             </span>
        </div>
      </div>

      {/* 2. KHU VỰC NÚT BẤM */}
      <div className="flex flex-col gap-[8px] w-full">
        
        {/* Hàng nút Check In / Check Out */}
        <div className="flex gap-[8px] w-full">
            {/* Nút Check In */}
            <button 
                onClick={onCheckIn}
                disabled={isCheckInBtnDisabled}
                className={`
                    flex-1 py-[10px] rounded-[10px] flex items-center justify-center transition-all h-[40px]
                    ${attendanceStatus === 'checked_in' 
                        ? 'bg-green-100 text-green-700' // Đã check in thành công
                        : (!isCheckInBtnDisabled 
                            ? 'bg-[#e08c27] text-white active:scale-95' // Được phép check in
                            : 'bg-[#e6e7e8] text-[#666b70] cursor-not-allowed opacity-70') // Bị khóa
                    }
                `}
            >
                <span className="text-[14px] font-semibold leading-[20px]">
                    {attendanceStatus === 'checked_in' ? 'Đã Check In' : 'Check In'}
                </span>
            </button>

            {/* Nút Check Out */}
            <button 
                 onClick={onCheckOut}
                 disabled={isCheckOutDisabled}
                 className={`
                    flex-1 py-[10px] rounded-[10px] flex items-center justify-center transition-all h-[40px]
                    ${!isCheckOutDisabled
                        ? 'bg-[#e08c27] text-white active:scale-95'
                        : 'bg-[#e6e7e8] text-[#666b70] cursor-not-allowed'
                    }
                 `}
            >
                <span className="text-[14px] font-normal leading-[20px]">Check Out</span>
            </button>
        </div>

        {/* --- KHU VỰC THÔNG BÁO CẢNH BÁO --- */}
        {/* Chỉ hiện khi chưa check-in và có cảnh báo */}
        {attendanceStatus === 'none' && warningMessage && (
            <div className="flex items-center justify-center gap-2 bg-red-50 border border-red-100 rounded-[8px] py-[8px] px-[12px] animate-in fade-in slide-in-from-top-1 duration-300">
                <AlertCircle size={16} className="text-[#c52c2c] shrink-0" />
                <span className="text-[13px] font-medium text-[#c52c2c] text-center leading-tight">
                    {warningMessage}
                </span>
            </div>
        )}

        {/* Nút Đơn xin nghỉ */}
        <button 
            onClick={onRequestLeave}
            className="w-full py-[10px] rounded-[10px] bg-[#c52c2c] flex items-center justify-center gap-[10px] active:scale-[0.98] transition-transform h-[40px]"
        >
            <FilePlus size={20} className="text-white opacity-90"/>
            <span className="text-[14px] font-semibold text-white leading-[20px]">Đơn xin nghỉ</span>
        </button>

      </div>

    </div>
  );
}
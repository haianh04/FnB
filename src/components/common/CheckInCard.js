import React from 'react';
import { FilePlus } from 'lucide-react';
import { useRealtimeClock, canCheckIn, getCurrentTime } from '../../utils/helpers';

export default function CheckInCard({ shift, attendanceStatus, onCheckIn, onCheckOut, onRequestLeave }) {
  // Sử dụng đồng hồ thời gian thực
  const realtime = useRealtimeClock();
  const simpleTime = getCurrentTime(); // Dùng để check logic (HH:mm)

  // Logic kiểm tra
  const isActiveTime = shift ? canCheckIn(shift.time, simpleTime) : false;
  const isCheckInDisabled = attendanceStatus !== 'none' || !isActiveTime;
  const isCheckOutDisabled = attendanceStatus !== 'checked_in';

  return (
    // Style container: bg-white rounded-[16px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.15)]
    // Margin-top âm để đè lên phần cam ở trang chủ (sẽ được chỉnh ở HomeScreen)
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
                {attendanceStatus === 'checked_out' ? realtime : '--:--:--'}
             </span>
        </div>
      </div>

      {/* 2. KHU VỰC NÚT BẤM */}
      <div className="flex flex-col gap-[8px] w-full">
        
        {/* Hàng nút Check In / Check Out */}
        <div className="flex gap-[8px] w-full">
            {/* Nút Check In (Màu cam #e08c27) */}
            <button 
                onClick={onCheckIn}
                disabled={isCheckInDisabled}
                className={`
                    flex-1 py-[10px] rounded-[10px] flex items-center justify-center transition-all h-[40px]
                    ${attendanceStatus === 'checked_in' 
                        ? 'bg-green-100 text-green-700' 
                        : (isActiveTime ? 'bg-[#e08c27] text-white active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed')
                    }
                `}
            >
                <span className="text-[14px] font-semibold leading-[20px]">
                    {attendanceStatus === 'checked_in' ? 'Đã Check In' : 'Check In'}
                </span>
            </button>

            {/* Nút Check Out (Màu xám #e6e7e8, Text #666b70) */}
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

        {/* Nút Đơn xin nghỉ (Màu đỏ #c52c2c) */}
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
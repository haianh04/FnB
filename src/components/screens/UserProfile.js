import React from 'react';
import { 
  ChevronLeft, UserCircle, User, Mail, CalendarDays, Phone, MapPin, 
  CreditCard, Image as ImageIcon, AlertCircle, Briefcase 
} from 'lucide-react';
import InfoRow from '../common/InfoRow';

// Icon phụ (local)
const PlusIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);

export default function UserProfile({ user, onBack }) {
  return (
    <div className="flex flex-col h-full bg-gray-50 font-sans overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 pb-20">
         {/* Header */}
         <div className="bg-[#F97316] text-white pt-4 pb-4 px-4 rounded-2xl shadow-md relative -mx-4">
            <div className="flex items-center gap-3 mb-3">
               <button onClick={onBack} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <ChevronLeft size={20}/>
               </button>
               <h2 className="text-base font-bold">Hồ sơ cá nhân</h2>
            </div>
            
            <div className="flex flex-col items-center py-2">
               <div className="w-16 h-16 bg-white p-1 rounded-full mb-2 shadow-md overflow-hidden">
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                     <UserCircle size={56} className="text-gray-400" />
                  </div>
               </div>
               <h1 className="text-base font-bold">{user.fullName}</h1>
            </div>
         </div>
         
         {/* 1. Thông tin cá nhân */}
         <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                <User size={16} className="text-[#F97316]"/> Thông tin cá nhân
            </h3>
            <div className="pl-2">
                <InfoRow label="Họ và Tên" value={user.fullName} isRequired={true} />
                <InfoRow label="Email" value={user.email} icon={Mail} />
                <InfoRow label="Ngày sinh" value={user.dob} icon={CalendarDays} />
                <InfoRow label="SĐT di động" value={user.phone} icon={Phone} />
                <InfoRow label="Địa chỉ thường trú" value={user.address} icon={MapPin} />
            </div>
         </div>

         {/* 2. Thông tin định danh (CCCD) */}
         <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                <CreditCard size={16} className="text-[#F97316]"/> Định danh (CCCD)
            </h3>
            <div className="pl-2">
                <InfoRow label="Số CCCD" value={user.cccdNumber} isRequired={true} />
                <InfoRow label="Ngày cấp" value={user.cccdDate} isRequired={true} icon={CalendarDays} />
                
                {/* Khu vực Hình ảnh CCCD */}
                <div className="py-3">
                    <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                       <ImageIcon size={12}/> Hình ảnh CCCD
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        {/* Mặt trước */}
                        <div className="aspect-[3/2] bg-gray-50 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden relative group cursor-pointer hover:border-[#F97316] transition-colors">
                            {user.cccdImageFront ? (
                                <img src={user.cccdImageFront} alt="Mặt trước" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center">
                                    <span className="text-2xl text-gray-300">+</span>
                                    <p className="text-[10px] text-gray-400">Mặt trước</p>
                                </div>
                            )}
                        </div>
                        {/* Mặt sau */}
                        <div className="aspect-[3/2] bg-gray-50 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#F97316] transition-colors">
                             {user.cccdImageBack ? (
                                <img src={user.cccdImageBack} alt="Mặt sau" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <PlusIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                                    <p className="text-[10px]">Thêm mặt sau</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
         </div>

         {/* 3. Liên hệ khẩn cấp */}
         <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                <AlertCircle size={16} className="text-[#F97316]"/> Liên hệ khẩn cấp
            </h3>
            <div className="pl-2">
                <InfoRow label="Tên liên lạc" value={user.emergencyName} />
                <InfoRow label="SĐT liên lạc khẩn cấp" value={user.emergencyPhone} icon={Phone} />
            </div>
         </div>

         {/* 4. Công việc */}
         <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                <Briefcase size={16} className="text-[#F97316]"/> Công việc
            </h3>
            <div className="pl-2">
                <InfoRow label="Ngày vào làm" value={user.joinDate} icon={CalendarDays} />
            </div>
         </div>

         {/* Nút Cập nhật */}
         <button className="w-full bg-[#F97316] text-white font-bold py-3.5 rounded-xl shadow-lg active:scale-95 transition-transform text-base">
            Cập nhật hồ sơ
         </button>
      </div>
    </div>
  )
}
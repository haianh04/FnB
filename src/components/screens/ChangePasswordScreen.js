import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, Key, CheckCircle, Eye, EyeOff } from 'lucide-react';

export default function ChangePasswordScreen({ onBack, user }) {
  const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập OTP & Pass mới
  const [email, setEmail] = useState(user.email || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Giả lập gửi mã code
  const handleSendCode = () => {
      if (!email) return alert('Vui lòng nhập email');
      setIsLoading(true);
      
      // Giả lập API call
      setTimeout(() => {
          setIsLoading(false);
          alert(`Mã xác nhận đã được gửi đến ${email}. (Mã demo: 123456)`);
          setStep(2);
      }, 1500);
  };

  // Giả lập đổi mật khẩu
  const handleChangePassword = () => {
      if (otp !== '123456') return alert('Mã xác nhận không đúng (Mã demo là 123456)');
      if (newPassword.length < 6) return alert('Mật khẩu phải có ít nhất 6 ký tự');
      if (newPassword !== confirmPassword) return alert('Mật khẩu nhập lại không khớp');

      setIsLoading(true);
      setTimeout(() => {
          setIsLoading(false);
          alert('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
          onBack(); // Quay lại menu hoặc đăng xuất
      }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F5F5] font-sans relative overflow-hidden">
      
      {/* Header */}
      <div className="bg-white pt-12 pb-4 px-4 shadow-sm relative z-10 flex items-center gap-3">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-gray-900"/>
        </button>
        <h1 className="text-[17px] font-bold text-gray-900">Đổi mật khẩu</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
        
        {/* Step 1: Xác nhận Email */}
        {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
                <div className="text-center py-6">
                    <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-100">
                        <Mail size={40} className="text-[#E08C27]"/>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Xác thực tài khoản</h2>
                    <p className="text-sm text-gray-500 mt-2 px-4">
                        Chúng tôi sẽ gửi một mã xác nhận gồm 6 chữ số đến email của bạn để bảo mật.
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email nhận mã</label>
                    <div className="relative">
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={true} // Thường là email đăng nhập không sửa được
                            className="w-full p-4 pl-12 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-medium outline-none"
                        />
                        <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                    </div>
                </div>

                <button 
                    onClick={handleSendCode}
                    disabled={isLoading}
                    className="w-full py-4 bg-[#E08C27] text-white font-bold rounded-xl shadow-lg shadow-orange-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                    {isLoading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
                </button>
            </div>
        )}

        {/* Step 2: Nhập OTP & Pass mới */}
        {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
                <div className="text-center py-4">
                     <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-blue-100">
                        <Key size={32} className="text-blue-500"/>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Thiết lập mật khẩu mới</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Mã xác nhận đã gửi đến <b>{email}</b>
                    </p>
                </div>

                {/* Input OTP */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Mã xác nhận (OTP)</label>
                    <input 
                        type="text" 
                        placeholder="Nhập mã 6 số (VD: 123456)"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full p-4 bg-white border border-gray-200 rounded-xl text-gray-900 font-bold tracking-widest text-center outline-none focus:border-[#E08C27] transition-colors"
                        maxLength={6}
                    />
                </div>

                {/* Input Mật khẩu mới */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Mật khẩu mới</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"}
                                placeholder="Ít nhất 6 ký tự"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full p-4 pl-12 bg-white border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-[#E08C27] transition-colors"
                            />
                            <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                            <button 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Nhập lại mật khẩu</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"}
                                placeholder="Xác nhận mật khẩu mới"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-4 pl-12 bg-white border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-[#E08C27] transition-colors"
                            />
                            <CheckCircle size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${newPassword && newPassword === confirmPassword ? 'text-green-500' : 'text-gray-400'}`}/>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={handleChangePassword}
                    disabled={isLoading}
                    className="w-full py-4 bg-[#E08C27] text-white font-bold rounded-xl shadow-lg shadow-orange-200 active:scale-95 transition-transform mt-4"
                >
                    {isLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                </button>
                
                <button onClick={() => setStep(1)} className="w-full text-sm text-gray-500 font-medium py-2">
                    Gửi lại mã?
                </button>
            </div>
        )}

      </div>
    </div>
  );
}
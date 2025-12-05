import React from 'react';
import { User, Lock } from 'lucide-react';
import StatusBar from '../common/StatusBar'; // Import StatusBar để hiển thị trong màn hình login

export default function LoginScreen({ onLogin }) {
  return (
    <div className="flex flex-col h-full bg-white text-gray-900 p-8 justify-center relative">
      <div className="absolute top-0 left-0 w-full"><StatusBar lightMode={true}/></div>
      <div className="mb-10 text-center">
        <div className="w-20 h-20 bg-[#F97316] rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
           <span className="text-3xl font-bold text-white">X</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">XinK FnB</h1>
        <p className="text-gray-500 text-sm">Quản lý nhân sự thông minh</p>
      </div>
      <div className="space-y-4 w-full">
        <div className="bg-gray-50 rounded-xl flex items-center px-4 py-3 border border-gray-200 focus-within:border-[#F97316] transition-colors">
           <User size={18} className="text-gray-400 mr-3"/>
           <input type="text" placeholder="Tên đăng nhập" className="bg-transparent outline-none text-sm w-full placeholder-gray-400 text-gray-900"/>
        </div>
        <div className="bg-gray-50 rounded-xl flex items-center px-4 py-3 border border-gray-200 focus-within:border-[#F97316] transition-colors">
           <Lock size={18} className="text-gray-400 mr-3"/>
           <input type="password" placeholder="Mật khẩu" className="bg-transparent outline-none text-sm w-full placeholder-gray-400 text-gray-900"/>
        </div>
        <button onClick={onLogin} className="w-full bg-[#F97316] text-white font-bold py-3.5 rounded-xl mt-4 active:scale-95 transition-transform shadow-lg shadow-orange-900/20">Đăng nhập</button>
      </div>
      <p className="text-center text-gray-500 text-xs mt-8">Quên mật khẩu? Liên hệ quản lý.</p>
    </div>
  )
}
import React from 'react';

export default function InfoRow({ label, value, icon: Icon, isRequired }) {
  return (
    <div className="py-3 border-b border-gray-50 last:border-0">
      <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
        {Icon && <Icon size={12}/>} 
        {label} 
        {isRequired && <span className="text-red-500 font-bold">*</span>}
      </p>
      <p className="text-sm font-medium text-gray-800">
        {value || <span className="text-gray-300 italic text-xs">Chưa cập nhật</span>}
      </p>
    </div>
  );
}
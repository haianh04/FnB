import React from 'react';
import { Signal, Wifi, Battery } from 'lucide-react';

export default function StatusBar({ lightMode = true }) {
  return (
    <div className={`h-[44px] flex items-center justify-between px-6 shrink-0 relative z-50 transition-colors ${lightMode ? 'text-black' : 'text-white'}`}>
      <span className="text-[15px] font-semibold">9:41</span>
      <div className="flex items-center gap-1.5">
        <Signal className="w-4 h-4" />
        <Wifi className="w-4 h-4" />
        <Battery className="w-5 h-5" />
      </div>
    </div>
  );
}
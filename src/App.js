// src/App.js
import React, { useState } from 'react';
import './App.css'; 

// Import các components
import IPhone from './components/IPhone'; 
import WebEmploymentHistory from './components/WebEmploymentHistory';
import SettingsScreen from './components/SettingsScreen'; // <--- Import file mới

function App() {
  // State điều khiển màn hình hiển thị ('mobile', 'web', 'settings')
  const [view, setView] = useState('settings'); // Mặc định hiển thị Settings để xem ngay

  return (
    <div className="App relative min-h-screen bg-gray-100">
      
      {/* --- THANH ĐIỀU HƯỚNG (Góc phải màn hình) --- */}
      <div className="fixed top-4 right-4 z-[9999] flex gap-2 bg-white p-2 rounded-xl shadow-md border border-gray-200">
        <button 
          onClick={() => setView('mobile')}
          className={`px-3 py-2 rounded-lg font-bold text-sm transition-all ${view === 'mobile' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          📱 Mobile
        </button>
        <button 
          onClick={() => setView('web')}
          className={`px-3 py-2 rounded-lg font-bold text-sm transition-all ${view === 'web' ? 'bg-[#F97316] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          💻 Lương (Web)
        </button>
        <button 
          onClick={() => setView('settings')}
          className={`px-3 py-2 rounded-lg font-bold text-sm transition-all ${view === 'settings' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          ⚙️ Cài đặt
        </button>
      </div>

      {/* --- KHU VỰC HIỂN THỊ NỘI DUNG --- */}
      <div className="w-full min-h-screen">
        {view === 'mobile' && (
          <div className="flex items-center justify-center min-h-screen py-10">
            <IPhone />
          </div>
        )}

        {view === 'web' && (
          <div className="w-full h-full bg-gray-50">
             <WebEmploymentHistory />
          </div>
        )}

        {view === 'settings' && (
          <div className="w-full h-full bg-gray-50">
             <SettingsScreen />
          </div>
        )}
      </div>

    </div>
  );
}

export default App;
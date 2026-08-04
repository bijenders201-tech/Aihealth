import React from 'react';
import { useApp } from '../context/AppContext';
import { Wifi, Battery, Signal } from 'lucide-react';

export const AndroidFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showAndroidFrame } = useApp();

  if (!showAndroidFrame) {
    return <>{children}</>;
  }

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-2 sm:p-6 overflow-x-hidden">
      {/* Smartphone Body */}
      <div className="w-full max-w-[430px] h-[880px] bg-slate-900 rounded-[50px] border-[10px] border-slate-800 ring-1 ring-slate-700/50 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col relative overflow-hidden">
        
        {/* Top Punchhole / Camera Notch & Android Status Bar */}
        <div className="bg-slate-900 text-slate-300 px-6 py-2 flex items-center justify-between text-xs font-mono select-none z-50 border-b border-slate-800/50">
          <span>{currentTime}</span>
          {/* Punchhole Notch */}
          <div className="w-4 h-4 rounded-full bg-slate-950 ring-2 ring-slate-800 mx-auto"></div>
          <div className="flex items-center space-x-2 text-slate-400">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Screen Viewport */}
        <div className="flex-1 overflow-y-auto relative bg-slate-950 text-slate-100 custom-scrollbar">
          {children}
        </div>

        {/* Bottom Android Gesture Bar */}
        <div className="bg-slate-900 py-2 flex items-center justify-center z-50">
          <div className="w-32 h-1 bg-slate-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

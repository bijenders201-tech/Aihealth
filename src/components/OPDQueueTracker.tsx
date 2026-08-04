import React, { useState } from 'react';
import { Clock, Users, Volume2, ShieldAlert, ArrowRight, CheckCircle, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OPDQueueTracker: React.FC = () => {
  const { appointments, appLanguage } = useApp();
  const [currentServingToken, setCurrentServingToken] = useState(14);
  const myToken = 18;
  const roomNumber = 'OPD-102';
  const doctorName = 'Dr. Sarah Patel';

  const tokensAhead = Math.max(0, myToken - currentServingToken);
  const estWaitMins = tokensAhead * 4;

  const handleNextToken = () => {
    setCurrentServingToken(prev => prev + 1);
  };

  const handleVoiceAnnounce = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const phrase = appLanguage === 'hi'
        ? `टोकन नंबर ${currentServingToken}, डॉक्टर सरिता पटेल के कमरा नंबर ${roomNumber} में आएं।`
        : `Token Number ${currentServingToken}, please proceed to ${doctorName} in Room ${roomNumber}.`;
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = appLanguage === 'hi' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 text-slate-100">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Clock className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Real-time OPD Triage</span>
            <h3 className="font-extrabold text-base text-white">Live OPD Queue Tracker</h3>
          </div>
        </div>

        <button
          onClick={handleVoiceAnnounce}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center space-x-1.5 border border-slate-700 transition-all cursor-pointer"
        >
          <Volume2 className="w-4 h-4 text-cyan-400" />
          <span>Announce Token</span>
        </button>
      </div>

      {/* Queue Token Visualizer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        <div className="bg-slate-950 p-4 rounded-2xl border border-cyan-500/40 text-center relative overflow-hidden">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Now Serving</span>
          <span className="text-3xl font-black font-mono text-cyan-400">#{currentServingToken}</span>
          <span className="text-[10px] text-cyan-300/80 block mt-1 font-mono">Room {roomNumber}</span>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/40 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Your OPD Token</span>
          <span className="text-3xl font-black font-mono text-emerald-400">#{myToken}</span>
          <span className="text-[10px] text-emerald-300/80 block mt-1 font-mono">
            {tokensAhead === 0 ? 'GO INSIDE ROOM NOW' : `${tokensAhead} Patients Ahead`}
          </span>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/40 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Estimated Wait Time</span>
          <span className="text-3xl font-black font-mono text-amber-400">{estWaitMins}m</span>
          <span className="text-[10px] text-amber-300/80 block mt-1 font-mono">Avg 4 mins / patient</span>
        </div>

      </div>

      {/* Live Counter Simulator Controls */}
      <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300 font-medium">Doctor: <strong className="text-white">{doctorName}</strong></span>
        </div>

        <button
          onClick={handleNextToken}
          className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs flex items-center space-x-1 cursor-pointer"
        >
          <span>Advance OPD Queue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};

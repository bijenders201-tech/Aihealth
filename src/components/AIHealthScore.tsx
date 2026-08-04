import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  Heart,
  Moon,
  Footprints,
  Flame,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Users,
  Smartphone,
  RefreshCw
} from 'lucide-react';

export const AIHealthScore: React.FC = () => {
  const { selectedFamilyMember, setSelectedFamilyMember, familyMembers } = useApp();

  const [isSyncing, setIsSyncing] = useState(false);

  // Score depends on selected family member age/data
  const score = selectedFamilyMember.relationship === 'Parent' ? 76 : selectedFamilyMember.relationship === 'Child' ? 94 : 86;

  const handleSyncVitals = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Header */}
      <div className="bg-[#1E293B] border border-slate-700/50 rounded-[2rem] p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2 px-3 py-1 rounded-full">
            <Activity className="w-3.5 h-3.5" />
            <span>Gemini AI Longitudinal Vitals Analysis</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">AI Clinical Health Index</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time health score for <strong className="text-cyan-300">{selectedFamilyMember.name}</strong> based on vitals, labs, and activity telemetry.
          </p>
        </div>

        {/* Sync Vitals Button */}
        <button
          onClick={handleSyncVitals}
          disabled={isSyncing}
          className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 flex items-center space-x-2 transition-all cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing Smartwatch Vitals...' : 'SYNC WEARABLE VITALS'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Big Score Gauge Display (Col Span 5) */}
        <div className="lg:col-span-5 bg-[#1E293B] border border-slate-700/50 rounded-[2.5rem] p-8 text-center shadow-2xl flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
          
          <div className="relative flex items-center justify-center">
            {/* Circular Progress Meter */}
            <svg className="w-56 h-56 transform -rotate-90">
              <circle
                cx="112"
                cy="112"
                r="90"
                stroke="#334155"
                strokeWidth="16"
                fill="transparent"
              />
              <circle
                cx="112"
                cy="112"
                r="90"
                stroke="url(#scoreGradient)"
                strokeWidth="16"
                strokeDasharray={565}
                strokeDashoffset={565 - (565 * score) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-white tracking-tight">{score}</span>
              <span className="text-xs text-slate-400 uppercase font-mono font-bold">Out of 100</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Optimal Health Status
            </span>
            <p className="text-xs text-slate-400 mt-2">
              Vitals indicate low cardiovascular risk and normal glycemic index.
            </p>
          </div>

        </div>

        {/* Breakdown Parameters & AI Insights (Col Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Sub-Metric Cards Grid */}
          <div className="grid grid-cols-2 gap-4">
            
            <div className="bg-[#1E293B] border border-slate-700/50 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                  <Heart className="w-4 h-4 text-rose-400" /> Heart Rate Vitals
                </span>
                <span className="text-white font-extrabold font-mono">68 bpm</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: '92%' }}></div>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold block">92/100 • Resting HR Normal</span>
            </div>

            <div className="bg-[#1E293B] border border-slate-700/50 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                  <Moon className="w-4 h-4 text-indigo-400" /> Sleep Quality
                </span>
                <span className="text-white font-extrabold font-mono">7.8 hrs</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: '88%' }}></div>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold block">88/100 • Deep Sleep 2.1 hrs</span>
            </div>

            <div className="bg-[#1E293B] border border-slate-700/50 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                  <Footprints className="w-4 h-4 text-cyan-400" /> Daily Steps
                </span>
                <span className="text-white font-extrabold font-mono">8,420</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: '78%' }}></div>
              </div>
              <span className="text-[10px] text-cyan-400 font-bold block">78/100 • Goal 10,000 steps</span>
            </div>

            <div className="bg-[#1E293B] border border-slate-700/50 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                  <Flame className="w-4 h-4 text-amber-400" /> BMI & Metabolism
                </span>
                <span className="text-white font-extrabold font-mono">22.4 BMI</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold block">85/100 • Healthy Weight</span>
            </div>

          </div>

          {/* Gemini AI Recommendations Box */}
          <div className="bg-[#1E293B] border border-slate-700/50 rounded-[2rem] p-6 shadow-xl space-y-4">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Gemini AI Personalized Health Advice
            </h3>

            <div className="space-y-2.5 text-xs text-slate-300">
              <p className="flex items-start gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Maintain hydration: Consume at least 2.5 liters of water daily to support kidney filtration.</span>
              </p>
              <p className="flex items-start gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Cardio Goal: Increase brisk walking duration by 15 minutes to reach daily 10,000 steps.</span>
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

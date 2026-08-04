import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Navigation2,
  Building2,
  MapPin,
  Compass,
  Volume2,
  CheckCircle2,
  Layers,
  ArrowUpRight,
  ArrowRight,
  Footprints,
  Info
} from 'lucide-react';
import { Hospital, DepartmentFloor } from '../types';

export const HospitalNavigation: React.FC = () => {
  const { navTarget, setNavTarget, hospitals } = useApp();

  const activeHospital: Hospital = navTarget?.hospital || hospitals[0];
  const [selectedDept, setSelectedDept] = useState<DepartmentFloor>(
    navTarget?.department || activeHospital.departments[0]
  );

  const [stepIndex, setStepIndex] = useState(0);
  const [voiceActive, setVoiceActive] = useState(false);

  const navigationSteps = [
    { title: 'Hospital Lobby Entrance', desc: `Enter via Main Gate at ${activeHospital.address}. Scan QR Code at Lobby Kiosk 1.`, distance: '0m' },
    { title: 'Proceed to Main Concourse', desc: `Walk straight past the Central Pharmacy and Billing Counter.`, distance: '30m' },
    { title: `Elevator Bank - ${selectedDept.building}`, desc: `Take Elevator B to ${selectedDept.floor}.`, distance: '45m' },
    { title: `Exit Elevator & Follow Overhead Signage`, desc: `Turn left towards Wing B corridor.`, distance: '25m' },
    { title: `Arrived at Destination: ${selectedDept.departmentName}`, desc: `Room ${selectedDept.roomNumber} - In charge: ${selectedDept.doctorInCharge}`, distance: '20m' }
  ];

  const speakStep = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
      setVoiceActive(true);
      setTimeout(() => setVoiceActive(false), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1E293B] border border-slate-700/50 rounded-[2rem] p-6 sm:p-8 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2 px-3 py-1 rounded-full">
            <Compass className="w-3.5 h-3.5" />
            <span>Turn-by-Turn Indoor Wayfinding System</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{activeHospital.name} Navigation</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Indoor GPS positioning guiding you to exact OPD rooms, labs, and ICUs.</p>
        </div>

        {/* Destination Department Selector */}
        <div className="flex items-center space-x-2 bg-slate-950 p-2 rounded-2xl border border-slate-800">
          <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <select
            value={selectedDept.id}
            onChange={(e) => {
              const dept = activeHospital.departments.find(d => d.id === e.target.value);
              if (dept) {
                setSelectedDept(dept);
                setStepIndex(0);
              }
            }}
            className="bg-transparent text-xs text-slate-100 font-bold focus:outline-none"
          >
            {activeHospital.departments.map(d => (
              <option key={d.id} value={d.id} className="bg-slate-900 text-slate-200">
                {d.departmentName} ({d.building} - {d.floor})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Step-by-Step Wayfinding Guidance Column */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Active Navigation Header Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest">Target Room</span>
                <h3 className="text-xl font-extrabold text-slate-100">{selectedDept.departmentName}</h3>
                <p className="text-xs text-slate-400">{selectedDept.building} • {selectedDept.floor} • <strong className="text-cyan-300">Room {selectedDept.roomNumber}</strong></p>
              </div>

              <div className="text-right">
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full text-xs font-bold font-mono">
                  ~120 meters • 2 mins walk
                </span>
                <p className="text-[10px] text-slate-400 mt-1">Doctor: {selectedDept.doctorInCharge}</p>
              </div>
            </div>

            {/* Active Turn Step Visual Prompt */}
            <div className="p-5 bg-gradient-to-r from-cyan-950/80 to-slate-950 border-2 border-cyan-500/50 rounded-2xl relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Step {stepIndex + 1} of {navigationSteps.length}</span>
                  <h4 className="text-lg font-extrabold text-slate-100 mt-0.5">{navigationSteps[stepIndex].title}</h4>
                  <p className="text-xs text-slate-200 mt-1 max-w-lg leading-relaxed">{navigationSteps[stepIndex].desc}</p>
                </div>

                <button
                  onClick={() => speakStep(`${navigationSteps[stepIndex].title}. ${navigationSteps[stepIndex].desc}`)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer shrink-0 ${
                    voiceActive ? 'bg-cyan-500 text-slate-950 border-cyan-400 animate-pulse' : 'bg-slate-800 border-slate-700 text-cyan-400 hover:bg-slate-700'
                  }`}
                  title="Play Voice Navigation Prompt"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${((stepIndex + 1) / navigationSteps.length) * 100}%` }}
                ></div>
              </div>

              {/* Next/Prev Step Controls */}
              <div className="flex items-center justify-between pt-3">
                <button
                  disabled={stepIndex === 0}
                  onClick={() => setStepIndex(prev => prev - 1)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs disabled:opacity-40 cursor-pointer"
                >
                  Previous Step
                </button>

                <button
                  disabled={stepIndex === navigationSteps.length - 1}
                  onClick={() => {
                    const next = stepIndex + 1;
                    setStepIndex(next);
                    speakStep(navigationSteps[next].title);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 disabled:opacity-40 cursor-pointer flex items-center space-x-1"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List of All Route Checkpoints */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Route Checkpoint Summary</h4>
              {navigationSteps.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => setStepIndex(idx)}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                    stepIndex === idx
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300 font-bold'
                      : idx < stepIndex
                      ? 'bg-slate-950/50 border-slate-800/80 text-slate-400 line-through opacity-70'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-[11px] ${
                      stepIndex === idx ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-semibold">{s.title}</span>
                      <span className="text-[10px] text-slate-500 block">{s.desc}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{s.distance}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Visual Indoor Department Floor Blueprint Simulation */}
        <div>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl sticky top-20 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Indoor Floor Map Blueprint</span>
              </h3>
              <span className="text-[10px] text-cyan-400 font-mono uppercase">{selectedDept.floor}</span>
            </div>

            {/* Floor Map Layout Canvas */}
            <div className="w-full h-80 bg-slate-950 border border-slate-800 rounded-2xl relative p-4 overflow-hidden flex flex-col justify-between">
              
              {/* Floor Plan Grid Lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-30"></div>

              {/* Corridor Walls */}
              <div className="absolute top-12 left-6 right-6 h-12 bg-slate-900/80 border border-slate-700 rounded-xl flex items-center justify-around text-[10px] font-mono text-slate-400 z-10">
                <span>OPD 201</span>
                <span>OPD 202</span>
                <span>OPD 203</span>
                <span className="text-cyan-400 font-bold underline bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-400">
                  {selectedDept.roomNumber} ({selectedDept.departmentName.substring(0, 10)})
                </span>
              </div>

              {/* Elevator Node */}
              <div className="absolute bottom-12 left-6 w-20 h-16 bg-slate-800 border border-slate-600 rounded-xl flex flex-col items-center justify-center text-[10px] font-bold text-slate-300 z-10">
                <span>Elevator B</span>
                <span className="text-[9px] text-teal-400 font-normal">Floor {selectedDept.floor.charAt(0)}</span>
              </div>

              {/* Route Line Canvas Overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
                <path
                  d="M 60 250 L 60 120 L 280 120"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="4"
                  strokeDasharray="6 4"
                  className="animate-pulse"
                />
              </svg>

              {/* Destination Pin */}
              <div className="absolute top-8 right-12 z-30 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-cyan-400 text-slate-950 font-extrabold flex items-center justify-center shadow-lg shadow-cyan-400/50 animate-bounce">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-cyan-500/40 mt-1">
                  Destination Room
                </span>
              </div>

              <div className="mt-auto z-10 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
                <span>Building: <strong>{selectedDept.building}</strong></span>
                <span>In-charge: <strong>{selectedDept.doctorInCharge}</strong></span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start space-x-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>For wheel-chair assistance or paramedic escort, request at the ground floor information desk.</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

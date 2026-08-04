import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Siren,
  Phone,
  Navigation2,
  Clock,
  MapPin,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Car,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { AmbulanceRequest } from '../types';

export const AmbulanceTracker: React.FC = () => {
  const { user, requestAmbulance, triggerEmergencySOS } = useApp();

  const [activeAmbulance, setActiveAmbulance] = useState<AmbulanceRequest>({
    id: 'amb_901',
    patientName: user.name || 'Alex Johnson',
    phone: user.phone || '+1 (555) 234-5678',
    type: 'Advanced Life Support (ALS)',
    pickupAddress: user.address || '742 Evergreen Terrace, San Francisco, CA',
    hospitalDestination: 'Apex General Medical Center (Level 1 ER)',
    driverName: 'Rajesh Kumar (Paramedic Lead)',
    driverPhone: '+1 (555) 998-1122',
    vehicleNo: 'SF-EMG-9901',
    status: 'En Route',
    ETA: '6 mins'
  });

  const [progressPercent, setProgressPercent] = useState(45);
  const [etaSeconds, setEtaSeconds] = useState(360); // 6 mins
  const [vehicleSpeed, setVehicleSpeed] = useState(48);

  // Simulate ambulance movement along route
  useEffect(() => {
    const timer = setInterval(() => {
      setProgressPercent(prev => (prev < 95 ? prev + 1 : 95));
      setEtaSeconds(prev => (prev > 30 ? prev - 3 : 30));
      setVehicleSpeed(Math.floor(42 + Math.random() * 12));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const formatMinutes = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#1E293B] border border-slate-700/50 rounded-[2rem] p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider mb-2 px-3 py-1 rounded-full">
            <Siren className="w-3.5 h-3.5 animate-pulse" />
            <span>24x7 GPS Emergency Dispatch</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Live Ambulance Dispatch & GPS Tracking</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Real-time telematics, paramedic communication, and emergency corridor status.</p>
        </div>

        <button
          onClick={() => triggerEmergencySOS()}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0"
        >
          <Siren className="w-4 h-4 animate-spin text-yellow-300" />
          <span>DISPATCH NEW SOS AMBULANCE</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive Simulated Live GPS Map (Col Span 8) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-[2rem] p-4 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[420px]">
          
          {/* Map Overhead Header */}
          <div className="flex items-center justify-between z-10 bg-slate-950/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-extrabold text-white uppercase tracking-wider">Live Telematics Signal</span>
            </div>
            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="text-cyan-400 font-bold">{vehicleSpeed} km/h</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 font-bold">2.1 km away</span>
            </div>
          </div>

          {/* Map Vector Graphic Canvas Representation */}
          <div className="relative my-6 h-64 bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden flex items-center justify-center p-4">
            
            {/* Grid Map Background Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20"></div>

            {/* Route Vector Path Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path
                d="M 60,180 Q 200,60 380,180 T 700,80"
                fill="none"
                stroke="#0284c7"
                strokeWidth="4"
                strokeDasharray="6 6"
                className="animate-pulse"
              />
            </svg>

            {/* Patient Pickup Marker */}
            <div className="absolute left-8 bottom-12 flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-extrabold text-emerald-300 bg-slate-900/90 px-2 py-0.5 rounded-full mt-1 border border-emerald-500/30">
                Patient Home
              </span>
            </div>

            {/* Moving Ambulance Marker */}
            <div
              className="absolute transition-all duration-1000 ease-linear flex flex-col items-center z-20"
              style={{ left: `${progressPercent}%`, top: '40%' }}
            >
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-xl shadow-red-600/50 border-2 border-white animate-bounce">
                  <Car className="w-6 h-6" />
                </div>
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-yellow-400 rounded-full animate-ping"></span>
              </div>
              <span className="text-[10px] font-extrabold text-white bg-red-600 px-2 py-0.5 rounded-full mt-1 shadow-md">
                {activeAmbulance.vehicleNo}
              </span>
            </div>

            {/* Hospital Destination Marker */}
            <div className="absolute right-8 top-8 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 border-2 border-cyan-400 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Siren className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-extrabold text-cyan-300 bg-slate-900/90 px-2 py-0.5 rounded-full mt-1 border border-cyan-500/30">
                Apex ER
              </span>
            </div>

          </div>

          {/* Bottom Live Progress Bar */}
          <div className="z-10 bg-slate-950/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">En Route Progress</span>
              <span className="font-mono font-extrabold text-cyan-400">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 h-full rounded-full transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

        </div>

        {/* Live Driver & ETA Info Card (Col Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Big ETA Display Box */}
          <div className="bg-[#1E293B] border border-slate-700/50 rounded-[2rem] p-6 text-center shadow-xl space-y-2">
            <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest block">Estimated Time of Arrival</span>
            <div className="text-4xl font-extrabold font-mono text-white tracking-tight">
              {formatMinutes(etaSeconds)}
            </div>
            <p className="text-xs text-slate-400">Green corridor traffic priority requested</p>
          </div>

          {/* Driver Info Card */}
          <div className="bg-[#1E293B] border border-slate-700/50 rounded-[2rem] p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-extrabold text-xl shrink-0">
                RK
              </div>
              <div>
                <h4 className="font-extrabold text-base text-white">{activeAmbulance.driverName}</h4>
                <p className="text-xs text-slate-400">Vehicle: <strong className="text-cyan-300 font-mono">{activeAmbulance.vehicleNo}</strong></p>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 inline-block mt-1 font-bold">
                  ★ 4.9 Paramedic Rating
                </span>
              </div>
            </div>

            <a
              href={`tel:${activeAmbulance.driverPhone}`}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>CALL DRIVER ({activeAmbulance.driverPhone})</span>
            </a>
          </div>

          {/* Equipment & Vehicle Spec Badge */}
          <div className="bg-[#1E293B] border border-slate-700/50 rounded-[2rem] p-6 shadow-xl space-y-3">
            <h4 className="font-extrabold text-xs text-slate-300 uppercase tracking-wider">On-Board Life Support Support</h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/40 text-slate-200 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Oxygen Cylinder</span>
              </div>
              <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/40 text-slate-200 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>ECG Monitor</span>
              </div>
              <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/40 text-slate-200 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Defibrillator</span>
              </div>
              <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/40 text-slate-200 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Ventilator Unit</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

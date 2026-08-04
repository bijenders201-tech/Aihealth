import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Stethoscope,
  Siren,
  Building2,
  Calendar,
  Pill,
  FolderHeart,
  Navigation2,
  Sparkles,
  ArrowRight,
  Clock,
  Bed,
  MapPin,
  CheckCircle2,
  QrCode,
  Star,
  Mic,
  Activity,
  FileText,
  CreditCard,
  ChevronRight
} from 'lucide-react';

export const MainDashboard: React.FC = () => {
  const {
    setActiveTab,
    selectedFamilyMember,
    triggerEmergencySOS,
    appointments,
    hospitals,
    medicineReminders,
    markMedicineTaken,
    setCheckinModalAppointment
  } = useApp();

  const [symptomInput, setSymptomInput] = useState('');

  const upcomingAppointment = appointments.find(a => a.status === 'Confirmed' || a.status === 'Checked-In') || appointments[0];

  const handleQuickSymptomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomInput.trim()) return;
    setActiveTab('symptom-check');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Bento Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Hero Card - AI Symptom Checker (Col Span 7) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-cyan-600 via-teal-700 to-slate-900 rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl border border-white/10 group min-h-[320px]">
          <div className="z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 text-xs font-semibold mb-4 border border-white/20 text-white shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
              <span>AI CLINICAL ASSISTANT</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3 leading-tight tracking-tight">
              Symptom Checker &<br />Specialist Guide
            </h1>
            <p className="text-cyan-50/90 max-w-md text-xs sm:text-sm leading-relaxed">
              Describe symptoms for <strong className="text-white underline decoration-cyan-300">{selectedFamilyMember.name}</strong> via text or voice. Our AI will guide you to the correct department immediately.
            </p>
          </div>

          <form onSubmit={handleQuickSymptomSubmit} className="z-10 mt-6 space-y-3">
            <div className="relative">
              <input
                type="text"
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                placeholder="Describe headache, fever, cough, chest tightness..."
                className="w-full bg-slate-900/80 backdrop-blur-md border border-white/20 rounded-2xl pl-4 pr-12 py-3.5 text-xs sm:text-sm text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-all shadow-inner"
              />
              <button
                type="button"
                onClick={() => setActiveTab('symptom-check')}
                className="absolute right-3 top-3 text-cyan-200 hover:text-white p-1 transition-colors"
                title="Voice Input"
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="bg-white text-cyan-950 font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-xl shadow-cyan-950/20 hover:scale-[1.02] transition-all flex items-center space-x-2 cursor-pointer"
              >
                <span>Start AI Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => triggerEmergencySOS()}
                className="bg-red-500/20 backdrop-blur-md border border-red-400/40 text-red-200 font-bold text-xs px-4 py-3.5 rounded-2xl hover:bg-red-500/30 transition-all flex items-center space-x-2 cursor-pointer ml-auto"
              >
                <Siren className="w-4 h-4 text-red-400 animate-pulse" />
                <span>SOS Dispatch</span>
              </button>
            </div>
          </form>

          {/* Decorative subtle background shapes */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute right-8 top-12 hidden sm:flex flex-col gap-2 opacity-30 pointer-events-none">
            <div className="w-32 h-1 bg-white rounded-full"></div>
            <div className="w-48 h-1 bg-white rounded-full ml-4"></div>
            <div className="w-24 h-1 bg-white rounded-full ml-12"></div>
          </div>
        </div>

        {/* Right Column Stack: Next Appointment + Health Pass (Col Span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Next Appointment Card */}
          {upcomingAppointment ? (
            <div className="bg-[#1E293B] border border-slate-700/50 rounded-[2rem] p-6 flex flex-col justify-between shadow-xl flex-1">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-slate-400 uppercase tracking-wider text-xs flex items-center space-x-1.5">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span>Next OPD Appointment</span>
                  </h3>
                  <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold rounded-full border border-cyan-500/20">
                    CONFIRMED
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    <Stethoscope className="w-7 h-7 text-cyan-400" />
                  </div>
                  <div className="flex-1 truncate">
                    <p className="font-bold text-white text-base truncate">{upcomingAppointment.doctorName}</p>
                    <p className="text-xs text-slate-400 truncate">{upcomingAppointment.specialty} • {upcomingAppointment.hospitalName}</p>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/30 p-2.5 rounded-xl text-center">
                    <p className="text-lg font-mono font-extrabold text-cyan-400">{upcomingAppointment.tokenNumber}</p>
                    <p className="text-[9px] uppercase font-bold text-slate-400">Token</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-700/50 pt-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Slot & Date</p>
                  <p className="font-bold text-white text-xs">{upcomingAppointment.date} @ {upcomingAppointment.timeSlot}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCheckinModalAppointment(upcomingAppointment)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center space-x-1 cursor-pointer transition-all"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Kiosk QR</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('navigation')}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all cursor-pointer flex items-center space-x-1"
                  >
                    <Navigation2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Route</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#1E293B] border border-slate-700/50 rounded-[2rem] p-6 flex flex-col justify-between shadow-xl">
              <p className="text-xs text-slate-400">No active appointment pass found.</p>
              <button onClick={() => setActiveTab('doctors')} className="mt-2 text-xs text-cyan-400 font-bold hover:underline">
                Book a doctor consultation &rarr;
              </button>
            </div>
          )}

          {/* Health Wallet / ABHA Pass Mini Card */}
          <div className="bg-[#1E293B] border border-slate-700/50 rounded-[2rem] px-6 py-4 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">ABHA Health ID</p>
                <p className="text-sm font-extrabold text-white font-mono">{selectedFamilyMember.abhaId}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Blood Group</p>
              <p className="text-xs text-cyan-400 font-extrabold bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20 inline-block">
                {selectedFamilyMember.bloodGroup}
              </p>
            </div>
          </div>

        </div>

        {/* Quick Action Bento Grid Items */}
        <div className="lg:col-span-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => setActiveTab('ambulance')}
            className="bg-[#1E293B] border border-slate-700/50 hover:border-red-500/50 rounded-2xl p-4 transition-all cursor-pointer text-left space-y-2 group shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
              <Siren className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="font-extrabold text-xs text-slate-100">Live Ambulance</p>
              <p className="text-[10px] text-slate-400 mt-0.5">GPS Dispatch & Tracker</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('lab_tests')}
            className="bg-[#1E293B] border border-slate-700/50 hover:border-cyan-500/50 rounded-2xl p-4 transition-all cursor-pointer text-left space-y-2 group shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-xs text-slate-100">Lab Test Booking</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Home Sample Pickup</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('pharmacy')}
            className="bg-[#1E293B] border border-slate-700/50 hover:border-emerald-500/50 rounded-2xl p-4 transition-all cursor-pointer text-left space-y-2 group shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-xs text-slate-100">E-Pharmacy</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Order Meds in 30Mins</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('video_consult')}
            className="bg-[#1E293B] border border-slate-700/50 hover:border-teal-500/50 rounded-2xl p-4 transition-all cursor-pointer text-left space-y-2 group shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-xs text-slate-100">Video Consult</p>
              <p className="text-[10px] text-slate-400 mt-0.5">WebRTC Teleconsult</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('insurance')}
            className="bg-[#1E293B] border border-slate-700/50 hover:border-blue-500/50 rounded-2xl p-4 transition-all cursor-pointer text-left space-y-2 group shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-xs text-slate-100">Health Insurance</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Cashless Claims Hub</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('health_score')}
            className="bg-[#1E293B] border border-slate-700/50 hover:border-amber-500/50 rounded-2xl p-4 transition-all cursor-pointer text-left space-y-2 group shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-xs text-slate-100">AI Health Score</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Vitals Index 86/100</p>
            </div>
          </button>
        </div>

        {/* Bottom Bento Row: Medical Records, Medicine Tracker & Vitals Summary */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Medical Records Card */}
          <div className="bg-[#1E293B] border border-slate-700/50 rounded-[2rem] p-6 flex flex-col justify-between shadow-xl min-h-[260px]">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-300 uppercase tracking-wider text-xs flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Medical Vault</span>
                </h3>
                <button onClick={() => setActiveTab('records')} className="text-cyan-400 text-xs font-bold hover:underline">
                  View All
                </button>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-800/60 rounded-2xl p-3.5 border border-slate-700/40 flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 truncate">
                    <p className="text-xs font-bold text-white truncate">Full Blood Panel Lab</p>
                    <p className="text-[10px] text-slate-400">Oct 12, 2025 • LabCorp</p>
                  </div>
                  <span className="text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    AI Parsed
                  </span>
                </div>

                <div className="bg-slate-800/60 rounded-2xl p-3.5 border border-slate-700/40 flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 text-purple-400 rounded-xl">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 truncate">
                    <p className="text-xs font-bold text-white truncate">Chest Radiology X-Ray</p>
                    <p className="text-[10px] text-slate-400">Sep 28, 2025 • City General</p>
                  </div>
                  <span className="text-slate-400 text-[10px]">Verified</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('records')}
              className="mt-4 w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center justify-center space-x-1 transition-all cursor-pointer"
            >
              <span>Upload New Prescription or Lab Scan</span>
              <ChevronRight className="w-4 h-4 text-cyan-400" />
            </button>
          </div>

          {/* Medicine Tracker */}
          <div className="bg-[#1E293B] border border-slate-700/50 rounded-[2rem] p-6 flex flex-col justify-between shadow-xl min-h-[260px]">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-300 uppercase tracking-wider text-xs flex items-center space-x-1.5">
                  <Pill className="w-4 h-4 text-cyan-400" />
                  <span>Medicine Tracker</span>
                </h3>
                <button onClick={() => setActiveTab('medicines')} className="text-cyan-400 text-xs font-bold hover:underline">
                  Full Schedule
                </button>
              </div>

              <div className="space-y-3">
                {medicineReminders.slice(0, 2).map((rem) => (
                  <div key={rem.id} className="flex items-center gap-3 p-3 bg-slate-800/60 rounded-2xl border border-slate-700/40">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs shrink-0">
                      {rem.times[0] || '08:00'}
                    </div>
                    <div className="flex-1 truncate">
                      <p className="text-xs font-bold text-white truncate">{rem.medicineName}</p>
                      <p className="text-[10px] text-slate-400">{rem.dosage} • {rem.instructions}</p>
                    </div>
                    <button
                      onClick={() => markMedicineTaken(rem.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-[11px] border border-emerald-500/30 cursor-pointer shrink-0"
                    >
                      Taken
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveTab('medicines')}
              className="mt-4 w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center justify-center space-x-1 transition-all cursor-pointer"
            >
              <span>+ Add Medication Reminder</span>
            </button>
          </div>

          {/* Vitals Summary Chart Card */}
          <div className="bg-[#1E293B] border border-slate-700/50 rounded-[2rem] p-6 flex flex-col justify-between shadow-xl min-h-[260px]">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-slate-300 uppercase tracking-wider text-xs flex items-center space-x-1.5">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Vitals Summary</span>
                </h3>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  HEALTHY
                </span>
              </div>

              <div className="mb-3">
                <p className="text-3xl font-extrabold text-white">72 <span className="text-xs text-slate-400 font-normal">BPM</span></p>
                <p className="text-[11px] text-emerald-400 font-medium">Resting pulse within normal range</p>
              </div>

              {/* Stylized bento bar graph */}
              <div className="flex items-end gap-2 h-16 mb-3">
                <div className="flex-1 bg-cyan-500/20 rounded-t-lg h-8"></div>
                <div className="flex-1 bg-cyan-500/20 rounded-t-lg h-12"></div>
                <div className="flex-1 bg-cyan-500/50 rounded-t-lg h-16 border-t-2 border-cyan-400"></div>
                <div className="flex-1 bg-cyan-500/20 rounded-t-lg h-10"></div>
                <div className="flex-1 bg-cyan-500/30 rounded-t-lg h-14"></div>
                <div className="flex-1 bg-cyan-500/20 rounded-t-lg h-9"></div>
                <div className="flex-1 bg-cyan-500/40 rounded-t-lg h-11"></div>
              </div>
            </div>

            <div className="flex justify-between items-center bg-slate-800/60 p-3 rounded-2xl border border-slate-700/40 text-xs">
              <span className="text-slate-400">Sleep: <strong className="text-white">7h 20m</strong></span>
              <span className="text-slate-400">BP: <strong className="text-white">120/80</strong></span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};


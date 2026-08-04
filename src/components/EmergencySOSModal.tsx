import React from 'react';
import { useApp } from '../context/AppContext';
import { Siren, Phone, MapPin, X, CheckCircle2, ShieldAlert, Navigation2 } from 'lucide-react';

export const EmergencySOSModal: React.FC = () => {
  const { activeSOS, setActiveSOS, user, selectedFamilyMember, hospitals } = useApp();

  if (!activeSOS) return null;

  const nearestHosp = hospitals[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-red-500/80 rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.4)] p-6 text-slate-100 relative overflow-hidden animate-fadeIn">
        
        {/* Siren Glow top bar */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-red-600 animate-pulse"></div>

        <button
          onClick={() => setActiveSOS(null)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-4">
          
          <div className="w-20 h-20 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center mx-auto text-red-500 animate-bounce shadow-lg shadow-red-600/50">
            <Siren className="w-10 h-10 animate-spin" />
          </div>

          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-400 bg-red-500/20 px-3 py-1 rounded-full border border-red-500/30">
              DISTRESS ALERT ACTIVE
            </span>
            <h2 className="text-2xl font-extrabold text-slate-100 mt-2">Emergency SOS Dispatched</h2>
            <p className="text-xs text-slate-300 mt-1">
              Ambulance dispatched for <strong className="text-white">{selectedFamilyMember.name}</strong> to address: <strong className="text-cyan-300">{user.address}</strong>
            </p>
          </div>

          {/* Dispatch Status Card */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-red-500/40 text-left space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs text-slate-400">Assigned Hospital:</span>
              <span className="font-bold text-slate-100 text-xs">{nearestHosp.name}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs text-slate-400">Paramedic Unit:</span>
              <span className="font-mono font-bold text-cyan-300 text-xs">{activeSOS.ambulanceDriver}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Estimated Arrival (ETA):</span>
              <span className="font-mono font-extrabold text-red-400 text-lg animate-pulse">{activeSOS.ETA}</span>
            </div>
          </div>

          {/* Emergency Contact Broadcast Info */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-start space-x-2 text-left">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              SMS with GPS coordinates broadcasted to emergency contact: <strong>{user.emergencyContact.name} ({user.emergencyContact.phone})</strong>
            </span>
          </div>

          {/* Emergency Hotline Button */}
          <div className="pt-2 flex space-x-3">
            <a
              href="tel:911"
              className="flex-1 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-lg shadow-red-600/40 flex items-center justify-center space-x-2 transition-all"
            >
              <Phone className="w-4 h-4 animate-bounce" />
              <span>Direct Emergency Hotline (911)</span>
            </a>

            <button
              onClick={() => setActiveSOS(null)}
              className="px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 cursor-pointer"
            >
              Resolve Alert
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

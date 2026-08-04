import React from 'react';
import { useApp } from '../context/AppContext';
import { User, Wallet, ShieldCheck, Phone, MapPin, Plus, Heart, QrCode } from 'lucide-react';

export const PatientProfile: React.FC = () => {
  const { user, selectedFamilyMember } = useApp();

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      
      {/* Account Info Header */}
      <div className="bg-[#1E293B] border border-slate-700/50 rounded-[2rem] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-slate-950 font-extrabold text-2xl flex items-center justify-center ring-4 ring-cyan-500/20 shrink-0">
            {user.name.charAt(0)}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-extrabold text-slate-100">{user.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                Phone Verified ({user.phone})
              </span>
            </div>

            <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start space-x-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{user.address}</span>
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center sm:text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-mono">Digital Health Wallet</span>
            <span className="text-2xl font-extrabold text-cyan-400 font-mono">${user.walletBalance}</span>
            <span className="text-[9px] text-emerald-400 block mt-0.5">Insurance Pre-authorized</span>
          </div>
        </div>
      </div>

      {/* Emergency Contact & Medical ID Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-red-400 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-red-400" />
            <span>Emergency SOS Contact</span>
          </h3>

          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1">
            <p className="font-bold text-slate-100">{user.emergencyContact.name} ({user.emergencyContact.relationship})</p>
            <p className="font-mono text-cyan-400">{user.emergencyContact.phone}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
            <Heart className="w-4 h-4 text-cyan-400" />
            <span>Active Selected Profile</span>
          </h3>

          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1">
            <p className="font-bold text-slate-100">{selectedFamilyMember.name}</p>
            <p className="text-slate-400">{selectedFamilyMember.age} Yrs • Blood Group: <strong className="text-red-400">{selectedFamilyMember.bloodGroup}</strong></p>
          </div>
        </div>

      </div>

    </div>
  );
};

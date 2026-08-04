import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Users, Building2, Stethoscope, Activity, CheckCircle2, Clock, Check, AlertCircle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { hospitals, doctors, appointments, approveHospital } = useApp();
  const [filterTab, setFilterTab] = useState<'All' | 'Pending' | 'Verified'>('All');

  const pendingHospitals = hospitals.filter(h => h.isApproved === false);
  const verifiedHospitals = hospitals.filter(h => h.isApproved !== false);

  const displayedHospitals = hospitals.filter(h => {
    if (filterTab === 'Pending') return h.isApproved === false;
    if (filterTab === 'Verified') return h.isApproved !== false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#1E293B] border border-slate-700/50 rounded-[2rem] p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2 px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Super Admin & Governance Console</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Super Admin Master Control</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Review hospital self-registrations, verify NABH licenses, and manage live Firestore records.</p>
        </div>
        <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-cyan-400 font-mono text-xs font-bold shrink-0 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Firestore Connected • {hospitals.length} Facilities</span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Total Hospitals</span>
            <Building2 className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-3xl font-extrabold font-mono text-slate-100">{hospitals.length}</span>
          <p className="text-[11px] text-slate-400 mt-1">{verifiedHospitals.length} Verified • {pendingHospitals.length} Pending</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Pending Approvals</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-3xl font-extrabold font-mono text-amber-400">{pendingHospitals.length}</span>
          <p className="text-[11px] text-amber-300/80 mt-1">Requires Super Admin Review</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Verified Specialists</span>
            <Stethoscope className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-3xl font-extrabold font-mono text-slate-100">{doctors.length}</span>
          <p className="text-[11px] text-slate-400 mt-1">NMC Registered</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Live Appointments</span>
            <Activity className="w-4 h-4 text-teal-400" />
          </div>
          <span className="text-3xl font-extrabold font-mono text-slate-100">{appointments.length}</span>
          <p className="text-[11px] text-slate-400 mt-1">Firestore Synced</p>
        </div>
      </div>

      {/* Hospital Verification Directory */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-extrabold text-lg text-slate-100">Hospital Onboarding Verification Directory</h3>
            <p className="text-xs text-slate-400">Patients only see verified hospitals approved by the Super Admin.</p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-2xl border border-slate-800 self-start sm:self-auto">
            {(['All', 'Pending', 'Verified'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterTab === tab
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab} {tab === 'Pending' && pendingHospitals.length > 0 && `(${pendingHospitals.length})`}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-800/80">
          {displayedHospitals.map(h => {
            const isApproved = h.isApproved !== false;

            return (
              <div key={h.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-extrabold text-sm text-slate-100">{h.name}</h4>
                    {isApproved ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-[10px] flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Verified & Approved</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-[10px] flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>Pending Super Admin Verification</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400">{h.address}, {h.city} • Phone: {h.phone}</p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Govt License: {h.registrationNo || 'REG-PENDING'} • Fee: ₹{h.consultationFee} • OPD: {h.opdTimings || '08:00 AM - 08:00 PM'}
                  </p>
                </div>

                <div className="shrink-0 flex items-center space-x-2">
                  {!isApproved ? (
                    <button
                      onClick={() => approveHospital(h.id)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center space-x-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve & Verify Hospital</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-mono bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                      Live in Patient Directory
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {displayedHospitals.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-xs">
              No hospitals found in this filter view.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

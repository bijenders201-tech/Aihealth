import React from 'react';
import { useApp } from '../context/AppContext';
import { Stethoscope, Calendar, CheckCircle2, UserCheck, Clock, FileText } from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
  const { appointments, checkInHospital } = useApp();

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Doctor Workstation</span>
          <h2 className="text-2xl font-extrabold text-slate-100 mt-1">Dr. Rajesh Sharma (Cardiology)</h2>
          <p className="text-xs text-slate-400">City Care Community Hospital • OPD Room 204</p>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-mono">
          Live OPD Queue: Active
        </div>
      </div>

      {/* OPD Queue Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-base text-slate-100 flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <span>Today's OPD Patient Queue</span>
        </h3>

        <div className="space-y-3">
          {appointments.map(apt => (
            <div key={apt.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center space-x-3">
                <span className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-300 font-extrabold font-mono flex items-center justify-center text-sm">
                  {apt.tokenNumber}
                </span>
                <div>
                  <h4 className="font-bold text-slate-100">{apt.patientName}</h4>
                  <p className="text-[11px] text-slate-400">Time: {apt.timeSlot} • Type: {apt.type}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  apt.status === 'Checked-In' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'
                }`}>
                  {apt.status}
                </span>

                {apt.status === 'Confirmed' && (
                  <button
                    onClick={() => checkInHospital(apt.id)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 font-bold hover:bg-cyan-500/30 border border-cyan-500/40 cursor-pointer"
                  >
                    Call Patient
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

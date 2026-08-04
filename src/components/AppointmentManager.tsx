import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QRCodeSVG } from 'qrcode.react';
import {
  Calendar,
  Clock,
  QrCode,
  XCircle,
  Building2,
  Stethoscope,
  Navigation2,
  CheckCircle2,
  Ban,
  Download
} from 'lucide-react';
import { Appointment } from '../types';
import { OPDQueueTracker } from './OPDQueueTracker';

export const AppointmentManager: React.FC = () => {
  const {
    appointments,
    cancelAppointment,
    setNavTarget,
    setActiveTab,
    hospitals,
    setCheckinModalAppointment
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'All' | 'Confirmed' | 'Checked-In' | 'Completed' | 'Cancelled'>('All');
  const [selectedTicket, setSelectedTicket] = useState<Appointment | null>(appointments[0] || null);

  const filteredAppointments = appointments.filter(a => activeFilter === 'All' || a.status === activeFilter);

  const handleStartHospitalNav = (apt: Appointment) => {
    const hosp = hospitals.find(h => h.id === apt.hospitalId) || hospitals[0];
    const dept = hosp.departments.find(d => d.departmentName.toLowerCase().includes(apt.specialty.toLowerCase())) || hosp.departments[0];
    setNavTarget({ hospital: hosp, department: dept });
    setActiveTab('navigation');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      
      {/* Real-time OPD Queue Tracker Widget */}
      <OPDQueueTracker />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1E293B] border border-slate-700/50 rounded-[2rem] p-6 sm:p-8 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2 px-3 py-1 rounded-full">
            <Calendar className="w-3.5 h-3.5" />
            <span>Digital Queue & Appointment Passbook</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">My Medical Appointments</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Scan QR code at hospital lobby kiosks for instant check-in and digital queue status.</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          {(['All', 'Confirmed', 'Checked-In', 'Completed', 'Cancelled'] as const).map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === f ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Appointments List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              onClick={() => setSelectedTicket(apt)}
              className={`bg-slate-900 border rounded-3xl p-5 shadow-xl transition-all cursor-pointer ${
                selectedTicket?.id === apt.id ? 'border-cyan-500 ring-1 ring-cyan-500/40' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-extrabold font-mono text-sm">
                    {apt.tokenNumber}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-100">{apt.doctorName}</h3>
                    <p className="text-xs text-cyan-400 font-semibold">{apt.specialty} • {apt.hospitalName}</p>
                  </div>
                </div>

                <span className={`self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold ${
                  apt.status === 'Confirmed' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                  apt.status === 'Checked-In' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  apt.status === 'Completed' ? 'bg-slate-800 text-slate-300 border border-slate-700' :
                  'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}>
                  {apt.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-3 text-xs text-slate-300 font-medium">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Date & Time</span>
                  <span>{apt.date} • {apt.timeSlot}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Patient Name</span>
                  <span>{apt.patientName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Consultation Fee</span>
                  <span className="text-emerald-400 font-mono font-bold">₹ {apt.consultationFee} ({apt.paymentStatus})</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); setCheckinModalAppointment(apt); }}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Show QR Pass</span>
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); handleStartHospitalNav(apt); }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer"
                >
                  <Navigation2 className="w-3.5 h-3.5" />
                  <span>OPD Indoor Route</span>
                </button>

                {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); cancelAppointment(apt.id); }}
                    className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>

        {/* Selected Ticket Pass Preview */}
        {selectedTicket && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl h-fit space-y-4 text-center sticky top-20">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Digital Boarding Pass</span>
              <h3 className="font-extrabold text-lg text-slate-100">{selectedTicket.doctorName}</h3>
              <p className="text-xs text-slate-400">{selectedTicket.hospitalName}</p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 inline-block mx-auto">
              <QRCodeSVG
                value={selectedTicket.qrCodeData}
                size={140}
                bgColor="#090d16"
                fgColor="#06b6d4"
                level="H"
              />
              <p className="text-[10px] text-slate-400 font-mono mt-2">{selectedTicket.id}</p>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-3 text-cyan-300">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Queue Token Number</span>
              <span className="text-3xl font-black font-mono text-cyan-400">{selectedTicket.tokenNumber}</span>
            </div>

            <div className="text-left text-xs space-y-2 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Time Slot:</span>
                <span className="font-bold text-slate-200">{selectedTicket.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Patient:</span>
                <span className="font-bold text-slate-200">{selectedTicket.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Consultation Type:</span>
                <span className="font-bold text-cyan-400">{selectedTicket.type}</span>
              </div>
            </div>

            <button
              onClick={() => alert(`Downloaded digital ticket pass for Token ${selectedTicket.tokenNumber}`)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-extrabold text-xs shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Save Ticket PDF</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
};

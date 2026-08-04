import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QrCode, X, CheckCircle2, RefreshCw, Sparkles, Building2 } from 'lucide-react';
import { Appointment } from '../types';

export const QRCheckinModal: React.FC<{ appointment: Appointment | null; onClose: () => void }> = ({
  appointment,
  onClose
}) => {
  const { checkInHospital } = useApp();

  const [scanning, setScanning] = useState(false);
  const [scannedSuccess, setScannedSuccess] = useState(false);

  if (!appointment) return null;

  const handleStartScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScannedSuccess(true);
      checkInHospital(appointment.id);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-100 relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {!scannedSuccess ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto">
              <QrCode className="w-6 h-6 text-cyan-400" />
            </div>

            <h3 className="text-xl font-extrabold text-slate-100">Hospital Lobby QR Check-In</h3>
            <p className="text-xs text-slate-300">
              Checking in for <strong className="text-cyan-400">{appointment.doctorName}</strong> at <strong className="text-slate-100">{appointment.hospitalName}</strong>
            </p>

            {/* Camera Viewport Simulation */}
            <div className="w-full h-56 bg-slate-950 rounded-2xl border-2 border-dashed border-cyan-500/40 relative flex items-center justify-center overflow-hidden my-4">
              {scanning ? (
                <div className="flex flex-col items-center space-y-2">
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                  <span className="text-xs text-cyan-300 font-mono">Reading Hospital Kiosk Barcode...</span>
                </div>
              ) : (
                <div className="text-center p-4 space-y-2">
                  <div className="w-24 h-24 border-2 border-cyan-400 rounded-xl mx-auto flex items-center justify-center relative">
                    <span className="w-full h-0.5 bg-cyan-400 absolute top-1/2 animate-pulse"></span>
                    <QrCode className="w-12 h-12 text-slate-600" />
                  </div>
                  <p className="text-[11px] text-slate-400">Position kiosk barcode within camera frame</p>
                </div>
              )}
            </div>

            <button
              onClick={handleStartScan}
              disabled={scanning}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              Simulate Camera Barcode Scan
            </button>
          </div>
        ) : (
          /* Checked-In Live Queue Ticket */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-xl font-extrabold text-slate-100">Lobby Check-In Complete!</h3>
            
            <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/40 space-y-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-mono">Active OPD Live Queue Token</span>
              <span className="text-3xl font-extrabold font-mono text-emerald-400">{appointment.tokenNumber}</span>
              <p className="text-xs text-slate-300">
                Status: <strong className="text-emerald-400">In Live OPD Queue (Position #3)</strong>
              </p>
              <p className="text-[11px] text-slate-400">
                Please proceed to <strong className="text-cyan-300">Building B, 2nd Floor (OPD 204)</strong>. Estimated wait time: ~12 minutes.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 cursor-pointer"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Bed, 
  Clock, 
  Droplet, 
  Users, 
  TrendingUp, 
  Plus, 
  ShieldCheck, 
  Activity, 
  DollarSign, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { HospitalSelfRegistrationModal } from './HospitalSelfRegistrationModal';
import { DoctorVerificationModal } from './DoctorVerificationModal';

export const HospitalDashboard: React.FC = () => {
  const { hospitals } = useApp();
  const hosp = hospitals[0] || {
    name: 'City Care Super Specialty Hospital',
    address: 'Sector 12, Ring Road',
    city: 'New Delhi',
    totalBeds: 150,
    availableBeds: 42,
    erWaitTimeMinutes: 12
  };

  const [beds, setBeds] = useState(hosp.availableBeds);
  const [icuBeds, setIcuBeds] = useState(8);
  const [erWait, setErWait] = useState(hosp.erWaitTimeMinutes);
  
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'inventory' | 'analytics' | 'blood_bank'>('inventory');

  // Blood Bank Inventory State
  const [bloodUnits, setBloodUnits] = useState({
    'A+': 18,
    'A-': 6,
    'B+': 24,
    'B-': 4,
    'AB+': 12,
    'AB-': 2,
    'O+': 35,
    'O-': 8
  });

  const handleUpdateBlood = (group: keyof typeof bloodUnits, delta: number) => {
    setBloodUnits(prev => ({
      ...prev,
      [group]: Math.max(0, prev[group] + delta)
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      
      {/* Header with Quick Modals */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>Hospital Administration & Emergency Operations</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100">{hosp.name}</h2>
          <p className="text-xs text-slate-400">{hosp.address}, {hosp.city}</p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setShowRegisterModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Register New Hospital</span>
          </button>

          <button
            onClick={() => setShowDoctorModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Verify Doctor License</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'inventory' ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ICU & Bed Capacity
        </button>

        <button
          onClick={() => setActiveTab('blood_bank')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'blood_bank' ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Blood Bank Inventory
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'analytics' ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Hospital Operations Analytics
        </button>
      </div>

      {/* Tab 1: Bed Inventory */}
      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
              <Bed className="w-4 h-4 text-emerald-400" />
              <span>General Ward & Private Beds</span>
            </h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Available General Beds (out of {hosp.totalBeds})</label>
              <input
                type="number"
                value={beds}
                onChange={(e) => setBeds(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <button
              onClick={() => alert('General Bed inventory updated in MediRoute GPS Network!')}
              className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Update General Bed Count
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>ICU & Ventilator Critical Care Beds</span>
            </h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Available ICU Beds (MICU, CCU, PICU)</label>
              <input
                type="number"
                value={icuBeds}
                onChange={(e) => setIcuBeds(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <button
              onClick={() => alert('ICU Bed availability synced with Emergency SOS Dispatch!')}
              className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Update Live ICU Beds
            </button>
          </div>

        </div>
      )}

      {/* Tab 2: Blood Bank Inventory */}
      {activeTab === 'blood_bank' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
            <Droplet className="w-5 h-5 text-red-500" />
            <div>
              <h3 className="font-extrabold text-base text-white">Hospital Blood Bank Stock Ledger</h3>
              <p className="text-xs text-slate-400">Manage real-time available blood units for emergency transfusions</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(bloodUnits).map(([group, units]) => (
              <div key={group} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center space-y-2">
                <span className="text-lg font-black font-mono text-red-400 block">{group}</span>
                <span className="text-2xl font-bold text-white block">{units} <span className="text-xs text-slate-400 font-normal">units</span></span>
                
                <div className="flex justify-center space-x-2 pt-1">
                  <button
                    onClick={() => handleUpdateBlood(group as keyof typeof bloodUnits, -1)}
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm cursor-pointer"
                  >
                    -
                  </button>
                  <button
                    onClick={() => handleUpdateBlood(group as keyof typeof bloodUnits, 1)}
                    className="w-7 h-7 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-bold text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Hospital Analytics Dashboard */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Bed Occupancy Rate</span>
              <p className="text-2xl font-black text-cyan-400 font-mono">78.4%</p>
              <span className="text-[10px] text-emerald-400 flex items-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span>+4.2% vs last week</span>
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Daily OPD Footfall</span>
              <p className="text-2xl font-black text-emerald-400 font-mono">342 Patients</p>
              <span className="text-[10px] text-slate-400">Avg consultation 8 mins</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Avg ER Wait Time</span>
              <p className="text-2xl font-black text-amber-400 font-mono">12 Mins</p>
              <span className="text-[10px] text-emerald-400">Optimized by AI Triage</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Revenue</span>
              <p className="text-2xl font-black text-purple-400 font-mono">₹ 18.4 Lakhs</p>
              <span className="text-[10px] text-slate-400">OPD + Lab + Pharmacy</span>
            </div>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
            <h3 className="font-extrabold text-sm text-white">OPD & ER Patient Rush Hours Heatmap</h3>
            <div className="grid grid-cols-6 gap-2 text-center text-[10px] font-mono">
              <div className="p-3 bg-cyan-950/40 border border-cyan-500/20 rounded-xl text-slate-300">08:00 AM<br/><span className="text-cyan-400 font-bold">Moderate</span></div>
              <div className="p-3 bg-red-950/50 border border-red-500/40 rounded-xl text-slate-300">10:00 AM<br/><span className="text-red-400 font-bold">PEAK RUSH</span></div>
              <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-slate-300">01:00 PM<br/><span className="text-amber-300 font-bold">High</span></div>
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-slate-300">04:00 PM<br/><span className="text-emerald-400 font-bold">Low</span></div>
              <div className="p-3 bg-red-950/50 border border-red-500/40 rounded-xl text-slate-300">06:00 PM<br/><span className="text-red-400 font-bold">PEAK RUSH</span></div>
              <div className="p-3 bg-cyan-950/40 border border-cyan-500/20 rounded-xl text-slate-300">09:00 PM<br/><span className="text-cyan-400 font-bold">Moderate</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showRegisterModal && (
        <HospitalSelfRegistrationModal onClose={() => setShowRegisterModal(false)} />
      )}

      {showDoctorModal && (
        <DoctorVerificationModal onClose={() => setShowDoctorModal(false)} />
      )}

    </div>
  );
};

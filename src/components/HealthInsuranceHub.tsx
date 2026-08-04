import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Building2,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  ArrowRight,
  Download,
  AlertCircle,
  CreditCard
} from 'lucide-react';

export const HealthInsuranceHub: React.FC = () => {
  const { user, insurance, selectedFamilyMember, hospitals } = useApp();

  const [activeTab, setActiveTab] = useState<'card' | 'claim' | 'hospitals'>('card');
  const [searchHospital, setSearchHospital] = useState('');
  
  // Claim Form State
  const [hospitalName, setHospitalName] = useState('Apex General Medical Center');
  const [claimAmount, setClaimAmount] = useState('25000');
  const [claimType, setClaimType] = useState('Cashless Pre-Authorization');
  const [claimSuccessMsg, setClaimSuccessMsg] = useState('');

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClaimSuccessMsg(`Cashless Claim Pre-Authorization Request of ₹${claimAmount} for ${selectedFamilyMember.name} submitted successfully! Claim Reference: CLM-${Math.floor(100000 + Math.random() * 900000)}.`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Header */}
      <div className="bg-[#1E293B] border border-slate-700/50 rounded-[2rem] p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-wider mb-2 px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Digital ABHA Health Insurance Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Health Insurance & Cashless Claims</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Instant cashless authorization at 10,000+ network hospitals, digital card, and claim tracker.</p>
        </div>

        {/* View Switcher */}
        <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1 shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('card')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'card' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Digital Policy Card
          </button>
          <button
            onClick={() => setActiveTab('claim')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'claim' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            File Cashless Claim
          </button>
          <button
            onClick={() => setActiveTab('hospitals')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'hospitals' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Network Hospitals
          </button>
        </div>
      </div>

      {/* Success Alert */}
      {claimSuccessMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-emerald-300 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{claimSuccessMsg}</span>
          </div>
          <button onClick={() => setClaimSuccessMsg('')} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* TAB 1: Digital Policy Card View */}
      {activeTab === 'card' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Digital Card Graphic (Col Span 7) */}
          <div className="lg:col-span-7 bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 border border-blue-500/30 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-widest block">{insurance.providerName}</span>
                <h3 className="text-2xl font-extrabold text-white mt-0.5">Comprehensive Health Shield</h3>
              </div>
              <ShieldCheck className="w-10 h-10 text-cyan-400 animate-pulse" />
            </div>

            <div className="my-6 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Policy Number</span>
              <p className="text-xl font-mono font-extrabold text-white tracking-widest">{insurance.policyNumber}</p>
            </div>

            <div className="flex justify-between items-end border-t border-white/10 pt-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Insured Name</span>
                <span className="font-bold text-white text-sm">{user.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Sum Insured</span>
                <span className="font-extrabold text-emerald-400 text-sm">₹{insurance.coverageAmount.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Valid Thru</span>
                <span className="font-bold text-white">{insurance.validTill}</span>
              </div>
            </div>
          </div>

          {/* Policy Balance Breakdown & Stats (Col Span 5) */}
          <div className="lg:col-span-5 bg-[#1E293B] border border-slate-700/50 rounded-[2.5rem] p-6 shadow-2xl space-y-5">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-cyan-400" /> Coverage Balance & Usage
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Total Sum Insured</span>
                <span className="font-extrabold text-white">₹{insurance.coverageAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Claims Used (YTD)</span>
                <span className="font-extrabold text-rose-400">₹{insurance.claimedAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-cyan-500 h-full rounded-full"
                  style={{ width: `${(insurance.claimedAmount / insurance.coverageAmount) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs pt-1">
                <span className="text-emerald-400 font-bold">Remaining Balance</span>
                <span className="font-extrabold text-emerald-400">
                  ₹{(insurance.coverageAmount - insurance.claimedAmount).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-xs space-y-2">
              <span className="font-extrabold text-slate-300 block">Covered Features:</span>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Daycare Procedures</p>
                <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> ICU & Room Rent</p>
                <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Ambulance Cover</p>
                <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> AYUSH Treatments</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: File Claim Form */}
      {activeTab === 'claim' && (
        <div className="bg-[#1E293B] border border-slate-700/50 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl max-w-3xl mx-auto space-y-5">
          <div>
            <h3 className="text-xl font-extrabold text-white">File Cashless Pre-Authorization Claim</h3>
            <p className="text-xs text-slate-400 mt-1">Submit hospital admission details for instant cashless approval.</p>
          </div>

          <form onSubmit={handleClaimSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-slate-300 block mb-1 font-bold">Select Beneficiary</label>
              <input
                type="text"
                disabled
                value={`${selectedFamilyMember.name} (${selectedFamilyMember.relationship})`}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-cyan-300 font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1 font-bold">Hospital Name</label>
                <input
                  type="text"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1 font-bold">Estimated Claim Amount (₹)</label>
                <input
                  type="number"
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1 font-bold">Upload Hospital Estimate / Discharge Summary</label>
              <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-2xl p-6 text-center space-y-2 cursor-pointer bg-slate-950 transition-all">
                <Upload className="w-8 h-8 text-cyan-400 mx-auto" />
                <p className="text-xs text-slate-300 font-medium">Click to upload estimate bill or medical report (PDF / JPG)</p>
                <p className="text-[10px] text-slate-500">Max size 15MB • Encrypted transfer</p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs rounded-2xl shadow-xl shadow-teal-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>SUBMIT CASHLESS CLAIM FOR PRE-AUTHORIZATION</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: Network Hospitals Lookup */}
      {activeTab === 'hospitals' && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchHospital}
              onChange={(e) => setSearchHospital(e.target.value)}
              placeholder="Search cashless network hospital..."
              className="w-full bg-[#1E293B] border border-slate-700/50 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hospitals.map((hosp) => (
              <div key={hosp.id} className="bg-[#1E293B] border border-slate-700/50 rounded-2xl p-4 flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-extrabold text-white text-sm">{hosp.name}</h4>
                  <p className="text-slate-400">{hosp.address}, {hosp.city}</p>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold mt-1 inline-block">
                    ✓ 100% Cashless Approved Hospital
                  </span>
                </div>
                <button className="px-3 py-2 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 rounded-xl font-bold transition-all text-[11px] shrink-0">
                  Select for Admission
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

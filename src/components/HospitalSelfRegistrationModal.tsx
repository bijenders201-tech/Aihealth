import React, { useState } from 'react';
import { Building2, Upload, CheckCircle2, X, Plus, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Hospital } from '../types';

interface HospitalSelfRegistrationModalProps {
  onClose: () => void;
}

export const HospitalSelfRegistrationModal: React.FC<HospitalSelfRegistrationModalProps> = ({ onClose }) => {
  const { addHospital } = useApp();

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('Super Specialty & Emergency Trauma Centre');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [erWaitTimeMinutes, setErWaitTimeMinutes] = useState(15);
  const [availableBeds, setAvailableBeds] = useState(45);
  const [totalBeds, setTotalBeds] = useState(120);
  const [image, setImage] = useState('https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800');
  
  const [opdTimings, setOpdTimings] = useState('08:00 AM - 08:00 PM (Mon-Sat)');
  const [consultationFee, setConsultationFee] = useState(500);
  const [logo, setLogo] = useState('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=200');
  const [specialties, setSpecialties] = useState<string[]>(['Emergency & Trauma', 'Cardiology', 'ICU Care']);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAddSpecialty = () => {
    if (newSpecialty && !specialties.includes(newSpecialty)) {
      setSpecialties([...specialties, newSpecialty]);
      setNewSpecialty('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !licenseNumber) return;

    const newHosp: Hospital = {
      id: 'hosp_' + Date.now(),
      name,
      tagline,
      address,
      city,
      distanceKm: 2.5,
      rating: 4.8,
      totalReviews: 1,
      consultationFee: Number(consultationFee),
      erWaitTimeMinutes: Number(erWaitTimeMinutes),
      availableBeds: Number(availableBeds),
      totalBeds: Number(totalBeds),
      icuBeds: Math.floor(Number(totalBeds) * 0.15),
      is24x7: true,
      phone,
      registrationNo: licenseNumber,
      opdTimings,
      emergencyStatus: 'Active 24x7',
      isApproved: false, // Requires Super Admin approval
      image,
      logo,
      lat: 28.6139,
      lng: 77.2090,
      specialties,
      departments: [
        { id: 'dep1', departmentName: 'Emergency & Trauma', building: 'Main Wing', floor: 'Ground Floor', roomNumber: 'ER-101', doctorInCharge: 'Duty Officer' },
        { id: 'dep2', departmentName: 'General OPD', building: 'OPD Block', floor: '1st Floor', roomNumber: '101', doctorInCharge: 'Consultant Doctor' }
      ],
      facilities: ['24x7 Emergency', 'Advanced ICU', 'Blood Bank', 'Pharmacy', 'Digital X-Ray']
    };

    addHospital(newHosp);
    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-100 relative max-h-[90vh] overflow-y-auto space-y-6">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full mb-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Hospital Onboarding Portal</span>
            </div>
            <h2 className="text-xl font-extrabold text-white">Self-Register Hospital Network</h2>
          </div>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3 bg-emerald-950/30 border border-emerald-500/40 rounded-3xl">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-emerald-300">Hospital Application Submitted!</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Your facility <strong className="text-white">{name}</strong> has been registered in Firestore. It is currently <span className="text-amber-400 font-bold underline">Pending Super Admin Verification</span>. Once approved by the Super Admin, it will appear in the patient directory.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1">Hospital Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. St. Jude Memorial Care Center"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl p-3 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1">Govt. Medical License Reg. No *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HOSP-REG-2026-904"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl p-3 focus:border-cyan-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase block mb-1">Full Address & Location *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sector 12, Ring Road, Near AIIMS"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl p-3 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1">Emergency Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1">ER Wait Time (mins)</label>
                <input
                  type="number"
                  value={erWaitTimeMinutes}
                  onChange={(e) => setErWaitTimeMinutes(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl p-2.5 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1">Available Beds Count</label>
                <input
                  type="number"
                  value={availableBeds}
                  onChange={(e) => setAvailableBeds(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1">Total Capacity Beds</label>
                <input
                  type="number"
                  value={totalBeds}
                  onChange={(e) => setTotalBeds(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl p-2.5 font-mono"
                />
              </div>
            </div>

            {/* Specialties tag builder */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase block mb-1">Clinical Specialties</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  placeholder="Add clinical specialty e.g. Oncology..."
                  className="flex-1 bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl px-3 py-2"
                />
                <button
                  type="button"
                  onClick={handleAddSpecialty}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs rounded-xl cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {specialties.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] rounded-lg font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              Submit Hospital Registration & Activate GPS
            </button>

          </form>
        )}

      </div>
    </div>
  );
};

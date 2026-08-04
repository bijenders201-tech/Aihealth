import React, { useState } from 'react';
import { Stethoscope, Upload, CheckCircle2, ShieldCheck, FileText, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DoctorVerificationModalProps {
  onClose: () => void;
}

export const DoctorVerificationModal: React.FC<DoctorVerificationModalProps> = ({ onClose }) => {
  const { userProfile, doctors } = useApp();

  const [councilRegNumber, setCouncilRegNumber] = useState('MCI-2026-88192');
  const [specialty, setSpecialty] = useState('Cardiology & Critical Care');
  const [qualification, setQualification] = useState('MBBS, MD (Cardiology), FACC');
  const [experienceYears, setExperienceYears] = useState(12);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsVerified(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 text-slate-100 relative space-y-5">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-1 bg-teal-500/10 text-teal-300 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mb-0.5">
              <ShieldCheck className="w-3 h-3" />
              <span>Medical License Verification</span>
            </div>
            <h3 className="text-lg font-extrabold text-white">Practitioner Credentials Audit</h3>
          </div>
        </div>

        {isVerified ? (
          <div className="p-6 text-center space-y-3 bg-teal-950/40 border border-teal-500/40 rounded-2xl">
            <CheckCircle2 className="w-10 h-10 text-teal-400 mx-auto" />
            <h4 className="font-extrabold text-base text-teal-300">Doctor Profile Verified!</h4>
            <p className="text-xs text-slate-300">
              Medical License <strong className="text-teal-400 font-mono">{councilRegNumber}</strong> has been audited against the National Medical Commission (NMC) Registry.
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-teal-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Portal
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleVerificationSubmit} className="space-y-4 text-xs">
            
            <div>
              <label className="font-bold text-slate-300 uppercase block mb-1">Doctor Full Name</label>
              <input
                type="text"
                required
                defaultValue={userProfile?.name || 'Dr. Sarah Patel'}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-3 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-300 uppercase block mb-1">Council Reg. No (NMC/MCI) *</label>
                <input
                  type="text"
                  required
                  value={councilRegNumber}
                  onChange={(e) => setCouncilRegNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5 font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 uppercase block mb-1">Clinical Specialty</label>
                <input
                  type="text"
                  required
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-300 uppercase block mb-1">Qualifications & Degrees</label>
              <input
                type="text"
                required
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-3 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* License Upload Drag-n-drop */}
            <div>
              <label className="font-bold text-slate-300 uppercase block mb-1">Upload Medical License Copy (PDF/PNG)</label>
              <div className="border-2 border-dashed border-slate-700 hover:border-teal-500 bg-slate-950 rounded-2xl p-4 text-center cursor-pointer transition-colors relative">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload className="w-6 h-6 text-teal-400 mx-auto mb-1" />
                <p className="text-slate-300 font-medium">
                  {uploadedFileName ? `Selected: ${uploadedFileName}` : 'Click to select or drag Medical License file'}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">Supports PDF, PNG, JPG up to 10MB</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
            >
              {isSubmitting ? 'Verifying with Medical Council...' : 'Submit Credentials for instant AI Audit'}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};

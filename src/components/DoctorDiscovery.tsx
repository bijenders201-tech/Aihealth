import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Stethoscope,
  Star,
  Globe2,
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  Video,
  Building2,
  X
} from 'lucide-react';
import { Doctor, Hospital } from '../types';

export const DoctorDiscovery: React.FC<{ prefilterSpecialty?: string }> = ({ prefilterSpecialty }) => {
  const { doctors, hospitals, familyMembers, selectedFamilyMember, bookAppointment, setActiveTab } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(prefilterSpecialty || 'All');
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('All');
  const [minRating, setMinRating] = useState<number>(0);

  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [bookingDate, setBookingDate] = useState('2026-08-06');
  const [bookingSlot, setBookingSlot] = useState('10:30 AM');
  const [bookingType, setBookingType] = useState<'OPD' | 'Teleconsultation'>('OPD');
  const [bookingFamilyId, setBookingFamilyId] = useState(selectedFamilyMember.id);
  const [bookingSuccessAptId, setBookingSuccessAptId] = useState<string | null>(null);

  const specialties: string[] = ['All', ...Array.from(new Set<string>(doctors.map(d => d.specialty)))];

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.languages.some((l: string) => l.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty.toLowerCase() === selectedSpecialty.toLowerCase();
    const matchesHospital = selectedHospitalId === 'All' || doc.hospitalId === selectedHospitalId;
    const matchesRating = doc.rating >= minRating;

    return matchesSearch && matchesSpecialty && matchesHospital && matchesRating;
  });

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDoctor) return;

    const hosp = hospitals.find(h => h.id === bookingDoctor.hospitalId) || hospitals[0];
    const newApt = bookAppointment(bookingDoctor, hosp, bookingDate, bookingSlot, bookingFamilyId, bookingType);

    setBookingSuccessAptId(newApt.id);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1E293B] border border-slate-700/50 rounded-[2rem] p-6 sm:p-8 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-wider mb-2 px-3 py-1 rounded-full">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Specialist OPD & Teleconsultation Network</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Find Specialists & OPD Doctors</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Instant digital queue tokens, verified qualifications, and multi-language doctors.</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doctor name, specialty, languages..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-2">Specialty:</span>
          {specialties.map(sp => (
            <button
              key={sp}
              onClick={() => setSelectedSpecialty(sp)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                selectedSpecialty.toLowerCase() === sp.toLowerCase()
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {sp}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <select
            value={selectedHospitalId}
            onChange={(e) => setSelectedHospitalId(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:border-cyan-500 focus:outline-none"
          >
            <option value="All">All Hospitals</option>
            {hospitals.map(h => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl hover:border-cyan-500/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start space-x-4">
                <img
                  src={doc.avatar}
                  alt={doc.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-cyan-500/30 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      {doc.specialty}
                    </span>
                    <div className="flex items-center space-x-1 text-amber-300 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{doc.rating}</span>
                      <span className="text-[10px] text-slate-500">({doc.totalReviews})</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-100 mt-1 truncate">{doc.name}</h3>
                  <p className="text-xs text-slate-400 font-mono truncate">{doc.qualification}</p>
                  
                  <p className="text-xs text-slate-300 mt-1 flex items-center space-x-1 truncate">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{doc.hospitalName}</span>
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">{doc.bio}</p>

              {/* Languages & Experience */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
                <div className="flex items-center space-x-1.5 text-slate-400">
                  <Globe2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>{doc.languages.join(', ')}</span>
                </div>
                <div className="font-semibold">
                  Experience: <span className="text-cyan-400 font-bold">{doc.experienceYears}+ Years</span>
                </div>
              </div>
            </div>

            {/* Bottom Booking Action */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Consultation Fee</span>
                <span className="text-base font-extrabold text-cyan-400">₹{doc.consultationFee}</span>
              </div>

              <button
                onClick={() => {
                  setBookingDoctor(doc);
                  setBookingSlot(doc.timeSlots[0] || '10:30 AM');
                  setBookingSuccessAptId(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </button>
            </div>
          </div>
        ))}

        {filteredDoctors.length === 0 && (
          <div className="col-span-full bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
            <Stethoscope className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="font-semibold text-sm text-slate-300">No doctors match your filter selection.</p>
          </div>
        )}
      </div>

      {/* Appointment Booking Modal */}
      {bookingDoctor && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-100 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setBookingDoctor(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            {!bookingSuccessAptId ? (
              <div>
                <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-800">
                  <img src={bookingDoctor.avatar} alt={bookingDoctor.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-cyan-500/40" />
                  <div>
                    <h3 className="font-bold text-base text-slate-100">{bookingDoctor.name}</h3>
                    <p className="text-xs text-cyan-400 font-semibold">{bookingDoctor.specialty} • {bookingDoctor.hospitalName}</p>
                  </div>
                </div>

                <form onSubmit={handleConfirmBooking} className="space-y-4">
                  
                  {/* Select Family Member */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">Select Patient Profile</label>
                    <select
                      value={bookingFamilyId}
                      onChange={(e) => setBookingFamilyId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl px-3.5 py-3 focus:border-cyan-500 focus:outline-none"
                    >
                      {familyMembers.map(f => (
                        <option key={f.id} value={f.id}>{f.name} ({f.relationship})</option>
                      ))}
                    </select>
                  </div>

                  {/* Consultation Type */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">Consultation Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setBookingType('OPD')}
                        className={`py-3 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                          bookingType === 'OPD' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <Building2 className="w-4 h-4" />
                        <span>In-Hospital OPD</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBookingType('Teleconsultation')}
                        className={`py-3 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                          bookingType === 'Teleconsultation' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <Video className="w-4 h-4" />
                        <span>HD Video Consultation</span>
                      </button>
                    </div>
                  </div>

                  {/* Select Date & Time Slot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">Date</label>
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl px-3 py-2.5 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">Time Slot</label>
                      <select
                        value={bookingSlot}
                        onChange={(e) => setBookingSlot(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl px-3 py-2.5 focus:border-cyan-500 focus:outline-none font-mono"
                      >
                        {bookingDoctor.timeSlots.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Fee Summary */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Total Consultation Fee</span>
                    <span className="font-extrabold text-cyan-400 text-sm">₹{bookingDoctor.consultationFee} (Deducted from Wallet)</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                  >
                    Confirm & Generate Digital Ticket
                  </button>
                </form>
              </div>
            ) : (
              /* Success Screen */
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-100">Appointment Confirmed!</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Your appointment with <strong className="text-cyan-400">{bookingDoctor.name}</strong> for <strong className="text-slate-100">{bookingDate}</strong> at <strong className="text-slate-100">{bookingSlot}</strong> has been booked.
                </p>

                <div className="pt-4 flex justify-center space-x-3">
                  <button
                    onClick={() => {
                      setBookingDoctor(null);
                      setActiveTab('appointments');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg cursor-pointer"
                  >
                    View QR Code Ticket & Token
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

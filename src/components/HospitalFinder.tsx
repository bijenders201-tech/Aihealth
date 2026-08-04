import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  MapPin,
  Star,
  Clock,
  Bed,
  Phone,
  Navigation2,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Search,
  Compass
} from 'lucide-react';
import { Hospital } from '../types';
import { HospitalGoogleMap } from './HospitalGoogleMap';

export const HospitalFinder: React.FC<{ onSelectDoctorForHospital?: (hospitalId: string) => void }> = ({
  onSelectDoctorForHospital
}) => {
  const { hospitals, doctors, setNavTarget, setActiveTab } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [maxWaitTime, setMaxWaitTime] = useState<number>(30);
  const [only24x7, setOnly24x7] = useState<boolean>(false);
  const [selectedHospitalForMap, setSelectedHospitalForMap] = useState<Hospital | null>(hospitals[0]);

  const allSpecialties: string[] = Array.from(new Set<string>(hospitals.flatMap(h => h.specialties)));

  const filteredHospitals = hospitals.filter(h => {
    const isApproved = h.isApproved !== false;
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          h.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || h.specialties.includes(selectedSpecialty);
    const matchesWait = h.erWaitTimeMinutes <= maxWaitTime;
    const matches24x7 = !only24x7 || h.is24x7;

    return isApproved && matchesSearch && matchesSpecialty && matchesWait && matches24x7;
  });

  const handleStartIndoorNav = (hospital: Hospital) => {
    setNavTarget({ hospital, department: hospital.departments[0] });
    setActiveTab('navigation');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1E293B] border border-slate-700/50 rounded-[2rem] p-6 sm:p-8 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2 px-3 py-1 rounded-full">
            <Compass className="w-3.5 h-3.5" />
            <span>GPS Hospital Discovery & ER Queue Tracker</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Nearby Hospitals & Trauma Centers</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Real-time ER wait times, available ICU bed counters, and turn-by-turn OPD room navigation.</p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hospitals, cities, departments..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 flex items-center space-x-1 mr-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Filter By:</span>
          </span>

          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:border-cyan-500 focus:outline-none"
          >
            <option value="All">All Specialties</option>
            {allSpecialties.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button
            onClick={() => setOnly24x7(!only24x7)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              only24x7 ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            24/7 ER Trauma Only
          </button>
        </div>

        <div className="flex items-center space-x-3 text-xs text-slate-300">
          <span>Max ER Wait: <strong className="text-cyan-400 font-mono">{maxWaitTime} mins</strong></span>
          <input
            type="range"
            min={5}
            max={60}
            step={5}
            value={maxWaitTime}
            onChange={(e) => setMaxWaitTime(Number(e.target.value))}
            className="accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Main Grid: Hospital List & Interactive Map Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Hospital List (2 Columns on large) */}
        <div className="lg:col-span-2 space-y-4">
          {filteredHospitals.map((hosp) => (
            <div
              key={hosp.id}
              onClick={() => setSelectedHospitalForMap(hosp)}
              className={`bg-slate-900 border rounded-3xl p-5 shadow-xl transition-all duration-300 hover:border-cyan-500/50 cursor-pointer ${
                selectedHospitalForMap?.id === hosp.id ? 'border-cyan-500 ring-1 ring-cyan-500/40 bg-slate-900/90' : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                
                {/* Image */}
                <div className="relative w-full sm:w-44 h-36 rounded-2xl overflow-hidden shrink-0">
                  <img src={hosp.image} alt={hosp.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-cyan-300 border border-slate-700">
                    {hosp.distanceKm} km away
                  </span>
                  {hosp.is24x7 && (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-emerald-500/80 text-slate-950 text-[9px] font-extrabold uppercase">
                      24/7 ER
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-100 leading-snug">{hosp.name}</h3>
                      <p className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{hosp.address}, {hosp.city}</span>
                      </p>
                    </div>

                    <div className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{hosp.rating}</span>
                      <span className="text-[10px] text-slate-400">({hosp.totalReviews})</span>
                    </div>
                  </div>

                  {/* Badges: ER Wait, Available Beds, Consultation Fee */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 font-medium flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-red-400" />
                      <span>ER Wait: <strong>~{hosp.erWaitTimeMinutes} mins</strong></span>
                    </span>

                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-medium flex items-center space-x-1">
                      <Bed className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Beds: <strong>{hosp.availableBeds} / {hosp.totalBeds} Available</strong></span>
                    </span>

                    <span className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                      Consultation: <strong className="text-cyan-400">₹{hosp.consultationFee}</strong>
                    </span>
                  </div>

                  {/* Specialties Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {hosp.specialties.slice(0, 4).map(s => (
                      <span key={s} className="px-2 py-0.5 rounded-lg bg-slate-950 text-[10px] text-slate-300 border border-slate-800">
                        {s}
                      </span>
                    ))}
                    {hosp.specialties.length > 4 && (
                      <span className="text-[10px] text-cyan-400 self-center">+{hosp.specialties.length - 4} more</span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-800/80">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${hosp.lat},${hosp.lng}&destination_place_id=${encodeURIComponent(hosp.name)}`, '_blank', 'noopener,noreferrer');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-md shadow-cyan-500/20 flex items-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <Navigation2 className="w-3.5 h-3.5" />
                      <span>Google Maps GPS</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartIndoorNav(hosp);
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs border border-slate-700 transition-all cursor-pointer flex items-center space-x-1"
                    >
                      <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Indoor OPD Rooms</span>
                    </button>

                    {onSelectDoctorForHospital && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDoctorForHospital(hosp.id);
                        }}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all cursor-pointer flex items-center space-x-1"
                      >
                        <span>View Doctors ({doctors.filter(d => d.hospitalId === hosp.id).length})</span>
                        <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                      </button>
                    )}

                    <a
                      href={`tel:${hosp.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 transition-all ml-auto"
                      title="Call Emergency Hotline"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>

                </div>
              </div>
            </div>
          ))}

          {filteredHospitals.length === 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
              <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="font-semibold text-sm text-slate-300">No hospitals matched your search filter.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedSpecialty('All'); setOnly24x7(false); }}
                className="mt-3 text-xs text-cyan-400 font-bold underline"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Interactive Google Map & Department Floorplan Preview Sidebar */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl sticky top-20 space-y-4">
            
            {/* Google Map Component */}
            <HospitalGoogleMap
              hospitals={filteredHospitals}
              selectedHospital={selectedHospitalForMap}
              onSelectHospital={(h) => setSelectedHospitalForMap(h)}
              onStartIndoorNav={handleStartIndoorNav}
            />

            {/* Department Floor Directory Preview for Selected Hospital */}
            {selectedHospitalForMap && (
              <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Indoor Department Directory</h4>
                  <span className="text-[10px] text-cyan-400">{selectedHospitalForMap.departments.length} Floors</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedHospitalForMap.departments.map(dep => (
                    <div
                      key={dep.id}
                      onClick={() => {
                        setNavTarget({ hospital: selectedHospitalForMap, department: dep });
                        setActiveTab('navigation');
                      }}
                      className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">{dep.departmentName}</p>
                        <p className="text-[10px] text-slate-400">{dep.building} • {dep.floor} (Room {dep.roomNumber})</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleStartIndoorNav(selectedHospitalForMap)}
                  className="w-full py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs border border-cyan-500/40 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Navigation2 className="w-3.5 h-3.5" />
                  <span>Start Turn-by-Turn Guidance</span>
                </button>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};

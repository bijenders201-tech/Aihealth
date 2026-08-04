import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { Hospital } from '../types';
import { Navigation2, MapPin, Building2, Clock, Bed, Compass, ExternalLink, LocateFixed } from 'lucide-react';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY' && API_KEY.trim().length > 0;

interface HospitalGoogleMapProps {
  hospitals: Hospital[];
  selectedHospital?: Hospital | null;
  onSelectHospital?: (hospital: Hospital) => void;
  onStartIndoorNav?: (hospital: Hospital) => void;
}

// Single Marker with InfoWindow
const HospitalMarkerItem: React.FC<{
  hospital: Hospital;
  isSelected: boolean;
  onSelect: (hosp: Hospital) => void;
  onNavigateGoogleMaps: (hosp: Hospital) => void;
  onIndoorNav?: (hosp: Hospital) => void;
}> = ({ hospital, isSelected, onSelect, onNavigateGoogleMaps, onIndoorNav }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [isOpen, setIsOpen] = useState(isSelected);

  useEffect(() => {
    setIsOpen(isSelected);
  }, [isSelected]);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: hospital.lat, lng: hospital.lng }}
        title={hospital.name}
        onClick={() => {
          onSelect(hospital);
          setIsOpen(true);
        }}
      >
        <Pin
          background={hospital.is24x7 ? '#ef4444' : '#0284c7'}
          borderColor="#ffffff"
          glyphColor="#ffffff"
          scale={isSelected ? 1.3 : 1.0}
        />
      </AdvancedMarker>

      {isOpen && (
        <InfoWindow
          anchor={marker}
          onCloseClick={() => setIsOpen(false)}
          className="min-w-[240px] max-w-[280px]"
        >
          <div className="p-1 space-y-2 text-slate-900 font-sans">
            <div className="flex items-start justify-between gap-1">
              <div>
                <h4 className="font-bold text-sm leading-tight text-slate-900">{hospital.name}</h4>
                <p className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-cyan-600 shrink-0" />
                  <span>{hospital.city} • {hospital.distanceKm} km</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] pt-1">
              <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" />
                ER: ~{hospital.erWaitTimeMinutes}m
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
                <Bed className="w-3 h-3" />
                Beds: {hospital.availableBeds}
              </span>
            </div>

            <div className="pt-2 flex flex-col gap-1.5 border-t border-slate-200">
              <button
                onClick={() => onNavigateGoogleMaps(hospital)}
                className="w-full py-1.5 px-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
              >
                <Navigation2 className="w-3.5 h-3.5" />
                <span>Open Google Maps GPS Navigation</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
              </button>

              {onIndoorNav && (
                <button
                  onClick={() => onIndoorNav(hospital)}
                  className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Indoor OPD Room Navigation</span>
                </button>
              )}
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export const HospitalGoogleMap: React.FC<HospitalGoogleMapProps> = ({
  hospitals,
  selectedHospital,
  onSelectHospital,
  onStartIndoorNav
}) => {
  // User live location state
  const [userPos, setUserPos] = useState<{ lat: number; lng: number }>({
    lat: 28.6139, // Default: New Delhi
    lng: 77.2090
  });
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Default map center on selected hospital or user position
  const mapCenter = selectedHospital
    ? { lat: selectedHospital.lat, lng: selectedHospital.lng }
    : userPos;

  // Function to detect current user location via Geolocation API
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLocationError('Unable to retrieve current GPS location. Showing default Delhi location.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    // Attempt auto-location on mount
    handleLocateUser();
  }, []);

  // Function to open Google Maps external directions
  const openGoogleMapsDirections = (hosp: Hospital) => {
    const originStr = `${userPos.lat},${userPos.lng}`;
    const destStr = `${hosp.lat},${hosp.lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${originStr}&destination=${destStr}&destination_place_id=${encodeURIComponent(hosp.name)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Fallback banner when GOOGLE_MAPS_PLATFORM_KEY is missing
  if (!hasValidKey) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-200 space-y-4">
        <div className="flex items-center space-x-3 text-amber-400">
          <Compass className="w-6 h-6 shrink-0" />
          <h3 className="text-base font-bold text-slate-100">Google Maps API Key Required</h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          To view real-time Google Maps with live hospital markers and interactive GPS navigation, please add your Google Maps API Key in AI Studio Secrets.
        </p>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-2 text-slate-300">
          <p className="font-bold text-cyan-400">How to configure GOOGLE_MAPS_PLATFORM_KEY:</p>
          <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px]">
            <li>
              Get an API key from the{' '}
              <a
                href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 underline font-semibold"
              >
                Google Cloud Console
              </a>.
            </li>
            <li>
              Open <strong>Settings</strong> (⚙️ gear icon in the top-right corner) → <strong>Secrets</strong>.
            </li>
            <li>
              Type secret name: <code className="text-emerald-400 font-mono bg-slate-900 px-1.5 py-0.5 rounded">GOOGLE_MAPS_PLATFORM_KEY</code> and press Enter.
            </li>
            <li>Paste your Google Maps API key as the value and save. The app rebuilds automatically.</li>
          </ol>
        </div>

        {/* Fallback Hospital Coordinate Navigation Cards */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            GPS Coordinates & Direct Google Maps Navigation
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {hospitals.map((hosp) => (
              <div
                key={hosp.id}
                className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-2"
              >
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-100 truncate">{hosp.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Lat: {hosp.lat.toFixed(4)}, Lng: {hosp.lng.toFixed(4)}
                  </p>
                </div>
                <button
                  onClick={() => openGoogleMapsDirections(hosp)}
                  className="px-2.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] rounded-lg shrink-0 flex items-center space-x-1 cursor-pointer"
                >
                  <Navigation2 className="w-3 h-3" />
                  <span>Navigate</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Map Header Controls */}
      <div className="flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-200">Interactive Google Map</span>
          <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded-full font-mono">
            {hospitals.length} Nearby Hospitals
          </span>
        </div>

        <button
          onClick={handleLocateUser}
          disabled={isLocating}
          className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 flex items-center space-x-1 transition-all cursor-pointer text-[11px]"
        >
          <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Locating...' : 'My Location'}</span>
        </button>
      </div>

      {locationError && (
        <p className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg">
          {locationError}
        </p>
      )}

      {/* Map Viewport Container */}
      <div className="w-full h-80 sm:h-96 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
        <APIProvider apiKey={API_KEY} version="weekly">
          <Map
            defaultCenter={mapCenter}
            center={mapCenter}
            defaultZoom={11}
            mapId="DEMO_MAP_ID"
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            style={{ width: '100%', height: '100%' }}
          >
            {/* User Location Marker */}
            <AdvancedMarker
              position={userPos}
              title="Your Current GPS Location"
            >
              <div className="relative flex items-center justify-center">
                <span className="absolute w-6 h-6 rounded-full bg-cyan-400/40 animate-ping"></span>
                <div className="w-4 h-4 rounded-full bg-cyan-400 border-2 border-white shadow-lg shadow-cyan-500/50"></div>
              </div>
            </AdvancedMarker>

            {/* Hospital Markers */}
            {hospitals.map((hosp) => (
              <HospitalMarkerItem
                key={hosp.id}
                hospital={hosp}
                isSelected={selectedHospital?.id === hosp.id}
                onSelect={(h) => onSelectHospital && onSelectHospital(h)}
                onNavigateGoogleMaps={openGoogleMapsDirections}
                onIndoorNav={onStartIndoorNav}
              />
            ))}
          </Map>
        </APIProvider>
      </div>

      {/* Quick Navigation Action Bar for Selected Hospital */}
      {selectedHospital && (
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-2 shadow-lg">
          <div className="truncate">
            <p className="text-xs font-bold text-slate-100 truncate">{selectedHospital.name}</p>
            <p className="text-[10px] text-slate-400 font-mono">
              GPS: {selectedHospital.lat.toFixed(4)}, {selectedHospital.lng.toFixed(4)} • {selectedHospital.distanceKm} km away
            </p>
          </div>

          <button
            onClick={() => openGoogleMapsDirections(selectedHospital)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-md shadow-cyan-500/20 shrink-0 flex items-center space-x-1.5 cursor-pointer transition-all"
          >
            <Navigation2 className="w-3.5 h-3.5" />
            <span>Open Google Maps</span>
          </button>
        </div>
      )}
    </div>
  );
};

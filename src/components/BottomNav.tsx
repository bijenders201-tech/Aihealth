import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  Building2,
  Stethoscope,
  FolderHeart,
  Pill,
  Menu,
  Siren,
  FileText,
  CreditCard,
  Activity,
  Users,
  Navigation2,
  User,
  X,
  ChevronRight
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'hospitals', label: 'Hospitals', icon: Building2 },
    { id: 'symptom_checker', label: 'AI Triage', icon: Stethoscope },
    { id: 'vault', label: 'Records', icon: FolderHeart },
    { id: 'reminders', label: 'Medicines', icon: Pill },
  ];

  const moreServices = [
    { id: 'ambulance', label: 'Live Ambulance Dispatch', desc: 'Real-time GPS Tracking', icon: Siren, color: 'text-red-400 bg-red-500/10' },
    { id: 'lab_tests', label: 'Diagnostic Lab Tests', desc: 'Home Sample Collection', icon: FileText, color: 'text-cyan-400 bg-cyan-500/10' },
    { id: 'pharmacy', label: 'E-Pharmacy Store', desc: 'Express 30-min Delivery', icon: Pill, color: 'text-emerald-400 bg-emerald-500/10' },
    { id: 'video_consult', label: 'Video Consultation', desc: 'WebRTC Teleconsult', icon: Stethoscope, color: 'text-teal-400 bg-teal-500/10' },
    { id: 'insurance', label: 'Health Insurance', desc: 'Cashless Claims Hub', icon: CreditCard, color: 'text-blue-400 bg-blue-500/10' },
    { id: 'health_score', label: 'AI Health Score', desc: 'Clinical Vitals Index', icon: Activity, color: 'text-amber-400 bg-amber-500/10' },
    { id: 'family', label: 'Family Profiles', desc: 'Manage ABHA Profiles', icon: Users, color: 'text-purple-400 bg-purple-500/10' },
    { id: 'navigation', label: 'Indoor Hospital Route', desc: 'OPD Floorplan Map', icon: Navigation2, color: 'text-orange-400 bg-orange-500/10' },
    { id: 'profile', label: 'Account & Settings', desc: 'Role & Language Options', icon: User, color: 'text-slate-300 bg-slate-800' },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 text-slate-300 shadow-2xl px-2 py-1.5">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setShowMoreMenu(false);
                }}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-400 font-bold scale-105 shadow-sm shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-cyan-400' : ''}`} />
                <span className="text-[10px] font-medium mt-0.5 tracking-tight">{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => setShowMoreMenu(true)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
              showMoreMenu ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-0.5 tracking-tight">More</span>
          </button>
        </div>
      </nav>

      {/* More Services Bottom Drawer */}
      {showMoreMenu && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-t-[2.5rem] sm:rounded-[2.5rem] w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 space-y-4 text-slate-100 shadow-2xl relative">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-white">All MediRoute AI Services</h3>
                <p className="text-xs text-slate-400">Select a feature to navigate instantly</p>
              </div>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {moreServices.map((srv) => {
                const Icon = srv.icon;
                return (
                  <button
                    key={srv.id}
                    onClick={() => {
                      setActiveTab(srv.id);
                      setShowMoreMenu(false);
                    }}
                    className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 rounded-2xl text-left flex items-center justify-between transition-all cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2.5 rounded-xl ${srv.color} border border-white/5 shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-extrabold text-xs text-white group-hover:text-cyan-300 transition-colors">{srv.label}</p>
                        <p className="text-[10px] text-slate-400">{srv.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      )}
    </>
  );
};

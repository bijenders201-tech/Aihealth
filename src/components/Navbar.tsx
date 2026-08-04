import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Heart,
  Moon,
  Sun,
  Siren,
  Globe,
  Bell,
  UserCheck,
  Search,
  Smartphone,
  Check,
  Menu,
  X,
  Wifi,
  WifiOff,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { AppLanguage, UserRole } from '../types';

export const Navbar: React.FC<{ onOpenAuth: () => void; onOpenSearch: () => void }> = ({
  onOpenAuth,
  onOpenSearch
}) => {
  const {
    user,
    isLoggedIn,
    logout,
    selectedFamilyMember,
    setSelectedFamilyMember,
    familyMembers,
    role,
    setRole,
    theme,
    toggleTheme,
    language,
    setLanguage,
    showAndroidFrame,
    setShowAndroidFrame,
    notifications,
    markNotificationRead,
    triggerEmergencySOS,
    dataSyncStatus,
    isOnline
  } = useApp();

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showFamilyMenu, setShowFamilyMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const languages: { code: AppLanguage; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Heart className="w-5 h-5 text-cyan-400 fill-cyan-400/20 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                  MediRoute AI
                </span>
                {/* Live Firestore Sync Status Badge */}
                <div className={`flex items-center space-x-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                  dataSyncStatus === 'synced' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                  dataSyncStatus === 'syncing' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' :
                  'bg-red-500/10 text-red-400 border-red-500/30'
                }`}>
                  {dataSyncStatus === 'synced' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
                  {dataSyncStatus === 'syncing' && <RefreshCw className="w-2.5 h-2.5 animate-spin text-amber-300" />}
                  {dataSyncStatus === 'offline' && <WifiOff className="w-2.5 h-2.5 text-red-400" />}
                  <span className="hidden sm:inline">{dataSyncStatus === 'synced' ? 'Firestore Live' : dataSyncStatus}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Smart Clinical Triage & Indoor OPD Guidance</p>
            </div>
          </div>

          {/* Quick Search Bar Trigger */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center space-x-2 px-3.5 py-2 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-400 text-sm hover:bg-slate-800 hover:border-slate-600 transition-all text-left cursor-pointer"
            >
              <Search className="w-4 h-4 text-cyan-400" />
              <span className="flex-1 truncate">Search doctors, hospitals, symptoms, blood group...</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-700 text-slate-300 rounded">⌘K</kbd>
            </button>
          </div>

          {/* Controls & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">

            {/* Emergency SOS Button */}
            <button
              onClick={() => triggerEmergencySOS()}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 animate-bounce cursor-pointer transition-all"
              title="One-Tap Emergency Distress & SOS Ambulance Dispatch"
            >
              <Siren className="w-4 h-4 text-yellow-300" />
              <span className="hidden xs:inline">SOS Emergency</span>
            </button>

            {/* Device Frame Toggle */}
            <button
              onClick={() => setShowAndroidFrame(!showAndroidFrame)}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                showAndroidFrame
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                  : 'bg-slate-800 border-slate-700/60 text-slate-300 hover:bg-slate-700'
              }`}
              title="Toggle Android Smartphone Frame Preview"
            >
              <Smartphone className="w-4 h-4" />
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="p-2 rounded-lg bg-slate-800 border border-slate-700/60 text-slate-300 hover:bg-slate-700 transition-all flex items-center space-x-1 cursor-pointer"
                title="Change Language"
              >
                <Globe className="w-4 h-4 text-teal-400" />
                <span className="text-xs uppercase font-semibold hidden sm:inline">{language}</span>
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1 z-50">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setShowLangMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-200 hover:bg-slate-700/80 transition-colors cursor-pointer"
                    >
                      <span>{l.flag} {l.label}</span>
                      {language === l.code && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700/60 text-slate-300 hover:bg-slate-700 transition-all cursor-pointer"
              title="Toggle Light / Dark Mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="p-2 rounded-lg bg-slate-800 border border-slate-700/60 text-slate-300 hover:bg-slate-700 transition-all relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-slate-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 text-slate-100">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700">
                    <span className="font-semibold text-xs text-slate-200">Alerts & Reminders</span>
                    <span className="text-[10px] text-cyan-400 font-medium">{unreadCount} Unread</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                          n.unread ? 'bg-slate-700/60 border-cyan-500/40' : 'bg-slate-800/40 border-slate-700/40 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-xs text-cyan-300">{n.title}</span>
                          <span className="text-[10px] text-slate-400">{n.date}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-snug">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Active Role Switcher */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700/80 text-xs text-slate-200 hover:bg-slate-700 flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="capitalize font-medium text-slate-200">{role.replace('_', ' ')}</span>
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Switch Portal View</div>
                  {(['patient', 'doctor', 'hospital', 'admin'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setRole(r);
                        setShowRoleMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-200 hover:bg-slate-700 capitalize transition-colors cursor-pointer"
                    >
                      <span>{r.replace('_', ' ')} Portal</span>
                      {role === r && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Family Profile / Auth Button */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowFamilyMenu(!showFamilyMenu)}
                  className="flex items-center space-x-2 pl-2 pr-3 py-1 rounded-full bg-slate-800 border border-slate-700 hover:border-cyan-500/50 transition-all cursor-pointer"
                >
                  <img
                    src={selectedFamilyMember.avatar}
                    alt={selectedFamilyMember.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-cyan-500/40"
                  />
                  <span className="text-xs font-semibold text-slate-200 hidden sm:inline max-w-[100px] truncate">
                    {selectedFamilyMember.name.split(' ')[0]}
                  </span>
                </button>

                {showFamilyMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 text-slate-100">
                    <div className="px-3 py-2 border-b border-slate-700 mb-1">
                      <p className="text-xs font-semibold text-slate-200">{user.name}</p>
                      <p className="text-[10px] text-cyan-400 font-mono truncate">{user.abhaId || user.email}</p>
                    </div>

                    <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase">Switch Active Family Member</div>
                    {familyMembers.map((fam) => (
                      <button
                        key={fam.id}
                        onClick={() => {
                          setSelectedFamilyMember(fam);
                          setShowFamilyMenu(false);
                        }}
                        className={`w-full flex items-center space-x-2.5 px-3 py-1.5 rounded-xl text-xs transition-colors mb-1 cursor-pointer ${
                          selectedFamilyMember.id === fam.id ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-300 hover:bg-slate-700/60'
                        }`}
                      >
                        <img src={fam.avatar} alt={fam.name} className="w-6 h-6 rounded-full object-cover" />
                        <div className="flex-1 text-left truncate">
                          <div>{fam.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{fam.relationship} • {fam.bloodGroup}</div>
                        </div>
                        {selectedFamilyMember.id === fam.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </button>
                    ))}

                    <div className="border-t border-slate-700 pt-1 mt-1">
                      <button
                        onClick={logout}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-400" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
              >
                Sign In / OTP
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

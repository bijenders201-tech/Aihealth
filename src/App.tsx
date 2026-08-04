import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AndroidFrame } from './components/AndroidFrame';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { AuthModal } from './components/AuthModal';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { QRCheckinModal } from './components/QRCheckinModal';
import { AIChatbotWidget } from './components/AIChatbotWidget';
import { VoiceAssistantWidget } from './components/VoiceAssistantWidget';

import { MainDashboard } from './components/MainDashboard';
import { SymptomChecker } from './components/SymptomChecker';
import { HospitalFinder } from './components/HospitalFinder';
import { DoctorDiscovery } from './components/DoctorDiscovery';
import { AppointmentManager } from './components/AppointmentManager';
import { MedicalVault } from './components/MedicalVault';
import { MedicineReminders } from './components/MedicineReminders';
import { HospitalNavigation } from './components/HospitalNavigation';
import { FamilyProfiles } from './components/FamilyProfiles';
import { PatientProfile } from './components/PatientProfile';

import { DoctorDashboard } from './components/DoctorDashboard';
import { HospitalDashboard } from './components/HospitalDashboard';
import { AdminDashboard } from './components/AdminDashboard';

import { AmbulanceTracker } from './components/AmbulanceTracker';
import { LabTestBooking } from './components/LabTestBooking';
import { MedicinePharmacy } from './components/MedicinePharmacy';
import { VideoConsultationRoom } from './components/VideoConsultationRoom';
import { HealthInsuranceHub } from './components/HealthInsuranceHub';
import { AIHealthScore } from './components/AIHealthScore';

const AppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentRole,
    showAuthModal,
    activeSOS,
    checkinModalAppointment,
    setCheckinModalAppointment
  } = useApp();

  const [prefilterSpecialty, setPrefilterSpecialty] = useState<string>('');

  const handleBookSpecialistFromChecker = (specialty: string) => {
    setPrefilterSpecialty(specialty);
    setActiveTab('doctors');
  };

  const renderRoleView = () => {
    if (currentRole === 'doctor') return <DoctorDashboard />;
    if (currentRole === 'hospital') return <HospitalDashboard />;
    if (currentRole === 'admin') return <AdminDashboard />;

    // Patient Role Navigation Tabs
    switch (activeTab) {
      case 'home':
        return <MainDashboard />;
      case 'symptom-check':
      case 'symptom_checker':
        return <SymptomChecker onBookSpecialist={handleBookSpecialistFromChecker} />;
      case 'hospitals':
        return <HospitalFinder />;
      case 'doctors':
        return <DoctorDiscovery prefilterSpecialty={prefilterSpecialty} />;
      case 'appointments':
        return <AppointmentManager />;
      case 'records':
      case 'vault':
        return <MedicalVault />;
      case 'medicines':
      case 'reminders':
        return <MedicineReminders />;
      case 'navigation':
        return <HospitalNavigation />;
      case 'family':
        return <FamilyProfiles />;
      case 'profile':
        return <PatientProfile />;
      case 'ambulance':
        return <AmbulanceTracker />;
      case 'lab_tests':
        return <LabTestBooking />;
      case 'pharmacy':
        return <MedicinePharmacy />;
      case 'video_consult':
        return <VideoConsultationRoom onClose={() => setActiveTab('home')} />;
      case 'insurance':
        return <HealthInsuranceHub />;
      case 'health_score':
        return <AIHealthScore />;
      default:
        return <MainDashboard />;
    }
  };

  return (
    <AndroidFrame>
      <div className="min-h-full flex flex-col justify-between bg-slate-950 text-slate-100 font-sans pb-20 sm:pb-0">
        <div>
          <Navbar />
          <main className="transition-all duration-300">
            {renderRoleView()}
          </main>
        </div>

        {/* Floating AI & Voice Widgets */}
        <AIChatbotWidget />
        <VoiceAssistantWidget />

        {/* Mobile Navigation */}
        <BottomNav />

        {/* Global Modals */}
        {showAuthModal && <AuthModal />}
        {activeSOS && <EmergencySOSModal />}
        {checkinModalAppointment && (
          <QRCheckinModal
            appointment={checkinModalAppointment}
            onClose={() => setCheckinModalAppointment(null)}
          />
        )}
      </div>
    </AndroidFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

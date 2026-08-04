import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  AppLanguage,
  FamilyMember,
  Hospital,
  Doctor,
  Appointment,
  MedicalRecord,
  MedicineReminder,
  FollowupReminder,
  EmergencySOS,
  AmbulanceRequest,
  InsurancePolicy,
  HealthWallet,
  HealthTimelineItem,
  DepartmentFloor
} from '../types';
import {
  initialUserProfile,
  initialFamilyMembers,
  mockHospitals,
  mockDoctors,
  initialMedicalRecords,
  initialMedicineReminders,
  initialFollowups,
  mockInsurance,
  mockHealthWallet,
  mockHealthTimeline
} from '../data/mockData';
import { auth, db, googleProvider, validateFirestoreConnection } from '../firebase/config';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import {
  handleFirestoreError,
  OperationType,
  withNetworkRetry,
  trackAnalyticsEvent
} from '../firebase/firestoreHelpers';
import { seedProductionFirestoreDatabase } from '../firebase/seedFirestore';

interface AppContextType {
  // Authentication & Profile
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  authUser: User | null;
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  selectedFamilyMember: FamilyMember;
  setSelectedFamilyMember: (member: FamilyMember) => void;
  familyMembers: FamilyMember[];
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => void;

  // Settings & Theme
  role: UserRole;
  setRole: (role: UserRole) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  showAndroidFrame: boolean;
  setShowAndroidFrame: (show: boolean) => void;

  // Network & Sync
  isOnline: boolean;
  isLoadingData: boolean;
  dataSyncStatus: 'synced' | 'syncing' | 'offline' | 'error';
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Data Collections
  hospitals: Hospital[];
  doctors: Doctor[];
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  medicineReminders: MedicineReminder[];
  followupReminders: FollowupReminder[];
  insurance: InsurancePolicy;
  healthWallet: HealthWallet;
  timeline: HealthTimelineItem[];
  ambulances: AmbulanceRequest[];
  payments: any[];

  // Hospital & Doctor Registration Actions
  addHospital: (hosp: Hospital) => Promise<void>;
  updateHospital: (hospitalId: string, updates: Partial<Hospital>) => Promise<void>;
  approveHospital: (hospitalId: string) => Promise<void>;
  deleteHospital: (hospitalId: string) => Promise<void>;
  addDoctor: (docData: Doctor) => Promise<void>;
  updateDoctor: (doctorId: string, updates: Partial<Doctor>) => Promise<void>;
  deleteDoctor: (doctorId: string) => Promise<void>;

  // Actions
  bookAppointment: (doctor: Doctor, hospital: Hospital, date: string, timeSlot: string, familyMemberId: string, type: 'OPD' | 'Teleconsultation' | 'Emergency') => Promise<Appointment>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
  checkInHospital: (appointmentId: string) => Promise<void>;
  deleteAppointment: (appointmentId: string) => Promise<void>;

  addMedicalRecord: (record: Omit<MedicalRecord, 'id'>) => Promise<void>;
  deleteMedicalRecord: (recordId: string) => Promise<void>;

  addMedicineReminder: (reminder: Omit<MedicineReminder, 'id' | 'history'>) => Promise<void>;
  markMedicineTaken: (reminderId: string) => Promise<void>;
  deleteMedicineReminder: (reminderId: string) => Promise<void>;

  triggerEmergencySOS: () => Promise<EmergencySOS>;
  requestAmbulance: (type: AmbulanceRequest['type'], pickup: string, destination: string) => Promise<AmbulanceRequest>;

  // Hospital Navigation Active State
  navTarget: { hospital: Hospital; department?: DepartmentFloor } | null;
  setNavTarget: (target: { hospital: Hospital; department?: DepartmentFloor } | null) => void;

  // SOS Active State
  activeSOS: EmergencySOS | null;
  setActiveSOS: (sos: EmergencySOS | null) => void;

  // Active QR Checkin Modal
  checkinModalAppointment: Appointment | null;
  setCheckinModalAppointment: (apt: Appointment | null) => void;

  // Notifications
  notifications: { id: string; title: string; message: string; date: string; unread: boolean; type: 'info' | 'alarm' | 'appointment' | 'emergency' }[];
  markNotificationRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialFamilyMembers);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<FamilyMember>(initialFamilyMembers[0]);
  const [role, setRole] = useState<UserRole>('patient');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [language, setLanguage] = useState<AppLanguage>('en');
  const [showAndroidFrame, setShowAndroidFrame] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('home');

  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [dataSyncStatus, setDataSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'error'>('synced');

  const [hospitals, setHospitals] = useState<Hospital[]>(mockHospitals);
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'apt_1001',
      patientId: 'usr_101',
      patientName: 'Alex Johnson',
      familyMemberId: 'fam_1',
      doctorId: 'doc_1',
      doctorName: 'Dr. Elena Rostova',
      specialty: 'Cardiologist',
      hospitalId: 'hosp_1',
      hospitalName: 'Apex General Medical Center',
      date: '2026-08-05',
      timeSlot: '10:30 AM',
      type: 'OPD',
      status: 'Confirmed',
      qrCodeData: 'MEDIROUTE-APT-1001-APEX-ROSTOVA',
      tokenNumber: 'CARD-12',
      consultationFee: 50,
      paymentStatus: 'Paid',
      createdAt: '2026-08-01'
    }
  ]);

  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(initialMedicalRecords);
  const [medicineReminders, setMedicineReminders] = useState<MedicineReminder[]>(initialMedicineReminders);
  const [followupReminders] = useState<FollowupReminder[]>(initialFollowups);
  const [insurance] = useState<InsurancePolicy>(mockInsurance);
  const [healthWallet, setHealthWallet] = useState<HealthWallet>(mockHealthWallet);
  const [timeline, setTimeline] = useState<HealthTimelineItem[]>(mockHealthTimeline);
  const [ambulances, setAmbulances] = useState<AmbulanceRequest[]>([]);
  const [payments, setPayments] = useState<any[]>(mockHealthWallet.transactions);

  const [navTarget, setNavTarget] = useState<{ hospital: Hospital; department?: DepartmentFloor } | null>(null);
  const [activeSOS, setActiveSOS] = useState<EmergencySOS | null>(null);
  const [checkinModalAppointment, setCheckinModalAppointment] = useState<Appointment | null>(null);

  const [notifications, setNotifications] = useState<any[]>([
    {
      id: 'notif_1',
      title: 'Upcoming Appointment',
      message: 'Cardiology OPD with Dr. Elena Rostova scheduled for Aug 5 at 10:30 AM.',
      date: '10 mins ago',
      unread: true,
      type: 'appointment'
    },
    {
      id: 'notif_2',
      title: 'Medicine Alarm',
      message: 'Time for Symbicort Asthma Inhaler (2 Puffs).',
      date: '1 hour ago',
      unread: true,
      type: 'alarm'
    }
  ]);

  // Network Monitor
  useEffect(() => {
    const handleOnline = () => { setIsOnline(true); setDataSyncStatus('synced'); };
    const handleOffline = () => { setIsOnline(false); setDataSyncStatus('offline'); };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Theme Sync
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Auth Listener and Profile Firestore Sync
  useEffect(() => {
    validateFirestoreConnection();

    // Auto-seed database once
    seedProductionFirestoreDatabase().catch(err => console.warn('Production seeding warning:', err));

    const unsubscribeAuth = onAuthStateChanged(auth, async (fireUser) => {
      setAuthUser(fireUser);
      if (fireUser) {
        setIsLoggedIn(true);
        try {
          const userDocRef = doc(db, 'users', fireUser.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const data = userSnap.data() as UserProfile;
            setUser(data);
            if (data.role) setRole(data.role);
          } else {
            const newProf: UserProfile = {
              id: fireUser.uid,
              name: fireUser.displayName || 'Alex Johnson',
              email: fireUser.email || 'alex@mediroute.ai',
              phone: fireUser.phoneNumber || '+1 (555) 234-5678',
              age: 34,
              gender: 'Male',
              bloodGroup: 'O+',
              address: '742 Evergreen Terrace, San Francisco, CA',
              abhaId: 'ABHA-9821-4412-8801',
              isVerified: true,
              profilePhoto: fireUser.photoURL || initialUserProfile.profilePhoto,
              role: role || 'patient',
              allergies: ['Penicillin', 'Dust Mites'],
              chronicConditions: ['Mild Asthma'],
              emergencyContact: initialUserProfile.emergencyContact
            };
            await setDoc(userDocRef, newProf);
            setUser(newProf);
          }
        } catch (err) {
          console.warn('User profile sync notice:', err);
        }
      }
    });

    return () => unsubscribeAuth();
  }, [role]);

  // Real-Time Firestore Synchronization for ALL 9 Collections
  useEffect(() => {
    setIsLoadingData(true);
    setDataSyncStatus('syncing');

    // 1. Hospitals Collection
    const unsubHospitals = onSnapshot(collection(db, 'hospitals'), (snap) => {
      if (!snap.empty) {
        const list: Hospital[] = [];
        snap.forEach(d => list.push(d.data() as Hospital));
        setHospitals(list);
      }
    }, (err) => console.warn('Hospitals listener warning:', err));

    // 2. Doctors Collection
    const unsubDoctors = onSnapshot(collection(db, 'doctors'), (snap) => {
      if (!snap.empty) {
        const list: Doctor[] = [];
        snap.forEach(d => list.push(d.data() as Doctor));
        setDoctors(list);
      }
    }, (err) => console.warn('Doctors listener warning:', err));

    // 3. Appointments Collection
    const unsubAppointments = onSnapshot(collection(db, 'appointments'), (snap) => {
      if (!snap.empty) {
        const list: Appointment[] = [];
        snap.forEach(d => list.push(d.data() as Appointment));
        setAppointments(list);
      }
    }, (err) => console.warn('Appointments listener warning:', err));

    // 4. Medical Records Collection
    const unsubRecords = onSnapshot(collection(db, 'medicalRecords'), (snap) => {
      if (!snap.empty) {
        const list: MedicalRecord[] = [];
        snap.forEach(d => list.push(d.data() as MedicalRecord));
        setMedicalRecords(list);
      }
    }, (err) => console.warn('Medical records listener warning:', err));

    // 5. Medicines / MedicineReminders Collection
    const unsubReminders = onSnapshot(collection(db, 'medicines'), (snap) => {
      if (!snap.empty) {
        const list: MedicineReminder[] = [];
        snap.forEach(d => list.push(d.data() as MedicineReminder));
        setMedicineReminders(list);
      }
    }, (err) => console.warn('Medicines listener warning:', err));

    // 6. Ambulances / EmergencySOS Collection
    const unsubAmbulances = onSnapshot(collection(db, 'ambulances'), (snap) => {
      if (!snap.empty) {
        const list: AmbulanceRequest[] = [];
        snap.forEach(d => list.push(d.data() as AmbulanceRequest));
        setAmbulances(list);
      }
    }, (err) => console.warn('Ambulances listener warning:', err));

    // 7. Payments Collection
    const unsubPayments = onSnapshot(collection(db, 'payments'), (snap) => {
      if (!snap.empty) {
        const list: any[] = [];
        snap.forEach(d => list.push(d.data()));
        setPayments(list);
        setHealthWallet(prev => ({ ...prev, transactions: list }));
      }
    }, (err) => console.warn('Payments listener warning:', err));

    // 8. Notifications Collection
    const unsubNotifications = onSnapshot(collection(db, 'notifications'), (snap) => {
      if (!snap.empty) {
        const list: any[] = [];
        snap.forEach(d => list.push(d.data()));
        setNotifications(list);
      }
    }, (err) => console.warn('Notifications listener warning:', err));

    setIsLoadingData(false);
    setDataSyncStatus('synced');

    return () => {
      unsubHospitals();
      unsubDoctors();
      unsubAppointments();
      unsubRecords();
      unsubReminders();
      unsubAmbulances();
      unsubPayments();
      unsubNotifications();
    };
  }, [authUser]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const signInWithGoogle = async () => {
    try {
      setDataSyncStatus('syncing');
      await signInWithPopup(auth, googleProvider);
      trackAnalyticsEvent('user_google_login', 'Signed in via Google Auth');
      setDataSyncStatus('synced');
    } catch (err) {
      console.error('Google Auth Error:', err);
      setDataSyncStatus('error');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setAuthUser(null);
      setIsLoggedIn(false);
      trackAnalyticsEvent('user_logout');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const addFamilyMember = (memberData: Omit<FamilyMember, 'id'>) => {
    const newMember: FamilyMember = {
      ...memberData,
      id: `fam_${Date.now()}`
    };
    setFamilyMembers(prev => [...prev, newMember]);
  };

  // CRUD Actions
  const addHospital = async (hosp: Hospital) => {
    try {
      setDataSyncStatus('syncing');
      await withNetworkRetry(() => setDoc(doc(db, 'hospitals', hosp.id), hosp));
      setHospitals(prev => [hosp, ...prev]);
      trackAnalyticsEvent('hospital_registered', hosp.name);
      setDataSyncStatus('synced');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `hospitals/${hosp.id}`);
    }
  };

  const updateHospital = async (hospitalId: string, updates: Partial<Hospital>) => {
    try {
      setDataSyncStatus('syncing');
      await updateDoc(doc(db, 'hospitals', hospitalId), updates);
      setHospitals(prev => prev.map(h => h.id === hospitalId ? { ...h, ...updates } : h));
      setDataSyncStatus('synced');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `hospitals/${hospitalId}`);
    }
  };

  const approveHospital = async (hospitalId: string) => {
    try {
      setDataSyncStatus('syncing');
      await updateDoc(doc(db, 'hospitals', hospitalId), { isApproved: true });
      setHospitals(prev => prev.map(h => h.id === hospitalId ? { ...h, isApproved: true } : h));
      trackAnalyticsEvent('hospital_approved_by_admin', hospitalId);
      setDataSyncStatus('synced');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `hospitals/${hospitalId}`);
    }
  };

  const deleteHospital = async (hospitalId: string) => {
    try {
      setDataSyncStatus('syncing');
      await deleteDoc(doc(db, 'hospitals', hospitalId));
      setHospitals(prev => prev.filter(h => h.id !== hospitalId));
      setDataSyncStatus('synced');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `hospitals/${hospitalId}`);
    }
  };

  const addDoctor = async (docData: Doctor) => {
    try {
      setDataSyncStatus('syncing');
      await withNetworkRetry(() => setDoc(doc(db, 'doctors', docData.id), docData));
      setDoctors(prev => [docData, ...prev]);
      trackAnalyticsEvent('doctor_registered', docData.name);
      setDataSyncStatus('synced');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `doctors/${docData.id}`);
    }
  };

  const updateDoctor = async (doctorId: string, updates: Partial<Doctor>) => {
    try {
      setDataSyncStatus('syncing');
      await updateDoc(doc(db, 'doctors', doctorId), updates);
      setDoctors(prev => prev.map(d => d.id === doctorId ? { ...d, ...updates } : d));
      setDataSyncStatus('synced');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `doctors/${doctorId}`);
    }
  };

  const deleteDoctor = async (doctorId: string) => {
    try {
      setDataSyncStatus('syncing');
      await deleteDoc(doc(db, 'doctors', doctorId));
      setDoctors(prev => prev.filter(d => d.id !== doctorId));
      setDataSyncStatus('synced');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `doctors/${doctorId}`);
    }
  };

  const bookAppointment = async (
    doctor: Doctor,
    hospital: Hospital,
    date: string,
    timeSlot: string,
    familyMemberId: string,
    type: 'OPD' | 'Teleconsultation' | 'Emergency'
  ): Promise<Appointment> => {
    const targetMember = familyMembers.find(f => f.id === familyMemberId) || selectedFamilyMember;
    const newApt: Appointment = {
      id: `apt_${Date.now()}`,
      patientId: authUser?.uid || user.id,
      patientName: targetMember.name,
      familyMemberId: targetMember.id,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      date,
      timeSlot,
      type,
      status: 'Confirmed',
      qrCodeData: `MEDIROUTE-APT-${Date.now()}-${hospital.id}-${doctor.id}`,
      tokenNumber: `${doctor.specialty.substring(0, 4).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
      consultationFee: doctor.consultationFee,
      paymentStatus: 'Paid',
      createdAt: new Date().toISOString().split('T')[0]
    };

    try {
      setDataSyncStatus('syncing');
      await withNetworkRetry(() => setDoc(doc(db, 'appointments', newApt.id), newApt));
      setAppointments(prev => [newApt, ...prev]);

      // Record payment in Firestore
      const newPayment = {
        id: `pay_${Date.now()}`,
        userId: authUser?.uid || user.id,
        amount: doctor.consultationFee,
        type: 'debit',
        description: `Booked ${type} with ${doctor.name} at ${hospital.name}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Completed'
      };
      await setDoc(doc(db, 'payments', newPayment.id), newPayment);

      // Add Notification in Firestore
      const newNotif = {
        id: `notif_${Date.now()}`,
        userId: authUser?.uid || user.id,
        title: 'Appointment Booked',
        message: `Confirmed appointment with ${doctor.name} on ${date} at ${timeSlot}. Token: ${newApt.tokenNumber}`,
        date: 'Just now',
        unread: true,
        type: 'appointment'
      };
      await setDoc(doc(db, 'notifications', newNotif.id), newNotif);

      trackAnalyticsEvent('appointment_booked', `${newApt.doctorName} - ${newApt.hospitalName}`);
      setDataSyncStatus('synced');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `appointments/${newApt.id}`);
    }

    // Update wallet balance & transactions
    setHealthWallet(prev => ({
      ...prev,
      balance: Math.max(0, prev.balance - doctor.consultationFee),
      transactions: [
        {
          id: `tx_${Date.now()}`,
          type: 'debit',
          amount: doctor.consultationFee,
          description: `Booked ${type} with ${doctor.name} at ${hospital.name}`,
          date: new Date().toISOString().split('T')[0]
        },
        ...prev.transactions
      ]
    }));

    return newApt;
  };

  const cancelAppointment = async (appointmentId: string) => {
    try {
      setDataSyncStatus('syncing');
      await updateDoc(doc(db, 'appointments', appointmentId), {
        status: 'Cancelled',
        paymentStatus: 'Refunded'
      });
      setAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, status: 'Cancelled', paymentStatus: 'Refunded' } : a));
      trackAnalyticsEvent('appointment_cancelled', appointmentId);
      setDataSyncStatus('synced');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `appointments/${appointmentId}`);
    }
  };

  const checkInHospital = async (appointmentId: string) => {
    try {
      setDataSyncStatus('syncing');
      await updateDoc(doc(db, 'appointments', appointmentId), { status: 'Checked-In' });
      setAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, status: 'Checked-In' } : a));
      trackAnalyticsEvent('hospital_qr_checkin', appointmentId);
      setDataSyncStatus('synced');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `appointments/${appointmentId}`);
    }
  };

  const deleteAppointment = async (appointmentId: string) => {
    try {
      setDataSyncStatus('syncing');
      await deleteDoc(doc(db, 'appointments', appointmentId));
      setAppointments(prev => prev.filter(a => a.id !== appointmentId));
      setDataSyncStatus('synced');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `appointments/${appointmentId}`);
    }
  };

  const addMedicalRecord = async (recordData: Omit<MedicalRecord, 'id'>) => {
    const newRecord: MedicalRecord = {
      ...recordData,
      id: `rec_${Date.now()}`
    };

    try {
      setDataSyncStatus('syncing');
      await withNetworkRetry(() => setDoc(doc(db, 'medicalRecords', newRecord.id), newRecord));
      setMedicalRecords(prev => [newRecord, ...prev]);
      trackAnalyticsEvent('medical_record_uploaded', newRecord.title);
      setDataSyncStatus('synced');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `medicalRecords/${newRecord.id}`);
    }
  };

  const deleteMedicalRecord = async (recordId: string) => {
    try {
      setDataSyncStatus('syncing');
      await deleteDoc(doc(db, 'medicalRecords', recordId));
      setMedicalRecords(prev => prev.filter(r => r.id !== recordId));
      setDataSyncStatus('synced');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `medicalRecords/${recordId}`);
    }
  };

  const addMedicineReminder = async (reminderData: Omit<MedicineReminder, 'id' | 'history'>) => {
    const newRem: MedicineReminder = {
      ...reminderData,
      id: `med_${Date.now()}`,
      history: []
    };

    try {
      setDataSyncStatus('syncing');
      await withNetworkRetry(() => setDoc(doc(db, 'medicines', newRem.id), newRem));
      await withNetworkRetry(() => setDoc(doc(db, 'medicineReminders', newRem.id), newRem));
      setMedicineReminders(prev => [newRem, ...prev]);
      trackAnalyticsEvent('medicine_reminder_added', newRem.medicineName);
      setDataSyncStatus('synced');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `medicines/${newRem.id}`);
    }
  };

  const markMedicineTaken = async (reminderId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMedicineReminders(prev => prev.map(m => {
      if (m.id === reminderId) {
        const updated = {
          ...m,
          remainingPills: Math.max(0, m.remainingPills - 1),
          history: [{ date: today, time: nowTime, status: 'Taken' as const }, ...(m.history || [])]
        };
        updateDoc(doc(db, 'medicines', reminderId), {
          remainingPills: updated.remainingPills,
          history: updated.history
        }).catch(() => console.warn('Offline update cached locally.'));
        updateDoc(doc(db, 'medicineReminders', reminderId), {
          remainingPills: updated.remainingPills,
          history: updated.history
        }).catch(() => {});
        return updated;
      }
      return m;
    }));
  };

  const deleteMedicineReminder = async (reminderId: string) => {
    try {
      setDataSyncStatus('syncing');
      await deleteDoc(doc(db, 'medicines', reminderId));
      await deleteDoc(doc(db, 'medicineReminders', reminderId)).catch(() => {});
      setMedicineReminders(prev => prev.filter(m => m.id !== reminderId));
      setDataSyncStatus('synced');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `medicines/${reminderId}`);
    }
  };

  const triggerEmergencySOS = async (): Promise<EmergencySOS> => {
    const nearestHosp = hospitals[0] || mockHospitals[0];
    const newSOS: EmergencySOS = {
      id: `sos_${Date.now()}`,
      patientId: authUser?.uid || user.id,
      patientName: selectedFamilyMember.name,
      phone: user.phone,
      location: {
        lat: 37.7749,
        lng: -122.4194,
        address: user.address
      },
      status: 'Ambulance Dispatched',
      hospitalAssigned: nearestHosp.name,
      ambulanceDriver: 'Officer Ray Miller (Unit 402)',
      ETA: '6 mins',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    try {
      await setDoc(doc(db, 'emergencySOS', newSOS.id), newSOS);
      await setDoc(doc(db, 'ambulances', newSOS.id), newSOS);

      // Create notification for Emergency
      const emergencyNotif = {
        id: `notif_${Date.now()}`,
        userId: authUser?.uid || user.id,
        title: 'Emergency SOS Dispatched',
        message: `Ambulance unit assigned for ${newSOS.patientName}. Destination: ${nearestHosp.name}. ETA: 6 mins.`,
        date: 'Just now',
        unread: true,
        type: 'emergency'
      };
      await setDoc(doc(db, 'notifications', emergencyNotif.id), emergencyNotif);

      trackAnalyticsEvent('emergency_sos_dispatched', newSOS.id);
    } catch (err) {
      console.warn('SOS logged locally:', err);
    }

    setActiveSOS(newSOS);
    return newSOS;
  };

  const requestAmbulance = async (
    type: AmbulanceRequest['type'],
    pickup: string,
    destination: string
  ): Promise<AmbulanceRequest> => {
    const req: AmbulanceRequest = {
      id: `amb_${Date.now()}`,
      patientName: selectedFamilyMember.name,
      phone: user.phone,
      type,
      pickupAddress: pickup || user.address,
      hospitalDestination: destination || hospitals[0]?.name || 'City Trauma Care Center',
      driverName: 'Capt. Marcus Vance',
      driverPhone: '+1 (555) 019-2831',
      vehicleNo: 'MED-AMB-911',
      status: 'Dispatched',
      ETA: '8 Minutes'
    };

    try {
      await setDoc(doc(db, 'ambulances', req.id), req);
      trackAnalyticsEvent('ambulance_requested', type);
    } catch (err) {
      console.warn('Ambulance request cached locally:', err);
    }

    return req;
  };

  const markNotificationRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { unread: false });
    } catch (err) {
      console.warn('Notification update cached locally:', err);
    }
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const deleteNotification = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (err) {
      console.warn('Notification delete cached locally:', err);
    }
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <AppContext.Provider value={{
      user, setUser,
      authUser,
      isLoggedIn, setIsLoggedIn,
      signInWithGoogle, logout,
      selectedFamilyMember, setSelectedFamilyMember,
      familyMembers, addFamilyMember,
      role, setRole,
      theme, setTheme, toggleTheme,
      language, setLanguage,
      showAndroidFrame, setShowAndroidFrame,
      isOnline, isLoadingData, dataSyncStatus,
      showAuthModal, setShowAuthModal,
      activeTab, setActiveTab,
      hospitals, doctors, appointments, medicalRecords, medicineReminders, followupReminders, insurance, healthWallet, timeline, ambulances, payments,
      addHospital, updateHospital, approveHospital, deleteHospital,
      addDoctor, updateDoctor, deleteDoctor,
      bookAppointment, cancelAppointment, checkInHospital, deleteAppointment,
      addMedicalRecord, deleteMedicalRecord,
      addMedicineReminder, markMedicineTaken, deleteMedicineReminder,
      triggerEmergencySOS, requestAmbulance,
      navTarget, setNavTarget,
      activeSOS, setActiveSOS,
      checkinModalAppointment, setCheckinModalAppointment,
      notifications, markNotificationRead, deleteNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

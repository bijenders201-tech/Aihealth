export type UserRole = 'patient' | 'doctor' | 'hospital_admin' | 'platform_admin';

export type AppLanguage = 'en' | 'es' | 'hi' | 'fr' | 'de' | 'ar';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  address: string;
  abhaId: string;
  isVerified: boolean;
  profilePhoto: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  role: UserRole;
  allergies: string[];
  chronicConditions: string[];
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: 'Self' | 'Spouse' | 'Child' | 'Parent' | 'Sibling' | 'Other';
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  allergies: string[];
  chronicConditions: string[];
  avatar: string;
}

export interface SymptomCheckResult {
  id: string;
  symptomText: string;
  age: number;
  gender: string;
  duration: string;
  severity: 'low' | 'medium' | 'high';
  primaryCategory: string;
  urgencyLevel: string;
  emergencyWarning: boolean;
  possibleCauses: string[];
  recommendedSpecialists: string[];
  suggestedQuestions: string[];
  triageAdvice: string;
  disclaimer: string;
  timestamp: string;
}

export interface DepartmentFloor {
  id: string;
  departmentName: string;
  building: string;
  floor: string;
  roomNumber: string;
  doctorInCharge: string;
}

export interface Hospital {
  id: string;
  name: string;
  tagline: string;
  address: string;
  city: string;
  distanceKm: number;
  rating: number;
  totalReviews: number;
  consultationFee: number;
  erWaitTimeMinutes: number;
  availableBeds: number;
  totalBeds: number;
  icuBeds?: number;
  is24x7: boolean;
  phone: string;
  image: string;
  logo?: string;
  lat: number;
  lng: number;
  specialties: string[];
  departments: DepartmentFloor[];
  facilities: string[];
  isApproved?: boolean;
  registrationNo?: string;
  opdTimings?: string;
  emergencyStatus?: 'Active 24x7' | 'High Volume' | 'Trauma Alert' | 'Full Capacity';
  ownerUid?: string;
}

export interface Doctor {
  id: string;
  name: string;
  hospitalId: string;
  hospitalName: string;
  specialty: string;
  qualification: string;
  experienceYears: number;
  languages: string[];
  rating: number;
  totalReviews: number;
  consultationFee: number;
  avatar: string;
  bio: string;
  availabilityDays: string[];
  timeSlots: string[];
  councilRegNumber?: string;
  opdTimings?: string;
  isVerified?: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  familyMemberId: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  hospitalId: string;
  hospitalName: string;
  date: string;
  timeSlot: string;
  type: 'OPD' | 'Teleconsultation' | 'Emergency';
  status: 'Confirmed' | 'Checked-In' | 'In-Progress' | 'Completed' | 'Cancelled';
  qrCodeData: string;
  tokenNumber: string;
  consultationFee: number;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  createdAt: string;
  notes?: string;
}

export interface AISummaryResult {
  reportTitle: string;
  patientSummary: string;
  keyMetrics: {
    parameter: string;
    value: string;
    status: 'normal' | 'high' | 'low' | 'critical';
    explanation: string;
  }[];
  actionableAdvice: string[];
  questionsForDoctor: string[];
  disclaimer: string;
}

export type RecordType = 'Prescription' | 'Blood Test' | 'X-Ray' | 'MRI' | 'CT Scan' | 'ECG' | 'Vaccination' | 'Discharge Summary';

export interface MedicalRecord {
  id: string;
  patientId: string;
  familyMemberId: string;
  title: string;
  type: RecordType;
  doctorName: string;
  hospitalName: string;
  date: string;
  fileUrl?: string;
  rawText: string;
  aiSummary?: AISummaryResult;
  tags: string[];
}

export interface MedicineReminder {
  id: string;
  patientId: string;
  familyMemberId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  times: string[]; // e.g. ["08:00 AM", "08:00 PM"]
  instructions: 'Before Meal' | 'After Meal' | 'With Food' | 'Anytime';
  remainingPills: number;
  totalPills: number;
  startDate: string;
  endDate: string;
  active: boolean;
  history: {
    date: string;
    time: string;
    status: 'Taken' | 'Skipped' | 'Missed';
  }[];
}

export interface FollowupReminder {
  id: string;
  patientId: string;
  familyMemberId: string;
  doctorName: string;
  specialty: string;
  hospitalName: string;
  dueDate: string;
  reason: string;
  status: 'Upcoming' | 'Completed' | 'Dismissed';
}

export interface EmergencySOS {
  id: string;
  patientId: string;
  patientName: string;
  phone: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'Triggered' | 'Ambulance Dispatched' | 'Arrived' | 'Resolved';
  hospitalAssigned?: string;
  ambulanceDriver?: string;
  ETA?: string;
  timestamp: string;
}

export interface BloodBank {
  id: string;
  hospitalName: string;
  city: string;
  contactPhone: string;
  inventory: {
    bloodGroup: string;
    unitsAvailable: number;
    status: 'Available' | 'Low' | 'Critical';
  }[];
}

export interface AmbulanceRequest {
  id: string;
  patientName: string;
  phone: string;
  type: 'Basic Life Support (BLS)' | 'Advanced Life Support (ALS)' | 'ICU on Wheels';
  pickupAddress: string;
  hospitalDestination: string;
  driverName: string;
  driverPhone: string;
  vehicleNo: string;
  status: 'Dispatched' | 'En Route' | 'Picked Up' | 'Completed';
  ETA: string;
}

export interface InsurancePolicy {
  id: string;
  patientId: string;
  providerName: string;
  policyNumber: string;
  coverageAmount: number;
  claimedAmount: number;
  validTill: string;
  status: 'Active' | 'Under Review' | 'Expired';
  digitalCardUrl: string;
}

export interface HealthWallet {
  id: string;
  patientId: string;
  balance: number;
  abhaHealthId: string;
  cardHolderName: string;
  transactions: {
    id: string;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    date: string;
  }[];
}

export interface HealthTimelineItem {
  id: string;
  patientId: string;
  familyMemberId: string;
  eventType: 'vital' | 'visit' | 'report' | 'vaccine' | 'prescription' | 'sos';
  title: string;
  description: string;
  date: string;
  category: string;
}

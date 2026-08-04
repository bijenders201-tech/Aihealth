import {
  Hospital,
  Doctor,
  MedicalRecord,
  MedicineReminder,
  FollowupReminder,
  BloodBank,
  InsurancePolicy,
  HealthWallet,
  HealthTimelineItem,
  FamilyMember,
  UserProfile
} from '../types';

export const initialUserProfile: UserProfile = {
  id: 'usr_101',
  name: 'Alex Johnson',
  phone: '+1 (555) 234-5678',
  email: 'alex.johnson@mediroute.ai',
  age: 34,
  gender: 'Male',
  bloodGroup: 'O+',
  address: '742 Evergreen Terrace, San Francisco, CA',
  abhaId: 'ABHA-9821-4412-8801',
  isVerified: true,
  profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  emergencyContact: {
    name: 'Sarah Johnson',
    relationship: 'Spouse',
    phone: '+1 (555) 876-5432'
  },
  role: 'patient',
  allergies: ['Penicillin', 'Dust Mites'],
  chronicConditions: ['Mild Asthma', 'Seasonal Rhinitis']
};

export const initialFamilyMembers: FamilyMember[] = [
  {
    id: 'fam_1',
    name: 'Alex Johnson (Self)',
    relationship: 'Self',
    age: 34,
    gender: 'Male',
    bloodGroup: 'O+',
    allergies: ['Penicillin'],
    chronicConditions: ['Mild Asthma'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'fam_2',
    name: 'Sarah Johnson',
    relationship: 'Spouse',
    age: 32,
    gender: 'Female',
    bloodGroup: 'A+',
    allergies: ['Peanuts'],
    chronicConditions: [],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'fam_3',
    name: 'Leo Johnson',
    relationship: 'Child',
    age: 6,
    gender: 'Male',
    bloodGroup: 'O+',
    allergies: [],
    chronicConditions: [],
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'fam_4',
    name: 'Robert Johnson',
    relationship: 'Parent',
    age: 68,
    gender: 'Male',
    bloodGroup: 'B+',
    allergies: ['Sulfa Drugs'],
    chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'
  }
];

export const mockHospitals: Hospital[] = [
  {
    id: 'hosp_aiims_delhi',
    name: 'AIIMS New Delhi (All India Institute of Medical Sciences)',
    tagline: 'Apex Autonomous Public Medical Institute & Level-1 Trauma Centre',
    address: 'Sri Aurobindo Marg, Ansari Nagar',
    city: 'New Delhi',
    distanceKm: 1.8,
    rating: 4.9,
    totalReviews: 4890,
    consultationFee: 500,
    erWaitTimeMinutes: 10,
    availableBeds: 124,
    totalBeds: 2478,
    icuBeds: 35,
    is24x7: true,
    phone: '+91 11 2658 8500',
    registrationNo: 'AIIMS-ND-1956-GOI',
    opdTimings: '08:00 AM - 04:00 PM (Mon-Sat)',
    emergencyStatus: 'Active 24x7',
    isApproved: true,
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=600',
    logo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=200',
    lat: 28.5672,
    lng: 77.2100,
    specialties: ['Cardiology', 'Pulmonology', 'Neurology', 'Trauma & Emergency', 'Gastroenterology', 'Oncology', 'Nephrology', 'Pediatrics'],
    facilities: ['Level 1 Trauma Unit', 'Organ Transplant ICU', '24/7 Blood Bank', 'Gamma Knife Radiosurgery', 'Robot Assisted Surgery', 'Digital CT & MRI'],
    departments: [
      { id: 'dep_aiims_1', departmentName: 'Apex Trauma Center (ER)', building: 'JPN Trauma Center', floor: 'Ground Floor', roomNumber: 'ER-01', doctorInCharge: 'Dr. Randeep Guleria' },
      { id: 'dep_aiims_2', departmentName: 'Cardiothoracic OPD', building: 'Cardio-Neuro Centre', floor: '3rd Floor', roomNumber: 'CNC-302', doctorInCharge: 'Dr. Ashok Seth' },
      { id: 'dep_aiims_3', departmentName: 'Pulmonary & Critical Care', building: 'Main OPD Block', floor: '2nd Floor', roomNumber: 'PULM-204', doctorInCharge: 'Dr. Randeep Guleria' },
      { id: 'dep_aiims_4', departmentName: 'Neurosurgery & Stroke Center', building: 'Cardio-Neuro Centre', floor: '5th Floor', roomNumber: 'NEURO-501', doctorInCharge: 'Dr. B. K. Misra' }
    ]
  },
  {
    id: 'hosp_apollo_chennai',
    name: 'Apollo Hospitals, Greams Road',
    tagline: 'Asia Premier Multi-Specialty Quaternary Care Hospital',
    address: '21 Greams Lane, Thousand Lights',
    city: 'Chennai',
    distanceKm: 3.2,
    rating: 4.9,
    totalReviews: 3120,
    consultationFee: 1200,
    erWaitTimeMinutes: 12,
    availableBeds: 48,
    totalBeds: 600,
    icuBeds: 18,
    is24x7: true,
    phone: '+91 44 2829 0200',
    registrationNo: 'NABH-APOLLO-CHE-2024',
    opdTimings: '08:30 AM - 07:00 PM (Mon-Sat)',
    emergencyStatus: 'Active 24x7',
    isApproved: true,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600',
    logo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=200',
    lat: 13.0604,
    lng: 80.2496,
    specialties: ['Cardiology', 'Robotic Surgery', 'Oncology', 'Nephrology', 'Orthopedics', 'Liver & Kidney Transplant'],
    facilities: ['CyberKnife Centre', 'Proton Therapy', '24/7 Cardiac ER', 'Hybrid Cath Lab', 'In-house Blood Bank'],
    departments: [
      { id: 'dep_apollo_1', departmentName: 'Heart & Vascular OPD', building: 'Main Tower', floor: '1st Floor', roomNumber: 'OPD-102', doctorInCharge: 'Dr. V. Mohan' },
      { id: 'dep_apollo_2', departmentName: 'Emergency & Acute Care', building: 'Emergency Wing', floor: 'Ground Floor', roomNumber: 'EMG-01', doctorInCharge: 'Dr. Devi Prasad Shetty' }
    ]
  },
  {
    id: 'hosp_fortis_delhi',
    name: 'Fortis Escorts Heart Institute',
    tagline: 'World-Renowned Pioneer in Advanced Cardiac Care & Surgery',
    address: 'Okhla Road, Opp Holy Family Hospital',
    city: 'New Delhi',
    distanceKm: 4.5,
    rating: 4.8,
    totalReviews: 2840,
    consultationFee: 1500,
    erWaitTimeMinutes: 8,
    availableBeds: 28,
    totalBeds: 310,
    icuBeds: 14,
    is24x7: true,
    phone: '+91 11 4713 5000',
    registrationNo: 'NABH-FEHI-DEL-8802',
    opdTimings: '09:00 AM - 06:00 PM (Mon-Sat)',
    emergencyStatus: 'Active 24x7',
    isApproved: true,
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=600',
    lat: 28.5606,
    lng: 77.2732,
    specialties: ['Cardiology', 'Cardiothoracic Surgery', 'Pediatric Cardiology', 'Electrophysiology', 'Vascular Surgery'],
    facilities: ['Advanced Cath Labs', 'Dedicated Pediatric ICU', 'Chest Pain Unit', '24/7 Cardiac Ambulance'],
    departments: [
      { id: 'dep_fortis_1', departmentName: 'Interventional Cardiology OPD', building: 'Cardiology Block', floor: 'Ground Floor', roomNumber: 'OPD-10', doctorInCharge: 'Dr. Ashok Seth' }
    ]
  },
  {
    id: 'hosp_max_saket',
    name: 'Max Super Speciality Hospital, Saket',
    tagline: 'Advanced Oncology, CyberKnife Radiation & Robotic Surgery Institute',
    address: '1, 2 Press Enclave Marg, Saket',
    city: 'New Delhi',
    distanceKm: 5.1,
    rating: 4.8,
    totalReviews: 2190,
    consultationFee: 1200,
    erWaitTimeMinutes: 15,
    availableBeds: 65,
    totalBeds: 530,
    icuBeds: 22,
    is24x7: true,
    phone: '+91 11 2651 5050',
    registrationNo: 'NABH-MAX-SAKET-1092',
    opdTimings: '08:00 AM - 08:00 PM (Mon-Sat)',
    emergencyStatus: 'Active 24x7',
    isApproved: true,
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600',
    lat: 28.5282,
    lng: 77.2120,
    specialties: ['Oncology', 'Neurosurgery', 'Orthopedics', 'Pulmonology', 'Bone Marrow Transplant', 'Urology'],
    facilities: ['Da Vinci Robotic System', 'PET-CT Scan', 'TrueBeam LINAC', 'Level 3 NICU & PICU'],
    departments: [
      { id: 'dep_max_1', departmentName: 'Oncology & Hematology', building: 'West Wing', floor: '2nd Floor', roomNumber: 'ONCO-201', doctorInCharge: 'Dr. Arvinder Singh Soin' }
    ]
  },
  {
    id: 'hosp_medanta_gurugram',
    name: 'Medanta - The Medicity',
    tagline: 'Indias Largest Multi-Super Specialty Institute & Organ Transplant Leader',
    address: 'CH Baktawar Singh Road, Sector 38',
    city: 'Gurugram',
    distanceKm: 12.4,
    rating: 4.9,
    totalReviews: 5410,
    consultationFee: 1500,
    erWaitTimeMinutes: 12,
    availableBeds: 110,
    totalBeds: 1250,
    icuBeds: 45,
    is24x7: true,
    phone: '+91 124 414 1414',
    registrationNo: 'NABH-MEDANTA-GUR-4021',
    opdTimings: '08:00 AM - 07:00 PM (Mon-Sat)',
    emergencyStatus: 'Active 24x7',
    isApproved: true,
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=600',
    lat: 28.4382,
    lng: 77.0425,
    specialties: ['Heart Institute', 'Liver Transplant', 'Kidney Transplant', 'Neurosciences', 'Bone & Joint', 'Cancer Care'],
    facilities: ['Air Ambulance Helipad', 'Robotic Surgery Suite', '3.0T MRI', '24/7 Level 1 Emergency'],
    departments: [
      { id: 'dep_medanta_1', departmentName: 'Heart Institute OPD', building: 'Building A', floor: '1st Floor', roomNumber: 'OPD-101', doctorInCharge: 'Dr. Naresh Trehan' },
      { id: 'dep_medanta_2', departmentName: 'Institute of Liver Transplantation', building: 'Building B', floor: '2nd Floor', roomNumber: 'LIVER-202', doctorInCharge: 'Dr. Arvinder Singh Soin' }
    ]
  },
  {
    id: 'hosp_kokilaben_mumbai',
    name: 'Kokilaben Dhirubhai Ambani Hospital',
    tagline: 'Landmark Multi-Specialty Quaternary Care & Robotic Surgery Center',
    address: 'Rao Saheb Achutrao Patwardhan Marg, Andheri West',
    city: 'Mumbai',
    distanceKm: 8.5,
    rating: 4.9,
    totalReviews: 3820,
    consultationFee: 1800,
    erWaitTimeMinutes: 8,
    availableBeds: 72,
    totalBeds: 750,
    icuBeds: 30,
    is24x7: true,
    phone: '+91 22 4269 6969',
    registrationNo: 'NABH-KDAH-MUM-7710',
    opdTimings: '08:00 AM - 08:00 PM (Mon-Sat)',
    emergencyStatus: 'Active 24x7',
    isApproved: true,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600',
    lat: 19.1310,
    lng: 72.8252,
    specialties: ['Neurosurgery', 'Childrens Heart Centre', 'Cardiac Care', 'Bone & Joint', 'Physical Rehabilitation'],
    facilities: ['Full Time Specialist System (FTSS)', 'EDGE Radiosurgery', 'Gait & Motion Analysis Lab'],
    departments: [
      { id: 'dep_kdah_1', departmentName: 'Centre for Neurosciences', building: 'Main Wing', floor: '3rd Floor', roomNumber: 'NEURO-304', doctorInCharge: 'Dr. B. K. Misra' },
      { id: 'dep_kdah_2', departmentName: 'Childrens Heart Centre', building: 'Pediatric Tower', floor: '2nd Floor', roomNumber: 'PED-201', doctorInCharge: 'Dr. Suresh Joshi' }
    ]
  }
];

export const mockDoctors: Doctor[] = [
  {
    id: 'doc_naresh_trehan',
    name: 'Dr. Naresh Trehan',
    hospitalId: 'hosp_medanta_gurugram',
    hospitalName: 'Medanta - The Medicity',
    specialty: 'Cardiovascular Surgeon',
    qualification: 'MBBS, ABRS (USA), Padma Bhushan',
    experienceYears: 42,
    languages: ['Hindi', 'English', 'Punjabi'],
    rating: 4.9,
    totalReviews: 1240,
    consultationFee: 2000,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    bio: 'Pioneer Cardiovascular & Cardiothoracic Surgeon. Performed over 48,000 successful open-heart surgeries in India. Founder of Medanta.',
    availabilityDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timeSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
    councilRegNumber: 'MCI-12890',
    opdTimings: '09:00 AM - 01:00 PM',
    isVerified: true
  },
  {
    id: 'doc_devi_shetty',
    name: 'Dr. Devi Prasad Shetty',
    hospitalId: 'hosp_apollo_chennai',
    hospitalName: 'Apollo Hospitals, Greams Road',
    specialty: 'Cardiac Surgeon',
    qualification: 'MBBS, MS, FRCS (Glasgow), Padma Bhushan',
    experienceYears: 38,
    languages: ['Kannada', 'Hindi', 'English', 'Tamil'],
    rating: 5.0,
    totalReviews: 2150,
    consultationFee: 1500,
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
    bio: 'World renowned Cardiac Surgeon specializing in pediatric cardiac surgery, coronary bypass, and affordable healthcare innovation.',
    availabilityDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    timeSlots: ['10:00 AM', '12:00 PM', '03:00 PM', '05:00 PM'],
    councilRegNumber: 'KMC-38910',
    opdTimings: '10:00 AM - 02:00 PM',
    isVerified: true
  },
  {
    id: 'doc_randeep_guleria',
    name: 'Dr. Randeep Guleria',
    hospitalId: 'hosp_aiims_delhi',
    hospitalName: 'AIIMS New Delhi',
    specialty: 'Pulmonologist',
    qualification: 'MBBS, MD, DM (Pulmonary Medicine), Padma Shri',
    experienceYears: 35,
    languages: ['Hindi', 'English'],
    rating: 4.9,
    totalReviews: 1890,
    consultationFee: 1500,
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300',
    bio: 'Renowned Pulmonologist & Ex-Director AIIMS New Delhi. Global expert in respiratory disorders, asthma, sleep apnea, and lung disease.',
    availabilityDays: ['Mon', 'Tue', 'Thu', 'Fri'],
    timeSlots: ['08:30 AM', '10:30 AM', '02:30 PM', '04:30 PM'],
    councilRegNumber: 'DMC-18230',
    opdTimings: '08:30 AM - 01:00 PM',
    isVerified: true
  },
  {
    id: 'doc_ashok_seth',
    name: 'Dr. Ashok Seth',
    hospitalId: 'hosp_fortis_delhi',
    hospitalName: 'Fortis Escorts Heart Institute',
    specialty: 'Interventional Cardiologist',
    qualification: 'MBBS, FRCP (London), FACC, Padma Bhushan',
    experienceYears: 36,
    languages: ['Hindi', 'English'],
    rating: 4.9,
    totalReviews: 950,
    consultationFee: 2000,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    bio: 'Chairman of Fortis Escorts Heart Institute. Pioneer in stenting, angioplasty, TAVR, and complex interventional cardiac procedures.',
    availabilityDays: ['Mon', 'Wed', 'Thu', 'Sat'],
    timeSlots: ['09:30 AM', '11:30 AM', '03:00 PM', '05:00 PM'],
    councilRegNumber: 'DMC-9012',
    opdTimings: '09:30 AM - 02:00 PM',
    isVerified: true
  },
  {
    id: 'doc_arvinder_soin',
    name: 'Dr. Arvinder Singh Soin',
    hospitalId: 'hosp_medanta_gurugram',
    hospitalName: 'Medanta - The Medicity',
    specialty: 'Liver Transplant Surgeon',
    qualification: 'MBBS, MS, FRCS (Edinburgh), Padma Shri',
    experienceYears: 32,
    languages: ['Hindi', 'English', 'Punjabi'],
    rating: 4.8,
    totalReviews: 810,
    consultationFee: 2200,
    avatar: 'https://images.unsplash.com/photo-1594824813566-814041b6c891?auto=format&fit=crop&q=80&w=300',
    bio: 'Chief Liver Transplant Surgeon with over 3,500 successful liver transplants. Pioneer in living donor liver transplantation in India.',
    availabilityDays: ['Tue', 'Thu', 'Fri', 'Sat'],
    timeSlots: ['10:00 AM', '01:00 PM', '04:00 PM'],
    councilRegNumber: 'HMC-4412',
    opdTimings: '10:00 AM - 03:00 PM',
    isVerified: true
  },
  {
    id: 'doc_bk_misra',
    name: 'Dr. B. K. Misra',
    hospitalId: 'hosp_kokilaben_mumbai',
    hospitalName: 'Kokilaben Dhirubhai Ambani Hospital',
    specialty: 'Neurosurgeon',
    qualification: 'MBBS, MS, M.Ch (Neurosurgery), Dr BC Roy Award',
    experienceYears: 37,
    languages: ['Marathi', 'Hindi', 'English', 'Odia'],
    rating: 4.9,
    totalReviews: 720,
    consultationFee: 1800,
    avatar: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=300',
    bio: 'Head of Neurosurgery at Kokilaben Ambani Hospital. First neurosurgeon in South Asia to perform Image-Guided Skull Base Surgery.',
    availabilityDays: ['Mon', 'Tue', 'Wed', 'Fri'],
    timeSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '05:00 PM'],
    councilRegNumber: 'MMC-5120',
    opdTimings: '09:00 AM - 01:30 PM',
    isVerified: true
  }
];

export const initialMedicalRecords: MedicalRecord[] = [
  {
    id: 'rec_1',
    patientId: 'usr_101',
    familyMemberId: 'fam_1',
    title: 'Comprehensive Lipid & Fasting Blood Panel',
    type: 'Blood Test',
    doctorName: 'Dr. Sarah Patel',
    hospitalName: 'City Care Community Hospital',
    date: '2026-07-15',
    rawText: `PATIENT: Alex Johnson | AGE: 34 | DATE: 2026-07-15
Fasting Plasma Glucose: 104 mg/dL (High, Ref: 70-99 mg/dL)
Total Cholesterol: 215 mg/dL (Borderline High, Ref: <200)
HDL Cholesterol: 48 mg/dL (Optimal, Ref: >40)
LDL Cholesterol: 138 mg/dL (Slightly High, Ref: <100)
Triglycerides: 145 mg/dL (Normal, Ref: <150)
Hemoglobin (Hb): 14.8 g/dL (Normal, Ref: 13.8-17.2)
White Blood Cells (WBC): 6,800 /mcL (Normal)
Platelets: 250,000 /mcL (Normal)`,
    aiSummary: {
      reportTitle: 'Lipid & Glucose Test Analysis',
      patientSummary: 'Overall blood parameters are healthy, but your fasting blood sugar (104 mg/dL) and total cholesterol (215 mg/dL) are slightly elevated above optimal ranges.',
      keyMetrics: [
        { parameter: 'Fasting Blood Sugar', value: '104 mg/dL', status: 'high', explanation: 'Slightly above normal (70-99 mg/dL). Pre-diabetes indicator if persistent.' },
        { parameter: 'Total Cholesterol', value: '215 mg/dL', status: 'high', explanation: 'Borderline high. Reduce saturated fats and increase cardio activity.' },
        { parameter: 'HDL Cholesterol', value: '48 mg/dL', status: 'normal', explanation: 'Good cholesterol level protecting heart blood vessels.' },
        { parameter: 'Hemoglobin', value: '14.8 g/dL', status: 'normal', explanation: 'Excellent oxygen supply in red blood cells.' }
      ],
      actionableAdvice: [
        'Engage in 30 minutes of aerobic exercise 4-5 times a week',
        'Limit refined sugars and fried foods in diet',
        'Repeat fasting glucose test in 3 months'
      ],
      questionsForDoctor: [
        'Does my glucose level require dietary intervention or medication?',
        'Should I take Omega-3 supplements for cholesterol?'
      ],
      disclaimer: 'Summary for patient understanding. Consult your primary physician Dr. Sarah Patel for clinical advice.'
    },
    tags: ['Blood Test', 'Cholesterol', 'Glucose', 'Routine']
  },
  {
    id: 'rec_2',
    patientId: 'usr_101',
    familyMemberId: 'fam_1',
    title: 'Chest X-Ray PA View',
    type: 'X-Ray',
    doctorName: 'Dr. Elena Rostova',
    hospitalName: 'Apex General Medical Center',
    date: '2026-06-10',
    rawText: `IMAGING REPORT: Chest X-Ray PA View
Findings: Lungs are clear with no focal consolidation, pneumothorax, or pleural effusion. Cardiomegaly is absent. Heart size and mediastinal contours are normal. Both costophrenic angles are clear.
Impression: Normal chest radiographic examination.`,
    aiSummary: {
      reportTitle: 'Chest X-Ray Result',
      patientSummary: 'Your lungs and heart appear completely healthy on the X-Ray image with no signs of infection, fluid, or lung congestion.',
      keyMetrics: [
        { parameter: 'Lungs Clarity', value: 'Clear', status: 'normal', explanation: 'No pneumonia or fluid buildup found.' },
        { parameter: 'Heart Size', value: 'Normal', status: 'normal', explanation: 'No enlargement or strain on the heart.' }
      ],
      actionableAdvice: ['No further imaging needed. Continue prescribed asthma inhaler as needed.'],
      questionsForDoctor: ['Are my respiratory allergy symptoms unrelated to lung structure?'],
      disclaimer: 'Radiology summary generated by AI.'
    },
    tags: ['X-Ray', 'Lungs', 'Apex Medical']
  },
  {
    id: 'rec_3',
    patientId: 'usr_101',
    familyMemberId: 'fam_1',
    title: 'Asthma Inhaler & Antihistamine Prescription',
    type: 'Prescription',
    doctorName: 'Dr. Sarah Patel',
    hospitalName: 'City Care Community Hospital',
    date: '2026-05-20',
    rawText: `Rx:
1. Budesonide + Formoterol Inhaler 200mcg - 2 puffs twice daily (Morning & Night)
2. Montelukast 10mg - 1 tablet daily at bedtime
3. Levocetirizine 5mg - 1 tablet as needed for severe rhinitis/itching`,
    tags: ['Prescription', 'Asthma', 'Medication']
  },
  {
    id: 'rec_4',
    patientId: 'usr_101',
    familyMemberId: 'fam_4',
    title: 'HbA1c & Diabetes Assessment (Father)',
    type: 'Blood Test',
    doctorName: 'Dr. Sarah Patel',
    hospitalName: 'City Care Community Hospital',
    date: '2026-07-02',
    rawText: `PATIENT: Robert Johnson (Age 68)
HbA1c: 6.8% (Controlled Diabetic, Target <7.0%)
Blood Pressure: 132/84 mmHg
eGFR: 78 mL/min (Mildly Decreased, Age appropriate)`,
    tags: ['Blood Test', 'Diabetes', 'HbA1c', 'Parent']
  }
];

export const initialMedicineReminders: MedicineReminder[] = [
  {
    id: 'med_1',
    patientId: 'usr_101',
    familyMemberId: 'fam_1',
    medicineName: 'Symbicort Asthma Inhaler',
    dosage: '2 Puffs (200mcg)',
    frequency: 'Twice Daily',
    times: ['08:00 AM', '08:00 PM'],
    instructions: 'Before Meal',
    remainingPills: 24,
    totalPills: 120,
    startDate: '2026-05-20',
    endDate: '2026-11-20',
    active: true,
    history: [
      { date: '2026-08-02', time: '08:00 AM', status: 'Taken' },
      { date: '2026-08-02', time: '08:00 PM', status: 'Taken' },
      { date: '2026-08-03', time: '08:00 AM', status: 'Taken' }
    ]
  },
  {
    id: 'med_2',
    patientId: 'usr_101',
    familyMemberId: 'fam_1',
    medicineName: 'Montelukast Sodium',
    dosage: '10 mg (1 Tablet)',
    frequency: 'Once Daily at Night',
    times: ['09:30 PM'],
    instructions: 'After Meal',
    remainingPills: 8,
    totalPills: 30,
    startDate: '2026-07-10',
    endDate: '2026-08-10',
    active: true,
    history: [
      { date: '2026-08-02', time: '09:30 PM', status: 'Taken' }
    ]
  },
  {
    id: 'med_3',
    patientId: 'usr_101',
    familyMemberId: 'fam_4',
    medicineName: 'Metformin SR (Father)',
    dosage: '500 mg (1 Tablet)',
    frequency: 'Twice Daily',
    times: ['09:00 AM', '08:30 PM'],
    instructions: 'With Food',
    remainingPills: 45,
    totalPills: 60,
    startDate: '2026-06-01',
    endDate: '2026-12-31',
    active: true,
    history: [
      { date: '2026-08-02', time: '09:00 AM', status: 'Taken' },
      { date: '2026-08-02', time: '08:30 PM', status: 'Taken' }
    ]
  }
];

export const initialFollowups: FollowupReminder[] = [
  {
    id: 'fol_1',
    patientId: 'usr_101',
    familyMemberId: 'fam_1',
    doctorName: 'Dr. Elena Rostova',
    specialty: 'Cardiologist',
    hospitalName: 'Apex General Medical Center',
    dueDate: '2026-08-20',
    reason: 'Routine Preventive Heart Sound Check & ECG Review',
    status: 'Upcoming'
  },
  {
    id: 'fol_2',
    patientId: 'usr_101',
    familyMemberId: 'fam_4',
    doctorName: 'Dr. Sarah Patel',
    specialty: 'General Physician',
    hospitalName: 'City Care Community Hospital',
    dueDate: '2026-08-15',
    reason: 'Father Diabetes Quarterly HbA1c Review',
    status: 'Upcoming'
  }
];

export const mockBloodBanks: BloodBank[] = [
  {
    id: 'bb_1',
    hospitalName: 'Apex General Blood Center',
    city: 'San Francisco',
    contactPhone: '+1 (555) 900-1099',
    inventory: [
      { bloodGroup: 'O+', unitsAvailable: 18, status: 'Available' },
      { bloodGroup: 'O-', unitsAvailable: 3, status: 'Low' },
      { bloodGroup: 'A+', unitsAvailable: 22, status: 'Available' },
      { bloodGroup: 'A-', unitsAvailable: 5, status: 'Available' },
      { bloodGroup: 'B+', unitsAvailable: 14, status: 'Available' },
      { bloodGroup: 'B-', unitsAvailable: 2, status: 'Critical' },
      { bloodGroup: 'AB+', unitsAvailable: 9, status: 'Available' },
      { bloodGroup: 'AB-', unitsAvailable: 1, status: 'Critical' }
    ]
  },
  {
    id: 'bb_2',
    hospitalName: 'St. Jude Transfusion Unit',
    city: 'San Francisco',
    contactPhone: '+1 (555) 888-2099',
    inventory: [
      { bloodGroup: 'O+', unitsAvailable: 12, status: 'Available' },
      { bloodGroup: 'O-', unitsAvailable: 8, status: 'Available' },
      { bloodGroup: 'B+', unitsAvailable: 19, status: 'Available' },
      { bloodGroup: 'AB+', unitsAvailable: 4, status: 'Low' }
    ]
  }
];

export const mockInsurance: InsurancePolicy = {
  id: 'pol_9912',
  patientId: 'usr_101',
  providerName: 'BlueShield TotalCare Platinum',
  policyNumber: 'BS-8839201-SF',
  coverageAmount: 100000,
  claimedAmount: 12500,
  validTill: '2027-03-31',
  status: 'Active',
  digitalCardUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=500'
};

export const mockHealthWallet: HealthWallet = {
  id: 'wal_5510',
  patientId: 'usr_101',
  balance: 450.00,
  abhaHealthId: 'ABHA-9821-4412-8801',
  cardHolderName: 'Alex Johnson',
  transactions: [
    { id: 'tx_1', type: 'debit', amount: 50.00, description: 'OPD Consultation - Dr. Elena Rostova', date: '2026-07-28' },
    { id: 'tx_2', type: 'credit', amount: 200.00, description: 'Insurance Co-pay Cash Back', date: '2026-07-20' },
    { id: 'tx_3', type: 'debit', amount: 30.00, description: 'Pharmacy Prescription Refill', date: '2026-07-10' }
  ]
};

export const mockHealthTimeline: HealthTimelineItem[] = [
  {
    id: 'tl_1',
    patientId: 'usr_101',
    familyMemberId: 'fam_1',
    eventType: 'visit',
    title: 'Consultation with Dr. Elena Rostova',
    description: 'Cardiology OPD checkup - Normal blood pressure (118/78 mmHg). Advice to continue active routine.',
    date: '2026-07-28',
    category: 'Doctor Visit'
  },
  {
    id: 'tl_2',
    patientId: 'usr_101',
    familyMemberId: 'fam_1',
    eventType: 'report',
    title: 'Fasting Lipid & Glucose Panel Uploaded',
    description: 'Glucose slightly high (104 mg/dL). AI report summary generated.',
    date: '2026-07-15',
    category: 'Lab Report'
  },
  {
    id: 'tl_3',
    patientId: 'usr_101',
    familyMemberId: 'fam_1',
    eventType: 'vaccine',
    title: 'Annual Influenza Booster Shot',
    description: 'Administered at City Care Community Hospital.',
    date: '2026-06-05',
    category: 'Vaccination'
  },
  {
    id: 'tl_4',
    patientId: 'usr_101',
    familyMemberId: 'fam_1',
    eventType: 'vital',
    title: 'Recorded Vitals Check',
    description: 'SpO2: 99%, Heart Rate: 72 bpm, Weight: 74 kg',
    date: '2026-05-10',
    category: 'Vitals'
  }
];

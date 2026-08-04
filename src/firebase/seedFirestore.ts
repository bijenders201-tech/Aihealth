import { db } from './config';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';

export async function seedProductionFirestoreDatabase() {
  console.log('Beginning Firestore Production Data Seeding...');

  try {
    // 1. Users collection
    const usersData = [
      {
        id: 'usr_101',
        uid: 'usr_101',
        name: 'Alex Johnson',
        email: 'alex.johnson@mediroute.ai',
        phone: '+1 (555) 234-5678',
        role: 'patient',
        age: 34,
        gender: 'Male',
        bloodGroup: 'O+',
        address: '742 Evergreen Terrace, San Francisco, CA',
        abhaId: 'ABHA-9821-4412-8801',
        isVerified: true,
        allergies: ['Penicillin', 'Dust Mites'],
        chronicConditions: ['Mild Asthma', 'Seasonal Rhinitis'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'doc_user_1',
        uid: 'doc_user_1',
        name: 'Dr. Elena Rostova',
        email: 'elena.rostova@mediroute.ai',
        phone: '+1 (555) 900-1001',
        role: 'doctor',
        specialty: 'Cardiologist',
        hospitalName: 'Apex General Medical Center',
        councilRegNumber: 'PMC-991823',
        isVerified: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'hosp_user_1',
        uid: 'hosp_user_1',
        name: 'Apex Hospital Administration',
        email: 'admin@apexhealth.org',
        phone: '+1 (555) 900-1000',
        role: 'hospital',
        hospitalName: 'Apex General Medical Center',
        isVerified: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'admin_user_1',
        uid: 'admin_user_1',
        name: 'Platform Super Admin',
        email: 'admin@mediroute.ai',
        phone: '+1 (555) 000-1122',
        role: 'admin',
        isVerified: true,
        createdAt: new Date().toISOString()
      }
    ];

    for (const u of usersData) {
      await setDoc(doc(db, 'users', u.id), u, { merge: true });
    }

    // 2. Hospitals collection
    const hospitalsData = [
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

    for (const h of hospitalsData) {
      await setDoc(doc(db, 'hospitals', h.id), h, { merge: true });
    }

    // 3. Doctors collection
    const doctorsData = [
      {
        id: 'doc_naresh_trehan',
        name: 'Dr. Naresh Trehan',
        hospitalId: 'hosp_medanta_gurugram',
        hospitalName: 'Medanta - The Medicity',
        specialty: 'Cardiovascular Surgeon',
        qualification: 'MBBS, ABRS (USA), Padma Bhushan',
        councilRegNumber: 'MCI-12890',
        experienceYears: 42,
        languages: ['Hindi', 'English', 'Punjabi'],
        rating: 4.9,
        totalReviews: 1240,
        consultationFee: 2000,
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
        bio: 'Pioneer Cardiovascular & Cardiothoracic Surgeon. Performed over 48,000 successful open-heart surgeries in India. Founder of Medanta.',
        availabilityDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        timeSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM']
      },
      {
        id: 'doc_devi_shetty',
        name: 'Dr. Devi Prasad Shetty',
        hospitalId: 'hosp_apollo_chennai',
        hospitalName: 'Apollo Hospitals, Greams Road',
        specialty: 'Cardiac Surgeon',
        qualification: 'MBBS, MS, FRCS (Glasgow), Padma Bhushan',
        councilRegNumber: 'KMC-38910',
        experienceYears: 38,
        languages: ['Kannada', 'Hindi', 'English', 'Tamil'],
        rating: 5.0,
        totalReviews: 2150,
        consultationFee: 1500,
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
        bio: 'World renowned Cardiac Surgeon specializing in pediatric cardiac surgery, coronary bypass, and affordable healthcare innovation.',
        availabilityDays: ['Mon', 'Wed', 'Fri', 'Sat'],
        timeSlots: ['10:00 AM', '12:00 PM', '03:00 PM', '05:00 PM']
      },
      {
        id: 'doc_randeep_guleria',
        name: 'Dr. Randeep Guleria',
        hospitalId: 'hosp_aiims_delhi',
        hospitalName: 'AIIMS New Delhi',
        specialty: 'Pulmonologist',
        qualification: 'MBBS, MD, DM (Pulmonary Medicine), Padma Shri',
        councilRegNumber: 'DMC-18230',
        experienceYears: 35,
        languages: ['Hindi', 'English'],
        rating: 4.9,
        totalReviews: 1890,
        consultationFee: 1500,
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300',
        bio: 'Renowned Pulmonologist & Ex-Director AIIMS New Delhi. Global expert in respiratory disorders, asthma, sleep apnea, and lung disease.',
        availabilityDays: ['Mon', 'Tue', 'Thu', 'Fri'],
        timeSlots: ['08:30 AM', '10:30 AM', '02:30 PM', '04:30 PM']
      },
      {
        id: 'doc_ashok_seth',
        name: 'Dr. Ashok Seth',
        hospitalId: 'hosp_fortis_delhi',
        hospitalName: 'Fortis Escorts Heart Institute',
        specialty: 'Interventional Cardiologist',
        qualification: 'MBBS, FRCP (London), FACC, Padma Bhushan',
        councilRegNumber: 'DMC-9012',
        experienceYears: 36,
        languages: ['Hindi', 'English'],
        rating: 4.9,
        totalReviews: 950,
        consultationFee: 2000,
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
        bio: 'Chairman of Fortis Escorts Heart Institute. Pioneer in stenting, angioplasty, TAVR, and complex interventional cardiac procedures.',
        availabilityDays: ['Mon', 'Wed', 'Thu', 'Sat'],
        timeSlots: ['09:30 AM', '11:30 AM', '03:00 PM', '05:00 PM']
      }
    ];

    for (const d of doctorsData) {
      await setDoc(doc(db, 'doctors', d.id), d, { merge: true });
    }

    // 4. Appointments collection
    const appointmentsData = [
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
      },
      {
        id: 'apt_1002',
        patientId: 'usr_101',
        patientName: 'Alex Johnson',
        familyMemberId: 'fam_1',
        doctorId: 'doc_3',
        doctorName: 'Dr. Sarah Patel',
        specialty: 'General Physician',
        hospitalId: 'hosp_3',
        hospitalName: 'City Care Community Hospital',
        date: '2026-08-10',
        timeSlot: '02:30 PM',
        type: 'Teleconsultation',
        status: 'Confirmed',
        qrCodeData: 'MEDIROUTE-APT-1002-CITYCARE-PATEL',
        tokenNumber: 'GEN-04',
        consultationFee: 30,
        paymentStatus: 'Paid',
        createdAt: '2026-08-02'
      }
    ];

    for (const a of appointmentsData) {
      await setDoc(doc(db, 'appointments', a.id), a, { merge: true });
    }

    // 5. Medical Records collection
    const recordsData = [
      {
        id: 'rec_1',
        patientId: 'usr_101',
        familyMemberId: 'fam_1',
        title: 'Comprehensive Lipid & Fasting Blood Panel',
        type: 'Blood Test',
        doctorName: 'Dr. Sarah Patel',
        hospitalName: 'City Care Community Hospital',
        date: '2026-07-15',
        encrypted: false,
        rawText: `PATIENT: Alex Johnson | AGE: 34 | DATE: 2026-07-15
Fasting Plasma Glucose: 104 mg/dL (High, Ref: 70-99 mg/dL)
Total Cholesterol: 215 mg/dL (Borderline High, Ref: <200)
HDL Cholesterol: 48 mg/dL (Optimal, Ref: >40)
LDL Cholesterol: 138 mg/dL (Slightly High, Ref: <100)
Triglycerides: 145 mg/dL (Normal, Ref: <150)
Hemoglobin (Hb): 14.8 g/dL (Normal, Ref: 13.8-17.2)`,
        aiSummary: {
          reportTitle: 'Lipid & Glucose Test Analysis',
          patientSummary: 'Overall blood parameters are healthy, but fasting blood sugar (104 mg/dL) and total cholesterol (215 mg/dL) are slightly elevated.',
          keyMetrics: [
            { parameter: 'Fasting Blood Sugar', value: '104 mg/dL', status: 'high', explanation: 'Slightly above normal (70-99 mg/dL).' },
            { parameter: 'Total Cholesterol', value: '215 mg/dL', status: 'high', explanation: 'Borderline high.' }
          ],
          actionableAdvice: ['Engage in 30 mins aerobic exercise', 'Limit refined sugars'],
          questionsForDoctor: ['Does my glucose level require dietary intervention?'],
          disclaimer: 'Generated by MediRoute AI for patient reference.'
        },
        tags: ['Blood Test', 'Cholesterol', 'Glucose']
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
        encrypted: false,
        rawText: `IMAGING REPORT: Chest X-Ray PA View
Findings: Lungs are clear with no focal consolidation or pleural effusion. Heart size normal.
Impression: Normal chest radiographic examination.`,
        tags: ['X-Ray', 'Lungs']
      }
    ];

    for (const r of recordsData) {
      await setDoc(doc(db, 'medicalRecords', r.id), r, { merge: true });
    }

    // 6. Medicines collection & MedicineReminders collection
    const medicinesData = [
      {
        id: 'med_1',
        patientId: 'usr_101',
        familyMemberId: 'fam_1',
        medicineName: 'Symbicort Asthma Inhaler',
        dosage: '2 Puffs (200mcg)',
        frequency: 'Twice Daily',
        times: '08:00 AM, 08:00 PM',
        remainingPills: 24,
        totalPills: 120,
        instructions: 'Before Meal',
        startDate: '2026-05-20',
        endDate: '2026-11-20',
        isActive: true,
        active: true,
        history: [
          { date: '2026-08-02', time: '08:00 AM', status: 'Taken' },
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
        times: '09:30 PM',
        remainingPills: 8,
        totalPills: 30,
        instructions: 'After Meal',
        startDate: '2026-07-10',
        endDate: '2026-08-10',
        isActive: true,
        active: true,
        history: [
          { date: '2026-08-02', time: '09:30 PM', status: 'Taken' }
        ]
      }
    ];

    for (const m of medicinesData) {
      await setDoc(doc(db, 'medicines', m.id), m, { merge: true });
      await setDoc(doc(db, 'medicineReminders', m.id), m, { merge: true });
    }

    // 7. Ambulances collection & EmergencySOS collection
    const ambulancesData = [
      {
        id: 'amb_1',
        patientId: 'usr_101',
        patientName: 'Alex Johnson',
        phone: '+1 (555) 234-5678',
        vehicleNo: 'MED-AMB-911',
        driverName: 'Officer Ray Miller (Unit 402)',
        driverPhone: '+1 (555) 019-2831',
        type: 'Advanced Life Support (ALS)',
        status: 'Ambulance Dispatched',
        hospitalDestination: 'Apex General Medical Center',
        pickupAddress: '742 Evergreen Terrace, San Francisco, CA',
        ETA: '6 mins',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      {
        id: 'amb_2',
        patientId: 'usr_101',
        patientName: 'Robert Johnson',
        phone: '+1 (555) 876-5432',
        vehicleNo: 'MED-AMB-108',
        driverName: 'Capt. Marcus Vance',
        driverPhone: '+1 (555) 019-8822',
        type: 'Basic Life Support (BLS)',
        status: 'En Route To Hospital',
        hospitalDestination: 'City Care Community Hospital',
        pickupAddress: 'Mission District, San Francisco, CA',
        ETA: '12 mins',
        timestamp: '10:15 AM'
      }
    ];

    for (const amb of ambulancesData) {
      await setDoc(doc(db, 'ambulances', amb.id), amb, { merge: true });
      await setDoc(doc(db, 'emergencySOS', amb.id), amb, { merge: true });
    }

    // 8. Payments collection
    const paymentsData = [
      {
        id: 'pay_1',
        userId: 'usr_101',
        amount: 50.00,
        type: 'debit',
        description: 'OPD Consultation - Dr. Elena Rostova at Apex General',
        date: '2026-08-01',
        status: 'Completed'
      },
      {
        id: 'pay_2',
        userId: 'usr_101',
        amount: 200.00,
        type: 'credit',
        description: 'Insurance Co-pay Cash Back Credit',
        date: '2026-07-20',
        status: 'Completed'
      },
      {
        id: 'pay_3',
        userId: 'usr_101',
        amount: 30.00,
        type: 'debit',
        description: 'Pharmacy Prescription Refill Fee',
        date: '2026-07-10',
        status: 'Completed'
      }
    ];

    for (const p of paymentsData) {
      await setDoc(doc(db, 'payments', p.id), p, { merge: true });
    }

    // 9. Notifications collection
    const notificationsData = [
      {
        id: 'notif_1',
        userId: 'usr_101',
        title: 'Upcoming OPD Appointment',
        message: 'Cardiology OPD with Dr. Elena Rostova scheduled for Aug 5 at 10:30 AM.',
        date: '10 mins ago',
        unread: true,
        type: 'appointment'
      },
      {
        id: 'notif_2',
        userId: 'usr_101',
        title: 'Medicine Dosage Alarm',
        message: 'Time for Symbicort Asthma Inhaler (2 Puffs).',
        date: '1 hour ago',
        unread: true,
        type: 'alarm'
      },
      {
        id: 'notif_3',
        userId: 'usr_101',
        title: 'Medical Record Processed',
        message: 'Your Fasting Blood Test report has been summarized by MediRoute AI.',
        date: '1 day ago',
        unread: false,
        type: 'info'
      }
    ];

    for (const n of notificationsData) {
      await setDoc(doc(db, 'notifications', n.id), n, { merge: true });
    }

    console.log('Firestore Production Data Seeding Completed Successfully for all 9 Collections!');
    return true;
  } catch (error) {
    console.error('Error seeding production Firestore database:', error);
    return false;
  }
}

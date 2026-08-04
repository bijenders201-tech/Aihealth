import { db } from './config';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { handleFirestoreError, OperationType, withNetworkRetry } from './firestoreHelpers';
import {
  UserProfile,
  Hospital,
  Doctor,
  Appointment,
  MedicalRecord,
  MedicineReminder
} from '../types';

// ================= USER CRUD =================
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(doc(db, 'users', userId));
    return snap.exists() ? (snap.data() as UserProfile) : null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `users/${userId}`);
    return null;
  }
}

export async function saveUserProfile(user: UserProfile): Promise<void> {
  try {
    await withNetworkRetry(() => setDoc(doc(db, 'users', user.id), user, { merge: true }));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${user.id}`);
  }
}

export async function deleteUserProfile(userId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'users', userId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `users/${userId}`);
  }
}

// ================= HOSPITALS CRUD =================
export async function getHospitalsFromFirestore(): Promise<Hospital[]> {
  try {
    const snap = await getDocs(collection(db, 'hospitals'));
    return snap.docs.map(d => d.data() as Hospital);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'hospitals');
    return [];
  }
}

export async function createHospitalInFirestore(hospital: Hospital): Promise<void> {
  try {
    await withNetworkRetry(() => setDoc(doc(db, 'hospitals', hospital.id), hospital));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `hospitals/${hospital.id}`);
  }
}

export async function updateHospitalInFirestore(hospitalId: string, updates: Partial<Hospital>): Promise<void> {
  try {
    await updateDoc(doc(db, 'hospitals', hospitalId), updates);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `hospitals/${hospitalId}`);
  }
}

export async function deleteHospitalFromFirestore(hospitalId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'hospitals', hospitalId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `hospitals/${hospitalId}`);
  }
}

// ================= DOCTORS CRUD =================
export async function getDoctorsFromFirestore(): Promise<Doctor[]> {
  try {
    const snap = await getDocs(collection(db, 'doctors'));
    return snap.docs.map(d => d.data() as Doctor);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'doctors');
    return [];
  }
}

export async function createDoctorInFirestore(doctor: Doctor): Promise<void> {
  try {
    await withNetworkRetry(() => setDoc(doc(db, 'doctors', doctor.id), doctor));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `doctors/${doctor.id}`);
  }
}

export async function updateDoctorInFirestore(doctorId: string, updates: Partial<Doctor>): Promise<void> {
  try {
    await updateDoc(doc(db, 'doctors', doctorId), updates);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `doctors/${doctorId}`);
  }
}

export async function deleteDoctorFromFirestore(doctorId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'doctors', doctorId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `doctors/${doctorId}`);
  }
}

// ================= APPOINTMENTS CRUD =================
export async function getAppointmentsFromFirestore(): Promise<Appointment[]> {
  try {
    const snap = await getDocs(collection(db, 'appointments'));
    return snap.docs.map(d => d.data() as Appointment);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'appointments');
    return [];
  }
}

export async function createAppointmentInFirestore(apt: Appointment): Promise<void> {
  try {
    await withNetworkRetry(() => setDoc(doc(db, 'appointments', apt.id), apt));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `appointments/${apt.id}`);
  }
}

export async function updateAppointmentStatusInFirestore(aptId: string, status: string, paymentStatus?: string): Promise<void> {
  try {
    const updates: Record<string, any> = { status };
    if (paymentStatus) updates.paymentStatus = paymentStatus;
    await updateDoc(doc(db, 'appointments', aptId), updates);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `appointments/${aptId}`);
  }
}

export async function deleteAppointmentFromFirestore(aptId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'appointments', aptId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `appointments/${aptId}`);
  }
}

// ================= MEDICAL RECORDS CRUD =================
export async function getMedicalRecordsFromFirestore(): Promise<MedicalRecord[]> {
  try {
    const snap = await getDocs(collection(db, 'medicalRecords'));
    return snap.docs.map(d => d.data() as MedicalRecord);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'medicalRecords');
    return [];
  }
}

export async function createMedicalRecordInFirestore(record: MedicalRecord): Promise<void> {
  try {
    await withNetworkRetry(() => setDoc(doc(db, 'medicalRecords', record.id), record));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `medicalRecords/${record.id}`);
  }
}

export async function deleteMedicalRecordFromFirestore(recordId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'medicalRecords', recordId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `medicalRecords/${recordId}`);
  }
}

// ================= MEDICINES CRUD =================
export async function getMedicinesFromFirestore(): Promise<MedicineReminder[]> {
  try {
    const snap = await getDocs(collection(db, 'medicines'));
    return snap.docs.map(d => d.data() as MedicineReminder);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'medicines');
    return [];
  }
}

export async function createMedicineInFirestore(med: MedicineReminder): Promise<void> {
  try {
    await withNetworkRetry(() => setDoc(doc(db, 'medicines', med.id), med));
    await withNetworkRetry(() => setDoc(doc(db, 'medicineReminders', med.id), med));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `medicines/${med.id}`);
  }
}

export async function updateMedicineInFirestore(medId: string, updates: Partial<MedicineReminder>): Promise<void> {
  try {
    await updateDoc(doc(db, 'medicines', medId), updates);
    await updateDoc(doc(db, 'medicineReminders', medId), updates).catch(() => {});
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `medicines/${medId}`);
  }
}

export async function deleteMedicineFromFirestore(medId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'medicines', medId));
    await deleteDoc(doc(db, 'medicineReminders', medId)).catch(() => {});
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `medicines/${medId}`);
  }
}

// ================= AMBULANCES / EMERGENCY SOS CRUD =================
export async function getAmbulancesFromFirestore(): Promise<any[]> {
  try {
    const snap = await getDocs(collection(db, 'ambulances'));
    return snap.docs.map(d => d.data());
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'ambulances');
    return [];
  }
}

export async function createAmbulanceDispatchInFirestore(dispatchData: any): Promise<void> {
  try {
    await withNetworkRetry(() => setDoc(doc(db, 'ambulances', dispatchData.id), dispatchData));
    await withNetworkRetry(() => setDoc(doc(db, 'emergencySOS', dispatchData.id), dispatchData));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `ambulances/${dispatchData.id}`);
  }
}

export async function updateAmbulanceStatusInFirestore(dispatchId: string, status: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'ambulances', dispatchId), { status });
    await updateDoc(doc(db, 'emergencySOS', dispatchId), { status }).catch(() => {});
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `ambulances/${dispatchId}`);
  }
}

export async function deleteAmbulanceFromFirestore(dispatchId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'ambulances', dispatchId));
    await deleteDoc(doc(db, 'emergencySOS', dispatchId)).catch(() => {});
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `ambulances/${dispatchId}`);
  }
}

// ================= PAYMENTS CRUD =================
export async function getPaymentsFromFirestore(): Promise<any[]> {
  try {
    const snap = await getDocs(collection(db, 'payments'));
    return snap.docs.map(d => d.data());
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'payments');
    return [];
  }
}

export async function createPaymentTransactionInFirestore(payment: any): Promise<void> {
  try {
    await withNetworkRetry(() => setDoc(doc(db, 'payments', payment.id), payment));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `payments/${payment.id}`);
  }
}

export async function deletePaymentFromFirestore(paymentId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'payments', paymentId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `payments/${paymentId}`);
  }
}

// ================= NOTIFICATIONS CRUD =================
export async function getNotificationsFromFirestore(): Promise<any[]> {
  try {
    const snap = await getDocs(collection(db, 'notifications'));
    return snap.docs.map(d => d.data());
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'notifications');
    return [];
  }
}

export async function createNotificationInFirestore(notification: any): Promise<void> {
  try {
    await withNetworkRetry(() => setDoc(doc(db, 'notifications', notification.id), notification));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `notifications/${notification.id}`);
  }
}

export async function markNotificationReadInFirestore(notificationId: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'notifications', notificationId), { unread: false });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `notifications/${notificationId}`);
  }
}

export async function deleteNotificationFromFirestore(notificationId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'notifications', notificationId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `notifications/${notificationId}`);
  }
}

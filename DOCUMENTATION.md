# MediRoute AI — Technical Documentation & Deployment Guide

## 1. Project Architecture

**MediRoute AI** is an intelligent healthcare triage, indoor hospital navigation, and digital OPD queue management platform.

### Tech Stack
- **Frontend Framework**: React 18 with Vite & TypeScript
- **Styling**: Tailwind CSS with dark/light mode, custom glassmorphism, responsive mobile-first & desktop viewports
- **Icons & Motion**: Lucide React, Framer Motion (`motion/react`)
- **Backend & Persistence**: Firebase Auth & Cloud Firestore
- **Real-Time Data Engine**: Firestore `onSnapshot` real-time listeners with offline fallback state
- **Security & Rules**: Security rules with default-deny, role-based checks, and input validation helpers

---

## 2. Firebase Cloud Firestore Collections & Schemas

The application is backed by 9 main Firestore collections configured via `firebase-blueprint.json` and secured by `firestore.rules`:

| Collection Path | Schema Entity | Access Level | Description |
|---|---|---|---|
| `/users/{userId}` | `User` | Authenticated | User profiles, roles (`patient`, `doctor`, `hospital`, `admin`), ABHA ID, medical vitals |
| `/hospitals/{hospitalId}` | `Hospital` | Public Read / Auth Write | Onboarded medical facilities, bed/ICU capacities, ER wait times, floor maps |
| `/doctors/{doctorId}` | `Doctor` | Public Read / Auth Write | Medical practitioners, Council Reg #, specialty, consultation fees |
| `/appointments/{appointmentId}` | `Appointment` | Authenticated | Patient OPD bookings, token numbers, QR check-in status, teleconsults |
| `/medicalRecords/{recordId}` | `MedicalRecord` | Authenticated | Patient medical vault (lab reports, prescriptions, radiology scans) |
| `/medicineReminders/{reminderId}` | `MedicineReminder` | Authenticated | Active dosage schedules, remaining pill counts, adherence logs |
| `/emergencySOS/{sosId}` | `EmergencySOS` | Authenticated | One-tap emergency SOS dispatches, live driver tracking & ETA |
| `/auditLogs/{logId}` | `AuditLog` | Authenticated | Vault access and security audit logs |
| `/analyticsEvents/{eventId}` | `AnalyticsEvent` | Public Write | Application performance and usage telemetry tracking |

---

## 3. Core API & Context Actions

All core business workflows are exposed through `AppContext` (`/src/context/AppContext.tsx`):

- **`signInWithGoogle()`**: Trigger Firebase Google OAuth login popup and sync user profile to Firestore.
- **`bookAppointment(...)`**: Generate tokenized OPD/Teleconsultation booking, create QR code string, deduct fee from wallet, and persist to `/appointments`.
- **`checkInHospital(appointmentId)`**: Instant QR code scan check-in updating appointment status to `Checked-In`.
- **`triggerEmergencySOS()`**: Dispatch nearest emergency ambulance with real-time ETA tracking and alert generation.
- **`addMedicalRecord(...)`**: Upload and index medical lab reports and prescriptions to the patient's encrypted Vault.
- **`addHospital(...)` / `addDoctor(...)`**: Onboard medical facilities and verified practitioners to the platform directory.

---

## 4. User Roles & Permission Matrix

1. **Patient / Citizen**:
   - Access to AI Symptom Checker, OPD Token Booking, Indoor Hospital Navigation, Medical Vault, Medicine Alarms, Emergency SOS.
2. **Medical Doctor**:
   - View OPD Patient Queue, conduct Video Teleconsultations, write e-Prescriptions, verify council registrations.
3. **Hospital Admin**:
   - Update live Bed/ICU availability, manage ER wait times, configure floor department indoor maps, register facility details.
4. **Super Admin**:
   - System-wide analytics dashboard, doctor/hospital verification approvals, security audit logs, platform configuration.

---

## 5. Web Deployment Guide (Cloud Run / AI Studio)

### Automated Build Pipeline
1. Run linting check:
   ```bash
   npm run lint
   ```
2. Build production assets:
   ```bash
   npm run build
   ```
3. Deploy Firestore Security Rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

---

## 6. Android Build Guide (Capacitor / Web App)

To package MediRoute AI into a native Android APK / AAB bundle:

1. **Install Capacitor Dependencies**:
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   ```
2. **Initialize Capacitor**:
   ```bash
   npx cap init "MediRoute AI" "com.mediroute.health" --web-dir dist
   ```
3. **Build Web App and Add Android Platform**:
   ```bash
   npm run build
   npx cap add android
   npx cap copy android
   ```
4. **Open in Android Studio**:
   ```bash
   npx cap open android
   ```

---

## 7. Google Play Store Release Checklist

- [x] **App Identity**: Package Name `com.mediroute.health`, Version `1.0.0`
- [x] **Firebase Config**: Include `google-services.json` in `android/app/`
- [x] **Permissions**: Configure Camera (QR scanner), Geolocation (Ambulance/Hospital locator) in `AndroidManifest.xml`
- [x] **Target SDK**: Target Android SDK 34 (Android 14) or higher
- [x] **App Bundle**: Generate signed Android App Bundle (`.aab`) using release keystore
- [x] **Privacy Policy**: Link ABHA & medical record encryption privacy policy in Google Play Console
- [x] **App Store Graphics**: 512x512 app icon, feature graphic (1024x500), phone & 7"/10" tablet screenshots

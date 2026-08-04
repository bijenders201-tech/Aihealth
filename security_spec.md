# Security Specification & Threat Model

## Data Invariants
1. A user can only write or update their own user profile document (`/users/{userId}`).
2. Patients can read hospital and doctor listings. Only administrators or hospital/doctor owners can create or update hospital and doctor records.
3. Appointments can only be read or created by the patient owner (`patientId == request.auth.uid`) or the assigned doctor/hospital.
4. Medical Vault records (`/medicalRecords/{recordId}`) contain sensitive health info and are strictly readable and writable by the document owner (`patientId == request.auth.uid`).
5. Medicine reminders and emergency SOS alerts can only be created or modified by the patient owner.
6. All IDs must pass `isValidId` size and character regex constraints (`^[a-zA-Z0-9_\\-]+$`).

## Dirty Dozen Threat Payloads
1. Spoofed User Profile Role: Attempting to create `/users/attackerId` with `role: "admin"`.
2. Orphaned Appointment: Attempting to create an appointment without a valid `patientId` matching `request.auth.uid`.
3. Overlarge Payload Attack: Sending a 10MB `rawText` string to `medicalRecords` to exhaust memory.
4. Unauthorized Medical Vault Snooping: Unauthenticated or non-owner user attempting to query `/medicalRecords`.
5. ID Poisoning Attack: Injecting special characters or giant strings into `{hospitalId}` path variables.
6. Shadow Field Injection: Sending unauthorized `isVerified: true` flags during doctor profile creation.
7. Spoofed Emergency SOS: Triggering SOS alerts on behalf of another patient ID.
8. Unverified Email Elevation: Updating admin resources with unverified email credentials.
9. Immutability Violation: Attempting to alter `createdAt` or `patientId` on existing medical records.
10. Blanket Query Scraping: Querying all medical records without filtering by `patientId`.
11. Unauthenticated Appointment Cancellation: Cancelling appointments owned by another patient.
12. Fraudulent Audit Log Tampering: Modifying or deleting security audit access entries.

## Rules Test Strategy
All payloads are guarded by schema boundary validators, strict `affectedKeys()` constraints, and identity integrity checks in `firestore.rules`.

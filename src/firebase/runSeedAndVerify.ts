import { seedProductionFirestoreDatabase } from './seedFirestore';
import { db } from './config';
import { collection, getDocs } from 'firebase/firestore';

async function run() {
  console.log('--- STARTING FIRESTORE SEEDING & VERIFICATION ---');
  
  // 1. Run Seeding
  const success = await seedProductionFirestoreDatabase();
  console.log('Seeding result:', success ? 'SUCCESS' : 'FAILED');

  // 2. Collections list to verify
  const collectionsToVerify = [
    'users',
    'hospitals',
    'doctors',
    'appointments',
    'medicalRecords',
    'medicines',
    'medicineReminders',
    'ambulances',
    'emergencySOS',
    'payments',
    'notifications',
    'auditLogs',
    'analyticsEvents'
  ];

  console.log('\n--- LIVE FIRESTORE COLLECTION VERIFICATION ---');
  for (const collName of collectionsToVerify) {
    try {
      const snap = await getDocs(collection(db, collName));
      const docIds = snap.docs.map(d => d.id);
      console.log(`Collection [${collName}]: ${snap.size} documents found. Doc IDs: [${docIds.join(', ')}]`);
    } catch (err: any) {
      console.error(`Error querying collection [${collName}]:`, err?.message || err);
    }
  }
  console.log('--- VERIFICATION COMPLETE ---');
  process.exit(0);
}

run().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});

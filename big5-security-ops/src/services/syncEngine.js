import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { drainQueue } from './offlineDb';

export async function startSync() {
  const syncFn = async (action) => {
    const { type, companyId, payload } = action;
    const target = {
      attendance: 'attendance',
      patrol: 'patrol_scans',
      incident: 'incidents',
      panic: 'panic_alerts'
    }[type];

    if (!target) return;
    await addDoc(collection(db, target), { ...payload, companyId, createdAt: serverTimestamp() });
  };

  if (navigator.onLine) await drainQueue(syncFn);
  window.addEventListener('online', () => drainQueue(syncFn));
};

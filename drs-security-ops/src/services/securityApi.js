import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from './firebase';
import { queueAction } from './offlineDb';

export async function saveAttendance(companyId, payload) {
  if (!navigator.onLine) return queueAction({ type: 'attendance', companyId, payload });
  await addDoc(collection(db, 'attendance'), { ...payload, companyId, createdAt: serverTimestamp() });
}

export async function savePatrolScan(companyId, payload) {
  if (!navigator.onLine) return queueAction({ type: 'patrol', companyId, payload });
  await addDoc(collection(db, 'patrol_scans'), { ...payload, companyId, createdAt: serverTimestamp() });
}

export async function saveIncident(companyId, payload) {
  if (!navigator.onLine) return queueAction({ type: 'incident', companyId, payload });
  const out = { ...payload, companyId, createdAt: serverTimestamp() };
  if (payload.photoFile) {
    const photoRef = ref(storage, `incidents/${companyId}/${Date.now()}-${payload.photoFile.name}`);
    await uploadBytes(photoRef, payload.photoFile);
    out.photoUrl = await getDownloadURL(photoRef);
    delete out.photoFile;
  }
  await addDoc(collection(db, 'incidents'), out);
}

export async function sendPanicAlert(companyId, payload) {
  if (!navigator.onLine) return queueAction({ type: 'panic', companyId, payload });
  await setDoc(doc(collection(db, 'panic_alerts')), { ...payload, companyId, createdAt: serverTimestamp() });
}

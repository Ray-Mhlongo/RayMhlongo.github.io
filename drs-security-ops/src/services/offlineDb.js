import { openDB } from 'idb';

export const dbPromise = openDB('security-offline', 1, {
  upgrade(db) {
    db.createObjectStore('queue', { keyPath: 'id', autoIncrement: true });
  }
});

export async function queueAction(payload) {
  const db = await dbPromise;
  return db.add('queue', { ...payload, createdAt: Date.now() });
}

export async function drainQueue(syncFn) {
  const db = await dbPromise;
  const tx = db.transaction('queue', 'readwrite');
  const store = tx.objectStore('queue');
  const actions = await store.getAll();
  for (const action of actions) {
    await syncFn(action);
    await store.delete(action.id);
  }
  await tx.done;
}

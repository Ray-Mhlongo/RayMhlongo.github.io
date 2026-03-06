import { useMemo, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { appConfig } from './config';
import { useGeo } from './hooks/useGeo';
import { saveAttendance, saveIncident, savePatrolScan, sendPanicAlert } from './services/securityApi';

export function HomePage({ user }) {
  return (
    <section className="space-y-3">
      <div className="rounded-xl2 bg-zinc-900 p-4">
        <p className="text-sm text-zinc-300">Active shift</p>
        <p className="text-lg font-semibold">On duty</p>
      </div>
      <div className="rounded-xl2 bg-zinc-900 p-4">
        <p className="text-sm text-zinc-300">Today route</p>
        <p className="font-medium">Sector A ➜ Sector C</p>
      </div>
      <div className="rounded-xl2 bg-zinc-900 p-4 text-sm">Welcome, {user.displayName}</div>
    </section>
  );
}

export function PatrolPage({ user }) {
  const { capture } = useGeo();
  const [scanner, setScanner] = useState(false);
  const [status, setStatus] = useState('Ready to scan checkpoint QR codes');

  const startScanner = () => {
    if (scanner) return;
    setScanner(true);
    const qr = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: 220 }, false);
    qr.render(async (decodedText) => {
      const location = await capture();
      await savePatrolScan(appConfig.companyId, {
        guardId: user.uid,
        checkpointId: decodedText,
        timestamp: new Date().toISOString(),
        location
      });
      setStatus(`Checkpoint ${decodedText} recorded`);
      qr.clear();
      setScanner(false);
    }, () => {});
  };

  return (
    <section className="space-y-3">
      <button className="w-full rounded-xl bg-orange-500 p-4 font-semibold" onClick={startScanner}>Scan Checkpoint QR</button>
      <div id="qr-reader" className="overflow-hidden rounded-xl2 bg-zinc-900" />
      <p className="text-sm text-zinc-200">{status}</p>
    </section>
  );
}

export function IncidentPage({ user }) {
  const { capture } = useGeo();
  const [payload, setPayload] = useState({ type: 'General', description: '', notes: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [status, setStatus] = useState('');
  const aiSuggestion = useMemo(() => payload.description.length > 20 ? 'AI Suggestion: prioritize nearest armed response unit.' : 'AI Suggestion: add incident detail for better classification.', [payload.description]);

  const submit = async () => {
    const location = await capture();
    await saveIncident(appConfig.companyId, {
      ...payload,
      photoFile,
      guardId: user.uid,
      timestamp: new Date().toISOString(),
      location,
      aiCategory: payload.description.includes('weapon') ? 'high-risk' : 'standard'
    });
    setStatus('Incident submitted and queued for sync if offline.');
  };

  return (
    <section className="space-y-3">
      <select className="w-full rounded-xl bg-zinc-900 p-3" value={payload.type} onChange={(e) => setPayload((v) => ({ ...v, type: e.target.value }))}>
        <option>General</option><option>Armed Threat</option><option>Medical</option><option>Alarm</option>
      </select>
      <textarea className="h-24 w-full rounded-xl bg-zinc-900 p-3" placeholder="Describe incident" value={payload.description} onChange={(e) => setPayload((v) => ({ ...v, description: e.target.value }))} />
      <p className="rounded-xl2 bg-zinc-900 p-3 text-xs text-emerald-300">{aiSuggestion}</p>
      <input className="w-full" type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} />
      <button className="w-full rounded-xl bg-orange-500 p-3 font-semibold" onClick={submit}>Submit Incident</button>
      <p className="text-xs text-zinc-300">{status}</p>
    </section>
  );
}

export function AttendancePage({ user }) {
  const { capture } = useGeo();
  const [status, setStatus] = useState('');

  const clock = async (action) => {
    const location = await capture();
    await saveAttendance(appConfig.companyId, {
      guardId: user.uid,
      action,
      timestamp: new Date().toISOString(),
      location,
      exportTarget: 'google-sheets'
    });
    setStatus(`${action} captured and will sync to Google Sheets connector.`);
  };

  return (
    <section className="space-y-3">
      <button className="w-full rounded-xl bg-emerald-600 p-4" onClick={() => clock('clock-in')}>Clock In</button>
      <button className="w-full rounded-xl bg-blue-600 p-4" onClick={() => clock('clock-out')}>Clock Out</button>
      <p className="text-sm">{status}</p>
    </section>
  );
}

export function PanicPage({ user }) {
  const { capture } = useGeo();
  const [status, setStatus] = useState('');

  const panic = async () => {
    const location = await capture();
    await sendPanicAlert(appConfig.companyId, {
      guardId: user.uid,
      timestamp: new Date().toISOString(),
      location,
      severity: 'critical'
    });
    setStatus('Emergency alert sent to command center.');
  };

  return (
    <section className="space-y-3">
      <button className="w-full rounded-full bg-red-600 p-10 text-2xl font-black" onClick={panic}>PANIC</button>
      <p>{status}</p>
    </section>
  );
}

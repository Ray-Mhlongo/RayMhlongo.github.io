import { useEffect, useMemo, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from './services/firebase';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const companies = [
  { id: 'drs', name: 'DRS Data Response Security' },
  { id: 'big5', name: 'Big 5 Security' }
];

export default function App() {
  const [incidents, setIncidents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [panic, setPanic] = useState([]);

  useEffect(() => {
    const unsubscribers = [
      onSnapshot(collection(db, 'incidents'), (snap) => setIncidents(snap.docs.map((d) => ({ id: d.id, ...d.data() })))),
      onSnapshot(collection(db, 'attendance'), (snap) => setAttendance(snap.docs.map((d) => ({ id: d.id, ...d.data() })))),
      onSnapshot(collection(db, 'panic_alerts'), (snap) => setPanic(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
    ];
    return () => unsubscribers.forEach((off) => off());
  }, []);

  const summary = useMemo(() => companies.map((company) => ({
    ...company,
    incidentsToday: incidents.filter((x) => x.companyId === company.id).length,
    attendanceLogs: attendance.filter((x) => x.companyId === company.id).length,
    activeGuards: new Set(attendance.filter((x) => x.companyId === company.id).map((x) => x.guardId)).size,
    patrolCompletionRate: Math.min(100, Math.round((attendance.filter((x) => x.companyId === company.id).length / 10) * 100))
  })), [incidents, attendance]);

  const lineData = summary.map((s) => ({ company: s.name.split(' ')[0], incidents: s.incidentsToday, panic: panic.filter((x) => x.companyId === s.id).length }));

  const exportCsv = () => {
    const csv = Papa.unparse(summary);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-command-summary-${Date.now()}.csv`;
    a.click();
  };

  const exportPdf = () => {
    const doc = new jsPDF();
    doc.text('Security Command Center Summary', 14, 16);
    autoTable(doc, {
      head: [['Company', 'Active Guards', 'Incidents', 'Attendance', 'Patrol Completion %']],
      body: summary.map((row) => [row.name, row.activeGuards, row.incidentsToday, row.attendanceLogs, row.patrolCompletionRate])
    });
    doc.save(`security-command-summary-${Date.now()}.pdf`);
  };

  return (
    <main className="mx-auto max-w-6xl p-4 space-y-4">
      <h1 className="text-3xl font-bold">Security Command Center</h1>
      <section className="grid gap-4 md:grid-cols-2">
        {summary.map((card) => (
          <article key={card.id} className="rounded-2xl bg-slate-900 p-4">
            <h2 className="text-xl font-semibold">{card.name}</h2>
            <p>Active guards: {card.activeGuards}</p>
            <p>Incidents today: {card.incidentsToday}</p>
            <p>Patrol completion: {card.patrolCompletionRate}%</p>
            <p>Attendance logs: {card.attendanceLogs}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl bg-slate-900 p-4">
        <h3 className="text-lg font-semibold mb-2">Incident & Panic Trends</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <Line dataKey="incidents" stroke="#fb923c" />
              <Line dataKey="panic" stroke="#ef4444" />
              <CartesianGrid stroke="#334155" />
              <XAxis dataKey="company" /><YAxis /><Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-2xl bg-slate-900 p-4">
        <h3 className="text-lg font-semibold mb-2">Patrol Compliance</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summary}>
              <Bar dataKey="patrolCompletionRate" fill="#22c55e" />
              <CartesianGrid stroke="#334155" />
              <XAxis dataKey="id" /><YAxis /><Tooltip />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="flex gap-3">
        <button className="rounded-xl bg-emerald-600 px-4 py-3" onClick={exportCsv}>Export CSV</button>
        <button className="rounded-xl bg-blue-600 px-4 py-3" onClick={exportPdf}>Export PDF</button>
      </section>
    </main>
  );
}

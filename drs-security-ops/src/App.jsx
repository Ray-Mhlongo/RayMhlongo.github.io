import { useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Navigate, Route, Routes } from 'react-router-dom';
import { auth } from './services/firebase';
import { startSync } from './services/syncEngine';
import { appConfig } from './config';
import { Layout } from './components/Layout';
import { RoleGate } from './components/RoleGate';
import { AttendancePage, HomePage, IncidentPage, PanicPage, PatrolPage } from './pages';

export default function App() {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const off = auth.onAuthStateChanged(setUser);
    startSync();
    return () => off();
  }, []);

  if (!user) {
    return (
      <main className="safe-area mx-auto max-w-md">
        <button
          className="w-full rounded-xl bg-orange-500 p-4 text-lg font-semibold"
          onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
        >
          Sign in with Google
        </button>
      </main>
    );
  }

  return (
    <RoleGate user={user}>
      {() => (
        <Layout appName={appConfig.appName}>
          <Routes>
            <Route path="/" element={<HomePage user={user} />} />
            <Route path="/patrol" element={<PatrolPage user={user} />} />
            <Route path="/incident" element={<IncidentPage user={user} />} />
            <Route path="/attendance" element={<AttendancePage user={user} />} />
            <Route path="/panic" element={<PanicPage user={user} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      )}
    </RoleGate>
  );
}

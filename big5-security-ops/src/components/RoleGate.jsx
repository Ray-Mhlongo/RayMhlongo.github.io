import { useEffect, useState } from 'react';

const roles = ['owner', 'management', 'admin', 'guard'];

export function RoleGate({ user, children }) {
  const key = `role:${user.uid}`;
  const [role, setRole] = useState(localStorage.getItem(key));

  useEffect(() => {
    if (role) localStorage.setItem(key, role);
  }, [key, role]);

  if (role) return children(role);

  return (
    <div className="space-y-3 rounded-xl2 bg-zinc-900 p-4">
      <h2 className="text-lg font-semibold">Select your role</h2>
      {roles.map((entry) => (
        <button key={entry} className="w-full rounded-xl bg-zinc-800 p-3 text-left capitalize" onClick={() => setRole(entry)}>{entry}</button>
      ))}
    </div>
  );
}

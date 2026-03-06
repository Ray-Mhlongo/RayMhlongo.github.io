import { NavLink } from 'react-router-dom';

const links = [
  ['/', 'Home'],
  ['/patrol', 'Patrol'],
  ['/incident', 'Incident'],
  ['/attendance', 'Attendance'],
  ['/panic', 'Panic']
];

export function Layout({ children, appName }) {
  return (
    <div className="safe-area mx-auto max-w-md">
      <header className="mb-4 rounded-xl2 bg-zinc-900 p-4">
        <h1 className="text-xl font-bold">{appName}</h1>
      </header>
      <main className="pb-24">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 mx-auto flex max-w-md justify-around border-t border-zinc-700 bg-black/95 p-3 text-xs">
        {links.map(([href, label]) => (
          <NavLink key={href} to={href} className={({ isActive }) => isActive ? 'text-orange-400' : 'text-zinc-400'}>
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

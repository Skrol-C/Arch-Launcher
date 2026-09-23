import { useState } from 'react';
import './styles.css';

type View = 'home' | 'library' | 'tools' | 'controllers' | 'jobs' | 'settings';

const nav: Array<{ id: View; label: string; icon: string }> = [
  { id: 'home', label: 'Home', icon: '⌂' },
  { id: 'library', label: 'My Library', icon: '▦' },
  { id: 'tools', label: 'Tools', icon: '◈' },
  { id: 'controllers', label: 'Controller Hub', icon: '⌁' },
  { id: 'jobs', label: 'Jobs', icon: '↯' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
];

export function App() {
  const [view, setView] = useState<View>('home');
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">A</span><span>ARCH <b>LAUNCHER</b></span></div>
      <p className="eyebrow">PERSONAL GAME ARCHIVE</p>
      <nav>{nav.map(item => <button key={item.id} className={view === item.id ? 'nav-item active' : 'nav-item'} onClick={() => setView(item.id)}><span>{item.icon}</span>{item.label}</button>)}</nav>
      <div className="sidebar-bottom"><div className="status-dot"/> Offline-first library<br/><small>Phase 0 foundation</small></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><div><p className="eyebrow">ARCH / {view.toUpperCase()}</p><h1>{view === 'home' ? 'Your games, properly archived.' : nav.find(n => n.id === view)?.label}</h1></div><button className="scan-button">＋ Scan libraries</button></header>
      <section className="hero-card"><div><p className="eyebrow accent">PHASE 0 · FOUNDATION</p><h2>The operational workspace<br/>behind every cover.</h2><p className="hero-copy">Arch Launcher will scan, identify, launch, diagnose, back up, and eventually manage your games, tools, emulators, controllers, and mods.</p><button className="primary-button" onClick={() => setView('library')}>Open library <span>→</span></button></div><div className="hero-orbit"><div className="orbit-ring ring-one"/><div className="orbit-ring ring-two"/><div className="orbit-core">A</div></div></section>
      <section className="section-heading"><div><p className="eyebrow">NEXT UP</p><h3>Phase 0 contracts</h3></div><span className="muted">Nothing touches your game files yet.</span></section>
      <div className="contract-grid"><Contract title="Library inventory" copy="Steam roots, manual folders, PS2 and PS3 libraries become evidence-backed game records."/><Contract title="Tool detection" copy="Steam, SteamCMD, SnakeBite, PCSX2, RPCS3, and managers are observed—not mutated."/><Contract title="Safe foundation" copy="SQLite index, fixture library, jobs, permissions, backups, and recovery come before live operations."/></div>
    </main>
  </div>;
}
function Contract({ title, copy }: { title: string; copy: string }) { return <article className="contract-card"><span className="contract-icon">✦</span><h4>{title}</h4><p>{copy}</p><span className="card-status">PLANNED</span></article>; }

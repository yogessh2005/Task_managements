import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function EmployeeLayout() {
  const { user, logout, darkMode, toggleDark } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'dark' : ''} bg-darkbg`}>
      {/* Background aesthetics */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>

      <aside className="w-68 glass-card border-r border-white/10 flex flex-col relative z-20">
        <div className="px-6 py-6 border-b border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-500 to-accent-400 flex items-center justify-center text-sm shadow-lg shadow-brand-500/20">⚡</div>
            <span className="font-display font-bold text-white text-xl tracking-tight text-glow">Nova</span>
          </div>
          <div className="text-xs text-brand-400 font-semibold uppercase tracking-widest pl-10">Employee</div>
        </div>
        <nav className="flex-1 py-6 space-y-2 px-3 overflow-y-auto hidden-scrollbar">
          <NavLink to="/employee" end className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-brand-600/90 to-brand-500/80 text-white shadow-lg shadow-brand-500/25 border border-brand-400/30' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
            <span className="text-lg">🏠</span> Dashboard
          </NavLink>
          <NavLink to="/employee/tasks" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-brand-600/90 to-brand-500/80 text-white shadow-lg shadow-brand-500/25 border border-brand-400/30' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
            <span className="text-lg">📋</span> My Tasks
          </NavLink>
        </nav>
        <div className="p-4 border-t border-white/5 bg-black/10">
          <div className="text-xs text-brand-300 font-semibold mb-3 px-2 uppercase tracking-wider">{user?.name}</div>
          <button onClick={handleLogout} className="flex items-center gap-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 text-sm px-3 py-2.5 w-full rounded-xl transition-colors">
            <span className="text-lg">🚪</span> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden relative z-10 w-full h-full bg-cover">
        <header className="glass border-b border-white/5 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <h1 className="font-display font-bold text-gray-100 text-2xl tracking-tight">Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">{user?.name}</span></h1>
          <button onClick={toggleDark} className="text-xl p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
            {darkMode ? '☀️' : '🌙'}
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

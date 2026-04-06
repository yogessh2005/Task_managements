import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '⬛', end: true },
  { to: '/admin/employees', label: 'Employees', icon: '👥' },
  { to: '/admin/tasks', label: 'Tasks', icon: '📋' },
  { to: '/admin/activity', label: 'Activity Log', icon: '📜' },
];

export default function AdminLayout() {
  const { user, logout, darkMode, toggleDark } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'dark' : ''} bg-darkbg`}>
      {/* Sidebar background visual blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-600/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>

      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-68'} transition-all duration-300 glass-card border-r border-white/10 flex flex-col relative z-20`}>
        <div className="flex items-center justify-between px-5 py-6 border-b border-white/5">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-500 to-accent-400 flex items-center justify-center text-sm shadow-lg shadow-brand-500/20">⚡</div>
              <span className="font-display font-bold text-white text-xl tracking-tight text-glow">Nova</span>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="text-gray-400 hover:text-white p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition">
            {collapsed ? '→' : '←'}
          </button>
        </div>
        <nav className="flex-1 py-6 space-y-2 px-3 overflow-y-auto hidden-scrollbar">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-brand-600/90 to-brand-500/80 text-white shadow-lg shadow-brand-500/25 border border-brand-400/30' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`
              }>
              <span className="text-lg">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5 bg-black/10">
          {!collapsed && <div className="text-xs text-brand-300 font-semibold mb-3 px-2 uppercase tracking-wider">Admin • {user?.name}</div>}
          <button onClick={handleLogout} className="flex items-center gap-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 text-sm px-3 py-2.5 w-full rounded-xl transition-colors">
            <span className="text-lg">🚪</span>{!collapsed && 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10 w-full h-full bg-cover">
        
        {/* Topbar */}
        <header className="glass border-b border-white/5 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <h1 className="font-display font-bold text-gray-100 text-2xl tracking-tight">Admin Portal</h1>
          <div className="flex items-center gap-4">
            <button onClick={toggleDark} className="text-xl p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
              {darkMode ? '☀️' : '🌙'}
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center text-white font-bold shadow-lg shadow-brand-500/20 border border-white/10 ring-2 ring-transparent group-hover:ring-brand-400 transition-all cursor-pointer">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-8 relative">
           <Outlet />
        </main>
      </div>
    </div>
  );
}

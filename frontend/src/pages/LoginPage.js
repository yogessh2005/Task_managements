import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('employee');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      if (loginType === 'admin' && data.role !== 'admin') {
        toast.error('You are not an admin!');
        setLoading(false);
        return;
      }
      if (loginType === 'employee' && data.role !== 'employee') {
        toast.error('You are not an employee! Use Admin Login.');
        setLoading(false);
        return;
      }
      login(data);
      toast.success(`Welcome back, ${data.name}!`);
      navigate(data.role === 'admin' ? '/admin' : '/employee');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-screen bg-black font-sans selection:bg-brand-500 selection:text-white">
      {/* Left Branding Panel missing on small screens */}
      <div className="hidden lg:flex lg:w-7/12 relative overflow-hidden bg-zinc-950 items-end p-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-900/60 via-zinc-950 to-zinc-950 z-0"></div>
          {/* Futuristic Grid Setup */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
          {/* Massive background glow */}
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-600/30 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse"></div>
        </div>
        <div className="relative z-10 pb-12 w-full">
          <div className="w-16 h-16 bg-white text-black text-3xl flex items-center justify-center rounded-2xl mb-8 shadow-2xl">⚡</div>
          <h1 className="text-7xl font-display font-bold text-white mb-6 uppercase tracking-tighter leading-[0.9]">
            Optimize <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-300">Your Workflow.</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-lg font-light leading-relaxed">
            The ultimate system for elite teams to manage tasks, streamline communication, and deliver projects without comprise.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-5/12 flex flex-col justify-center px-8 sm:px-16 md:px-24 lg:px-14 xl:px-20 bg-black relative border-l border-white/5 z-10 z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
        
        {/* Mobile Header (Shows only on small screens) */}
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-white text-black text-xl flex items-center justify-center rounded-xl">⚡</div>
          <h1 className="text-2xl font-display font-bold text-white tracking-widest uppercase">Nova</h1>
        </div>

        <div className="mb-10">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-2 tracking-tight">Access Portal</h2>
          <p className="text-zinc-500 font-medium">Verify your identity to proceed.</p>
        </div>

        <div className="flex bg-zinc-900 rounded-xl mb-8 p-1">
          <button onClick={() => setLoginType('employee')}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-all ${loginType === 'employee' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-white'}`}>
            Employee
          </button>
          <button onClick={() => setLoginType('admin')}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-all ${loginType === 'admin' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-white'}`}>
            Administrator
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{loginType === 'admin' ? 'Admin Email' : 'Work Email'}</label>
            <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-5 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500 focus:bg-zinc-900 transition-all font-medium"
              placeholder={loginType === 'admin' ? "admin@taskmanager.com" : "employee@company.com"} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Passcode</label>
            <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full px-5 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500 focus:bg-zinc-900 transition-all font-medium"
              placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-4 bg-white hover:bg-brand-50 text-black font-bold uppercase tracking-widest text-sm rounded-xl transition-all disabled:opacity-50 mt-4 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]">
            {loading ? 'Authenticating...' : `Authorize ${loginType === 'admin' ? 'Admin' : 'Employee'}`}
          </button>
        </form>

        {loginType === 'employee' && (
          <div className="mt-8 text-sm text-zinc-500">
            Need an account? <Link to="/register" className="text-white hover:text-brand-300 font-bold border-b border-zinc-600 hover:border-brand-300 pb-0.5 transition-colors">Apply here</Link>
          </div>
        )}

        {loginType === 'admin' && (
          <div className="mt-8 p-5 bg-brand-900/10 rounded-xl border border-brand-500/20">
            <p className="text-xs text-brand-400 font-bold mb-2 uppercase tracking-widest flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span> Demo Access</p>
            <p className="text-sm text-zinc-400 font-mono">admin@taskmanager.com</p>
            <p className="text-sm text-zinc-400 font-mono mt-0.5">admin123</p>
          </div>
        )}

        <div className="mt-auto pt-16 text-xs text-zinc-700 font-bold uppercase tracking-widest text-center lg:text-left">
          Nova System OS // v2.4.1
        </div>
      </div>
    </div>
  );
}

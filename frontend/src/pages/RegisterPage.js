import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerUser } from '../services/api';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', department: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(form);
      toast.success('Registration successful! Await admin approval.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
            Join <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-300">The Elite.</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-lg font-light leading-relaxed">
            Register to become part of a streamlined ecosystem. Your account will undergo secure validation before activation.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-5/12 flex flex-col justify-center px-8 sm:px-16 md:px-24 lg:px-14 xl:px-20 bg-black relative border-l border-white/5 z-10 shadow-[-20px_0_40px_rgba(0,0,0,0.5)] overflow-y-auto max-h-screen py-10">
        
        {/* Mobile Header (Shows only on small screens) */}
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-white text-black text-xl flex items-center justify-center rounded-xl">⚡</div>
          <h1 className="text-2xl font-display font-bold text-white tracking-widest uppercase">Nova</h1>
        </div>

        <div className="mb-8 mt-auto">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-2 tracking-tight">Onboarding</h2>
          <p className="text-zinc-500 font-medium">Create your secure work profile.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
            { key: 'email', label: 'Email Identity', type: 'email', placeholder: 'you@company.com' },
            { key: 'password', label: 'Passcode', type: 'password', placeholder: '••••••••' },
            { key: 'age', label: 'Age', type: 'number', placeholder: 'e.g. 25' },
            { key: 'department', label: 'Department / Division', type: 'text', placeholder: 'e.g. Engineering' },
          ].map(field => (
            <div key={field.key} className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{field.label}</label>
              <input type={field.type} value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                required={['name','email','password'].includes(field.key)}
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500 focus:bg-zinc-900 transition-all font-medium text-sm"
                placeholder={field.placeholder} />
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full py-4 bg-white hover:bg-brand-50 text-black font-bold uppercase tracking-widest text-sm rounded-xl transition-all disabled:opacity-50 mt-6 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]">
            {loading ? 'Processing...' : 'Submit Clearance Request'}
          </button>
        </form>
        
        <div className="mt-6 text-sm text-zinc-500 mb-8">
          Already verified? <Link to="/login" className="text-white hover:text-brand-300 font-bold border-b border-zinc-600 hover:border-brand-300 pb-0.5 transition-colors">Authenticate</Link>
        </div>
        
        <p className="w-full p-4 rounded-xl bg-zinc-900/50 text-xs text-brand-300 border border-brand-500/20 font-medium leading-relaxed mb-auto">
          <span className="font-bold text-brand-400 animate-pulse mr-1">•</span> Security Note: Application will be locked in standard [Pending] state until reviewed by an active Administrator.
        </p>

        <div className="mt-8 pt-8 text-xs text-zinc-700 font-bold uppercase tracking-widest text-center lg:text-left border-t border-white/5">
          Nova System OS // v2.4.1
        </div>
      </div>
    </div>
  );
}

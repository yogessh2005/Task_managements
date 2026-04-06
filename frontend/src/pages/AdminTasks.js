import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAllTasks, assignTask, deleteTask, getEmployees } from '../services/api';
import { format } from 'date-fns';

const PriorityBadge = ({ p }) => {
  const s = { High: 'bg-red-500/20 text-red-400 border-red-500/30', Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', Low: 'bg-green-500/20 text-green-400 border-green-500/30' };
  return <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold tracking-wider uppercase ${s[p]}`}>{p}</span>;
};

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [form, setForm] = useState({ title: '', description: '', assignedTo: '', priority: 'Medium', deadline: '' });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [tRes, eRes] = await Promise.all([getAllTasks({ search, status: filterStatus, priority: filterPriority }), getEmployees()]);
      setTasks(tRes.data);
      setEmployees(eRes.data);
    } catch { toast.error('Failed to sync master operations log'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, [search, filterStatus, filterPriority]);

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      await assignTask(form);
      toast.success('Directive Assigned Successfully.');
      setShowModal(false);
      setForm({ title: '', description: '', assignedTo: '', priority: 'Medium', deadline: '' });
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Operation failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this operation from the centralized log?')) return;
    try { await deleteTask(id); toast.success('Operation purged'); fetchAll(); }
    catch { toast.error('Purge failed'); }
  };

  return (
    <div className="space-y-6 pb-20 relative min-h-screen">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-white tracking-tight">Master Operations</h2>
          <p className="text-zinc-500 font-medium text-sm mt-1">Oversee and assign directives to active personnel.</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="px-5 py-3 bg-brand-600 hover:bg-brand-500 text-white text-xs uppercase tracking-widest font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]">
          Deploy Directive
        </button>
      </div>

      <div className="flex flex-col xl:flex-row gap-4 bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Query operations..."
          className="flex-1 px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500 transition-colors text-sm" />
        <div className="flex gap-4">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="w-full xl:w-48 px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-300 uppercase tracking-widest focus:outline-none focus:border-brand-500">
            <option value="">All Status</option>
            <option>Pending</option><option>In Progress</option><option>Completed</option>
          </select>
          <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
            className="w-full xl:w-48 px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-300 uppercase tracking-widest focus:outline-none focus:border-brand-500">
            <option value="">All Priority</option>
            <option>High</option><option>Medium</option><option>Low</option>
          </select>
        </div>
      </div>

      {loading ? <div className="text-center py-20 text-zinc-600 font-bold uppercase tracking-widest text-sm animate-pulse">Syncing Network...</div> : tasks.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-800 flex flex-col items-center justify-center space-y-4">
          <div className="text-4xl text-zinc-800">📋</div>
          <p className="text-zinc-500 font-medium">No active operations matching your query.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map(task => (
            <div key={task._id} className="bg-zinc-900/40 rounded-2xl p-6 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/60 transition-all group flex flex-col h-full relative overflow-hidden">
              <div className="flex items-start justify-between gap-2 mb-3 z-10">
                <h3 className="font-bold text-white text-base leading-snug group-hover:text-brand-300 transition-colors">{task.title}</h3>
                <PriorityBadge p={task.priority} />
              </div>
              
              <div className="flex items-center gap-2 mb-4 z-10">
                <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-white">
                  {task.assignedTo?.name?.charAt(0) || '?'}
                </div>
                <span className="text-xs text-zinc-400 font-medium">{task.assignedTo?.name || 'Unassigned'}</span>
              </div>
              
              {task.description && <p className="text-xs text-zinc-500 line-clamp-2 mb-5 z-10">{task.description}</p>}
              
              <div className="space-y-2 mb-5 mt-auto z-10">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  <span>Operation Sync</span><span className="text-brand-400">{task.progress || 0}%</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-brand-600 to-accent-500 rounded-full" style={{ width: `${task.progress || 0}%` }} />
                </div>
              </div>
              
              <div className="flex flex-col gap-4 z-10">
                <div className="flex items-center justify-between border-t border-zinc-800/80 pt-4">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${task.status === 'Completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : task.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>{task.status}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${task.deadline ? 'bg-white/5 text-zinc-300 border border-white/5' : 'text-zinc-600'}`}>
                    ⏳ {task.deadline ? format(new Date(task.deadline), 'MMM d, yyyy') : 'No Deadline'}
                  </span>
                </div>
                
                {/* Explicit Employee Encrypted Note Visibility */}
                {task.notes ? (
                  <div className="relative mt-2">
                    <p className="text-xs text-brand-300 italic bg-brand-900/10 border border-brand-500/20 rounded-lg px-3 py-2.5">
                      <span className="block text-[9px] uppercase font-bold text-brand-500 tracking-widest mb-1">Employee Note Provided:</span>
                      "{task.notes}"
                    </p>
                  </div>
                ) : (
                  <p className="text-[10px] text-zinc-600 italic uppercase tracking-widest">No employee notes provided.</p>
                )}
                
                <button onClick={() => handleDelete(task._id)}
                  className="w-full py-2.5 bg-transparent border border-red-900/50 hover:bg-red-900/20 hover:border-red-500/50 text-red-500 text-xs uppercase tracking-widest font-bold rounded-xl transition-all mt-2">
                  Purge Directive
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deploy Directive Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 to-accent-500"></div>
            
            <h3 className="font-display font-bold text-2xl text-white mb-6">Deploy New Directive</h3>
            
            <form onSubmit={handleAssign} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Designation *</label>
                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-3 border border-zinc-800 bg-zinc-950 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
                  placeholder="Task designation" />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Mission Briefing</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3} className="w-full px-4 py-3 border border-zinc-800 bg-zinc-950 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 transition-colors resize-none"
                  placeholder="Operational details..." />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Agent *</label>
                  <select required value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })}
                    className="w-full px-4 py-3 border border-zinc-800 bg-zinc-950 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 transition-colors font-medium">
                    <option value="">Select Target</option>
                    {employees.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Threat Level</label>
                  <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
                    className="w-full px-4 py-3 border border-zinc-800 bg-zinc-950 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 transition-colors font-medium">
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Deadline</label>
                <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })}
                  className="w-full px-4 py-3 border border-zinc-800 bg-zinc-950 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 transition-colors" />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-zinc-800 text-zinc-400 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 hover:text-white transition-all">Abort</button>
                <button type="submit" className="flex-1 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]">Authorize Load</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

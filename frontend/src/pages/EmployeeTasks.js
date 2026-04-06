import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getMyTasks, updateTaskStatus, getMyActivities } from '../services/api';
import { format } from 'date-fns';

const PriorityBadge = ({ p }) => {
  const s = { High: 'bg-red-500/20 text-red-400 border-red-500/30', Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', Low: 'bg-green-500/20 text-green-400 border-green-500/30' };
  return <span className={`px-2.5 py-0.5 rounded-full border text-xs font-bold tracking-wider uppercase ${s[p]}`}>{p}</span>;
};

export default function EmployeeTasks() {
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState(null);
  const [updateForm, setUpdateForm] = useState({ status: '', progress: 0, notes: '' });

  const fetchTasksAndActivities = async () => {
    setLoading(true);
    try {
      const [tasksRes, actRes] = await Promise.all([
        getMyTasks({ status: filterStatus }),
        getMyActivities()
      ]);
      setTasks(tasksRes.data);
      setActivities(actRes.data);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load portal data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasksAndActivities(); }, [filterStatus]);

  const openUpdate = (task) => {
    setSelected(task);
    setUpdateForm({ status: task.status, progress: task.progress || 0, notes: task.notes || '' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateTaskStatus(selected._id, updateForm);
      toast.success('Task objective updated.');
      setSelected(null);
      fetchTasksAndActivities(); // refresh both tasks & logs
    } catch { toast.error('Update operation failed.'); }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-20 relative min-h-screen">
      
      {/* Left Area: Tasks */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold text-white tracking-tight">Active Directives</h2>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-300 uppercase tracking-widest focus:outline-none focus:border-brand-500 transition-colors">
            <option value="">All Status</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>

        {loading ? <div className="text-center py-12 text-zinc-600 font-bold uppercase tracking-widest text-sm animate-pulse">Syncing Database...</div> : tasks.length === 0 ? (
          <div className="text-center py-12 bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-800">
            <p className="text-zinc-500 font-medium">No directives found in the current sector.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {tasks.map(task => (
              <div key={task._id} className="bg-zinc-900/40 rounded-2xl p-6 border border-zinc-800 transition-all hover:border-brand-500/50 hover:bg-zinc-900/60 group relative overflow-hidden">
                <div className="flex items-start justify-between gap-2 mb-3 relative z-10">
                  <h3 className="font-bold text-white text-base leading-snug group-hover:text-brand-300 transition-colors">{task.title}</h3>
                  <PriorityBadge p={task.priority} />
                </div>
                {task.description && <p className="text-xs text-zinc-400 line-clamp-2 mb-5 relative z-10">{task.description}</p>}
                
                <div className="space-y-2 mb-5 relative z-10">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    <span>Operation Sync</span><span className="text-brand-400">{task.progress || 0}%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-brand-600 to-accent-500 rounded-full" style={{ width: `${task.progress || 0}%` }} />
                  </div>
                </div>
                
                <div className="flex flex-col gap-4 relative z-10">
                  <div className="flex items-center justify-between border-t border-zinc-800/80 pt-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${task.status === 'Completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : task.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>{task.status}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${task.deadline ? 'bg-white/5 text-zinc-300 border border-white/5' : 'text-zinc-600'}`}>
                      ⏳ {task.deadline ? format(new Date(task.deadline), 'MMM d, yyyy') : 'No Deadline'}
                    </span>
                  </div>
                  
                  {task.notes && <p className="text-xs text-zinc-400 italic bg-black/40 rounded-lg px-3 py-2 border-l-2 border-brand-500">"{task.notes}"</p>}
                  
                  <button onClick={() => openUpdate(task)}
                    className="w-full py-2.5 bg-zinc-800 hover:bg-brand-600 border border-zinc-700 hover:border-brand-500 text-zinc-300 hover:text-white text-xs uppercase tracking-widest font-bold rounded-xl transition-all mt-2">
                    Access Console
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Area: Activities */}
      <div className="lg:w-80 xl:w-96 flex flex-col pt-2 lg:pt-0">
        <h2 className="text-lg font-display font-bold text-white tracking-tight mb-6">Execution Log</h2>
        <div className="flex-1 bg-zinc-900/50 rounded-2xl border border-zinc-800 p-5 overflow-y-auto max-h-[calc(100vh-140px)] hidden-scrollbar">
          {loading ? (
             <div className="text-center py-6 text-zinc-600 font-bold uppercase tracking-widest text-xs animate-pulse">Syncing Logs...</div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-sm">No recent activity detected in your sector.</div>
          ) : (
            <div className="space-y-4">
              {activities.map((log) => (
                <div key={log._id} className="relative pl-6 pb-4 border-l border-zinc-800 last:border-transparent last:pb-0">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-brand-600/30 border border-brand-500 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-400"></div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-200 capitalize leading-tight">{log.action}</h4>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mt-0.5">
                      {format(new Date(log.createdAt), 'MMM d • h:mm a')}
                    </span>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed bg-zinc-950/50 px-3 py-2 rounded-lg border border-zinc-800/50">
                      {log.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selected && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 to-accent-500"></div>
            
            <h3 className="font-display font-bold text-2xl text-white mb-2">Override Protocol</h3>
            <p className="text-sm text-brand-300 font-medium mb-6 uppercase tracking-wider truncate border-b border-white/5 pb-4">{selected.title}</p>
            
            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Operational Status</label>
                <select value={updateForm.status} onChange={e => setUpdateForm({ ...updateForm, status: e.target.value })}
                  className="w-full px-4 py-3 border border-zinc-800 bg-zinc-950 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 transition-colors font-medium">
                  <option>Pending</option><option>In Progress</option><option>Completed</option>
                </select>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                   <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Execution Ratio</label>
                   <span className="text-xs font-bold text-brand-400">{updateForm.progress}%</span>
                </div>
                <input type="range" min="0" max="100" value={updateForm.progress}
                  onChange={e => setUpdateForm({ ...updateForm, progress: Number(e.target.value) })}
                  className="w-full accent-brand-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Encrypted Note</label>
                <textarea value={updateForm.notes} onChange={e => setUpdateForm({ ...updateForm, notes: e.target.value })}
                  rows={3} placeholder="Transmission details..." className="w-full px-4 py-3 border border-zinc-800 bg-zinc-950 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 transition-colors font-medium resize-none" />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setSelected(null)} className="flex-1 py-3 border border-zinc-800 text-zinc-400 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 hover:text-white transition-all">Abort</button>
                <button type="submit" className="flex-1 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]">Commit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

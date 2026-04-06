import React, { useEffect, useState } from 'react';
import { getEmployees, getEmployeeActivities } from '../services/api';
import { format } from 'date-fns';

export default function AdminActivityLog() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async (query = '') => {
    setLoading(true);
    try {
      const { data } = await getEmployees({ search: query });
      setEmployees(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(search);
  };

  const handleSelectEmployee = async (emp) => {
    setSelectedEmp(emp);
    setLoadingActivities(true);
    try {
      const { data } = await getEmployeeActivities(emp._id);
      setActivities(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingActivities(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 relative min-h-screen flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-white">Employee Activity Search</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* Left Column: Search & Employee List */}
        <div className="lg:col-span-1 border-r border-gray-100 dark:border-gray-800 pr-6 flex flex-col gap-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Search by name, email, or age..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500 transition-all text-sm"
            />
            <button type="submit" className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-medium transition-colors">
              Search
            </button>
          </form>

          <div className="flex-1 overflow-y-auto space-y-3 hidden-scrollbar mt-2">
            {loading ? <div className="text-sm text-gray-500 py-4 text-center">Loading employees...</div> : employees.length === 0 ? (
              <div className="text-sm text-gray-500 py-4 text-center">No employees found.</div>
            ) : (
              employees.map(emp => (
                <div 
                  key={emp._id} 
                  onClick={() => handleSelectEmployee(emp)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedEmp?._id === emp._id ? 'border-brand-500 bg-brand-900/20' : 'border-zinc-800 bg-zinc-900/50 hover:border-brand-400'}`}
                >
                  <p className="font-bold text-white text-sm">{emp.name}</p>
                  <p className="text-xs text-zinc-400 mt-1">{emp.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                      Age: {emp.age || 'N/A'}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-900/30 text-brand-400">
                      {emp.department || 'General'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Employee Activities */}
        <div className="lg:col-span-2">
          {!selectedEmp ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 space-y-4 py-20">
              <div className="text-4xl text-gray-300 dark:text-gray-700">📜</div>
              <p>Select an employee from the list to view their activity logs.</p>
            </div>
          ) : (
            <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 shadow-[0_0_20px_rgba(0,0,0,0.5)] p-6 overflow-hidden flex flex-col h-full max-h-[800px]">
              <div className="mb-6 pb-4 border-b border-zinc-800">
                <h3 className="font-display font-bold text-xl text-white">{selectedEmp.name}'s Activity</h3>
                <p className="text-sm text-zinc-400">A detailed breakdown of all system actions involving this employee.</p>
              </div>

              <div className="flex-1 overflow-y-auto pr-4 hidden-scrollbar relative min-h-[400px]">
                {loadingActivities ? (
                  <div className="text-center text-zinc-500 py-8">Loading activities...</div>
                ) : activities.length === 0 ? (
                  <div className="text-center text-zinc-500 py-8">No specific activity recorded yet.</div>
                ) : (
                  <div className="relative">
                    <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-zinc-800" />
                    <div className="space-y-6">
                      {activities.map((log) => (
                        <div key={log._id} className="flex gap-4 pl-8 relative">
                          <div className="absolute left-0 w-5 h-5 rounded-full bg-brand-600 border-2 border-zinc-900 top-0.5" />
                          <div className="flex-1 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/60">
                            <div className="flex justify-between items-start mb-1">
                              <p className="text-sm font-bold text-white capitalize">{log.action}</p>
                              <span className="text-[10px] text-zinc-500 font-medium tracking-widest">
                                {format(new Date(log.createdAt), 'MMM d, yyyy • h:mm a')}
                              </span>
                            </div>
                            <p className="text-sm text-zinc-400 mt-1">{log.details}</p>
                            
                            <div className="mt-4 flex items-center gap-2 text-xs">
                              <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500">
                                Performed By: <span className="font-bold text-white ml-1">{log.performedBy?.name || 'System'}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Company Footer Info */}
      <div className="mt-auto pt-8 flex-col flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity">
        <div className="text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 w-full pt-6">
          <p className="font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2">Nova Task Management Solutions Ltd.</p>
          <p>📍 1204 Innovation Drive, Tech District, SF, CA 94103</p>
          <p className="mt-1">✉️ support@novatask.com • 📞 1-800-NOVA-TSK</p>
          <p className="mt-4 opacity-50">&copy; {new Date().getFullYear()} Nova Systems. All Rights Reserved. Restricted Business Area.</p>
        </div>
      </div>
    </div>
  );
}

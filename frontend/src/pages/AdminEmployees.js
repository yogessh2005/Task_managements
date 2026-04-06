import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getEmployees, approveEmployee } from '../services/api';
import { format } from 'date-fns';

const StatusBadge = ({ status }) => {
  const styles = { pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300', approved: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300', rejected: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
};

export default function AdminEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const { data } = await getEmployees({ search, status: filter });
      setEmployees(data);
    } catch { toast.error('Failed to load employees'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEmployees(); }, [search, filter]);

  const handleApprove = async (id, status) => {
    try {
      await approveEmployee(id, status);
      toast.success(`Employee ${status}!`);
      fetchEmployees();
    } catch { toast.error('Action failed'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Employees</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">{employees.length} records</span>
      </div>

      <div className="flex gap-3 flex-wrap">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
          className="flex-1 min-w-48 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-indigo-400" />
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:outline-none">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : employees.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No employees found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-750">
                <tr>
                  {['Name', 'Email', 'Department', 'Phone', 'Status', 'Registered', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {employees.map(emp => (
                  <tr key={emp._id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition">
                    <td className="px-5 py-4 font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
                        {emp.name}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{emp.email}</td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{emp.department || '—'}</td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{emp.phone || '—'}</td>
                    <td className="px-5 py-4"><StatusBadge status={emp.status} /></td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{format(new Date(emp.createdAt), 'MMM d, yyyy')}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {emp.status !== 'approved' && (
                          <button onClick={() => handleApprove(emp._id, 'approved')}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-medium rounded-lg transition">Approve</button>
                        )}
                        {emp.status !== 'rejected' && (
                          <button onClick={() => handleApprove(emp._id, 'rejected')}
                            className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium rounded-lg transition">Reject</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

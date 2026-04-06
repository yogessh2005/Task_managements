import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/api';
import { format } from 'date-fns';

const StatCard = ({ label, value, icon, color }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm`}>
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
      <span className={`text-2xl p-2 rounded-xl ${color}`}>{icon}</span>
    </div>
    <div className="text-3xl font-display font-bold text-gray-900 dark:text-white">{value ?? '—'}</div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then(({ data }) => { setStats(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading dashboard...</div>;

  const completionRate = stats?.totalTasks ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Employees" value={stats?.totalEmployees} icon="👥" color="bg-blue-50 dark:bg-blue-900/30" />
        <StatCard label="Pending Approvals" value={stats?.pendingApprovals} icon="⏳" color="bg-yellow-50 dark:bg-yellow-900/30" />
        <StatCard label="Total Tasks" value={stats?.totalTasks} icon="📋" color="bg-indigo-50 dark:bg-indigo-900/30" />
        <StatCard label="Completed Tasks" value={stats?.completedTasks} icon="✅" color="bg-green-50 dark:bg-green-900/30" />
      </div>

      {/* Task Completion Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Task Completion Rate</h3>
          <span className="text-2xl font-display font-bold text-indigo-600">{completionRate}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
            style={{ width: `${completionRate}%` }} />
        </div>
        <div className="flex gap-6 mt-4">
          {[
            { label: 'Pending', value: stats?.totalTasks - stats?.completedTasks - stats?.inProgressTasks, color: 'bg-gray-300' },
            { label: 'In Progress', value: stats?.inProgressTasks, color: 'bg-yellow-400' },
            { label: 'Completed', value: stats?.completedTasks, color: 'bg-green-400' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}: <strong>{item.value ?? 0}</strong></span>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        {stats?.recentLogs?.length === 0 ? (
          <p className="text-gray-400 text-sm">No activity yet.</p>
        ) : (
          <div className="space-y-3">
            {stats?.recentLogs?.map((log, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-50 dark:border-gray-700 last:border-0">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{log.details || log.action}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{format(new Date(log.createdAt), 'MMM d, yyyy • h:mm a')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

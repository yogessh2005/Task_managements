import React, { useEffect, useState } from 'react';
import { getMyStats, getMyTasks } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className={`p-2 rounded-xl ${color}`}>{icon}</span>
    </div>
    <div className="text-3xl font-display font-bold text-gray-900 dark:text-white">{value ?? 0}</div>
  </div>
);

const PriorityDot = ({ p }) => {
  const c = { High: 'bg-red-500', Medium: 'bg-yellow-500', Low: 'bg-green-500' };
  return <span className={`inline-block w-2 h-2 rounded-full ${c[p]} mr-1.5`} />;
};

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getMyStats().then(({ data }) => setStats(data));
    getMyTasks().then(({ data }) => setTasks(data.slice(0, 5)));
  }, []);

  const completionRate = stats?.total ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">My Dashboard</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Here's your task overview, {user?.name}.</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Tasks" value={stats?.total} icon="📋" color="bg-indigo-50 dark:bg-indigo-900/30" />
        <StatCard label="Pending" value={stats?.pending} icon="⏳" color="bg-gray-100 dark:bg-gray-700" />
        <StatCard label="In Progress" value={stats?.inProgress} icon="🔄" color="bg-blue-50 dark:bg-blue-900/30" />
        <StatCard label="Completed" value={stats?.completed} icon="✅" color="bg-green-50 dark:bg-green-900/30" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">My Completion Rate</h3>
          <span className="text-2xl font-display font-bold text-indigo-600">{completionRate}%</span>
        </div>
        <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700" style={{ width: `${completionRate}%` }} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Tasks</h3>
        {tasks.length === 0 ? <p className="text-gray-400 text-sm">No tasks assigned yet.</p> : (
          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded-xl">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                    <PriorityDot p={task.priority} />{task.title}
                  </div>
                  {task.deadline && <div className="text-xs text-gray-400 mt-0.5">Due: {format(new Date(task.deadline), 'MMM d, yyyy')}</div>}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${task.status === 'Completed' ? 'bg-green-100 text-green-700' : task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{task.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

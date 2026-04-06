import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('taskflow_user') || '{}');
  if (user.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getDashboardStats = () => API.get('/admin/dashboard');
export const getEmployees = (params) => API.get('/admin/employees', { params });
export const getEmployeeActivities = (id) => API.get(`/admin/employees/${id}/activities`);
export const approveEmployee = (id, status) => API.put(`/admin/employees/${id}/approve`, { status });
export const assignTask = (data) => API.post('/admin/tasks', data);
export const getAllTasks = (params) => API.get('/admin/tasks', { params });
export const deleteTask = (id) => API.delete(`/admin/tasks/${id}`);
export const getMyTasks = (params) => API.get('/employee/tasks', { params });
export const updateTaskStatus = (id, data) => API.put(`/employee/tasks/${id}`, data);
export const getMyStats = () => API.get('/employee/stats');
export const getMyActivities = () => API.get('/employee/activities');

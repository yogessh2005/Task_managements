const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getEmployees, getEmployeeActivities, approveEmployee, assignTask, getAllTasks, getDashboardStats, deleteTask } = require('../controllers/adminController');

router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/employees', getEmployees);
router.get('/employees/:id/activities', getEmployeeActivities);
router.put('/employees/:id/approve', approveEmployee);
router.post('/tasks', assignTask);
router.get('/tasks', getAllTasks);
router.delete('/tasks/:id', deleteTask);

module.exports = router;

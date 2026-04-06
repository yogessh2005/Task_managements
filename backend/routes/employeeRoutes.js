const express = require('express');
const router = express.Router();
const { getEmployees, approveEmployee, getEmployeeStats } = require('../controllers/employeeController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, adminOnly, getEmployees);
router.get('/stats', protect, adminOnly, getEmployeeStats);
router.put('/:id/approve', protect, adminOnly, approveEmployee);

module.exports = router;

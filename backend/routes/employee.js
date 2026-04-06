const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getMyTasks, updateTaskStatus, getMyStats, getMyActivities } = require('../controllers/employeeController');

router.use(protect);

router.get('/tasks', getMyTasks);
router.put('/tasks/:id', updateTaskStatus);
router.get('/stats', getMyStats);
router.get('/activities', getMyActivities);

module.exports = router;

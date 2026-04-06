const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask, getTaskStats } = require('../controllers/taskController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/stats', protect, getTaskStats);
router.get('/', protect, getTasks);
router.post('/', protect, adminOnly, createTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, adminOnly, deleteTask);

module.exports = router;

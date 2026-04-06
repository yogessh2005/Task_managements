const express = require('express');
const router = express.Router();
const { getActivities } = require('../controllers/activityController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, adminOnly, getActivities);

module.exports = router;

const Activity = require('../models/Activity');

// @desc    Get activity log
// @route   GET /api/activities
const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate('performedBy', 'name role')
      .populate('targetUser', 'name')
      .populate('targetTask', 'title')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getActivities };

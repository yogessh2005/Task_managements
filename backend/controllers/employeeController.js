const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

const getMyTasks = async (req, res) => {
  try {
    const { status } = req.query;
    let query = { assignedTo: req.user._id };
    if (status) query.status = status;
    const tasks = await Task.find(query).populate('assignedBy', 'name').sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { status, progress, notes } = req.body;
    const task = await Task.findOne({ _id: req.params.id, assignedTo: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (status) task.status = status;
    if (progress !== undefined) task.progress = progress;
    if (notes !== undefined) task.notes = notes;
    if (status === 'Completed') task.progress = 100;
    if (status === 'Pending') task.progress = 0;
    await task.save();
    await ActivityLog.create({ action: 'Task Updated', performedBy: req.user._id, targetTask: task._id, details: `${req.user.name} updated task "${task.title}" to ${status || task.status}` });
    res.json(task);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getMyStats = async (req, res) => {
  try {
    const total = await Task.countDocuments({ assignedTo: req.user._id });
    const pending = await Task.countDocuments({ assignedTo: req.user._id, status: 'Pending' });
    const inProgress = await Task.countDocuments({ assignedTo: req.user._id, status: 'In Progress' });
    const completed = await Task.countDocuments({ assignedTo: req.user._id, status: 'Completed' });
    res.json({ total, pending, inProgress, completed });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getMyActivities = async (req, res) => {
  try {
    const logs = await ActivityLog.find({
      $or: [{ targetUser: req.user._id }, { performedBy: req.user._id }]
    }).populate('performedBy', 'name').sort({ createdAt: -1 }).limit(20);
    res.json(logs);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getMyTasks, updateTaskStatus, getMyStats, getMyActivities };

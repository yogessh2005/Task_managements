const User = require('../models/User');
const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

const getEmployees = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = { role: 'employee' };
    if (status) query.status = status;
    if (search) {
      if (!isNaN(search)) {
        query.$or = [{ age: Number(search) }, { name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
      } else {
        query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
      }
    }
    const employees = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getEmployeeActivities = async (req, res) => {
  try {
    const { id } = req.params;
    const logs = await ActivityLog.find({
      $or: [{ targetUser: id }, { performedBy: id }]
    }).populate('performedBy', 'name').populate('targetUser', 'name').sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const approveEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'
    const employee = await User.findByIdAndUpdate(id, { status }, { new: true }).select('-password');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    await ActivityLog.create({ action: `Employee ${status.charAt(0).toUpperCase() + status.slice(1)}`, performedBy: req.user._id, targetUser: id, details: `Admin ${status} ${employee.name}` });
    res.json({ message: `Employee ${status} successfully`, employee });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const assignTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, deadline } = req.body;
    const task = await Task.create({ title, description, assignedTo, assignedBy: req.user._id, priority: priority || 'Medium', deadline, status: 'Pending', progress: 0 });
    const populated = await Task.findById(task._id).populate('assignedTo', 'name email').populate('assignedBy', 'name');
    const emp = await User.findById(assignedTo);
    await ActivityLog.create({ action: 'Task Assigned', performedBy: req.user._id, targetUser: assignedTo, targetTask: task._id, details: `Task "${title}" assigned to ${emp?.name}` });
    res.status(201).json(populated);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getAllTasks = async (req, res) => {
  try {
    const { search, status, priority } = req.query;
    let query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) query.title = { $regex: search, $options: 'i' };
    const tasks = await Task.find(query).populate('assignedTo', 'name email').populate('assignedBy', 'name').sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const pendingApprovals = await User.countDocuments({ role: 'employee', status: 'pending' });
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'Completed' });
    const inProgressTasks = await Task.countDocuments({ status: 'In Progress' });
    const recentLogs = await ActivityLog.find().populate('performedBy', 'name').populate('targetUser', 'name').sort({ createdAt: -1 }).limit(10);
    res.json({ totalEmployees, pendingApprovals, totalTasks, completedTasks, inProgressTasks, recentLogs });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getEmployees, getEmployeeActivities, approveEmployee, assignTask, getAllTasks, getDashboardStats, deleteTask };

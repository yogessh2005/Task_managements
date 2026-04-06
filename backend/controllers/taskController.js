const Task = require('../models/Task');
const Activity = require('../models/Activity');

// @desc    Assign a new task (admin)
// @route   POST /api/tasks
const createTask = async (req, res) => {
  const { title, description, assignedTo, priority, deadline } = req.body;

  try {
    if (!title || !assignedTo) {
      return res.status(400).json({ message: 'Title and assignedTo are required' });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      assignedBy: req.user._id,
      priority: priority || 'Medium',
      deadline: deadline || null,
    });

    const populated = await task.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'assignedBy', select: 'name' },
    ]);

    await Activity.create({
      action: `Admin assigned task "${title}" to ${populated.assignedTo.name}`,
      performedBy: req.user._id,
      targetUser: assignedTo,
      targetTask: task._id,
      type: 'task',
    });

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tasks (admin) or own tasks (employee)
// @route   GET /api/tasks
const getTasks = async (req, res) => {
  try {
    const { status, priority, search } = req.query;
    let query = {};

    if (req.user.role === 'employee') {
      query.assignedTo = req.user._id;
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email department')
      .populate('assignedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task status (employee) or full update (admin)
// @route   PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role === 'employee') {
      // Employees can only update status and notes of their own tasks
      if (task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this task' });
      }
      const { status, notes } = req.body;
      if (status) task.status = status;
      if (notes !== undefined) task.notes = notes;
    } else {
      // Admin can update everything
      const { title, description, status, priority, deadline, assignedTo } = req.body;
      if (title) task.title = title;
      if (description !== undefined) task.description = description;
      if (status) task.status = status;
      if (priority) task.priority = priority;
      if (deadline !== undefined) task.deadline = deadline;
      if (assignedTo) task.assignedTo = assignedTo;
    }

    const updated = await task.save();
    const populated = await updated.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'assignedBy', select: 'name' },
    ]);

    await Activity.create({
      action: `${req.user.name} updated task "${task.title}" status to ${task.status}`,
      performedBy: req.user._id,
      targetTask: task._id,
      type: 'status',
    });

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete task (admin only)
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get task statistics
// @route   GET /api/tasks/stats
const getTaskStats = async (req, res) => {
  try {
    let matchQuery = {};
    if (req.user.role === 'employee') {
      matchQuery.assignedTo = req.user._id;
    }

    const total = await Task.countDocuments(matchQuery);
    const pending = await Task.countDocuments({ ...matchQuery, status: 'Pending' });
    const inProgress = await Task.countDocuments({ ...matchQuery, status: 'In Progress' });
    const completed = await Task.countDocuments({ ...matchQuery, status: 'Completed' });

    res.json({ total, pending, inProgress, completed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask, getTaskStats };

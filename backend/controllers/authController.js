const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { generateToken } = require('../middleware/auth');

const register = async (req, res) => {
  const { name, email, password, department, phone, age } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, email, password, department, phone, age, role: 'employee', status: 'pending' });
    await ActivityLog.create({ action: 'Employee Registered', targetUser: user._id, details: `${name} registered and awaiting approval` });
    res.status(201).json({ message: 'Registration successful. Await admin approval.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    if (!(await user.matchPassword(password))) return res.status(401).json({ message: 'Invalid credentials' });
    if (user.role === 'employee' && user.status !== 'approved') {
      return res.status(403).json({ message: user.status === 'pending' ? 'Your account is pending admin approval' : 'Your account has been rejected' });
    }
    res.json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, status: user.status,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@taskmanager.com' });
    if (!adminExists) {
      await User.create({ name: 'Admin', email: 'admin@taskmanager.com', password: 'admin123', role: 'admin', status: 'approved' });
      console.log('Default admin created');
    }
  } catch (error) {
    console.error('Admin seed error:', error.message);
  }
};

module.exports = { register, login, seedAdmin };

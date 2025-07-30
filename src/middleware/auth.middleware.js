require('dotenv').config();
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Agent = require('../models/Agent');

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key';

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const loggedInUser = await User.findById(decoded.id);
    if (!loggedInUser) throw new Error();

    req.user = { id: loggedInUser._id };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Middleware: Verify token and attach user info
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Contains id and role

    if (decoded.role === 'customer') {
      const customer = await Customer.findById(decoded.id);
      if (!customer) return res.status(401).json({ message: 'User not found' });
      req.fullUser = customer;
    } else if (decoded.role === 'agent') {
      const agent = await Agent.findById(decoded.id);
      if (!agent) return res.status(401).json({ message: 'User not found' });
      req.fullUser = agent;
    } else {
      return res.status(403).json({ message: 'Invalid role' });
    }

    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token', error: err.message });
  }
};

// Middleware: Allow only customers
const isCustomer = (req, res, next) => {
  if (req.user.role !== 'customer') {
    return res.status(403).json({ message: 'Only customers allowed' });
  }
  next();
};

// Middleware: Allow only agents
const isAgent = (req, res, next) => {
  if (req.user.role !== 'agent') {
    return res.status(403).json({ message: 'Only agents allowed' });
  }
  next();
};

// Optional: Admin middleware (if your app has admins)
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins allowed' });
  }
  next();
};

module.exports = {
  authenticate,
  verifyToken,
  isCustomer,
  isAgent,
  isAdmin
};

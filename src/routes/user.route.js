const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  updateUserProfile, 
  forgotUserPassword, 
  resetUserPassword, 
  getUser
} = require('../controllers/user.controller');

// // Middleware for authentication (you can customize this middleware)
// const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/users', getAllUsers);
router.get('/user', getUser);
router.put('/users/profile', updateUserProfile);
router.post('/forgot-password', forgotUserPassword);
router.post('/users/reset-password', resetUserPassword);

module.exports = router;

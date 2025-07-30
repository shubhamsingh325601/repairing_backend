const express = require('express');
const { registerUser, loginUser, registerAgent, loginAgent, sendOTP, verifyOTP } = require('../controllers/auth.controller');
const router = express.Router();

// --------------- USER ---------------- //
router.post('/registerUser', registerUser);
router.post('/loginUser', loginUser);

// --------------- AGENT ---------------- //
router.post('/registerAgent', registerAgent);
router.post('/loginAgent', loginAgent);

router.post('/sendOTP',sendOTP);
router.post('/verifyOTP',verifyOTP);

module.exports = router;

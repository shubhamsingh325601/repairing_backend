const express = require('express');
const { getAllAgents, updateAgentProfile, forgotAgentPassword, resetAgentPassword, getAgent } = require('../controllers/agent.controller');
const router = express.Router();

router.get('/agents', getAllAgents);
router.get('/agent', getAgent);
router.put('/update-profile', updateAgentProfile);
router.post('/forgot-password', forgotAgentPassword);
router.post('/reset-password', resetAgentPassword);

module.exports = router;

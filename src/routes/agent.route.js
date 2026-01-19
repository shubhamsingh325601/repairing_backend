const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agent.controller');

/**
 * @swagger
 * /api/Agent:
 *   get:
 *     summary: Get all agents
 *     tags: [Agents]
 *     responses:
 *       200:
 *         description: List of all agents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agent'
 */
router.get('/', agentController.getAllAgents);

module.exports = router;
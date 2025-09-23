const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
// const auth = require('../middleware/auth.middleware'); // Uncomment when auth is ready
// const adminAuth = require('../middleware/admin.middleware'); // Uncomment when admin auth is ready

/**
 * @swagger
 * /api/Admin/message/all-users:
 *   post:
 *     summary: Send message to all users
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - message
 *             properties:
 *               subject:
 *                 type: string
 *                 description: Email subject
 *               message:
 *                 type: string
 *                 description: Message content
 *               messageType:
 *                 type: string
 *                 enum: [email, sms]
 *                 default: email
 *                 description: Type of message delivery
 *     responses:
 *       200:
 *         description: Message sent to all users successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Message sent to 25 users successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     messageCount:
 *                       type: number
 *                       description: Number of users who received the message
 *                     messageType:
 *                       type: string
 *                       description: Type of message sent
 *       400:
 *         description: Bad request - missing required fields
 *       500:
 *         description: Internal server error
 */
router.post('/message/all-users', /*auth, adminAuth,*/ adminController.sendMessageToAllUsers);

/**
 * @swagger
 * /api/Admin/message/selected-users:
 *   post:
 *     summary: Send message to selected users
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userIds
 *               - subject
 *               - message
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of user IDs to send message to
 *               subject:
 *                 type: string
 *                 description: Email subject
 *               message:
 *                 type: string
 *                 description: Message content
 *               messageType:
 *                 type: string
 *                 enum: [email, sms]
 *                 default: email
 *                 description: Type of message delivery
 *     responses:
 *       200:
 *         description: Message sent to selected users successfully
 *       400:
 *         description: Bad request - missing required fields
 *       404:
 *         description: No valid users found
 *       500:
 *         description: Internal server error
 */
router.post('/message/selected-users', /*auth, adminAuth,*/ adminController.sendMessageToSelectedUsers);

/**
 * @swagger
 * /api/Admin/message/by-role:
 *   post:
 *     summary: Send message to users by role
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *               - subject
 *               - message
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, agent, admin]
 *                 description: User role to target
 *               subject:
 *                 type: string
 *                 description: Email subject
 *               message:
 *                 type: string
 *                 description: Message content
 *               messageType:
 *                 type: string
 *                 enum: [email, sms]
 *                 default: email
 *                 description: Type of message delivery
 *     responses:
 *       200:
 *         description: Message sent to users by role successfully
 *       400:
 *         description: Bad request - missing required fields
 *       404:
 *         description: No users found with specified role
 *       500:
 *         description: Internal server error
 */
router.post('/message/by-role', /*auth, adminAuth,*/ adminController.sendMessageByRole);

/**
 * @swagger
 * /api/Admin/user-stats:
 *   get:
 *     summary: Get user statistics for admin
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User statistics fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: number
 *                       description: Total number of users
 *                     usersByRole:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: User role
 *                           count:
 *                             type: number
 *                             description: Number of users with this role
 *       500:
 *         description: Internal server error
 */
router.get('/user-stats', /*auth, adminAuth,*/ adminController.getUserStats);

module.exports = router;

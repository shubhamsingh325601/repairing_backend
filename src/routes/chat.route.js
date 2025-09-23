const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
// const auth = require('../middleware/auth.middleware'); // Uncomment when auth is ready

/**
 * @swagger
 * /api/Chat/send:
 *   post:
 *     summary: Send a message
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiverId
 *               - message
 *             properties:
 *               receiverId:
 *                 type: string
 *                 description: ID of the message receiver
 *               message:
 *                 type: string
 *                 description: Message content
 *               messageType:
 *                 type: string
 *                 enum: [text, image, file]
 *                 default: text
 *                 description: Type of message
 *               bookingId:
 *                 type: string
 *                 description: Associated booking ID (optional)
 *     responses:
 *       201:
 *         description: Message sent successfully
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
 *                   example: Message sent successfully
 *                 data:
 *                   $ref: '#/components/schemas/Chat'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Receiver not found
 *       500:
 *         description: Internal server error
 */
router.post('/send', /*auth,*/ chatController.sendMessage);

/**
 * @swagger
 * /api/Chat/history/{userId}:
 *   get:
 *     summary: Get chat history with a specific user
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to get chat history with
 *     responses:
 *       200:
 *         description: Chat history fetched successfully
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
 *                   example: Chat history fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Chat'
 *       500:
 *         description: Internal server error
 */
router.get('/history/:userId', /*auth,*/ chatController.getChatHistory);

/**
 * @swagger
 * /api/Chat/conversations:
 *   get:
 *     summary: Get all conversations for current user
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Conversations fetched successfully
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
 *                   example: Conversations fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         $ref: '#/components/schemas/User'
 *                       lastMessage:
 *                         $ref: '#/components/schemas/Chat'
 *                       unreadCount:
 *                         type: number
 *                         description: Number of unread messages
 *       500:
 *         description: Internal server error
 */
router.get('/conversations', /*auth,*/ chatController.getConversations);

/**
 * @swagger
 * /api/Chat/read/{senderId}:
 *   patch:
 *     summary: Mark messages as read from a specific sender
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: senderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the sender whose messages to mark as read
 *     responses:
 *       200:
 *         description: Messages marked as read
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
 *                   example: Messages marked as read
 *                 data:
 *                   type: array
 *                   example: []
 *       500:
 *         description: Internal server error
 */
router.patch('/read/:senderId', /*auth,*/ chatController.markAsRead);

/**
 * @swagger
 * /api/Chat/unread-count:
 *   get:
 *     summary: Get unread message count
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count fetched
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
 *                   example: Unread count fetched
 *                 data:
 *                   type: object
 *                   properties:
 *                     unreadCount:
 *                       type: number
 *                       description: Number of unread messages
 *       500:
 *         description: Internal server error
 */
router.get('/unread-count', /*auth,*/ chatController.getUnreadCount);

module.exports = router;

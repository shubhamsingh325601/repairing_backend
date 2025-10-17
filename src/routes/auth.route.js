const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

/**
 * @swagger
 * /api/Auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - email
 *               - name
 *               - phone
 *               - address
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *                 description: Unique username
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email address
 *               name:
 *                 type: string
 *                 description: Full name
 *               phone:
 *                 type: string
 *                 description: Phone number
 *               address:
 *                 type: string
 *                 description: User address
 *               password:
 *                 type: string
 *                 description: User password
 *     responses:
 *       201:
 *         description: User registered successfully
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
 *                   example: User registered successfully.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       application:
 *                         $ref: '#/components/schemas/User'
 *                       token:
 *                         type: string
 *                         description: JWT token
 *       400:
 *         description: Bad request - validation error
 *       500:
 *         description: Internal server error
 */
router.post("/register", authController.registerUser);

/**
 * @swagger
 * /api/Auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email address
 *               password:
 *                 type: string
 *                 description: User password
 *     responses:
 *       200:
 *         description: Login successful
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
 *                   example: Login successful.
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT token
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/login", authController.loginUser);

/**
 * @swagger
 * /api/Auth/agent/register:
 *   post:
 *     summary: Register a new agent
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - password
 *               - address
 *               - skills
 *             properties:
 *               name:
 *                 type: string
 *                 description: Agent full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Agent email address
 *               phone:
 *                 type: string
 *                 description: Phone number
 *               password:
 *                 type: string
 *                 description: Agent password
 *               address:
 *                 type: string
 *                 description: Agent address
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of repair skills
 *     responses:
 *       201:
 *         description: Agent registered successfully
 *       400:
 *         description: Bad request - validation error
 *       500:
 *         description: Internal server error
 */
router.post("/agent/register", authController.registerAgent);

/**
 * @swagger
 * /api/Auth/agent/login:
 *   post:
 *     summary: Login agent
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Agent email address
 *               password:
 *                 type: string
 *                 description: Agent password
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: Agent not found
 *       500:
 *         description: Internal server error
 */
router.post("/agent/login", authController.loginAgent);
router.post("/email-verification", authController.emailVerification);
router.post("/verify-otp",authController.verifyOTP);
router.post("/send-otp",authController.sendOTP);

module.exports = router;

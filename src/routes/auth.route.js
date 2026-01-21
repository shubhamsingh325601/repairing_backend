const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

/**
 * @swagger
 * /api/Auth/register:
 *  post:
 *      summary: Register a new user or agent
 *      tags: [Authentication]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                    type: object
 *                    required:
 *                      - userName
 *                      - email
 *                      - name
 *                      - phone
 *                      - address
 *                      - password
 *                      - role
*                    properties:
 *                      userName:
 *                        type: string
 *                      email:
 *                        type: string
 *                        format: email
 *                      name:
 *                        type: string
 *                      phone:
 *                        type: string
 *                      address:
 *                        type: string
 *                      password:
 *                        type: string
 *                      role:
 *                        type: string
 *                        enum: [user, agent]
 *                        description: Specify account type
 *                      skills:
 *                        type: array
 *                        items:
 *                          type: string
 *                        description: Required only if role is agent
 *                      responses:
*                          201:
 *                            description: Registered successfully
 *                          400:
 *                            description: Validation error
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /api/Auth/login:
 *  post:
 *      summary: Login for all roles
 *      tags: [Authentication]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                    required:
 *                      - email
 *                      - password
 *                    properties:
 *                      email:
 *                        type: string
 *                        format: email
 *                      password:
 *                        type: string
 *                    responses:
 *                      200:
 *                        description: Login successful
 *                      401:
 *                        description: Invalid credentials
 */
router.post("/login", authController.login);

module.exports = router;
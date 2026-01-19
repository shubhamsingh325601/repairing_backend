const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

/**
 * @swagger
 * /api/Category:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of all categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get('/', categoryController.getAllCategories);

/**
 * @swagger
 * /api/Category:
 *   post:
 *     summary: Add a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Category name
 *               icon:
 *                 type: string
 *                 description: Category icon
 *               services:
 *                 type: number
 *                 description: Number of services
 *               products:
 *                 type: number
 *                 description: Number of products
 *               isActive:
 *                 type: boolean
 *                 description: Whether category is active
 *     responses:
 *       201:
 *         description: Category created successfully
 */
router.post('/', categoryController.addCategory);

module.exports = router;
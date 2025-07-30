const express = require('express');
const router = express.Router();
const { getAllCategories, addCategory } = require('../controllers/category.controller');

router.get('/categories', getAllCategories);
router.post('/addCategory',addCategory)

module.exports = router;

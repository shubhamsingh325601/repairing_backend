const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
// const auth = require('../middleware/auth.middleware'); // Uncomment if you want to protect routes

// Create a comment
router.post('/', /*auth,*/ commentController.createComment);

// Get comments by resource
router.get('/', commentController.getComments);

// Update a comment
router.put('/:id', /*auth,*/ commentController.updateComment);

// Delete a comment
router.delete('/:id', /*auth,*/ commentController.deleteComment);

module.exports = router; 
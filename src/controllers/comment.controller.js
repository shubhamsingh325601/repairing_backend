const { successResponse, failedResponse, errorResponse } = require('../helpers/apiResponse');
const Comment = require('../models/comment');

exports.createComment = async (req, res) => {
  try {
    const { resourceType, resourceId, content } = req.body;
    const userId = req.user ? req.user._id : req.body.userId; // fallback for unauthenticated
    const comment = await Comment.create({ resourceType, resourceId, userId, content });
    return successResponse(res, comment, 'Comment created', 201);
  } catch (err) {
    return errorResponse(res, err, 'Error creating comment');
  }
};

exports.getComments = async (req, res) => {
  try {
    const { resourceType, resourceId } = req.query;
    const filter = {};
    if (resourceType) filter.resourceType = resourceType;
    if (resourceId) filter.resourceId = resourceId;
    const comments = await Comment.find(filter).populate('userId', 'name email');
    return successResponse(res, comments, 'Comments fetched');
  } catch (err) {
    return errorResponse(res, err, 'Error fetching comments');
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const comment = await Comment.findByIdAndUpdate(id, { content }, { new: true });
    if (!comment) return failedResponse(res, 'Comment not found', 404);
    return successResponse(res, comment, 'Comment updated');
  } catch (err) {
    return errorResponse(res, err, 'Error updating comment');
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) return failedResponse(res, 'Comment not found', 404);
    return successResponse(res, [], 'Comment deleted');
  } catch (err) {
    return errorResponse(res, err, 'Error deleting comment');
  }
}; 
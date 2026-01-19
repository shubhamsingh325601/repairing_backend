const { successResponse, failedResponse, errorResponse } = require('../helpers/apiResponse');
const { User } = require('../models');

/**
 * @method GET
 * Returns all agents
 */
exports.getAllAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent', isDeleted: false });
    return successResponse(res, agents, "Agents fetched successfully");
  } catch (err) {
    return errorResponse(res, err, "Error fetching agents");
  }
};
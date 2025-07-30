const { User } = require("../models");
const crypto = require("crypto");
const { encryptPassword, passwordCompare } = require('../helpers/encyptDecrypt')
const { successResponse, failedResponse, errorResponse } = require("../helpers/apiResponse");

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

/**
 * @method GET
 * Returns agent profile
 */
exports.getAgent = async (req, res) => {
  try {
    const agent = await User.findOne({ _id: req.query.id, role: 'agent' });
    return successResponse(res, agent, "Agent fetched successfully");
  } catch (err) {
    return errorResponse(res, err, "Error fetching agent");
  }
};

/**
 * @method PUT
 * Updates authenticated agent's profile
 */
exports.updateAgentProfile = async (req, res) => {
  try {
    const agentId = req.user.id;
    const { name, phone, address, skills, isAvailable } = req.body;

    const updatedAgent = await User.findOneAndUpdate(
      { _id: agentId, role: 'agent' },
      { name, phone, address, skills, isAvailable },
      { new: true, runValidators: true }
    );

    if (!updatedAgent) return failedResponse(res, "Agent not found", 404);

    return successResponse(res, {
      name: updatedAgent.name,
      email: updatedAgent.email,
      phone: updatedAgent.phone,
      address: updatedAgent.address,
      skills: updatedAgent.skills,
      isAvailable: updatedAgent.isAvailable,
    }, "Profile updated successfully");
  } catch (err) {
    return errorResponse(res, err, "Error updating agent profile");
  }
};

/**
 * @method POST
 * Forgot password - agent
 */
exports.forgotAgentPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const agent = await User.findOne({ email, role: 'agent' });

    if (!agent) return failedResponse(res, "Agent not found", 404);

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 3600000;

    agent.resetToken = resetToken;
    agent.resetTokenExpiry = expiry;
    await agent.save();

    return successResponse(res, { resetToken }, "Password reset token generated"); // ⚠️ Remove in production
  } catch (err) {
    return errorResponse(res, err, "Error generating reset token");
  }
};

/**
 * @method POST
 * Reset password - agent
 */
exports.resetAgentPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const agent = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
      role: 'agent'
    });

    if (!agent) return failedResponse(res, "Invalid or expired token", 400);

    agent.password = await encryptPassword(newPassword);
    agent.resetToken = undefined;
    agent.resetTokenExpiry = undefined;

    await agent.save();

    return successResponse(res, null, "Password reset successful");
  } catch (err) {
    return errorResponse(res, err, "Error resetting password");
  }
};
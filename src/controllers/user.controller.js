const { User } = require("../models");
const crypto = require("crypto");
const { encryptPassword } = require("../helpers/encyptDecrypt");
const { successResponse, failedResponse, errorResponse } = require("../helpers/apiResponse");
const transporter = require("../config/email.config");
const { senderEmail } = require("../config/keys");

/**
 * @method GET
 * Returns all users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return successResponse(res, users, "Users fetched successfully");
  } catch (err) {
    return errorResponse(res, err, "Error fetching users");
  }
};


/**
 * @method GET
 * Returns all users
 */
exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({_id : req.query.id});
    return successResponse(res, user, "Users fetched successfully");
  } catch (err) {
    return errorResponse(res, err, "Error fetching users");
  }
};

/**
 * @method PUT
 * Updates authenticated user's profile
 */
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, address } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, phone, address },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return failedResponse(res, "User not found", 404);

    return successResponse(res, {
      userName: updatedUser.userName,
      email: updatedUser.email,
      name: updatedUser.name,
      phone: updatedUser.phone,
      address: updatedUser.address,
    }, "Profile updated successfully");
  } catch (err) {
    return errorResponse(res, err, "Error updating user profile");
  }
};

/**
 * @method POST
 * Forgot password - user
 */
exports.forgotUserPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return failedResponse(res, "User not found", 404);

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 3600000;

    user.resetToken = resetToken;
    user.resetTokenExpiry = expiry;

    const mailOptions = {
      from: senderEmail,
      to: 'ariel.shubhams@gmail.com',
      subject: 'Reset Password',
      text: `Please use OTP: ${resetToken}`,
    };

    const info = await transporter.sendMail(mailOptions);

    await user.save();

    return successResponse(res, { resetToken }, "Password reset token generated");
  } catch (err) {
    console.log(err)
    return errorResponse(res, err, "Error generating reset token");
  }
};

/**
 * @method POST
 * Reset password - user
 */
exports.resetUserPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) return failedResponse(res, "Invalid or expired token", 400);

    user.password = await encryptPassword(newPassword);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    return successResponse(res, null, "Password reset successful");
  } catch (err) {
    return errorResponse(res, err, "Error resetting password");
  }
};
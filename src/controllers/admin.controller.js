const { successResponse, failedResponse, errorResponse } = require('../helpers/apiResponse');
const { User } = require('../models');
const { transporter } = require('../config/email.config');
const { senderEmail } = require('../config/keys');

/**
 * @method POST
 * Send message to all users
 */
exports.sendMessageToAllUsers = async (req, res) => {
  try {
    const { subject, message, messageType = 'email' } = req.body;

    if (!subject || !message) {
      return failedResponse(res, 'Subject and message are required', 400);
    }

    // Get all users
    const users = await User.find({ isDeleted: false });

    if (messageType === 'email') {
      // Send emails
      const emailPromises = users.map(user => {
        const mailOptions = {
          from: senderEmail,
          to: user.email,
          subject: subject,
          text: message,
        };
        return transporter.sendMail(mailOptions);
      });

      await Promise.all(emailPromises);
    } else if (messageType === 'sms') {
      // For SMS, you would integrate with a service like Twilio
      // This is a placeholder - implement actual SMS logic
      return failedResponse(res, 'SMS functionality not implemented yet', 501);
    }

    return successResponse(res, { 
      messageCount: users.length, 
      messageType 
    }, `Message sent to ${users.length} users successfully`);
  } catch (err) {
    return errorResponse(res, err, 'Error sending message to all users');
  }
};

/**
 * @method POST
 * Send message to selected users
 */
exports.sendMessageToSelectedUsers = async (req, res) => {
  try {
    const { userIds, subject, message, messageType = 'email' } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return failedResponse(res, 'User IDs array is required', 400);
    }

    if (!subject || !message) {
      return failedResponse(res, 'Subject and message are required', 400);
    }

    // Get selected users
    const users = await User.find({ 
      _id: { $in: userIds }, 
      isDeleted: false 
    });

    if (users.length === 0) {
      return failedResponse(res, 'No valid users found', 404);
    }

    if (messageType === 'email') {
      // Send emails
      const emailPromises = users.map(user => {
        const mailOptions = {
          from: senderEmail,
          to: user.email,
          subject: subject,
          text: message,
        };
        return transporter.sendMail(mailOptions);
      });

      await Promise.all(emailPromises);
    } else if (messageType === 'sms') {
      // For SMS, you would integrate with a service like Twilio
      return failedResponse(res, 'SMS functionality not implemented yet', 501);
    }

    return successResponse(res, { 
      messageCount: users.length, 
      messageType 
    }, `Message sent to ${users.length} selected users successfully`);
  } catch (err) {
    return errorResponse(res, err, 'Error sending message to selected users');
  }
};

/**
 * @method POST
 * Send message to users by role
 */
exports.sendMessageByRole = async (req, res) => {
  try {
    const { role, subject, message, messageType = 'email' } = req.body;

    if (!role || !subject || !message) {
      return failedResponse(res, 'Role, subject, and message are required', 400);
    }

    // Get users by role
    const users = await User.find({ 
      role: role, 
      isDeleted: false 
    });

    if (users.length === 0) {
      return failedResponse(res, `No users found with role: ${role}`, 404);
    }

    if (messageType === 'email') {
      // Send emails
      const emailPromises = users.map(user => {
        const mailOptions = {
          from: senderEmail,
          to: user.email,
          subject: subject,
          text: message,
        };
        return transporter.sendMail(mailOptions);
      });

      await Promise.all(emailPromises);
    } else if (messageType === 'sms') {
      // For SMS, you would integrate with a service like Twilio
      return failedResponse(res, 'SMS functionality not implemented yet', 501);
    }

    return successResponse(res, { 
      messageCount: users.length, 
      messageType,
      role 
    }, `Message sent to ${users.length} ${role}s successfully`);
  } catch (err) {
    return errorResponse(res, err, 'Error sending message by role');
  }
};

/**
 * @method GET
 * Get user statistics for admin
 */
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isDeleted: false });
    const usersByRole = await User.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    return successResponse(res, {
      totalUsers,
      usersByRole
    }, 'User statistics fetched successfully');
  } catch (err) {
    return errorResponse(res, err, 'Error fetching user statistics');
  }
};

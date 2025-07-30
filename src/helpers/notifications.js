const admin = require('../config/firebase.config');

/**
 * Sends a Firebase push notification to a device token
 * @param {string} token - FCM device token
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} data - Additional data to send (optional)
 */
const notifications = async (token, title, body, data = {}) => {
  try {
    const message = {
      token,
      notification: { title, body },
      data,
    };

    const response = await admin.messaging().send(message);
    return { success: true, response };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

module.exports = notifications;

const { successResponse, failedResponse, errorResponse } = require('../helpers/apiResponse');
const Chat = require('../models/chat');
const { User } = require('../models');

/**
 * @method POST
 * Send a message
 */
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message, messageType = 'text', bookingId } = req.body;
    const senderId = req.user.id;

    // Validate receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return failedResponse(res, 'Receiver not found', 404);
    }

    const newMessage = new Chat({
      sender: senderId,
      receiver: receiverId,
      message,
      messageType,
      bookingId
    });

    await newMessage.save();

    // Populate sender details for response
    await newMessage.populate('sender', 'name email');

    // Emit real-time message via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${receiverId}`).emit('new_message', {
        _id: newMessage._id,
        sender: newMessage.sender,
        receiver: receiverId,
        message: newMessage.message,
        messageType: newMessage.messageType,
        createdAt: newMessage.createdAt,
        isRead: newMessage.isRead
      });
    }

    return successResponse(res, newMessage, 'Message sent successfully', 201);
  } catch (err) {
    return errorResponse(res, err, 'Error sending message');
  }
};

/**
 * @method GET
 * Get chat history between two users
 */
exports.getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const messages = await Chat.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    })
    .populate('sender', 'name email')
    .populate('receiver', 'name email')
    .sort({ createdAt: 1 });

    return successResponse(res, messages, 'Chat history fetched successfully');
  } catch (err) {
    return errorResponse(res, err, 'Error fetching chat history');
  }
};

/**
 * @method GET
 * Get all conversations for current user
 */
exports.getConversations = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Get unique conversations
    const conversations = await Chat.aggregate([
      {
        $match: {
          $or: [
            { sender: currentUserId },
            { receiver: currentUserId }
          ]
        }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', currentUserId] },
              '$receiver',
              '$sender'
            ]
          },
          lastMessage: { $last: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiver', currentUserId] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    // Populate user details
    const populatedConversations = await Chat.populate(conversations, [
      { path: '_id', select: 'name email role' },
      { path: 'lastMessage.sender', select: 'name email' },
      { path: 'lastMessage.receiver', select: 'name email' }
    ]);

    return successResponse(res, populatedConversations, 'Conversations fetched successfully');
  } catch (err) {
    return errorResponse(res, err, 'Error fetching conversations');
  }
};

/**
 * @method PATCH
 * Mark messages as read
 */
exports.markAsRead = async (req, res) => {
  try {
    const { senderId } = req.params;
    const currentUserId = req.user.id;

    await Chat.updateMany(
      {
        sender: senderId,
        receiver: currentUserId,
        isRead: false
      },
      { isRead: true }
    );

    return successResponse(res, [], 'Messages marked as read');
  } catch (err) {
    return errorResponse(res, err, 'Error marking messages as read');
  }
};

/**
 * @method GET
 * Get unread message count
 */
exports.getUnreadCount = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const unreadCount = await Chat.countDocuments({
      receiver: currentUserId,
      isRead: false
    });

    return successResponse(res, { unreadCount }, 'Unread count fetched');
  } catch (err) {
    return errorResponse(res, err, 'Error fetching unread count');
  }
};

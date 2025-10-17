# Home Appliance Repairing App Backend

This is the backend API for a Home Appliance Repairing App, built with Node.js, Express, MongoDB, and Socket.io for real-time chat.

## Features
- User and Agent registration/login
- Agent profile management (skills, availability, etc.)
- Service catalog (CRUD for repairable appliances/services)
- Customer can submit repair requests to selected agents
- Agents receive notifications for new requests (via FCM)
- Agents can accept/reject requests; customers are notified
- Booking status tracking (pending, accepted, rejected, in-progress, completed, cancelled)
- Feedback and rating system for completed jobs
- **Real-time chat between users and agents using Socket.io**
- **Admin messaging system (email/SMS to users)**
- Razorpay UPI payment integration
- Commenting system for all resources
- Admin endpoints for management
- **Interactive API Documentation with Swagger/OpenAPI**

## Setup Instructions

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment:**
   - Set up MongoDB connection in your config
   - Add your Razorpay and Firebase credentials in `src/config/`
4. **Run the server:**
   ```bash
   npm start
   ```

## API Documentation

### Beautiful Landing Page
When you visit `http://localhost:5000`, you'll see a **stunning, modern landing page** with:
- 🎨 **Gradient background** with beautiful colors
- 🏠 **App branding** and feature highlights
- 📚 **Direct link** to API documentation
- ✨ **Feature showcase** with icons and descriptions
- 📱 **Responsive design** for all devices

### Swagger UI
Your API comes with comprehensive, interactive documentation powered by Swagger/OpenAPI 3.0 with **beautiful, modern styling inspired by FastAPI**.

**Access the documentation:**
- **URL**: `http://localhost:5000/api-docs`
- **Features**:
  - ✨ **Beautiful, modern UI** with gradient backgrounds and smooth animations
  - 🎨 **FastAPI-inspired design** with custom colors and typography
  - 🔍 Interactive API testing with enhanced "Try it out" functionality
  - 📱 **Responsive design** that works on all devices
  - 🏷️ **Organized by tags** with emoji icons for better navigation
  - 📊 Request/response schemas with visual indicators
  - 🔐 Authentication requirements clearly displayed
  - ⚡ **Performance metrics** showing request duration
  - 📋 **Enhanced examples** and parameter descriptions

**What you get:**
- **Professional, enterprise-grade API documentation**
- **Modern gradient design** similar to FastAPI's Swagger UI
- **Interactive testing** for all endpoints
- **Beautiful visual hierarchy** with custom CSS styling
- **Enhanced user experience** with hover effects and animations
- **Export options** (JSON, YAML) for integration with other tools

## Socket.io Setup

The backend includes Socket.io for real-time chat functionality:

- **Connection**: Users connect to Socket.io server
- **Join Room**: Users join their personal room (`user_${userId}`)
- **Real-time Messaging**: Messages are delivered instantly
- **Typing Indicators**: Shows when someone is typing
- **Online Status**: Track user connections

## API Overview

### Authentication
- `/api/Auth/register` - Register user/agent
- `/api/Auth/login` - Login

### Agents
- `/api/Agent/agents` - List all agents
- `/api/Agent/agent?id=...` - Get agent profile
- `/api/Agent/update-profile` - Update agent profile

### Services
- `/api/Service` - List, create, update, delete services

### Bookings
- `POST /api/Booking` - Create a booking (customer)
- `GET /api/Booking/customer` - Customer's bookings
- `GET /api/Booking/agent` - Agent's bookings
- `PATCH /api/Booking/:bookingId/status` - Agent updates booking status (accept/reject/etc.)
- `POST /api/Booking/:bookingId/feedback` - Customer submits feedback for completed booking

### **Chat (Real-time)**
- `POST /api/Chat/send` - Send a message
- `GET /api/Chat/history/:userId` - Get chat history with a user
- `GET /api/Chat/conversations` - Get all conversations
- `PATCH /api/Chat/read/:senderId` - Mark messages as read
- `GET /api/Chat/unread-count` - Get unread message count

### **Admin Messaging**
- `POST /api/Admin/message/all-users` - Send message to all users
- `POST /api/Admin/message/selected-users` - Send message to selected users
- `POST /api/Admin/message/by-role` - Send message to users by role
- `GET /api/Admin/user-stats` - Get user statistics

### Payments
- `POST /api/Payment/upi` - Initiate UPI payment (Razorpay)

### Comments
- `/api/Comment` - CRUD for comments on any resource

### Feedback
- Included in booking feedback field (rating, comment)

### Notifications
- Push notifications via Firebase (FCM)
- Real-time chat notifications via Socket.io

## Socket.io Events

### Client to Server
- `join` - Join user room
- `send_message` - Send a message
- `typing` - Start typing indicator
- `stop_typing` - Stop typing indicator

### Server to Client
- `new_message` - Receive new message
- `user_typing` - User typing indicator

## Frontend Integration

To use the real-time chat:

```javascript
// Connect to Socket.io
const socket = io('http://localhost:5000');

// Join user room
socket.emit('join', userId);

// Listen for new messages
socket.on('new_message', (message) => {
  console.log('New message:', message);
});

// Send message
socket.emit('send_message', {
  receiverId: 'user123',
  message: 'Hello!',
  senderId: 'currentUserId'
});
```

## Development

### Adding New Endpoints
When adding new API endpoints, include JSDoc comments with `@swagger` tags to automatically generate documentation:

```javascript
/**
 * @swagger
 * /api/endpoint:
 *   get:
 *     summary: Endpoint description
 *     tags: [TagName]
 *     responses:
 *       200:
 *         description: Success response
 */
```

### Swagger Configuration
- **File**: `src/config/swagger.config.js`
- **Customization**: Modify schemas, tags, and server configurations
- **Auto-generation**: Documentation is automatically generated from JSDoc comments

## Contribution
Pull requests are welcome!

## License
MIT 
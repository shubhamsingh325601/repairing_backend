const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🏠 Home Appliance Repair App API',
      version: '1.0.0',
      description: 'A comprehensive API for home appliance repair services with real-time chat and admin features',
      contact: {
        name: 'API Support',
        email: 'support@repairapp.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: '🚀 Development server'
      },
      {
        url: 'https://api.repairapp.com',
        description: '🌐 Production server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'User ID' },
            userName: { type: 'string', description: 'Username' },
            email: { type: 'string', format: 'email', description: 'User email' },
            name: { type: 'string', description: 'Full name' },
            phone: { type: 'string', description: 'Phone number' },
            address: { type: 'string', description: 'User address' },
            role: { type: 'string', enum: ['user', 'agent', 'admin'], description: 'User role' },
            skills: { type: 'array', items: { type: 'string' }, description: 'Agent skills' },
            isAvailable: { type: 'boolean', description: 'Agent availability' },
            rating: { type: 'number', description: 'Agent rating' },
            fcmToken: { type: 'string', description: 'Firebase FCM token' }
          }
        },
        Booking: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Booking ID' },
            customer: { type: 'string', description: 'Customer ID' },
            agent: { type: 'string', description: 'Agent ID' },
            serviceType: { type: 'string', description: 'Type of service' },
            description: { type: 'string', description: 'Service description' },
            applianceType: { type: 'string', description: 'Type of appliance' },
            appointmentDate: { type: 'string', format: 'date-time', description: 'Appointment date' },
            preferredTime: { type: 'string', format: 'date-time', description: 'Preferred time' },
            status: { type: 'string', enum: ['pending', 'accepted', 'rejected', 'in-progress', 'completed', 'cancelled'], description: 'Booking status' },
            location: { type: 'string', description: 'Service location' },
            price: { type: 'number', description: 'Service price' },
            feedback: {
              type: 'object',
              properties: {
                rating: { type: 'number', minimum: 1, maximum: 5, description: 'Rating (1-5)' },
                comment: { type: 'string', description: 'Feedback comment' }
              }
            }
          }
        },
        Chat: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Message ID' },
            sender: { type: 'string', description: 'Sender ID' },
            receiver: { type: 'string', description: 'Receiver ID' },
            message: { type: 'string', description: 'Message content' },
            messageType: { type: 'string', enum: ['text', 'image', 'file'], description: 'Message type' },
            isRead: { type: 'boolean', description: 'Read status' },
            bookingId: { type: 'string', description: 'Associated booking ID' },
            createdAt: { type: 'string', format: 'date-time', description: 'Message timestamp' }
          }
        },
        Service: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Service ID' },
            name: { type: 'string', description: 'Service name' },
            description: { type: 'string', description: 'Service description' },
            category: { type: 'string', description: 'Service category' },
            basePrice: { type: 'number', description: 'Base price' },
            durationInMinutes: { type: 'number', description: 'Estimated duration' },
            imageUrl: { type: 'string', description: 'Service image URL' },
            isActive: { type: 'boolean', description: 'Service availability' }
          }
        }
      }
    },
    tags: [
      { name: '🔐 Authentication', description: 'User and agent authentication endpoints' },
      { name: '👥 Users', description: 'User management endpoints' },
      { name: '🔧 Agents', description: 'Agent management endpoints' },
      { name: '📅 Bookings', description: 'Booking management endpoints' },
      { name: '💬 Chat', description: 'Real-time chat endpoints' },
      { name: '🛠️ Services', description: 'Service catalog endpoints' },
      { name: '💳 Payments', description: 'Payment processing endpoints' },
      { name: '⚙️ Admin', description: 'Admin-only endpoints' },
      { name: '💭 Comments', description: 'Comment system endpoints' },
      { name: '📂 Categories', description: 'Category management endpoints' }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs;

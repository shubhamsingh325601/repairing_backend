const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger.config');
const { Auth, User, Category, Agent, Booking, Feedback, Payment, Comment, Chat, Admin } = require("./routes");
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Configure this based on your frontend URL
    methods: ["GET", "POST"]
  }
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Swagger Documentation with custom styling
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customCssUrl: '/public/swagger-custom.css',
  customSiteTitle: '🏠 Home Appliance Repair App API',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    docExpansion: 'none',
    filter: true,
    showRequestHeaders: true,
    showCommonExtensions: true,
    defaultModelsExpandDepth: 2,
    defaultModelExpandDepth: 2,
    displayRequestDuration: true,
    tryItOutEnabled: true
  },
  explorer: true
}));

// Global Route API
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Home Appliance Repair App API</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          margin: 0; 
          padding: 40px; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          min-height: 100vh;
        }
        .container { 
          max-width: 800px; 
          margin: 0 auto; 
          text-align: center;
        }
        h1 { 
          font-size: 3em; 
          margin-bottom: 20px; 
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        p { 
          font-size: 1.2em; 
          margin-bottom: 30px; 
          opacity: 0.9;
        }
        .btn { 
          display: inline-block; 
          background: rgba(255,255,255,0.2); 
          color: white; 
          padding: 15px 30px; 
          text-decoration: none; 
          border-radius: 25px; 
          font-weight: 600; 
          transition: all 0.3s ease;
          border: 2px solid rgba(255,255,255,0.3);
        }
        .btn:hover { 
          background: rgba(255,255,255,0.3); 
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }
        .features {
          margin-top: 40px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }
        .feature {
          background: rgba(255,255,255,0.1);
          padding: 20px;
          border-radius: 15px;
          backdrop-filter: blur(10px);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🏠 Home Appliance Repair App</h1>
        <p>A comprehensive backend API for home appliance repair services with real-time chat and admin features</p>
        <a href="/api-docs" class="btn">📚 View API Documentation</a>
        
        <div class="features">
          <div class="feature">
            <h3>🔐 Authentication</h3>
            <p>User & Agent registration/login</p>
          </div>
          <div class="feature">
            <h3>💬 Real-time Chat</h3>
            <p>Socket.io powered messaging</p>
          </div>
          <div class="feature">
            <h3>📅 Bookings</h3>
            <p>Service request management</p>
          </div>
          <div class="feature">
            <h3>💳 Payments</h3>
            <p>Razorpay UPI integration</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Routes
app.use("/api/Auth", Auth);
app.use("/api/User", User);
app.use("/api/Category", Category);
app.use("/api/Agent", Agent);
app.use("/api/Booking", Booking);
app.use("/api/Feedback", Feedback);
app.use("/api/Payment", Payment);
app.use("/api/Comment", Comment);
app.use("/api/Chat", Chat);
app.use("/api/Admin", Admin);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to their personal room
  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined room: user_${userId}`);
  });

  // Handle new message
  socket.on('send_message', (data) => {
    // Broadcast to receiver's room
    socket.to(`user_${data.receiverId}`).emit('new_message', {
      senderId: data.senderId,
      message: data.message,
      timestamp: new Date()
    });
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    socket.to(`user_${data.receiverId}`).emit('user_typing', {
      senderId: data.senderId,
      isTyping: true
    });
  });

  // Handle stop typing
  socket.on('stop_typing', (data) => {
    socket.to(`user_${data.receiverId}`).emit('user_typing', {
      senderId: data.senderId,
      isTyping: false
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available to other modules
app.set('io', io);

module.exports = { app, server };

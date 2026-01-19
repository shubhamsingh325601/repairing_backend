const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger.config');
const { Auth, Booking, Feedback, Payment, Chat, Admin, Agent, Category } = require("./routes");
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
// In app.js
const corsOptions = {
  origin: "*", // During development, allow all. In production, specify your frontend URL.
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Swagger Documentation with custom styling
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customSiteTitle: 'Home Appliance Repair App API',

  customCss: `
    /* Hide the bulb icon */
    .swagger-ui .topbar .topbar-wrapper .link img + svg,
    .swagger-ui .topbar .topbar-wrapper .btn.authorize {
      display: none !important;
    }

    .swagger-ui .topbar .topbar-wrapper {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: space-between !important;
    }

    /* Ensure topbar stays left aligned */
    .swagger-ui .topbar-wrapper {
      justify-content: flex-start !important;
    }
  `,

  swaggerOptions: {
    docExpansion: 'list',
    filter: true,
    displayRequestDuration: true
  }
}));



// Global Route API
// Global Route API
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Home Appliance Repair App API</title>
      <style>
        /* Force no scroll and blue/white gradient */
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          margin: 0; 
          padding: 20px; 
          background: linear-gradient(135deg, #002a48, #003d5b);
          color: white;
          height: 100vh;
          overflow: hidden; /* Hide scrollbar */
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container { 
          width: 95%;
          max-width: 1200px; 
          text-align: center;
        }
        h1 { 
          font-size: 2.5em; 
          margin-bottom: 10px; 
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        p.subtitle { 
          font-size: 1.1em; 
          margin-bottom: 25px; 
          opacity: 0.9;
        }
        .btn { 
          display: inline-block; 
          background: rgba(255,255,255,0.2); 
          color: white; 
          padding: 12px 25px; 
          text-decoration: none; 
          border-radius: 25px; 
          font-weight: 600; 
          transition: all 0.3s ease;
          margin-bottom: 30px;
        }
        .btn:hover { 
          background: #003d5b; 
          color: #fff;
          transform: translateY(-2px);
        }
        /* Layout for 4 cards in 1 row */
       .features {
          display: grid;
          grid-template-columns: repeat(4, 1fr); /* Force 4 columns in 1 row */
          gap: 20px;
          margin-top: 50px;
          width: 100%;
          justify-content: center;
        }
        .feature {
          background: rgba(255,255,255,0.08);
          padding: 25px 15px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .feature:hover {
          transform: scale(1.05);
          background: rgba(255,255,255,0.15);
        }
        h3 { margin-top: 0; font-size: 1.2em; }
        .feature p { font-size: 0.9em; margin-bottom: 0; opacity: 0.8; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1> Home Appliance Repair App</h1>
        <p class="subtitle">A comprehensive backend API for home appliance repair services with real-time chat and admin features</p>
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
app.use("/api/Booking", Booking);
app.use("/api/Feedback", Feedback);
app.use("/api/Payment", Payment);
app.use("/api/Chat", Chat);
app.use("/api/Admin", Admin);
app.use("/api/Agent", Agent);
app.use("/api/Category", Category);

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

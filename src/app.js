const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { Auth, User, Category,Agent, Booking, Feedback, Payment, Comment } = require("./routes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Global Route API
app.get('/', (req, res) => {
  res.send('Hello World!');
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

module.exports = app;

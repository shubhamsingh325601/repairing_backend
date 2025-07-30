require('dotenv').config();

module.exports = {
  port: process.env.PORT,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  connectionString: process.env.CONNECTION_STRING,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  senderEmail: process.env.SENDER_EMAIL,
  senderPass: process.env.SENDER_PASS,
};
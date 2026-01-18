require('dotenv').config();

module.exports = {
  port: process.env.PORT,
  apiUrl: process.env.API_URI,  
  serverType: process.env.SERVER_TYPE,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  connectionString: process.env.CONNECTION_STRING,
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
  senderEmail: process.env.SENDER_EMAIL,
  senderPass: process.env.SENDER_PASS,
};
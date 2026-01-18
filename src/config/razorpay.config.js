const Razorpay = require('razorpay');
const { razorpayKeyId, razorpayKeySecret } = require('./keys');

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});

module.exports = razorpay; 
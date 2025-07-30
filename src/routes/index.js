const Auth = require("./auth.route");
const User = require("./user.route");
const Category = require("./category.route");
const Booking = require("./booking.route");
const Feedback = require("./feedback.route");
const Agent = require("./agent.route");
const Payment = require("./payment.route");
const Comment = require('./comment.route');
// const Service = require("./service.route");

module.exports = {
    Auth,
    User,
    Category,
    Agent,
    Booking,
    Feedback,
    Payment,
    Comment
}
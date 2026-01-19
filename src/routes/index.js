const Auth = require("./auth.route");
const Booking = require("./booking.route");
const Feedback = require("./feedback.route");
const Payment = require("./payment.route");
const Chat = require('./chat.route');
const Admin = require('./admin.route');
const Agent = require('./agent.route');
const Category = require('./category.route');

module.exports = {
    Auth,
    Booking,
    Feedback,
    Payment,
    Chat,
    Admin,
    Agent,
    Category
}
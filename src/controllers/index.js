const Auth = require("./auth.controller");
const Booking = require("./booking.controller");
const Feedback = require("./feedback.controller");
const Service = require("./service.controller");
const Payment = require("./payment.controller");
const Category = require("./category.controller");
const User = require("./user.controller");
const Agent = require("./agent.controller");


module.exports = {
    User,
    Agent,
    Auth,
    Booking,
    Feedback,
    Service,
    Payment,
    Category
}
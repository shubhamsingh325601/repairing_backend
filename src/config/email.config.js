const nodemailer = require('nodemailer');
const Email = require('email-templates');
const { senderEmail, senderPass } = require('./keys');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: senderEmail, 
    pass: senderPass,
  },
});

const email = new Email({
        message: {
          from: senderEmail,
        },
        send: true,
        transport: transporter,
});


module.exports = {
  transporter,
  email
};

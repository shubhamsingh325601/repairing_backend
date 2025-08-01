const admin = require('firebase-admin');
// const serviceAccount = require('../config/firebase.config.js');

admin.initializeApp({
  // credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;

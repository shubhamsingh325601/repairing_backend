const { server } = require('./src/app');
const mongoose = require('mongoose');
const { connectionString } = require('./src/config/keys');

// Connect to MongoDB
mongoose.connect(connectionString)
  .then(() => {
    console.log('MongoDB Connected');
    
    // Start server
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

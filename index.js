const { server } = require('./src/app');
const mongoose = require('mongoose');
const { connectionString } = require('./src/config/keys');
const { seedAdmin } = require('./src/utils/seeder'); // Import the seeder

// Connect to MongoDB
mongoose.connect(connectionString)
  .then(async () => { // Make this async
    console.log('MongoDB Connected');
    
    // Check and seed admin if collection is empty
    await seedAdmin();
    
    // Start server
    const PORT = process.env.PORT || 5001;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
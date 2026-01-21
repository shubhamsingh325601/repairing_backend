const User = require('../models/user'); // Adjust path to your user model
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
  try {
    const count = await User.countDocuments();
    
    if (count === 0) {
      console.log('User collection is empty. Seeding admin...');
      
      const hashedPassword = await bcrypt.hash('Admin@123#$', 10);
      
      const adminData = {
        userName: 'superadmin',
        email: 'shubham.singh325601@gmail.com',
        name: 'System Administrator',
        password: hashedPassword,
        role: 'admin',
        isAvailable: true
      };

      await User.create(adminData);
      console.log('Admin record created successfully.');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

module.exports = { seedAdmin };
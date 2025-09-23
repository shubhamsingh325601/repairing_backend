const mongoose = require("mongoose");
const { app } = require("./src/app");
const keys = require("./src/config/keys");
const { Category, User } = require("./src/models");
const { seedCategories } = require("./src/constants/seedCategories");
const { agents } = require("./src/constants/seedAgents");

const port = keys.port;
const connectionString = keys.connectionString;

// DATABASE connection
mongoose
  .connect(connectionString)
  .then(async () => {
    console.log("MongoDB connected");
   
    const count = await Category.countDocuments();
    if (count !== seedCategories.length) {
      await Category.insertMany(seedCategories);
      console.log('Seed data inserted');
    } 
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
});

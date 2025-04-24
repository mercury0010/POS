require('dotenv').config();  // Make sure this line is at the top of your file

const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;
const clientOptions = { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  serverApi: { version: '1', strict: true, deprecationErrors: true }
};

const connectDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(uri, clientOptions);
    console.log("MongoDB connected successfully to the POS database");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;

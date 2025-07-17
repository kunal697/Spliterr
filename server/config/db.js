const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit process with failure
  }
}

module.exports = connectDB;

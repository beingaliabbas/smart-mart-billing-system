
const mongoose = require('mongoose');

// MongoDB Connection String
const MONGODB_URI = "mongodb://aliabbaszounr1:Aliabbas321@cluster1-shard-00-00.rpo2r.mongodb.net:27017,cluster1-shard-00-01.rpo2r.mongodb.net:27017,cluster1-shard-00-02.rpo2r.mongodb.net:27017/supermart?replicaSet=atlas-14bnbx-shard-0&ssl=true&authSource=admin";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

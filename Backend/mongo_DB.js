import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();


async function connectMongo() {
  try {
    console.log("connecting to MONGO_DB......");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

export default connectMongo;
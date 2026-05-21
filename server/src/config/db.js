import mongoose from "mongoose";
import { config } from "./env.js";

let cachedConnection = null;

export async function connectDB() {
  if (cachedConnection || mongoose.connection.readyState === 1) {
    return cachedConnection || mongoose.connection;
  }

  if (!config.mongoUri) {
    throw new Error("MONGODB_URI is missing. Add it in Vercel Project Settings > Environment Variables.");
  }

  cachedConnection = await mongoose.connect(config.mongoUri);
  console.log("MongoDB connected");
  return cachedConnection;
}

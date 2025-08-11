// lib/mongoose.ts
import mongoose from "mongoose";

// Define the mongoose cache type
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global object with proper typing
declare global {
  var _mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in your environment file");
}

async function dbConnect(): Promise<typeof mongoose> {
  // Return existing connection if available
  if (global._mongoose?.conn) {
    return global._mongoose.conn;
  }

  // Initialize the global mongoose cache if it doesn't exist
  if (!global._mongoose) {
    global._mongoose = {
      conn: null,
      promise: null,
    };
  }

  // Create a new connection promise if one doesn't exist
  if (!global._mongoose.promise) {
    const opts = {
      bufferCommands: false,
    };

    global._mongoose.promise = mongoose.connect(MONGODB_URI as string, opts);
  }

  try {
    // Wait for the connection and cache it
    global._mongoose.conn = await global._mongoose.promise;
    return global._mongoose.conn;
  } catch (error) {
    // Reset the promise on error so we can retry
    global._mongoose.promise = null;
    throw error;
  }
}

export default dbConnect;
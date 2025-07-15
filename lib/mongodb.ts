import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

interface MongooseGlobalCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Ensure global type is extended (for dev hot reload)
declare global {
  var mongoose: MongooseGlobalCache | undefined;
}

const cached: MongooseGlobalCache = global.mongoose ?? { conn: null, promise: null };

export async function connectToDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "next-todo-auth",
        bufferCommands: false,
      })
      .then((mongoose) => {
        console.log("connected successfully");
        return mongoose;
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;

  global.mongoose = cached;

  return cached.conn;
}

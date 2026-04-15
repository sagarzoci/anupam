import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "❌ MONGODB_URI is not set.\n" +
    "Add it to .env.local — see MONGODB_SETUP.md for instructions."
  );
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global._mongooseCache;
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI!, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 8000,  // Fail fast with a clear error
        socketTimeoutMS: 20000,
      })
      .catch((err) => {
        cached.promise = null; // Reset so next request retries
        const isLocalRefused =
          err?.message?.includes("ECONNREFUSED") ||
          err?.message?.includes("connect failed");

        if (isLocalRefused) {
          throw new Error(
            "❌ Cannot connect to MongoDB.\n\n" +
            "You are trying to use a local MongoDB (localhost:27017) but it is not running.\n\n" +
            "Fix: Use MongoDB Atlas (free cloud database) instead.\n" +
            "See MONGODB_SETUP.md in the project root for step-by-step instructions.\n\n" +
            "Quick fix — replace MONGODB_URI in .env.local with your Atlas URI:\n" +
            "MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/anupam-vidya-sadan"
          );
        }
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;

import mongoose from "mongoose";
import { seedAdmin } from "@/lib/seed";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .env"
    );
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            // Attempt to seed admin after successful connection
            // We don't await this to avoid blocking the connection return, 
            // but for safety in serverless, we might want to. 
            // For local dev, this works fine. 
            // In Vercel, this might run multiple times, but seed logic should be idempotent.
            console.log("DB Connected successfully");
            seedAdmin().catch(err => console.error("Admin Seeding Failed:", err));
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectDB;

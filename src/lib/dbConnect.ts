import mongoose from "mongoose";

type MongooseCache = {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

declare global {
    var mongooseCache: MongooseCache | undefined;
}

const cache = global.mongooseCache ?? {
    conn: null,
    promise: null,
};

global.mongooseCache = cache;

async function dbConnect(): Promise<typeof mongoose> {
    if (cache.conn && mongoose.connection.readyState === 1) {
        return cache.conn;
    }

    if (cache.conn && mongoose.connection.readyState === 0) {
        cache.conn = null;
        cache.promise = null;
    }

    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error("MONGODB_URI is not defined in the environment variables.");
    }

    if (!cache.promise) {
        cache.promise = mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000,
        }).catch((error: unknown) => {
            cache.promise = null;
            throw error;
        });
    }

    cache.conn = await cache.promise;
    console.log("DB Connected Successfully");
    return cache.conn;
}

export default dbConnect;
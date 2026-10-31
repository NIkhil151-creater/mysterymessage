import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        return;
    }

    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error("MONGODB_URI is not defined in the environment variables.");
    }

    try {
        const db = await mongoose.connect(mongoUri);
        connection.isConnected = db.connections[0].readyState;
        console.log("DB Connected Successfully");
    } catch (error) {
        console.log(`Database connection failed: ${error}`);
        throw error;
    }
}

export default dbConnect;
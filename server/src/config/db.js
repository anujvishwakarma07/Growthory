import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (req, res, next) => {
    if (mongoose.connection.readyState >= 1) {
        if (next) return next();
        return;
    }

    try {
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI is not defined in environment variables');
            if (res) return res.status(500).json({ error: 'MONGODB_URI is not defined' });
            return;
        }
        
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log(`MongoDB connected`);
        if (next) return next();
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        if (res) return res.status(500).json({ error: `DB connection error: ${error.message}` });
        if (!process.env.VERCEL) {
            process.exit(1);
        }
    }
};

export default connectDB;
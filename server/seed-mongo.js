import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Startup from './src/models/Startup.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const seed = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'founder@growthory.ai';
        const password = 'password123';
        
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                full_name: 'Startup Founder',
                email,
                password,
                role: 'founder',
                avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=founder'
            });
            console.log('User created:', email);
        } else {
            console.log('User already exists:', email);
            // Optionally reset password for testing
            user.password = password;
            await user.save();
        }

        let startup = await Startup.findOne({ founder_id: user._id });
        if (!startup) {
            startup = await Startup.create({
                founder_id: user._id,
                name: 'Growthory AI',
                tagline: 'Supercharging AI agents',
                description_raw: 'We build the best AI agents.',
                industry: 'Artificial Intelligence',
                stage: 'Seed',
                website: 'https://growthory.ai'
            });
            console.log('Startup created:', startup.name);
        }

        console.log('--- SEEDING SUCCESSFUL ---');
        console.log('Login Email:    ', email);
        console.log('Login Password: ', password);

        process.exit(0);
    } catch (err) {
        console.error('Error seeding:', err);
        process.exit(1);
    }
};

seed();

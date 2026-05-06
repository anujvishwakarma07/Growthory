import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const seedExtraUsers = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const users = [
            {
                email: 'investor@growthory.ai',
                password: 'password123',
                full_name: 'Venture Capitalist',
                role: 'investor'
            },
            {
                email: 'expert@growthory.ai',
                password: 'password123',
                full_name: 'Tech Expert',
                role: 'professional'
            }
        ];

        for (const userData of users) {
            let user = await User.findOne({ email: userData.email });
            if (!user) {
                await User.create(userData);
                console.log('User created:', userData.email);
            } else {
                console.log('User already exists:', userData.email);
            }
        }

        console.log('--- SEEDING EXTRA USERS SUCCESSFUL ---');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding extra users:', err);
        process.exit(1);
    }
};

seedExtraUsers();

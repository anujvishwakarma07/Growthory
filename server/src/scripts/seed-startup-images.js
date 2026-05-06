import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Startup from '../models/Startup.js';

dotenv.config();

const DEFAULT_IMAGES = [
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522071823991-b9671f9d7f1f?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2070&auto=format&fit=crop'
];

async function seedImages() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        const startups = await Startup.find({});

        console.log(`Updating ${startups.length} startups with high-fidelity visualization arrays.`);

        for (let i = 0; i < startups.length; i++) {
            const randomImages = [
                DEFAULT_IMAGES[i % DEFAULT_IMAGES.length],
                DEFAULT_IMAGES[(i + 1) % DEFAULT_IMAGES.length]
            ];
            
            // Set image_urls and clear old image_url
            startups[i].image_urls = randomImages;
            startups[i].image_url = undefined; // Remove legacy field
            
            await startups[i].save();
            console.log(`Updated ${startups[i].name} with ${randomImages.length} images.`);
        }

        console.log("Seeding complete.");
        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
}

seedImages();

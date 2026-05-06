import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Startup from '../models/Startup.js';
import User from '../models/User.js';

dotenv.config();

const PROFESSIONAL_STARTUPS = [
    {
        name: "Lumina AI",
        tagline: "Next-gen photonic computing for deep learning.",
        description: "Lumina is revolutionizing the AI hardware space by using light instead of electricity to perform matrix multiplications. Our silicon photonics platform reduces energy consumption by 90% while increasing processing speed by 10x for large language models.",
        industry: "Deep Tech / AI Hardware",
        stage: "Series A",
        website: "https://lumina-photonics.ai",
        image_urls: [
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2070&auto=format&fit=crop"
        ]
    },
    {
        name: "EcoVault",
        tagline: "Decentralized carbon credit verification.",
        description: "EcoVault uses satellite imagery and IoT sensors to provide real-time, tamper-proof verification of carbon sequestration projects. We connect forest conservancies directly with corporate offset buyers through a transparent blockchain-based marketplace.",
        industry: "ClimateTech / Web3",
        stage: "Seed",
        website: "https://ecovault.green",
        image_urls: [
            "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
        ]
    },
    {
        name: "Nexus Health",
        tagline: "AI-driven personalized oncology.",
        description: "Nexus Health is building the world's most comprehensive genomic database for rare cancers. Our AI engine predicts patient responses to experimental therapies, helping oncologists design personalized treatment protocols with 40% higher success rates.",
        industry: "HealthTech / Biotech",
        stage: "Series B",
        website: "https://nexus-health.io",
        image_urls: [
            "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=2080&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1579154238328-1c32b950a492?q=80&w=2070&auto=format&fit=crop"
        ]
    },
    {
        name: "AeroFlow",
        tagline: "Electric VTOL for urban logistics.",
        description: "AeroFlow is developing autonomous electric vertical take-off and landing vehicles specifically for middle-mile logistics. Our modular drone fleet can transport up to 500kg over 100km, bypassing urban congestion and reducing delivery times by 70%.",
        industry: "Mobility / Logistics",
        stage: "Early Stage",
        website: "https://aeroflow.com",
        image_urls: [
            "https://images.unsplash.com/photo-1506941433945-99a2aa4bd50a?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop"
        ]
    },
    {
        name: "FinPulse",
        tagline: "Hyper-personalized banking for the creator economy.",
        description: "FinPulse is the first neo-bank designed specifically for multi-platform creators. We offer automated tax withholding, multi-currency revenue tracking from 20+ sources (YouTube, Twitch, Patreon), and credit lines based on projected ad revenue.",
        industry: "Fintech",
        stage: "Seed",
        website: "https://finpulse.app",
        image_urls: [
            "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=2071&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070&auto=format&fit=crop"
        ]
    },
    {
        name: "Synthetix Labs",
        tagline: "Lab-grown sustainable leather.",
        description: "Synthetix Labs uses cellular agriculture to grow high-quality leather without animals or harmful chemicals. Our material is molecularly identical to cowhide but uses 95% less water and produces zero waste during the tanning process.",
        industry: "FashionTech / Sustainability",
        stage: "Pre-seed",
        website: "https://synthetix.labs",
        image_urls: [
            "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1974&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2099&auto=format&fit=crop"
        ]
    },
    {
        name: "QuantumShield",
        tagline: "Post-quantum encryption for financial networks.",
        description: "QuantumShield provides a hardware-agnostic software layer that protects enterprise data against future quantum computer attacks. Our lattice-based cryptography is already being piloted by three major European banks to secure cross-border settlements.",
        industry: "Cybersecurity",
        stage: "Series A",
        website: "https://quantumshield.tech",
        image_urls: [
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=2070&auto=format&fit=crop"
        ]
    },
    {
        name: "OrbitLease",
        tagline: "Shared infrastructure for small satellite constellations.",
        description: "OrbitLease is building a fleet of 'tugboat' satellites that provide propulsion, power, and high-bandwidth communication to small CubeSats. We lower the cost of space entry by 80% by allowing companies to lease infrastructure instead of building it.",
        industry: "SpaceTech",
        stage: "Seed",
        website: "https://orbitlease.space",
        image_urls: [
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072&auto=format&fit=crop"
        ]
    },
    {
        name: "Verge Robotics",
        tagline: "Collaborative robots for small-scale manufacturing.",
        description: "Verge is democratizing automation with ultra-affordable, easy-to-program cobots. Our 'vision-first' arms can be trained in minutes to perform repetitive tasks like sorting, packaging, and assembly, specifically designed for small workshops.",
        industry: "Robotics / Manufacturing",
        stage: "Pre-seed",
        website: "https://verge-robotics.com",
        image_urls: [
            "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop"
        ]
    },
    {
        name: "MindFlow",
        tagline: "Neural-feedback meditation for peak performance.",
        description: "MindFlow is a wearable EEG headband and app that gamifies focus. By providing real-time auditory feedback on your brainwave states, we help users achieve deeper meditative states faster and track their cognitive recovery over time.",
        industry: "Wellness / NeuroTech",
        stage: "Early Stage",
        website: "https://mindflow.io",
        image_urls: [
            "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?q=80&w=2069&auto=format&fit=crop"
        ]
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // Find a founder to assign these to (or create a system user)
        let founder = await User.findOne({ role: 'founder' });
        if (!founder) {
            founder = await User.create({
                full_name: "Growthory Genesis",
                email: "genesis@growthory.ai",
                password: "password123",
                role: "founder"
            });
        }

        console.log(`Clearing existing dummy data...`);
        // await Startup.deleteMany({}); // Uncomment if you want to clear old data

        for (const data of PROFESSIONAL_STARTUPS) {
            await Startup.create({
                ...data,
                founder_id: founder._id,
                description_raw: data.description
            });
            console.log(`Seeded: ${data.name}`);
        }

        console.log("Professional seeding complete.");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();

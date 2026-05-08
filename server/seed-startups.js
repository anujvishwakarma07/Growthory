import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Startup from './src/models/Startup.js';
import User from './src/models/User.js';
import StartupAnalysis from './src/models/StartupAnalysis.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const seedStartups = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check for founder or create one
        let founder = await User.findOne({ role: 'founder' });
        if (!founder) {
            founder = await User.create({
                full_name: 'Jane Doe',
                email: 'janedoe@growthory.ai',
                password: 'password123',
                role: 'founder'
            });
        }

        const startups = [
            {
                name: 'NeuroAI',
                industry: 'AI/ML',
                stage: 'Seed',
                description_raw: 'NeuroAI builds next-generation large language models for specialized medical use cases, reducing diagnosis time by 40%.',
                analysis: {
                    one_line_pitch: 'AI-powered diagnostics platform for hospitals.',
                    investor_appeal_score: 92
                }
            },
            {
                name: 'FinFlow',
                industry: 'Fintech',
                stage: 'Series A',
                description_raw: 'FinFlow is a B2B payment automation platform leveraging blockchain to settle cross-border payments instantly.',
                analysis: {
                    one_line_pitch: 'Instant B2B cross-border payments via blockchain.',
                    investor_appeal_score: 88
                }
            },
            {
                name: 'HealthSync',
                industry: 'Healthcare',
                stage: 'Pre-seed',
                description_raw: 'HealthSync connects wearable data directly with EMRs, providing real-time patient monitoring for chronic diseases.',
                analysis: {
                    one_line_pitch: 'Wearable-to-EMR integration for chronic patient monitoring.',
                    investor_appeal_score: 85
                }
            },
            {
                name: 'CloudScale',
                industry: 'SaaS',
                stage: 'Seed',
                description_raw: 'CloudScale provides automated infrastructure scaling for e-commerce platforms during high-traffic events.',
                analysis: {
                    one_line_pitch: 'Auto-scaling infrastructure for e-commerce.',
                    investor_appeal_score: 79
                }
            },
            {
                name: 'ChainBlock',
                industry: 'Web3',
                stage: 'Series B',
                description_raw: 'ChainBlock offers enterprise-grade smart contract auditing and deployment tools.',
                analysis: {
                    one_line_pitch: 'Enterprise smart contract tools.',
                    investor_appeal_score: 75
                }
            }
        ];

        for (const data of startups) {
            let startup = await Startup.findOne({ name: data.name });
            if (!startup) {
                startup = await Startup.create({
                    founder_id: founder._id,
                    name: data.name,
                    industry: data.industry,
                    stage: data.stage,
                    description_raw: data.description_raw
                });
                
                await StartupAnalysis.create({
                    startup_id: startup._id,
                    one_line_pitch: data.analysis.one_line_pitch,
                    investor_appeal_score: data.analysis.investor_appeal_score
                });

                console.log(`Created startup: ${data.name}`);
            } else {
                console.log(`Startup already exists: ${data.name}`);
            }
        }

        console.log('--- SEEDING STARTUPS SUCCESSFUL ---');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding startups:', err);
        process.exit(1);
    }
};

seedStartups();

import InvestorProfile from '../models/InvestorProfile.js';
import Startup from '../models/Startup.js';
import StartupAnalysis from '../models/StartupAnalysis.js';
import User from '../models/User.js';
import { generateEmbedding } from '../utils/ai.js';

// Update Investor Profile
export const updatePreferences = async (req, res) => {
    const { id } = req.params; // User ID
    const { ticket_size_min, ticket_size_max, industries, stages, bio } = req.body;

    try {
        const profile = await InvestorProfile.findOneAndUpdate(
            { user_id: id },
            {
                user_id: id,
                ticket_size_min,
                ticket_size_max,
                interested_industries: industries,
                interested_stages: stages,
                bio
            },
            { upsert: true, new: true }
        );

        res.json({ success: true, data: profile });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Matches for Investor
export const getInvestorMatches = async (req, res) => {
    const { id } = req.params;

    try {
        const investor = await InvestorProfile.findOne({ user_id: id });
        if (!investor) throw new Error("Investor profile not found");

        // Note: For now we're using a simple filter since vector search isn't set up yet
        const startups = await Startup.find({
            industry: { $in: investor.interested_industries || [] }
        }).limit(20).lean();

        const matches = await Promise.all(startups.map(async (s) => {
            const analysis = await StartupAnalysis.findOne({ startup_id: s._id }).lean();
            return {
                ...s,
                startup_analysis: analysis ? [analysis] : []
            };
        }));

        res.json({ matches });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export const getAllInvestors = async (req, res) => {
    try {
        const profiles = await InvestorProfile.find().populate('user_id', 'full_name avatar_url');
        
        const transformed = profiles.map(p => ({
            ...p.toObject(),
            users: p.user_id // Matching expected frontend format
        }));

        res.json(transformed);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

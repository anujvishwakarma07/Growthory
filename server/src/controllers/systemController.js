import Startup from '../models/Startup.js';
import InvestorProfile from '../models/InvestorProfile.js';
import ProfessionalProfile from '../models/ProfessionalProfile.js';

export const getSystemStats = async (req, res) => {
    try {
        const startupCount = await Startup.countDocuments();
        const investorCount = await InvestorProfile.countDocuments();
        const professionalCount = await ProfessionalProfile.countDocuments();

        const stats = {
            totalStartups: startupCount,
            totalInvestors: investorCount,
            totalProfessionals: professionalCount,
            totalVolume: "$124.5M",
            activeMatches: 450,
            globalNodes: 12,
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

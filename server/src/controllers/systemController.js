import Startup from '../models/Startup.js';
import InvestorProfile from '../models/InvestorProfile.js';
import ProfessionalProfile from '../models/ProfessionalProfile.js';
import StartupLike from '../models/StartupLike.js';
import Match from '../models/Match.js';
import User from '../models/User.js';

export const getSystemStats = async (req, res) => {
    const { timeframe } = req.query;
    console.log(`Fetching System Stats for ${timeframe || '1M'}...`);
    try {
        const startupCount = await Startup.countDocuments();
        const investorCount = await InvestorProfile.countDocuments();
        const professionalCount = await ProfessionalProfile.countDocuments();

        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const dailyLikes = await StartupLike.countDocuments({ createdAt: { $gte: yesterday } });
        const dailyMatches = await Match.countDocuments({ createdAt: { $gte: yesterday } });
        const totalMatches = await Match.countDocuments({ status: 'accepted' });
        const totalUsers = await User.countDocuments();

        // Calculate Industry Distribution
        const industryStats = await Startup.aggregate([
            { $group: { _id: "$industry", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const totalIndustryStartups = industryStats.reduce((acc, curr) => acc + curr.count, 0);
        const sectorMap = industryStats.map(stat => ({
            name: stat._id || 'General',
            val: startupCount > 0 ? Math.round((stat.count / startupCount) * 100) : 0,
            count: stat.count
        }));

        // Generate a activity trend based on timeframe
        const trendLength = timeframe === '1W' ? 7 : 12;
        const monthlyTrend = Array.from({ length: trendLength }, (_, i) => {
            const base = Math.floor(startupCount / (trendLength / 2)) || 15;
            const variance = Math.floor(Math.random() * 40);
            return Math.min(100, base + variance);
        });

        const stats = {
            totalStartups: startupCount,
            totalInvestors: investorCount,
            totalProfessionals: professionalCount,
            totalVolume: `$${(startupCount * 1.2 + investorCount * 5).toFixed(1)}M`, // Semi-realistic simulated volume
            activeMatches: totalMatches,
            signalsToday: dailyLikes + dailyMatches,
            globalNodes: totalUsers,
            sectorMap: sectorMap.length > 0 ? sectorMap : [
                { name: 'Artificial Intelligence', val: 40 },
                { name: 'Fintech', val: 30 },
                { name: 'SaaS', val: 20 },
                { name: 'Healthtech', val: 10 }
            ],
            monthlyTrend
        };

        res.json(stats);
    } catch (error) {
        console.error("System Stats Error:", error);
        res.status(500).json({ 
            error: error.message,
            totalStartups: 0,
            totalInvestors: 0,
            totalProfessionals: 0,
            totalVolume: "$0M",
            activeMatches: 0,
            signalsToday: 0,
            globalNodes: 0,
            sectorMap: [],
            monthlyTrend: [40, 60, 45, 70, 55, 90, 65, 80, 50, 85, 95, 75]
        });
    }
};

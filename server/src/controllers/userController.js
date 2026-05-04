import User from '../models/User.js';
import InvestorProfile from '../models/InvestorProfile.js';
import ProfessionalProfile from '../models/ProfessionalProfile.js';
import Startup from '../models/Startup.js';
import StartupAnalysis from '../models/StartupAnalysis.js';
import StartupLike from '../models/StartupLike.js';
import Match from '../models/Match.js';

// Get detailed user profile
export const getUserProfile = async (req, res) => {
    const { id } = req.params;
    const { currentUserId } = req.query;

    try {
        const user = await User.findById(id).lean();
        if (!user) return res.status(404).json({ error: "User not found" });

        // Fetch related profiles
        const investorProfile = await InvestorProfile.findOne({ user_id: id }).lean();
        const professionalProfile = await ProfessionalProfile.findOne({ user_id: id }).lean();
        
        // Fetch startups and their analysis
        const startups = await Startup.find({ founder_id: id }).lean();
        const startupsWithAnalysis = await Promise.all(startups.map(async (s) => {
            const analysis = await StartupAnalysis.find({ startup_id: s._id }).lean();
            return { ...s, startup_analysis: analysis };
        }));

        const result = {
            ...user,
            id: user._id,
            investor_profiles: investorProfile ? [investorProfile] : [],
            professional_profiles: professionalProfile ? [professionalProfile] : [],
            startups: startupsWithAnalysis
        };

        // Check connection status if requester ID is provided
        if (currentUserId) {
            const match = await Match.findOne({
                $or: [
                    { source_id: currentUserId, target_id: id },
                    { source_id: id, target_id: currentUserId }
                ]
            }).sort({ createdAt: -1 });

            result.connection_status = match ? match.status : null;
        }

        res.json(result);
    } catch (error) {
        console.error("Get User Profile Error:", error);
        res.status(404).json({ error: "User not found" });
    }
};

// Get user suggestions
export const getUserSuggestions = async (req, res) => {
    const { excludeId, limit = 5 } = req.query;
    try {
        const filter = {};
        if (excludeId) {
            filter._id = { $ne: excludeId };
        }

        const users = await User.find(filter)
            .select('full_name avatar_url role')
            .limit(parseInt(limit));

        const transformed = users.map(u => ({
            id: u._id,
            full_name: u.full_name,
            avatar_url: u.avatar_url,
            role: u.role
        }));

        res.json(transformed);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get who liked a startup
export const getStartupLikes = async (req, res) => {
    const { id } = req.params; // startup_id
    try {
        const likes = await StartupLike.find({ startup_id: id })
            .populate('user_id', 'full_name avatar_url role');

        const likedBy = likes.map(item => ({
            id: item.user_id._id,
            full_name: item.user_id.full_name,
            avatar_url: item.user_id.avatar_url,
            role: item.user_id.role
        }));

        res.json(likedBy);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
    const userId = req.user.id;
    const { full_name, bio, location, company, ai_prefs, eco_settings } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (full_name) user.full_name = full_name;
        if (bio !== undefined) user.bio = bio;
        if (location !== undefined) user.location = location;
        if (company !== undefined) user.company = company;
        if (ai_prefs) user.ai_prefs = { ...user.ai_prefs, ...ai_prefs };
        if (eco_settings) user.eco_settings = { ...user.eco_settings, ...eco_settings };

        await user.save();

        res.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                full_name: user.full_name,
                role: user.role,
                avatar_url: user.avatar_url,
                bio: user.bio,
                location: user.location,
                company: user.company,
                ai_prefs: user.ai_prefs,
                eco_settings: user.eco_settings
            }
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Change password
export const changePassword = async (req, res) => {
    const userId = req.user.id;
    const { newPassword } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.password = newPassword; // Pre-save hook will hash it
        await user.save();

        res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

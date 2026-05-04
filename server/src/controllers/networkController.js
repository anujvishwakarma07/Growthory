import User from '../models/User.js';
import Match from '../models/Match.js';
import InvestorProfile from '../models/InvestorProfile.js';
import ProfessionalProfile from '../models/ProfessionalProfile.js';
import Startup from '../models/Startup.js';

// Get all people in the network with filters
export const getExplorePeople = async (req, res) => {
    try {
        const { role, searchQuery, currentUserId } = req.query;

        const filter = {};
        if (role) filter.role = role;
        if (searchQuery) filter.full_name = { $regex: searchQuery, $options: 'i' };

        const users = await User.find(filter).limit(50).lean();

        // Fetch existing matches for the current user to show 'pending' or 'connected'
        let existingMatches = [];
        if (currentUserId) {
            existingMatches = await Match.find({
                $or: [{ source_id: currentUserId }, { target_id: currentUserId }]
            }).sort({ createdAt: -1 });
        }

        // Simplify data structure for frontend
        const people = await Promise.all(users.map(async (person) => {
            if (person._id.toString() === currentUserId) return null; // Don't show self

            let details = '';
            if (person.role === 'founder') {
                const startup = await Startup.findOne({ founder_id: person._id });
                if (startup) details = startup.name + ' • ' + startup.industry;
            } else if (person.role === 'investor') {
                const profile = await InvestorProfile.findOne({ user_id: person._id });
                details = profile?.bio || 'Investor';
            } else if (person.role === 'professional') {
                const profile = await ProfessionalProfile.findOne({ user_id: person._id });
                details = profile?.skills?.slice(0, 2).join(', ') || 'Professional';
            }

            const match = existingMatches.find(m => 
                m.source_id.toString() === person._id.toString() || 
                m.target_id.toString() === person._id.toString()
            );

            return {
                id: person._id,
                full_name: person.full_name,
                avatar_url: person.avatar_url,
                role: person.role,
                details,
                pending: match?.status === 'pending',
                connected: match?.status === 'accepted'
            };
        }));

        res.json(people.filter(Boolean));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Send a connection request
export const sendConnectionRequest = async (req, res) => {
    const { source_id, target_id, match_type: requestedType } = req.body;

    try {
        // Check for existing pending/accepted request
        const existing = await Match.findOne({
            $or: [
                { source_id, target_id },
                { source_id: target_id, target_id: source_id }
            ],
            status: { $in: ['pending', 'accepted'] }
        });

        if (existing) {
            return res.status(400).json({ 
                error: existing.status === 'pending' ? 'Connection request already pending' : 'Already connected' 
            });
        }

        // Fetch source and target roles to determine correct match_type if not provided
        const source = await User.findById(source_id);
        const target = await User.findById(target_id);

        let finalType = requestedType;
        if (!finalType || (finalType !== 'investor_startup' && finalType !== 'candidate_job')) {
            if ((source?.role === 'investor' && target?.role === 'founder') ||
                (source?.role === 'founder' && target?.role === 'investor')) {
                finalType = 'investor_startup';
            } else if ((source?.role === 'professional' && target?.role === 'founder') ||
                (source?.role === 'founder' && target?.role === 'professional')) {
                finalType = 'candidate_job';
            } else {
                finalType = 'investor_startup';
            }
        }

        const match = await Match.create({
            source_id,
            target_id,
            match_type: finalType,
            status: 'pending'
        });

        res.json({ success: true, data: match });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user's network connections
export const getMyNetwork = async (req, res) => {
    const { userId } = req.params;

    try {
        const matches = await Match.find({
            $or: [{ source_id: userId }, { target_id: userId }],
            status: 'accepted'
        });
        res.json(matches);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get pending connection requests (received by user)
export const getPendingRequests = async (req, res) => {
    const { userId } = req.params;

    try {
        const matches = await Match.find({
            target_id: userId,
            status: 'pending'
        }).sort({ createdAt: -1 }).populate('source_id', 'full_name avatar_url role');

        const requests = matches.map(match => ({
            id: match._id,
            from: {
                id: match.source_id._id,
                full_name: match.source_id.full_name,
                avatar_url: match.source_id.avatar_url,
                role: match.source_id.role
            },
            match_type: match.match_type,
            created_at: match.createdAt
        }));

        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Accept or reject a connection request
export const respondToRequest = async (req, res) => {
    const { matchId } = req.params;
    const { action } = req.body; // 'accept' or 'reject'

    try {
        const newStatus = action === 'accept' ? 'accepted' : 'rejected';
        const match = await Match.findByIdAndUpdate(matchId, { status: newStatus }, { new: true });
        res.json({ success: true, data: match });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

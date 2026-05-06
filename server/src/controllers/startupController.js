import Startup from '../models/Startup.js';
import StartupAnalysis from '../models/StartupAnalysis.js';
import StartupLike from '../models/StartupLike.js';
import StartupComment from '../models/StartupComment.js';
import { analyzeStartupPitch } from '../utils/ai.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const createStartup = async (req, res) => {
    try {
        const { founder_id, name, tagline, description, industry, stage, website } = req.body;

        let image_urls = [];
        if (req.files && req.files.length > 0) {
            try {
                const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer));
                const uploadResults = await Promise.all(uploadPromises);
                image_urls = uploadResults.map(res => res.secure_url);
            } catch (err) {
                console.error("Batch image upload failed:", err);
            }
        }

        const startup = await Startup.create({
            founder_id, 
            name, 
            tagline, 
            description_raw: description, 
            industry, 
            stage, 
            website,
            image_urls
        });

        const analysis = await analyzeStartupPitch(description, name, industry);

        const savedAnalysis = await StartupAnalysis.create({
            startup_id: startup._id,
            one_line_pitch: analysis.one_line_pitch,
            strengths: analysis.strengths,
            weaknesses: analysis.weaknesses,
            suggestions: analysis.suggestions,
            investor_appeal_score: analysis.investor_appeal_score,
        });

        res.status(201).json({ success: true, startup, analysis: savedAnalysis });
    } catch (error) {
        console.error("Create Startup Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getStartup = async (req, res) => {
    try {
        const startup = await Startup.findById(req.params.id);
        if (!startup) return res.status(404).json({ error: "Not found" });

        const analysis = await StartupAnalysis.find({ startup_id: startup._id });
        res.json({ ...startup.toObject(), startup_analysis: analysis });
    } catch (error) {
        res.status(404).json({ error: "Not found" });
    }
};

export const getAllStartups = async (req, res) => {
    try {
        const startups = await Startup.find()
            .populate('founder_id', 'full_name avatar_url')
            .sort({ createdAt: -1 });

        const result = await Promise.all(startups.map(async (s) => {
            const analysis = await StartupAnalysis.find({ startup_id: s._id });
            const likeCount = await StartupLike.countDocuments({ startup_id: s._id });
            const commentCount = await StartupComment.countDocuments({ startup_id: s._id });

            const obj = s.toObject();
            return {
                ...obj,
                founder_id: obj.founder_id?._id || obj.founder_id,
                founder: obj.founder_id,
                startup_analysis: analysis,
                like_count: likeCount,
                comment_count: commentCount,
            };
        }));

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const toggleLike = async (req, res) => {
    const { startup_id, user_id } = req.body;
    try {
        const existing = await StartupLike.findOne({ startup_id, user_id });
        if (existing) {
            await StartupLike.deleteOne({ _id: existing._id });
            return res.json({ liked: false });
        } else {
            await StartupLike.create({ startup_id, user_id });
            return res.json({ liked: true });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addComment = async (req, res) => {
    const { startup_id, user_id, content } = req.body;
    try {
        const comment = await StartupComment.create({ startup_id, user_id, content });
        const populated = await comment.populate('user_id', 'full_name avatar_url');
        res.json(populated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getComments = async (req, res) => {
    try {
        const comments = await StartupComment.find({ startup_id: req.params.id })
            .populate('user_id', 'full_name avatar_url')
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const updateStartup = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, tagline, description, industry, stage, website, existing_images } = req.body;
        
        const startup = await Startup.findById(id);
        if (!startup) return res.status(404).json({ error: "Startup not found" });

        // Authorization check
        if (startup.founder_id.toString() !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized to edit this startup" });
        }

        // Handle Images
        let final_image_urls = [];
        if (existing_images) {
            // existing_images might be a JSON string if sent via FormData
            final_image_urls = typeof existing_images === 'string' ? JSON.parse(existing_images) : existing_images;
        }

        if (req.files && req.files.length > 0) {
            try {
                const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer));
                const uploadResults = await Promise.all(uploadPromises);
                const new_urls = uploadResults.map(res => res.secure_url);
                final_image_urls = [...final_image_urls, ...new_urls];
            } catch (err) {
                console.error("Update image upload failed:", err);
            }
        }

        // Update fields
        if (name) startup.name = name;
        if (tagline) startup.tagline = tagline;
        if (description) startup.description_raw = description;
        if (industry) startup.industry = industry;
        if (stage) startup.stage = stage;
        if (website) startup.website = website;
        startup.image_urls = final_image_urls;

        await startup.save();

        // Optional: Re-run AI analysis if description changed
        if (description && description !== startup.description_raw) {
            try {
                const analysis = await analyzeStartupPitch(description, startup.name, startup.industry);
                await StartupAnalysis.findOneAndUpdate(
                    { startup_id: startup._id },
                    {
                        one_line_pitch: analysis.one_line_pitch,
                        strengths: analysis.strengths,
                        weaknesses: analysis.weaknesses,
                        suggestions: analysis.suggestions,
                        investor_appeal_score: analysis.investor_appeal_score,
                    },
                    { upsert: true }
                );
            } catch (err) {
                console.error("AI Analysis update failed:", err);
            }
        }

        res.json({ success: true, startup });
    } catch (error) {
        console.error("Update Startup Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteStartup = async (req, res) => {
    try {
        const { id } = req.params;
        const startup = await Startup.findById(id);
        if (!startup) return res.status(404).json({ error: "Startup not found" });

        if (startup.founder_id.toString() !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        await Startup.deleteOne({ _id: id });
        await StartupAnalysis.deleteMany({ startup_id: id });
        await StartupLike.deleteMany({ startup_id: id });
        await StartupComment.deleteMany({ startup_id: id });

        res.json({ success: true, message: "Startup deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

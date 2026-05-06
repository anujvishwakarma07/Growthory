import mongoose from 'mongoose';

const startupSchema = new mongoose.Schema({
    founder_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    tagline: { type: String },
    description_raw: { type: String },
    industry: { type: String },
    stage: { type: String },
    website: { type: String },
    logo_url: { type: String },
    image_urls: [{ type: String }],
    pitch_deck_url: { type: String },
}, { timestamps: true });

export default mongoose.model('Startup', startupSchema);

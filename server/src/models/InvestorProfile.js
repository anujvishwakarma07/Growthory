import mongoose from 'mongoose';

const investorProfileSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    ticket_size_min: { type: Number },
    ticket_size_max: { type: Number },
    interested_industries: [{ type: String }],
    interested_stages: [{ type: String }],
    bio: { type: String },
}, { timestamps: true });

export default mongoose.model('InvestorProfile', investorProfileSchema);

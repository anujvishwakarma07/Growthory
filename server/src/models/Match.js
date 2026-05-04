import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
    source_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    target_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    match_type: { type: String, enum: ['investor_startup', 'candidate_job'], required: true },
    score: { type: Number },
    reason: { type: String },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model('Match', matchSchema);

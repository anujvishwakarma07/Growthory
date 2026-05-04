import mongoose from 'mongoose';

const startupAnalysisSchema = new mongoose.Schema({
    startup_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', required: true },
    one_line_pitch: { type: String },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    suggestions: [{ type: String }],
    investor_appeal_score: { type: Number },
}, { timestamps: true });

export default mongoose.model('StartupAnalysis', startupAnalysisSchema);

import mongoose from 'mongoose';

const professionalProfileSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    resume_url: { type: String },
    skills: [{ type: String }],
    experience_years: { type: Number },
    parsed_resume_data: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

export default mongoose.model('ProfessionalProfile', professionalProfileSchema);

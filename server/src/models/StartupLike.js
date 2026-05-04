import mongoose from 'mongoose';

const startupLikeSchema = new mongoose.Schema({
    startup_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

startupLikeSchema.index({ startup_id: 1, user_id: 1 }, { unique: true });

export default mongoose.model('StartupLike', startupLikeSchema);

import mongoose, { mongo } from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
    },
    password : {
        type : String,
        required : true,
        select : false
    },
    full_name : {
        type : String,
        required : true,
    },
    role : {
        type : String,
        enum : ['founder', 'investor', 'professional'],
        default : 'founder'
    },
    avatar_url : {
        type : String,
        default : null
    },
    bio: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    company: {
        type: String,
        default: ''
    },
    linkedin_url: {
        type: String,
        default: ''
    },
    skills: {
        type: [String],
        default: []
    },
    experience_years: {
        type: Number,
        default: 0
    },
    ai_prefs: {
        aura: { type: String, default: 'tactical' },
        verbosity: { type: String, default: 'high' },
        precision: { type: Number, default: 85 }
    },
    eco_settings: {
        visibility: { type: String, default: 'public' },
        sharing: { type: Boolean, default: true },
        connectProtocol: { type: String, default: 'open' }
    }
}, {
    timestamps : true
});

userSchema.pre('save', async function () {
    if(!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await 
    bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
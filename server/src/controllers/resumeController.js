import ProfessionalProfile from '../models/ProfessionalProfile.js';
import { createRequire } from 'module';
import OpenAI from 'openai';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// Polyfill DOMMatrix for Node environments to prevent pdf-parse module loading error
if (typeof global.DOMMatrix === 'undefined') {
    global.DOMMatrix = class DOMMatrix {};
}

const require = createRequire(import.meta.url);

const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || "https://openrouter.ai/api/v1",
});

export const parseResume = async (req, res) => {
    try {
        if (!req.file) throw new Error("No file uploaded");

        // 1. Upload the file directly to Cloudinary from memory
        let cloudinaryUrl = null;
        try {
            const uploadResult = await uploadToCloudinary(req.file.buffer);
            cloudinaryUrl = uploadResult.secure_url;
        } catch (uploadError) {
            console.error("Cloudinary upload failed", uploadError);
        }

        // 2. Parse text from memory buffer using pdf-parse
        const pdf = require('pdf-parse');
        const pdfData = await pdf(req.file.buffer);
        const resumeText = pdfData.text;

        // 3. Leverage AI to extract structured info from resume text
        const systemPrompt = `You are an expert technical recruiter. Extract structured data from the resume text. Return JSON only.`;
        const userPrompt = `Resume Text:
    ${resumeText.substring(0, 3000)}... (truncated)

    Extract:
    - skills: Array of strings.
    - experience_years: Integer (total).
    - current_role: String.
    - summary: 2 sentence professional summary.
    `;

        const completion = await openai.chat.completions.create({
            model: "openai/gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" },
        });

        const parsedData = JSON.parse(completion.choices[0].message.content);

        const { id } = req.body; // User ID
        
        // 4. Update MongoDB profile
        const updateData = {
            user_id: id,
            skills: parsedData.skills,
            experience_years: parsedData.experience_years,
            parsed_resume_data: parsedData
        };
        if (cloudinaryUrl) {
            updateData.resume_url = cloudinaryUrl;
        }

        const profile = await ProfessionalProfile.findOneAndUpdate(
            { user_id: id },
            updateData,
            { upsert: true, new: true }
        );

        res.json({ success: true, data: parsedData, resume_url: cloudinaryUrl });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export const getAllProfessionals = async (req, res) => {
    try {
        const profiles = await ProfessionalProfile.find().populate('user_id', 'full_name avatar_url');
        
        const transformed = profiles.map(p => ({
            ...p.toObject(),
            users: p.user_id
        }));

        res.json(transformed);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

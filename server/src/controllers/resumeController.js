import ProfessionalProfile from '../models/ProfessionalProfile.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import fs from 'fs';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || "https://openrouter.ai/api/v1",
});

export const parseResume = async (req, res) => {
    try {
        if (!req.file) throw new Error("No file uploaded");

        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdf(dataBuffer);
        const resumeText = pdfData.text;

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
        
        // Cleanup file
        fs.unlinkSync(req.file.path);

        const profile = await ProfessionalProfile.findOneAndUpdate(
            { user_id: id },
            {
                user_id: id,
                skills: parsedData.skills,
                experience_years: parsedData.experience_years,
                parsed_resume_data: parsedData
            },
            { upsert: true, new: true }
        );

        res.json({ success: true, data: parsedData });

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

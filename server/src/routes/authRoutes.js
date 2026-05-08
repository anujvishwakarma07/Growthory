import express from 'express';
import { signup, login } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/me', protect, (req, res) => {
    res.json({
        id: req.user._id,
        email: req.user.email,
        full_name: req.user.full_name,
        role: req.user.role,
        avatar_url: req.user.avatar_url,
        banner_url: req.user.banner_url,
        bio: req.user.bio,
        location: req.user.location,
        company: req.user.company,
        skills: req.user.skills,
        experience_years: req.user.experience_years
    });
});

export default router;

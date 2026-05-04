import express from 'express';
import { getUserProfile, getUserSuggestions, updateUserProfile, changePassword } from '../controllers/userController.js';
import { protect as auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/suggestions', getUserSuggestions);
router.put('/update-profile', auth, updateUserProfile);
router.post('/change-password', auth, changePassword);
router.get('/:id', getUserProfile);

export default router;

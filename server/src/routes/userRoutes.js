import express from 'express';
import multer from 'multer';
import { getUserProfile, getUserSuggestions, updateUserProfile, changePassword } from '../controllers/userController.js';
import { protect as auth } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/suggestions', getUserSuggestions);
router.put('/update-profile', auth, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), updateUserProfile);
router.post('/change-password', auth, changePassword);
router.get('/:id', getUserProfile);

export default router;

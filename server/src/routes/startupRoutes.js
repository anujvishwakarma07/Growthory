import express from 'express';
import multer from 'multer';
import { createStartup, getStartup, getAllStartups, toggleLike, addComment, getComments, updateStartup, deleteStartup } from '../controllers/startupController.js';
import { getStartupLikes } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', protect, upload.array('images', 5), createStartup);
router.get('/', getAllStartups);
router.get('/:id', getStartup);
router.get('/:id/likes', getStartupLikes);
router.post('/toggle-like', protect, toggleLike);
router.post('/comment', protect, addComment);
router.get('/:id/comments', getComments);
router.put('/:id', protect, upload.array('images', 5), updateStartup);
router.delete('/:id', protect, deleteStartup);

export default router;

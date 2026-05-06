import express from 'express';
import multer from 'multer';
import { createStartup, getStartup, getAllStartups, toggleLike, addComment, getComments } from '../controllers/startupController.js';
import { getStartupLikes } from '../controllers/userController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.array('images', 5), createStartup);
router.get('/', getAllStartups);
router.get('/:id', getStartup);
router.get('/:id/likes', getStartupLikes);
router.post('/toggle-like', toggleLike);
router.post('/comment', addComment);
router.get('/:id/comments', getComments);

export default router;

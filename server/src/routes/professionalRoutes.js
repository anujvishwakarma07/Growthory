import express from 'express';
import multer from 'multer';
import { parseResume, getAllProfessionals } from '../controllers/resumeController.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

router.get('/', getAllProfessionals);

router.post('/upload-resume', upload.single('resume'), parseResume);

export default router;

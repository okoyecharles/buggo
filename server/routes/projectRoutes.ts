import express from 'express';
import protect from '../middleware/authMiddleware';
import { createProject } from './../controllers/projectController';

const router = express.Router();

router.post('/', protect, createProject);

export default router;
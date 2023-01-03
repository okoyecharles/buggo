import express from 'express';
import protect from '../middleware/authMiddleware';
import { getProjects, createProject } from './../controllers/projectController';

const router = express.Router();

router.get('/', protect, getProjects);
router.post('/', protect, createProject);

export default router;
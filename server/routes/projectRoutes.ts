import express from 'express';
import protect from '../middleware/authMiddleware';
import { getProjects, createProject, getProjectById } from './../controllers/projectController';

const router = express.Router();

router.get('/', protect, getProjects);
router.post('/', protect, createProject);
router.get('/:id', protect, getProjectById);

export default router;
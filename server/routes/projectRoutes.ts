import express from 'express';
import protect from '../middleware/authMiddleware';
import { getProjects, createProject, getProjectById, updateProject, deleteProject } from './../controllers/projectController';

const router = express.Router();

router.get('/', protect, getProjects);
router.post('/', protect, createProject);
router.get('/:id', protect, getProjectById);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

export default router;
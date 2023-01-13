import express from 'express';
import protect from '../middleware/authMiddleware';
import { getProjects, createProject, getProjectById, updateProject, deleteProject, createTicket, getProjectTeam } from './../controllers/projectController';

const router = express.Router();

router.get('/', protect, getProjects);
router.get('/:id', protect, getProjectById);
router.get('/:id/team', protect, getProjectTeam);

router.post('/', protect, createProject);
router.post('/:id/tickets', protect, createTicket);

router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

export default router;
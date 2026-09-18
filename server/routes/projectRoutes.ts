import express from 'express';
import protect from '../middleware/auth';
import { getProjects, createProject, getProjectById, updateProject, deleteProject, createTicket, inviteToProject, acceptInvite } from './../controllers/projectController';
import { validate } from '../middleware/validate';
import { createProjectSchema, inviteToProjectSchema, updateProjectSchema } from '../types/project';
import { createTicketSchema } from '../types/ticket';

const router = express.Router();

router.get('/', protect, getProjects);
router.get('/:id', protect, getProjectById);

router.post('/', protect, validate(createProjectSchema), createProject);
router.post('/:id/tickets', protect, validate(createTicketSchema), createTicket);

router.put('/:id', protect, validate(updateProjectSchema), updateProject);
router.put('/:id/invite', protect, validate(inviteToProjectSchema), inviteToProject);
router.put('/:id/accept-invite', protect, acceptInvite);

router.delete('/:id', protect, deleteProject);

export default router;

import { getTicketComment } from './../controllers/ticketController';
import express from "express";
import protect from '../middleware/auth';
import { createTicketComment, deleteTicket, getTicketById, getUserTickets, updateTicketById } from '../controllers/ticketController';
import { validate } from '../middleware/validate';
import { updateTicketSchema } from '../types/ticket';
import { createCommentSchema } from '../types/comment';

const router = express.Router();

router.get('/', protect, getUserTickets);
router.get('/:id', protect, getTicketById);
router.put('/:id', protect, validate(updateTicketSchema), updateTicketById);
router.delete('/:id', protect, deleteTicket);
router.post('/:id/comments', protect, validate(createCommentSchema), createTicketComment);
router.get('/:id/comments/:commentId', protect, getTicketComment);

export default router;

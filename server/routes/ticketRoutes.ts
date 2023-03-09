import { getTicketComment } from './../controllers/ticketController';
import express from "express";
import protect from '../middleware/authMiddleware';
import { createTicketComment, deleteTicket, getTicketById, getUserTickets, updateTicketById } from '../controllers/ticketController';

const router = express.Router();

router.get('/', protect, getUserTickets);
router.get('/:id', protect, getTicketById);
router.put('/:id', protect, updateTicketById);
router.delete('/:id', protect, deleteTicket);
router.post('/:id/comments', protect, createTicketComment);
router.get('/:id/comments/:commentId', protect, getTicketComment);

export default router;
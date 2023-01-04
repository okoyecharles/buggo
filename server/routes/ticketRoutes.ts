import express from "express";
import protect from '../middleware/authMiddleware';
import { createTicketComment, getUserTickets, updateTicketById } from '../controllers/ticketController';

const router = express.Router();

router.get('/', protect, getUserTickets);
router.put('/:id', protect, updateTicketById);
router.post('/:id/comments', protect, createTicketComment);

export default router;
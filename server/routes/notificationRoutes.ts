import express from "express";
import protect from '../middleware/auth';
import { deleteNotification, getNotifications, readNotificationById, readNotifications } from '../controllers/notificationController';

const router = express.Router();

router.get('/', protect, getNotifications);
router.patch('/read', protect, readNotifications);
router.patch('/:id/read', protect, readNotificationById);
router.delete('/:id', protect, deleteNotification);

export default router;

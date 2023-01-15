import { updateUser } from './../controllers/userController';
import express from 'express';
import { register, login, googleSignIn, deleteUser, getUsers } from '../controllers/userController';
import protect from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getUsers);
router.post('/signup', register);
router.post('/signin', login);
router.put('/:id', protect, updateUser);
router.delete('/:id', deleteUser);
router.post('/googleSignIn', googleSignIn);

export default router;

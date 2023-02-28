import { logout, updateUser, validateUser } from './../controllers/userController';
import express from 'express';
import { register, login, googleSignIn, deleteUser, getUsers } from '../controllers/userController';
import protect from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getUsers);
router.post('/validate', protect, validateUser);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);

router.post('/signup', register);
router.post('/signin', login);
router.post('/signout', logout);
router.post('/googleSignIn', googleSignIn);

export default router;

import express from 'express';
import { register, login, googleSignIn, deleteUser, getUsers } from '../controllers/userController';

const router = express.Router();

router.get('/', getUsers);
router.post('/signup', register);
router.post('/signin', login);
router.delete('/:id', deleteUser);
router.post('/googleSignIn', googleSignIn);

export default router;

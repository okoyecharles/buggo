import express from 'express';
import { register, login, googleSignIn, deleteUser } from '../controllers/userController';

const router = express.Router();

router.post('/signup', register);
router.post('/signin', login);
router.delete('/:id', deleteUser);
router.post('/googleSignIn', googleSignIn);

export default router;

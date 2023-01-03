import express from 'express';
import { register, login, googleSignIn } from '../controllers/userController';

const router = express.Router();

router.post('/signup', register);
router.post('/signin', login);
router.post('/googleSignIn', googleSignIn);

export default router;

import { logout, updateUser, validateUser } from './../controllers/userController';
import express from 'express';
import { register, login, deleteUser, getUsers } from '../controllers/userController';
import protect from '../middleware/auth';
import { validate } from '../middleware/validate';
import { loginSchema, registerSchema, updateUserSchema } from '../types/user';

const router = express.Router();

router.get('/', protect, getUsers);
router.post('/validate', protect, validateUser);
router.put('/:id', protect, validate(updateUserSchema), updateUser);
router.delete('/:id', protect, deleteUser);

router.post('/signup', validate(registerSchema), register);
router.post('/signin', validate(loginSchema), login);
router.post('/signout', logout);

export default router;

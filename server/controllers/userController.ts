import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { UserType } from '../models/userModel';
import { Request, Response } from 'express';

const secret = process.env.JWT_SECRET || '';
const tokenExpiration = process.env.NODE_ENV === 'development' ? '1d' : '1hr';

export const register = async (req: Request<never, never, UserType>, res: Response) => {
  const { name, image, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    };

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      image
    });

    res.status(200).json({ user, token: generateToken(user._id) });

  } catch (error) {
    res.status(500).json({ message: 'Something went wrong... Please try again' });
  }
};

export const login = async (req: Request<never, never, UserType>, res: Response) => {
  const { email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (!userExists) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userExists.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ user: userExists, token: generateToken(userExists._id) });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong... Please try again' });
  }
}

const generateToken = (id: any) => {
  const token = jwt.sign({ id }, secret, {
    expiresIn: tokenExpiration
  });
  return token;
}
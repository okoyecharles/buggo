import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { UserType } from '../models/userModel';
import { CookieOptions, Request, Response } from 'express';
import AuthorizedRequest from '../types/request';
import { pusher, pusherChannel } from '..';

const secret = process.env.JWT_SECRET!;
const tokenExpiration = process.env.NODE_ENV === 'development' ? '1d' : '7d';
const tokenName = "bug-tracker-token";
const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'none',
  secure: true,
};

/* 
 * @route   GET /users
 * @desc    Get all users
 * @access  Public
*/
export const getUsers = async (req: AuthorizedRequest<any>, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong... Please try again' });
  }
};

/*
 * @route   DELETE /users/:id
 * @desc    Delete a user
 * @access  Public
*/
export const deleteUser = async (req: AuthorizedRequest<any>, res: Response) => {
  try {
    const { id } = req.params;
    const socketId = req.headers['x-pusher-socket-id'];

    const userExists = await User.findById(id);

    if (!userExists)
      return res.status(404).json({ message: 'User not found' });

    if (!req.admin && req.user !== userExists._id.toString())
      return res.status(401).json({ message: 'Unauthorized Request' });

    await userExists.remove();
    await pusher.trigger(pusherChannel, 'delete-user', {
      userId: id,
    }, {
      socket_id: socketId as string
    });

    const users = await User.find();

    res.status(200).json({ users, message: 'User deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong... Please try again' });
  }
};

/*
 * @route   POST /users/signup
 * @desc    Register a new user
 * @access  Public
 */
export const register = async (
  req: Request<never, never, UserType>,
  res: Response
) => {
  const { name, image, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      image,
    });

    const token = generateToken(user._id.toString(), user.admin);
    res.status(200)
      .cookie(tokenName, token, cookieOptions)
      .json({ user, token });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong... Please try again' });
  }
};

/*
 * @route   POST /users/signin
 * @desc    Login a user
 * @access  Public
 */
export const login = async (
  req: Request<never, never, UserType>,
  res: Response
) => {
  const { email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (!userExists) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      userExists.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    };

    const token = generateToken(userExists._id.toString(), userExists.admin);
    res
      .status(200)
      .cookie(tokenName, token, cookieOptions)
      .json({ user: userExists, token });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong... Please try again' });
  }
};

/*
 * @route   POST /users/signout
  * @desc    Logout a user
  * @access  Public
  */

export const logout = async (req: Request, res: Response) => {
  res.clearCookie(
    tokenName,
    cookieOptions
  ).send({ message: 'Logged out successfully' });
};

/*
  * @route   POST /users/validate
  * @desc    Validate a user
  * @access  Public
*/
export const validateUser = async (req: Request, res: Response) => {
  const token = req.cookies[tokenName];

  if (!token)
    return res.status(401).json({ message: 'Unauthorized' });

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
    id: string;
    admin: boolean;
  };
  const user = await User.findById(decoded.id);
  if (!user)
    return res.status(401).json({ message: 'Unauthorized' });

  res.status(200).json({
    user, token
  });
};

/*
 * @route   PUT /users/:id
 * @desc    Update a user
 * @access  Public
  */
export const updateUser = async (
  req: AuthorizedRequest<UserType>,
  res: Response
) => {
  const { id } = req.params;
  const { name, image } = req.body;

  try {
    const userExists = await User.findById(id);

    if (!userExists)
      return res.status(404).json({ message: 'User not found' });

    if (req.user !== userExists._id.toString() && !req.admin)
      return res.status(401).json({ message: 'Unauthorized' });

    if (name) userExists.name = name;
    if (image) userExists.image = image;

    const updatedUser = await userExists.save();

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong... Please try again' });
  }
};

/*
 * @desc    Genrate a token based on user id
 */
const generateToken = (id: string, admin: boolean) => {
  const token = jwt.sign({ id, admin }, secret, {
    expiresIn: tokenExpiration,
  });
  return token;
};

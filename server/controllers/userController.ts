import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { CookieOptions, Response } from "express";
import { adminsRoom, getIO } from "../config/socket";
import { DefaultRequest, ProtectedRequest } from "../types/request";
import { LoginBody, RegisterBody, SearchUserQuery, UpdateUserBody } from "../types/user";
import { tokenName } from "../middleware/auth";
const secret = process.env.JWT_SECRET!;
const tokenExpirationInDays = process.env.NODE_ENV === "development" ? 1 : 7;
const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: tokenExpirationInDays * 24 * 60 * 60 * 1000,
};

/*
 * @route   GET /users/search/:query
 * @desc    Search for users
 * @access  Private
 */
export const searchUsers = async (
  req: ProtectedRequest<undefined, SearchUserQuery>,
  res: Response,
) => {
  const { query } = req.params;
  // Matched literally, so characters like "." or "(" can't build a regex
  const pattern = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  try {
    const users = await User.find({
      $or: [
        { name: { $regex: pattern, $options: "i" } },
        { email: { $regex: pattern, $options: "i" } },
      ],
    })
      .limit(15)
      .select("name email image");
    res.status(200).json({ users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong... Please try again" });
  }
};

/*
 * @route   GET /users
 * @desc    Get all users
 * @access  Private
 */
export const getUsers = async (req: ProtectedRequest, res: Response) => {
  try {
    if (!req.admin) return res.status(403).json({ message: "Unauthorized" });

    const users = await User.find().select("-password");
    res.status(200).json({ users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong... Please try again" });
  }
};

/*
 * @route   DELETE /users/:id
 * @desc    Delete a user
 * @access  Private
 */
export const deleteUser = async (
  req: ProtectedRequest<undefined, { id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const userExists = await User.findById(id);

    if (!userExists) return res.status(404).json({ message: "User not found" });

    if (
      req.admin !== true || // Must be admin
      req.user === userExists._id.toString() || // Cannot delete self
      userExists.admin // Cannot delete admin
    )
      return res.status(403).json({ message: "Unauthorized Request" });

    await userExists.remove();

    /*
     * The deleted account and every admin are told: the account to sign out,
     * the admins to drop it from their user list. Only the account's lines
     * are then dropped -- the packet is queued behind the event, so they
     * still hear why.
     */
    const io = getIO();
    io.to([`user:${id}`, adminsRoom]).emit("user:delete", {
      userId: id,
      byAdmin: true,
    });
    io.in(`user:${id}`).disconnectSockets();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong... Please try again" });
  }
};

/*
 * @route   PUT /users/:id
 * @desc    Update a user
 * @access  Private
 */
export const updateUser = async (
  req: ProtectedRequest<UpdateUserBody, { id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  const { name, image } = req.body;

  try {
    const userExists = await User.findById(id);

    if (!userExists) return res.status(404).json({ message: "User not found" });

    if (req.user !== userExists._id.toString() && !req.admin)
      return res.status(403).json({ message: "Unauthorized" });

    if (name) userExists.name = name;
    if (image) userExists.image = image;

    const updatedUser = await userExists.save();

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong... Please try again" });
  }
};

/*
 * @route   POST /users/validate
 * @desc    Validate a user
 * @access  Private
 */
export const validateUser = async (req: ProtectedRequest, res: Response) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(403).json({ message: "Unauthorized" });
    res.status(200).json({ user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong... Please try again" });
  }
};

/*
 * @route   POST /users/signup
 * @desc    Register a new user
 * @access  Public
 */
export const register = async (
  req: DefaultRequest<RegisterBody>,
  res: Response,
) => {
  const { name, image, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
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
    res.status(201).cookie(tokenName, token, cookieOptions).json({ user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong... Please try again" });
  }
};

/*
 * @route   POST /users/signin
 * @desc    Login a user
 * @access  Public
 */
export const login = async (req: DefaultRequest<LoginBody>, res: Response) => {
  const { email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (!userExists || !(await bcrypt.compare(password, userExists.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(userExists._id.toString(), userExists.admin);
    res
      .status(200)
      .cookie(tokenName, token, cookieOptions)
      .json({ user: userExists });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong... Please try again" });
  }
};

/*
 * @route   POST /users/signout
 * @desc    Logout a user
 * @access  Public
 */
export const logout = async (_req: DefaultRequest, res: Response) => {
  res
    .status(200)
    .clearCookie(tokenName, cookieOptions)
    .send({ message: "Logged out successfully" });
};

/*
 * @route   POST /users/socket-ticket
 * @desc    Mint a short lived credential for the socket handshake
 * @access  Private
 */
export const createSocketTicket = (req: ProtectedRequest, res: Response) => {
  // The socket connects straight to the api, bypassing the proxy, so the
  // cookie never reaches it -- this is the credential it carries instead.
  const ticket = jwt.sign({ id: req.user, typ: "socket" }, secret, {
    expiresIn: 120,
  });
  res.status(200).json({ ticket });
};

/*
 * @desc    Genrate a token based on user id
 */
const generateToken = (id: string, admin: boolean) => {
  const token = jwt.sign({ id, admin }, secret, {
    expiresIn: tokenExpirationInDays * 24 * 60 * 60,
  });
  return token;
};

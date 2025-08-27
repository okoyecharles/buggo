"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.validateUser = exports.logout = exports.login = exports.register = exports.deleteUser = exports.getUsers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const __1 = require("..");
const secret = process.env.JWT_SECRET;
const tokenExpiration = process.env.NODE_ENV === 'development' ? '1d' : '7d';
const tokenName = "bug-tracker-token";
const cookieOptions = {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
};
/*
 * @route   GET /users
 * @desc    Get all users
 * @access  Public
*/
const getUsers = async (req, res) => {
    try {
        const users = await userModel_1.default.find();
        res.status(200).json({ users });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: 'Something went wrong... Please try again' });
    }
};
exports.getUsers = getUsers;
/*
 * @route   DELETE /users/:id
 * @desc    Delete a user
 * @access  Public
*/
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const socketId = req.headers['x-pusher-socket-id'];
        const userExists = await userModel_1.default.findById(id);
        if (!userExists)
            return res.status(404).json({ message: 'User not found' });
        if (req.admin !== true || req.user === userExists._id.toString() || userExists.admin)
            return res.status(401).json({ message: 'Unauthorized Request' });
        await userExists.remove();
        await __1.pusher.trigger(__1.pusherChannel, 'delete-user', {
            userId: id,
        }, {
            socket_id: socketId
        });
        const users = await userModel_1.default.find();
        res.status(200).json({ users, message: 'User deleted successfully' });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: 'Something went wrong... Please try again' });
    }
};
exports.deleteUser = deleteUser;
/*
 * @route   POST /users/signup
 * @desc    Register a new user
 * @access  Public
 */
const register = async (req, res) => {
    const { name, image, email, password } = req.body;
    try {
        const userExists = await userModel_1.default.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcryptjs_1.default.genSalt(12);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const user = await userModel_1.default.create({
            name,
            email,
            password: hashedPassword,
            image,
        });
        const token = generateToken(user._id.toString(), user.admin);
        res.status(200)
            .cookie(tokenName, token, cookieOptions)
            .json({ user, token });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: 'Something went wrong... Please try again' });
    }
};
exports.register = register;
/*
 * @route   POST /users/signin
 * @desc    Login a user
 * @access  Public
 */
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userExists = await userModel_1.default.findOne({ email });
        if (!userExists) {
            return res.status(404).json({ message: 'User does not exist' });
        }
        const isPasswordCorrect = await bcryptjs_1.default.compare(password, userExists.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        ;
        const token = generateToken(userExists._id.toString(), userExists.admin);
        res
            .status(200)
            .cookie(tokenName, token, cookieOptions)
            .json({ user: userExists, token });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: 'Something went wrong... Please try again' });
    }
};
exports.login = login;
/*
 * @route   POST /users/signout
  * @desc    Logout a user
  * @access  Public
  */
const logout = async (req, res) => {
    res.clearCookie(tokenName, cookieOptions).send({ message: 'Logged out successfully' });
};
exports.logout = logout;
/*
  * @route   POST /users/validate
  * @desc    Validate a user
  * @access  Public
*/
const validateUser = async (req, res) => {
    const token = req.cookies[tokenName];
    if (!token)
        return res.status(401).json({ message: 'Unauthorized' });
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    const user = await userModel_1.default.findById(decoded.id);
    if (!user)
        return res.status(401).json({ message: 'Unauthorized' });
    res.status(200).json({
        user, token
    });
};
exports.validateUser = validateUser;
/*
 * @route   PUT /users/:id
 * @desc    Update a user
 * @access  Public
  */
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, image } = req.body;
    try {
        const userExists = await userModel_1.default.findById(id);
        if (!userExists)
            return res.status(404).json({ message: 'User not found' });
        if (req.user !== userExists._id.toString() && !req.admin)
            return res.status(401).json({ message: 'Unauthorized' });
        if (name)
            userExists.name = name;
        if (image)
            userExists.image = image;
        const updatedUser = await userExists.save();
        res.status(200).json({ user: updatedUser });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: 'Something went wrong... Please try again' });
    }
};
exports.updateUser = updateUser;
/*
 * @desc    Genrate a token based on user id
 */
const generateToken = (id, admin) => {
    const token = jsonwebtoken_1.default.sign({ id, admin }, secret, {
        expiresIn: tokenExpiration,
    });
    return token;
};

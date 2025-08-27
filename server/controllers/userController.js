"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.updateUser = exports.validateUser = exports.logout = exports.login = exports.register = exports.deleteUser = exports.getUsers = void 0;
var bcryptjs_1 = require("bcryptjs");
var jsonwebtoken_1 = require("jsonwebtoken");
var userModel_1 = require("../models/userModel");
var __1 = require("..");
var secret = process.env.JWT_SECRET;
var tokenExpiration = process.env.NODE_ENV === 'development' ? '1d' : '7d';
var tokenName = "bug-tracker-token";
var cookieOptions = {
    httpOnly: true,
    sameSite: 'none',
    secure: true
};
/*
 * @route   GET /users
 * @desc    Get all users
 * @access  Public
*/
var getUsers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userModel_1["default"].find()];
            case 1:
                users = _a.sent();
                res.status(200).json({ users: users });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res
                    .status(500)
                    .json({ message: 'Something went wrong... Please try again' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUsers = getUsers;
/*
 * @route   DELETE /users/:id
 * @desc    Delete a user
 * @access  Public
*/
var deleteUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, socketId, userExists, users, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                id = req.params.id;
                socketId = req.headers['x-pusher-socket-id'];
                return [4 /*yield*/, userModel_1["default"].findById(id)];
            case 1:
                userExists = _a.sent();
                if (!userExists)
                    return [2 /*return*/, res.status(404).json({ message: 'User not found' })];
                if (req.admin !== true || req.user === userExists._id.toString() || userExists.admin)
                    return [2 /*return*/, res.status(401).json({ message: 'Unauthorized Request' })];
                return [4 /*yield*/, userExists.remove()];
            case 2:
                _a.sent();
                return [4 /*yield*/, __1.pusher.trigger(__1.pusherChannel, 'delete-user', {
                        userId: id
                    }, {
                        socket_id: socketId
                    })];
            case 3:
                _a.sent();
                return [4 /*yield*/, userModel_1["default"].find()];
            case 4:
                users = _a.sent();
                res.status(200).json({ users: users, message: 'User deleted successfully' });
                return [3 /*break*/, 6];
            case 5:
                error_2 = _a.sent();
                res
                    .status(500)
                    .json({ message: 'Something went wrong... Please try again' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.deleteUser = deleteUser;
/*
 * @route   POST /users/signup
 * @desc    Register a new user
 * @access  Public
 */
var register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, image, email, password, userExists, salt, hashedPassword, user, token, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, image = _a.image, email = _a.email, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                return [4 /*yield*/, userModel_1["default"].findOne({ email: email })];
            case 2:
                userExists = _b.sent();
                if (userExists) {
                    return [2 /*return*/, res.status(400).json({ message: 'User already exists' })];
                }
                return [4 /*yield*/, bcryptjs_1["default"].genSalt(12)];
            case 3:
                salt = _b.sent();
                return [4 /*yield*/, bcryptjs_1["default"].hash(password, salt)];
            case 4:
                hashedPassword = _b.sent();
                return [4 /*yield*/, userModel_1["default"].create({
                        name: name,
                        email: email,
                        password: hashedPassword,
                        image: image
                    })];
            case 5:
                user = _b.sent();
                token = generateToken(user._id.toString(), user.admin);
                res.status(200)
                    .cookie(tokenName, token, cookieOptions)
                    .json({ user: user, token: token });
                return [3 /*break*/, 7];
            case 6:
                error_3 = _b.sent();
                res
                    .status(500)
                    .json({ message: 'Something went wrong... Please try again' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.register = register;
/*
 * @route   POST /users/signin
 * @desc    Login a user
 * @access  Public
 */
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, userExists, isPasswordCorrect, token, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, userModel_1["default"].findOne({ email: email })];
            case 2:
                userExists = _b.sent();
                if (!userExists) {
                    return [2 /*return*/, res.status(404).json({ message: 'User does not exist' })];
                }
                return [4 /*yield*/, bcryptjs_1["default"].compare(password, userExists.password)];
            case 3:
                isPasswordCorrect = _b.sent();
                if (!isPasswordCorrect) {
                    return [2 /*return*/, res.status(400).json({ message: 'Invalid credentials' })];
                }
                ;
                token = generateToken(userExists._id.toString(), userExists.admin);
                res
                    .status(200)
                    .cookie(tokenName, token, cookieOptions)
                    .json({ user: userExists, token: token });
                return [3 /*break*/, 5];
            case 4:
                error_4 = _b.sent();
                res
                    .status(500)
                    .json({ message: 'Something went wrong... Please try again' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
/*
 * @route   POST /users/signout
  * @desc    Logout a user
  * @access  Public
  */
var logout = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.clearCookie(tokenName, cookieOptions).send({ message: 'Logged out successfully' });
        return [2 /*return*/];
    });
}); };
exports.logout = logout;
/*
  * @route   POST /users/validate
  * @desc    Validate a user
  * @access  Public
*/
var validateUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, decoded, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = req.cookies[tokenName];
                if (!token)
                    return [2 /*return*/, res.status(401).json({ message: 'Unauthorized' })];
                decoded = jsonwebtoken_1["default"].verify(token, process.env.JWT_SECRET);
                return [4 /*yield*/, userModel_1["default"].findById(decoded.id)];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, res.status(401).json({ message: 'Unauthorized' })];
                res.status(200).json({
                    user: user,
                    token: token
                });
                return [2 /*return*/];
        }
    });
}); };
exports.validateUser = validateUser;
/*
 * @route   PUT /users/:id
 * @desc    Update a user
 * @access  Public
  */
var updateUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, name, image, userExists, updatedUser, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                _a = req.body, name = _a.name, image = _a.image;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, userModel_1["default"].findById(id)];
            case 2:
                userExists = _b.sent();
                if (!userExists)
                    return [2 /*return*/, res.status(404).json({ message: 'User not found' })];
                if (req.user !== userExists._id.toString() && !req.admin)
                    return [2 /*return*/, res.status(401).json({ message: 'Unauthorized' })];
                if (name)
                    userExists.name = name;
                if (image)
                    userExists.image = image;
                return [4 /*yield*/, userExists.save()];
            case 3:
                updatedUser = _b.sent();
                res.status(200).json({ user: updatedUser });
                return [3 /*break*/, 5];
            case 4:
                error_5 = _b.sent();
                res
                    .status(500)
                    .json({ message: 'Something went wrong... Please try again' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateUser = updateUser;
/*
 * @desc    Genrate a token based on user id
 */
var generateToken = function (id, admin) {
    var token = jsonwebtoken_1["default"].sign({ id: id, admin: admin }, secret, {
        expiresIn: tokenExpiration
    });
    return token;
};

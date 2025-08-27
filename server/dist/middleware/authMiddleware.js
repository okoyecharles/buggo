"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET || '';
const tokenName = "bug-tracker-token";
const protect = async (req, res, next) => {
    // If system doesn't support cookies, use authorization header
    const cookieToken = req.cookies[tokenName];
    const requestToken = cookieToken || req.headers.authorization?.split(' ')[1];
    if (requestToken) {
        try {
            const decoded = jsonwebtoken_1.default.verify(requestToken, secret);
            req.user = decoded.id;
            req.admin = decoded.admin;
            next();
        }
        catch (err) {
            res.clearCookie(tokenName);
            return res.status(400).json({ message: 'Not authorized' });
        }
    }
    else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};
exports.default = protect;

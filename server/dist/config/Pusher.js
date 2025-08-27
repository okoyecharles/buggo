"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pusher_1 = __importDefault(require("pusher"));
const connectToPusher = () => {
    // Add pusher for real time updates
    return new pusher_1.default({
        appId: process.env.PUSHER_APP_ID,
        key: process.env.PUSHER_APP_KEY,
        secret: process.env.PUSHER_APP_SECRET,
        cluster: "eu",
        useTLS: true
    });
};
exports.default = connectToPusher;

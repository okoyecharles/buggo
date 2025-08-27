"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    text: { type: String, required: true },
    author: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    ticket: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Ticket', required: true }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('Comment', commentSchema);

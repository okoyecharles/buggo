"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const projectModel_1 = __importDefault(require("./projectModel"));
const ticketModel_1 = __importDefault(require("./ticketModel"));
const commentModel_1 = __importDefault(require("./commentModel"));
const UserSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, min: 2, max: 50 },
    image: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, min: 6 },
    googleId: { type: String, required: false },
    admin: { type: Boolean, default: false },
}, {
    timestamps: true,
});
// Delete associated projects and tickets when user is removed from db
UserSchema.pre('remove', { document: true }, async function (next) {
    const user = this;
    await projectModel_1.default.deleteMany({ author: user._id });
    await ticketModel_1.default.deleteMany({ author: user._id });
    await commentModel_1.default.deleteMany({ author: user._id });
    next();
});
exports.default = mongoose_1.default.model('User', UserSchema);

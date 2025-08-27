"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const commentModel_1 = __importDefault(require("./commentModel"));
// Status: New | Open | In Progress | Resolved | Closed
// Priority: Immediate | High | Medium | Low
// Type: Issue | Bug | Error | Feature Request | Other
const ticketSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, required: true },
    priority: { type: String, required: true },
    type: { type: String, required: true },
    time_estimate: { type: Number, required: true },
    project: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    team: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Comment' }],
}, {
    timestamps: true,
});
// Delete associated comments when ticket is removed from db
ticketSchema.pre('remove', { document: true }, async function (next) {
    const ticket = this;
    await commentModel_1.default.deleteMany({ ticket: ticket._id });
    next();
});
exports.default = mongoose_1.default.model('Ticket', ticketSchema);

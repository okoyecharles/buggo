"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ticketModel_1 = __importDefault(require("./ticketModel"));
const projectSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    team: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    invitees: [{
            user: { type: mongoose_1.default.Schema.Types.ObjectId, required: true, ref: 'User', },
            email: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        }],
    tickets: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Ticket' }],
}, {
    timestamps: true,
});
// Delete associated tickets when project is removed from db
projectSchema.pre('remove', { document: true }, async function (next) {
    const project = this;
    const tickets = await ticketModel_1.default.find({ project: project._id });
    tickets.forEach(async (ticket) => {
        await ticket.remove();
    });
    next();
});
// Make sure invitees and team are unique
projectSchema.pre('save', { document: true }, async function (next) {
    const project = this;
    const invitees = project.invitees;
    const uniqueInvitees = invitees.filter((invitee, index) => index === invitees.findIndex((t) => t.user.toString() === invitee.user.toString()));
    const team = project.team;
    const uniqueTeam = team.filter((member, index) => index === team.findIndex((t) => t.toString() === member.toString()));
    project.invitees = uniqueInvitees;
    project.team = uniqueTeam;
    next();
});
exports.default = mongoose_1.default.model('Project', projectSchema);

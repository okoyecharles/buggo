"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTicketComment = exports.createTicketComment = exports.deleteTicket = exports.updateTicketById = exports.getTicketById = exports.getUserTickets = void 0;
const ticketModel_1 = __importDefault(require("../models/ticketModel"));
const projectModel_1 = __importDefault(require("../models/projectModel"));
const commentModel_1 = __importDefault(require("../models/commentModel"));
const __1 = require("..");
const fetchTicket = async (id) => {
    const ticket = ticketModel_1.default.findById(id)
        .populate('author', 'name')
        .populate({
        path: 'comments',
        populate: {
            path: 'author',
            select: 'name image email'
        }
    })
        .populate('team', 'name image email');
    return ticket;
};
/*
* @route    GET /tickets
* @desc     Get all tickets created by a specific user
* @access   Private
*/
const getUserTickets = async (req, res) => {
    try {
        const tickets = await ticketModel_1.default.find({ author: req.user }).populate('project', 'title');
        res.status(200).json({ tickets });
    }
    catch (error) {
        res.status(200).json({ message: error.message });
    }
};
exports.getUserTickets = getUserTickets;
/*
* @route    GET /tickets/:id
* @desc     Get a ticket by id
* @access   Private
*/
const getTicketById = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await fetchTicket(id);
        res.status(200).json({ ticket });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.getTicketById = getTicketById;
/*
* @route    PUT /tickets/:id
* @desc     Update a ticket by id
* @access   Private
*/
const updateTicketById = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, priority, status, type, time_estimate, team, comments } = req.body;
        const socketId = req.headers['x-pusher-socket-id'];
        const ticket = await ticketModel_1.default.findById(id);
        const project = await projectModel_1.default.findById(ticket?.project);
        const projectTeam = project.team.map((member) => member.toString());
        if (!ticket)
            return res.status(404).json({ message: 'Ticket not found' });
        if (!req.admin &&
            ticket.author.toString() !== req.user &&
            project?.author.toString() !== req.user &&
            !projectTeam.includes(req.user))
            return res.status(401).json({ message: 'User not authorized' });
        await ticketModel_1.default.updateOne({ _id: id }, {
            title,
            description,
            priority,
            status,
            type,
            time_estimate,
            team,
            comments
        });
        await __1.pusher.trigger(__1.pusherChannel, 'update-project-ticket', {
            ticket: {
                _id: id,
                author: ticket?.author._id.toString(),
            },
        }, {
            socket_id: socketId
        });
        const updatedTicket = await fetchTicket(id);
        res.status(200).json({ ticket: updatedTicket });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateTicketById = updateTicketById;
/*
* @route    DELETE /tickets/:id
* @desc     Delete a ticket
* @access   Private
*/
const deleteTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const socketId = req.headers['x-pusher-socket-id'];
        const ticket = await ticketModel_1.default.findById(id);
        const project = await projectModel_1.default.findById(ticket?.project);
        if (!ticket)
            return res.status(404).json({ message: 'Ticket not found' });
        if (!project)
            return res.status(404).json({ message: 'Project not found' });
        if (!req.admin &&
            ticket?.author.toString() !== req.user &&
            project?.author.toString() !== req.user) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        await ticket.remove();
        await __1.pusher.trigger(__1.pusherChannel, 'delete-project-ticket', {
            ticket: {
                _id: id,
                author: ticket.author._id.toString(),
            },
        }, {
            socket_id: socketId
        });
        // Remove ticket reference from the project without using pull
        project.tickets = project.tickets.filter((ticketId) => ticketId.toString() !== id);
        await project?.save();
        res.status(200).json({ message: 'Ticket removed' });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.deleteTicket = deleteTicket;
/*
* @route    POST /tickets/:id/comments
* @desc     Comment on a ticket
* @access   Private
*/
const createTicketComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const author = req.user;
        const ticket = await ticketModel_1.default.findById(id).populate('project', 'author');
        const project = ticket?.project;
        const socketId = req.headers['x-pusher-socket-id'];
        if (!ticket)
            return res.status(404).json({ message: 'Comment\'s ticket not found' });
        if (!req.admin &&
            ticket?.author.toString() !== req.user &&
            project?.author.toString() !== req.user &&
            !ticket?.team.some((member) => member.toString() === req.user))
            return res.status(401).json({ message: 'User not authorized' });
        const comment = await commentModel_1.default.create({
            text,
            author: author,
            ticket: ticket?._id
        });
        await __1.pusher.trigger(__1.pusherChannel, 'new-ticket-comment', {
            ticketId: id,
            comment: {
                _id: comment?._id.toString(),
                author: comment?.author.toString(),
            }
        }, {
            socket_id: socketId
        });
        // Add comment reference to the ticket
        ticket?.comments.push(comment.id);
        await ticket?.save();
        const savedComment = await commentModel_1.default.findById(comment.id)
            .populate('author', 'name image email');
        res.status(200).json({ comment: savedComment });
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};
exports.createTicketComment = createTicketComment;
/*
  * @route    GET /tickets/:id/comments/:commentId
  * @desc     Get a comment
  * @access   Private
*/
const getTicketComment = async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const comment = await commentModel_1.default.findById(commentId)
            .populate('author', 'name image email');
        if (comment?.ticket.toString() !== id)
            return res.status(404).json({ message: 'Comment not found' });
        res.status(200).json({ comment });
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};
exports.getTicketComment = getTicketComment;

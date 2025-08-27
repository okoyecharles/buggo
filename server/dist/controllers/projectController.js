"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTicket = exports.deleteProject = exports.acceptInvite = exports.inviteToProject = exports.updateProject = exports.createProject = exports.getProjectById = exports.getProjects = void 0;
const ticketModel_1 = __importDefault(require("../models/ticketModel"));
const projectModel_1 = __importDefault(require("./../models/projectModel"));
const __1 = require("..");
const fetchProject = async (id) => {
    const project = await projectModel_1.default.findById(id)
        .populate('author', 'name')
        .populate('team', 'name image email')
        .populate({
        path: 'tickets',
        populate: {
            path: 'team',
            select: 'name image email',
        },
    })
        .populate('invitees.user', 'name image email');
    return project;
};
/*
 * @route   GET /projects
 * @desc    Get all projects
 * @access  Private
 */
const getProjects = async (req, res) => {
    try {
        const projects = await projectModel_1.default.find()
            .populate('author', 'name')
            .populate('team', 'name email image')
            .populate('invitees.user', 'name image email')
            .sort({ createdAt: -1 });
        res.status(200).json({ projects });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.getProjects = getProjects;
/*
 * @route   GET /projects/:id
 * @desc    Get a project by id
 * @access  Private
 */
const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await fetchProject(id);
        res.status(200).json({ project });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.getProjectById = getProjectById;
/*
 * @route   POST /projects
 * @desc    Create a new project
 * @access  Private
 */
const createProject = async (req, res) => {
    try {
        const { title } = req.body;
        const socketId = req.headers['x-pusher-socket-id'];
        const project = new projectModel_1.default({
            title,
            author: req.user,
            team: [req.user],
        });
        const newProject = await project.save();
        await __1.pusher.trigger(__1.pusherChannel, 'project-create', {
            projectId: newProject?._id.toString(),
        }, { socket_id: socketId });
        const returnProject = await fetchProject(newProject._id);
        res.status(201).json({ project: returnProject });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createProject = createProject;
/*
 * @route   PUT /projects/:id
 * @desc    Update a project by id
 * @access  Private
 */
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, team } = req.body;
        const socketId = req.headers['x-pusher-socket-id'];
        const project = await projectModel_1.default.findById(id).populate('author', 'name');
        if (!project)
            return res.status(404).json({ message: 'Project not found' });
        if (project?.author._id.toString() !== req.user && !req.admin)
            return res.status(401).json({ message: 'User not authorized' });
        if (title)
            project.title = title;
        if (team)
            project.team = team;
        const updatedProject = await project.save();
        await __1.pusher.trigger(__1.pusherChannel, 'project-update', {
            projectId: updatedProject?._id.toString(),
        }, { socket_id: socketId });
        const returnProject = await fetchProject(updatedProject.id);
        res.status(200).json({ project: returnProject });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateProject = updateProject;
/*
  * @route   PUT /projects/:id/invite
  * @desc    Invite users to a project
  * @access  Private
*/
const inviteToProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { invitees } = req.body;
        const socketId = req.headers['x-pusher-socket-id'];
        const project = await projectModel_1.default.findById(id).populate('author', 'name');
        if (!project)
            return res.status(404).json({ message: 'Project not found' });
        if (project?.author.id.toString() !== req.user && !req.admin)
            return res.status(401).json({ message: 'User not authorized' });
        project.invitees = [...project.invitees, ...invitees];
        const updatedProject = await project.save();
        await __1.pusher.trigger(__1.pusherChannel, 'project-invite', {
            projectId: updatedProject?._id.toString(),
        }, { socket_id: socketId });
        const returnProject = await fetchProject(updatedProject.id);
        res.status(200).json({ project: returnProject });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.inviteToProject = inviteToProject;
/*
  * @route   PUT /projects/:id/accept-invite
  * @desc    Accept an invite to a project
  * @access  Private
*/
const acceptInvite = async (req, res) => {
    try {
        const { id } = req.params;
        const socketId = req.headers['x-pusher-socket-id'];
        const project = await projectModel_1.default.findById(id).populate('author', 'name');
        if (!project)
            return res.status(404).json({ message: 'Project not found' });
        const invitees = project.invitees.map((invitee) => {
            return invitee.user.toString();
        });
        if (invitees.includes(req.user)) {
            project.invitees = project.invitees.filter((invitee) => invitee.user.toString() !== req.user);
            project.team.push(req.user);
            await project.save();
            await __1.pusher.trigger(__1.pusherChannel, 'accept-project-invite', {
                projectId: project?._id.toString(),
            }, { socket_id: socketId });
            const returnProject = await fetchProject(project.id);
            res.status(200).json({ project: returnProject });
        }
        else {
            res.status(400).json({ message: 'Invitation invalid or expired' });
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.acceptInvite = acceptInvite;
/*
 * @route   DELETE /projects/:id
 * @desc    Delete a project by id
 * @access  Private
 */
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const socketId = req.headers['x-pusher-socket-id'];
        const project = await projectModel_1.default.findById(id).populate('author', 'name');
        if (!project)
            return res.status(404).json({ message: 'Project not found' });
        if (project.author._id.toString() !== req.user && !req.admin)
            return res.status(401).json({ message: 'User not authorized' });
        await project.remove();
        await __1.pusher.trigger(__1.pusherChannel, 'delete-project', {
            projectId: id,
        }, {
            socket_id: socketId
        });
        res.status(200).json({ message: 'Project removed' });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.deleteProject = deleteProject;
/*
 *  @route   POST /projects/:id/tickets
 *  @desc    Create ticket for a project
 *  @access  Private
 */
const createTicket = async (req, res) => {
    const { priority, status, type, time_estimate, title, description } = req.body;
    const { id } = req.params;
    const socketId = req.headers['x-pusher-socket-id'];
    try {
        // Get ticket's project and author
        const ticketProject = await projectModel_1.default.findById(id);
        const ticketAuthor = req.user;
        let ticket = new ticketModel_1.default({
            priority,
            status,
            type,
            time_estimate,
            title,
            description,
        });
        // Assign project and author to tickets relationship
        ticket.project = ticketProject?.id;
        ticket.author = ticketAuthor;
        const ticketProjectMembers = ticketProject?.team.map((member) => {
            return member.toString();
        });
        if (!req.admin && !ticketProjectMembers?.some((member) => member === req.user)) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        ticket = await ticket.save();
        await __1.pusher.trigger(__1.pusherChannel, 'create-project-ticket', {
            ticket: {
                _id: ticket.id.toString(),
                author: ticket.author.toString(),
            },
        }, { socket_id: socketId });
        // Assign ticket to project's relationship
        ticketProject?.tickets.unshift(ticket._id);
        await ticketProject?.save();
        res.status(200).json({ ticket });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createTicket = createTicket;

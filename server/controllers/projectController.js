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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.createTicket = exports.deleteProject = exports.acceptInvite = exports.inviteToProject = exports.updateProject = exports.createProject = exports.getProjectById = exports.getProjects = void 0;
var ticketModel_1 = require("../models/ticketModel");
var projectModel_1 = require("./../models/projectModel");
var __1 = require("..");
var fetchProject = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var project;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, projectModel_1["default"].findById(id)
                    .populate('author', 'name')
                    .populate('team', 'name image email')
                    .populate({
                    path: 'tickets',
                    populate: {
                        path: 'team',
                        select: 'name image email'
                    }
                })
                    .populate('invitees.user', 'name image email')];
            case 1:
                project = _a.sent();
                return [2 /*return*/, project];
        }
    });
}); };
/*
 * @route   GET /projects
 * @desc    Get all projects
 * @access  Private
 */
var getProjects = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var projects, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, projectModel_1["default"].find()
                        .populate('author', 'name')
                        .populate('team', 'name email image')
                        .populate('invitees.user', 'name image email')
                        .sort({ createdAt: -1 })];
            case 1:
                projects = _a.sent();
                res.status(200).json({ projects: projects });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(400).json({ message: error_1.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getProjects = getProjects;
/*
 * @route   GET /projects/:id
 * @desc    Get a project by id
 * @access  Private
 */
var getProjectById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, project, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, fetchProject(id)];
            case 1:
                project = _a.sent();
                res.status(200).json({ project: project });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.status(400).json({ message: error_2.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getProjectById = getProjectById;
/*
 * @route   POST /projects
 * @desc    Create a new project
 * @access  Private
 */
var createProject = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var title, socketId, project, newProject, returnProject, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                title = req.body.title;
                socketId = req.headers['x-pusher-socket-id'];
                project = new projectModel_1["default"]({
                    title: title,
                    author: req.user,
                    team: [req.user]
                });
                return [4 /*yield*/, project.save()];
            case 1:
                newProject = _a.sent();
                return [4 /*yield*/, __1.pusher.trigger(__1.pusherChannel, 'project-create', {
                        projectId: newProject === null || newProject === void 0 ? void 0 : newProject._id.toString()
                    }, { socket_id: socketId })];
            case 2:
                _a.sent();
                return [4 /*yield*/, fetchProject(newProject._id)];
            case 3:
                returnProject = _a.sent();
                res.status(201).json({ project: returnProject });
                return [3 /*break*/, 5];
            case 4:
                error_3 = _a.sent();
                res.status(400).json({ message: error_3.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.createProject = createProject;
/*
 * @route   PUT /projects/:id
 * @desc    Update a project by id
 * @access  Private
 */
var updateProject = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, title, team, socketId, project, updatedProject, returnProject, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                id = req.params.id;
                _a = req.body, title = _a.title, team = _a.team;
                socketId = req.headers['x-pusher-socket-id'];
                return [4 /*yield*/, projectModel_1["default"].findById(id).populate('author', 'name')];
            case 1:
                project = _b.sent();
                if (!project)
                    return [2 /*return*/, res.status(404).json({ message: 'Project not found' })];
                if ((project === null || project === void 0 ? void 0 : project.author._id.toString()) !== req.user && !req.admin)
                    return [2 /*return*/, res.status(401).json({ message: 'User not authorized' })];
                if (title)
                    project.title = title;
                if (team)
                    project.team = team;
                return [4 /*yield*/, project.save()];
            case 2:
                updatedProject = _b.sent();
                return [4 /*yield*/, __1.pusher.trigger(__1.pusherChannel, 'project-update', {
                        projectId: updatedProject === null || updatedProject === void 0 ? void 0 : updatedProject._id.toString()
                    }, { socket_id: socketId })];
            case 3:
                _b.sent();
                return [4 /*yield*/, fetchProject(updatedProject.id)];
            case 4:
                returnProject = _b.sent();
                res.status(200).json({ project: returnProject });
                return [3 /*break*/, 6];
            case 5:
                error_4 = _b.sent();
                res.status(400).json({ message: error_4.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.updateProject = updateProject;
/*
  * @route   PUT /projects/:id/invite
  * @desc    Invite users to a project
  * @access  Private
*/
var inviteToProject = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, invitees, socketId, project, updatedProject, returnProject, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                id = req.params.id;
                invitees = req.body.invitees;
                socketId = req.headers['x-pusher-socket-id'];
                return [4 /*yield*/, projectModel_1["default"].findById(id).populate('author', 'name')];
            case 1:
                project = _a.sent();
                if (!project)
                    return [2 /*return*/, res.status(404).json({ message: 'Project not found' })];
                if ((project === null || project === void 0 ? void 0 : project.author.id.toString()) !== req.user && !req.admin)
                    return [2 /*return*/, res.status(401).json({ message: 'User not authorized' })];
                project.invitees = __spreadArray(__spreadArray([], project.invitees, true), invitees, true);
                return [4 /*yield*/, project.save()];
            case 2:
                updatedProject = _a.sent();
                return [4 /*yield*/, __1.pusher.trigger(__1.pusherChannel, 'project-invite', {
                        projectId: updatedProject === null || updatedProject === void 0 ? void 0 : updatedProject._id.toString()
                    }, { socket_id: socketId })];
            case 3:
                _a.sent();
                return [4 /*yield*/, fetchProject(updatedProject.id)];
            case 4:
                returnProject = _a.sent();
                res.status(200).json({ project: returnProject });
                return [3 /*break*/, 6];
            case 5:
                error_5 = _a.sent();
                res.status(400).json({ message: error_5.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.inviteToProject = inviteToProject;
/*
  * @route   PUT /projects/:id/accept-invite
  * @desc    Accept an invite to a project
  * @access  Private
*/
var acceptInvite = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, socketId, project, invitees, returnProject, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                id = req.params.id;
                socketId = req.headers['x-pusher-socket-id'];
                return [4 /*yield*/, projectModel_1["default"].findById(id).populate('author', 'name')];
            case 1:
                project = _a.sent();
                if (!project)
                    return [2 /*return*/, res.status(404).json({ message: 'Project not found' })];
                invitees = project.invitees.map(function (invitee) {
                    return invitee.user.toString();
                });
                if (!invitees.includes(req.user)) return [3 /*break*/, 5];
                project.invitees = project.invitees.filter(function (invitee) { return invitee.user.toString() !== req.user; });
                project.team.push(req.user);
                return [4 /*yield*/, project.save()];
            case 2:
                _a.sent();
                return [4 /*yield*/, __1.pusher.trigger(__1.pusherChannel, 'accept-project-invite', {
                        projectId: project === null || project === void 0 ? void 0 : project._id.toString()
                    }, { socket_id: socketId })];
            case 3:
                _a.sent();
                return [4 /*yield*/, fetchProject(project.id)];
            case 4:
                returnProject = _a.sent();
                res.status(200).json({ project: returnProject });
                return [3 /*break*/, 6];
            case 5:
                res.status(400).json({ message: 'Invitation invalid or expired' });
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                error_6 = _a.sent();
                res.status(400).json({ message: error_6.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.acceptInvite = acceptInvite;
/*
 * @route   DELETE /projects/:id
 * @desc    Delete a project by id
 * @access  Private
 */
var deleteProject = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, socketId, project, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                id = req.params.id;
                socketId = req.headers['x-pusher-socket-id'];
                return [4 /*yield*/, projectModel_1["default"].findById(id).populate('author', 'name')];
            case 1:
                project = _a.sent();
                if (!project)
                    return [2 /*return*/, res.status(404).json({ message: 'Project not found' })];
                if (project.author._id.toString() !== req.user && !req.admin)
                    return [2 /*return*/, res.status(401).json({ message: 'User not authorized' })];
                return [4 /*yield*/, project.remove()];
            case 2:
                _a.sent();
                return [4 /*yield*/, __1.pusher.trigger(__1.pusherChannel, 'delete-project', {
                        projectId: id
                    }, {
                        socket_id: socketId
                    })];
            case 3:
                _a.sent();
                res.status(200).json({ message: 'Project removed' });
                return [3 /*break*/, 5];
            case 4:
                error_7 = _a.sent();
                res.status(400).json({ message: error_7.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.deleteProject = deleteProject;
/*
 *  @route   POST /projects/:id/tickets
 *  @desc    Create ticket for a project
 *  @access  Private
 */
var createTicket = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, priority, status, type, time_estimate, title, description, id, socketId, ticketProject, ticketAuthor, ticket, ticketProjectMembers, error_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, priority = _a.priority, status = _a.status, type = _a.type, time_estimate = _a.time_estimate, title = _a.title, description = _a.description;
                id = req.params.id;
                socketId = req.headers['x-pusher-socket-id'];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                return [4 /*yield*/, projectModel_1["default"].findById(id)];
            case 2:
                ticketProject = _b.sent();
                ticketAuthor = req.user;
                ticket = new ticketModel_1["default"]({
                    priority: priority,
                    status: status,
                    type: type,
                    time_estimate: time_estimate,
                    title: title,
                    description: description
                });
                // Assign project and author to tickets relationship
                ticket.project = ticketProject === null || ticketProject === void 0 ? void 0 : ticketProject.id;
                ticket.author = ticketAuthor;
                ticketProjectMembers = ticketProject === null || ticketProject === void 0 ? void 0 : ticketProject.team.map(function (member) {
                    return member.toString();
                });
                if (!req.admin && !(ticketProjectMembers === null || ticketProjectMembers === void 0 ? void 0 : ticketProjectMembers.some(function (member) { return member === req.user; }))) {
                    return [2 /*return*/, res.status(401).json({ message: 'User not authorized' })];
                }
                return [4 /*yield*/, ticket.save()];
            case 3:
                ticket = _b.sent();
                return [4 /*yield*/, __1.pusher.trigger(__1.pusherChannel, 'create-project-ticket', {
                        ticket: {
                            _id: ticket.id.toString(),
                            author: ticket.author.toString()
                        }
                    }, { socket_id: socketId })];
            case 4:
                _b.sent();
                // Assign ticket to project's relationship
                ticketProject === null || ticketProject === void 0 ? void 0 : ticketProject.tickets.unshift(ticket._id);
                return [4 /*yield*/, (ticketProject === null || ticketProject === void 0 ? void 0 : ticketProject.save())];
            case 5:
                _b.sent();
                res.status(200).json({ ticket: ticket });
                return [3 /*break*/, 7];
            case 6:
                error_8 = _b.sent();
                res.status(400).json({ message: error_8.message });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.createTicket = createTicket;

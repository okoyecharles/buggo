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
exports.getTicketComment = exports.createTicketComment = exports.deleteTicket = exports.updateTicketById = exports.getTicketById = exports.getUserTickets = void 0;
var ticketModel_1 = require("../models/ticketModel");
var projectModel_1 = require("../models/projectModel");
var commentModel_1 = require("../models/commentModel");
var __1 = require("..");
var fetchTicket = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var ticket;
    return __generator(this, function (_a) {
        ticket = ticketModel_1["default"].findById(id)
            .populate('author', 'name')
            .populate({
            path: 'comments',
            populate: {
                path: 'author',
                select: 'name image email'
            }
        })
            .populate('team', 'name image email');
        return [2 /*return*/, ticket];
    });
}); };
/*
* @route    GET /tickets
* @desc     Get all tickets created by a specific user
* @access   Private
*/
var getUserTickets = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tickets, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, ticketModel_1["default"].find({ author: req.user }).populate('project', 'title')];
            case 1:
                tickets = _a.sent();
                res.status(200).json({ tickets: tickets });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(200).json({ message: error_1.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUserTickets = getUserTickets;
/*
* @route    GET /tickets/:id
* @desc     Get a ticket by id
* @access   Private
*/
var getTicketById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, ticket, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, fetchTicket(id)];
            case 1:
                ticket = _a.sent();
                res.status(200).json({ ticket: ticket });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.status(400).json({ message: error_2.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getTicketById = getTicketById;
/*
* @route    PUT /tickets/:id
* @desc     Update a ticket by id
* @access   Private
*/
var updateTicketById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, title, description, priority, status_1, type, time_estimate, team, comments, socketId, ticket, project, projectTeam, updatedTicket, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                id = req.params.id;
                _a = req.body, title = _a.title, description = _a.description, priority = _a.priority, status_1 = _a.status, type = _a.type, time_estimate = _a.time_estimate, team = _a.team, comments = _a.comments;
                socketId = req.headers['x-pusher-socket-id'];
                return [4 /*yield*/, ticketModel_1["default"].findById(id)];
            case 1:
                ticket = _b.sent();
                return [4 /*yield*/, projectModel_1["default"].findById(ticket === null || ticket === void 0 ? void 0 : ticket.project)];
            case 2:
                project = _b.sent();
                projectTeam = project.team.map(function (member) { return member.toString(); });
                if (!ticket)
                    return [2 /*return*/, res.status(404).json({ message: 'Ticket not found' })];
                if (!req.admin &&
                    ticket.author.toString() !== req.user &&
                    (project === null || project === void 0 ? void 0 : project.author.toString()) !== req.user &&
                    !projectTeam.includes(req.user))
                    return [2 /*return*/, res.status(401).json({ message: 'User not authorized' })];
                return [4 /*yield*/, ticketModel_1["default"].updateOne({ _id: id }, {
                        title: title,
                        description: description,
                        priority: priority,
                        status: status_1,
                        type: type,
                        time_estimate: time_estimate,
                        team: team,
                        comments: comments
                    })];
            case 3:
                _b.sent();
                return [4 /*yield*/, __1.pusher.trigger(__1.pusherChannel, 'update-project-ticket', {
                        ticket: {
                            _id: id,
                            author: ticket === null || ticket === void 0 ? void 0 : ticket.author._id.toString()
                        }
                    }, {
                        socket_id: socketId
                    })];
            case 4:
                _b.sent();
                return [4 /*yield*/, fetchTicket(id)];
            case 5:
                updatedTicket = _b.sent();
                res.status(200).json({ ticket: updatedTicket });
                return [3 /*break*/, 7];
            case 6:
                error_3 = _b.sent();
                res.status(400).json({ message: error_3.message });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.updateTicketById = updateTicketById;
/*
* @route    DELETE /tickets/:id
* @desc     Delete a ticket
* @access   Private
*/
var deleteTicket = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id_1, socketId, ticket, project, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                id_1 = req.params.id;
                socketId = req.headers['x-pusher-socket-id'];
                return [4 /*yield*/, ticketModel_1["default"].findById(id_1)];
            case 1:
                ticket = _a.sent();
                return [4 /*yield*/, projectModel_1["default"].findById(ticket === null || ticket === void 0 ? void 0 : ticket.project)];
            case 2:
                project = _a.sent();
                if (!ticket)
                    return [2 /*return*/, res.status(404).json({ message: 'Ticket not found' })];
                if (!project)
                    return [2 /*return*/, res.status(404).json({ message: 'Project not found' })];
                if (!req.admin &&
                    (ticket === null || ticket === void 0 ? void 0 : ticket.author.toString()) !== req.user &&
                    (project === null || project === void 0 ? void 0 : project.author.toString()) !== req.user) {
                    return [2 /*return*/, res.status(401).json({ message: 'User not authorized' })];
                }
                return [4 /*yield*/, ticket.remove()];
            case 3:
                _a.sent();
                return [4 /*yield*/, __1.pusher.trigger(__1.pusherChannel, 'delete-project-ticket', {
                        ticket: {
                            _id: id_1,
                            author: ticket.author._id.toString()
                        }
                    }, {
                        socket_id: socketId
                    })];
            case 4:
                _a.sent();
                // Remove ticket reference from the project without using pull
                project.tickets = project.tickets.filter(function (ticketId) { return ticketId.toString() !== id_1; });
                return [4 /*yield*/, (project === null || project === void 0 ? void 0 : project.save())];
            case 5:
                _a.sent();
                res.status(200).json({ message: 'Ticket removed' });
                return [3 /*break*/, 7];
            case 6:
                error_4 = _a.sent();
                res.status(400).json({ message: error_4.message });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.deleteTicket = deleteTicket;
/*
* @route    POST /tickets/:id/comments
* @desc     Comment on a ticket
* @access   Private
*/
var createTicketComment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, text, author, ticket, project, socketId, comment, savedComment, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                id = req.params.id;
                text = req.body.text;
                author = req.user;
                return [4 /*yield*/, ticketModel_1["default"].findById(id).populate('project', 'author')];
            case 1:
                ticket = _a.sent();
                project = ticket === null || ticket === void 0 ? void 0 : ticket.project;
                socketId = req.headers['x-pusher-socket-id'];
                if (!ticket)
                    return [2 /*return*/, res.status(404).json({ message: 'Comment\'s ticket not found' })];
                if (!req.admin &&
                    (ticket === null || ticket === void 0 ? void 0 : ticket.author.toString()) !== req.user &&
                    (project === null || project === void 0 ? void 0 : project.author.toString()) !== req.user &&
                    !(ticket === null || ticket === void 0 ? void 0 : ticket.team.some(function (member) { return member.toString() === req.user; })))
                    return [2 /*return*/, res.status(401).json({ message: 'User not authorized' })];
                return [4 /*yield*/, commentModel_1["default"].create({
                        text: text,
                        author: author,
                        ticket: ticket === null || ticket === void 0 ? void 0 : ticket._id
                    })];
            case 2:
                comment = _a.sent();
                return [4 /*yield*/, __1.pusher.trigger(__1.pusherChannel, 'new-ticket-comment', {
                        ticketId: id,
                        comment: {
                            _id: comment === null || comment === void 0 ? void 0 : comment._id.toString(),
                            author: comment === null || comment === void 0 ? void 0 : comment.author.toString()
                        }
                    }, {
                        socket_id: socketId
                    })];
            case 3:
                _a.sent();
                // Add comment reference to the ticket
                ticket === null || ticket === void 0 ? void 0 : ticket.comments.push(comment.id);
                return [4 /*yield*/, (ticket === null || ticket === void 0 ? void 0 : ticket.save())];
            case 4:
                _a.sent();
                return [4 /*yield*/, commentModel_1["default"].findById(comment.id)
                        .populate('author', 'name image email')];
            case 5:
                savedComment = _a.sent();
                res.status(200).json({ comment: savedComment });
                return [3 /*break*/, 7];
            case 6:
                error_5 = _a.sent();
                res.status(404).json({ message: error_5.message });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.createTicketComment = createTicketComment;
/*
  * @route    GET /tickets/:id/comments/:commentId
  * @desc     Get a comment
  * @access   Private
*/
var getTicketComment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, commentId, comment, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.params, id = _a.id, commentId = _a.commentId;
                return [4 /*yield*/, commentModel_1["default"].findById(commentId)
                        .populate('author', 'name image email')];
            case 1:
                comment = _b.sent();
                if ((comment === null || comment === void 0 ? void 0 : comment.ticket.toString()) !== id)
                    return [2 /*return*/, res.status(404).json({ message: 'Comment not found' })];
                res.status(200).json({ comment: comment });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _b.sent();
                res.status(404).json({ message: error_6.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getTicketComment = getTicketComment;

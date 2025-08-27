"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ticketController_1 = require("./../controllers/ticketController");
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const ticketController_2 = require("../controllers/ticketController");
const router = express_1.default.Router();
router.get('/', authMiddleware_1.default, ticketController_2.getUserTickets);
router.get('/:id', authMiddleware_1.default, ticketController_2.getTicketById);
router.put('/:id', authMiddleware_1.default, ticketController_2.updateTicketById);
router.delete('/:id', authMiddleware_1.default, ticketController_2.deleteTicket);
router.post('/:id/comments', authMiddleware_1.default, ticketController_2.createTicketComment);
router.get('/:id/comments/:commentId', authMiddleware_1.default, ticketController_1.getTicketComment);
exports.default = router;

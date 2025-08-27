"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const projectController_1 = require("./../controllers/projectController");
const router = express_1.default.Router();
router.get('/', authMiddleware_1.default, projectController_1.getProjects);
router.get('/:id', authMiddleware_1.default, projectController_1.getProjectById);
router.post('/', authMiddleware_1.default, projectController_1.createProject);
router.post('/:id/tickets', authMiddleware_1.default, projectController_1.createTicket);
router.put('/:id', authMiddleware_1.default, projectController_1.updateProject);
router.put('/:id/invite', authMiddleware_1.default, projectController_1.inviteToProject);
router.put('/:id/accept-invite', authMiddleware_1.default, projectController_1.acceptInvite);
router.delete('/:id', authMiddleware_1.default, projectController_1.deleteProject);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("./../controllers/userController");
const express_1 = __importDefault(require("express"));
const userController_2 = require("../controllers/userController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
router.get('/', authMiddleware_1.default, userController_2.getUsers);
router.post('/validate', authMiddleware_1.default, userController_1.validateUser);
router.put('/:id', authMiddleware_1.default, userController_1.updateUser);
router.delete('/:id', authMiddleware_1.default, userController_2.deleteUser);
router.post('/signup', userController_2.register);
router.post('/signin', userController_2.login);
router.post('/signout', userController_1.logout);
exports.default = router;

import {
  createSocketTicket,
  logout,
  searchUsers,
  updateUser,
  validateUser,
} from "./../controllers/userController";
import express from "express";
import {
  register,
  login,
  deleteUser,
  getUsers,
} from "../controllers/userController";
import protect from "../middleware/auth";
import { validate, ValidateType } from "../middleware/validate";
import {
  loginSchema,
  registerSchema,
  updateUserSchema,
  searchUserSchema,
} from "../types/user";

const router = express.Router();

router.get("/", protect, getUsers);
router.get(
  "/search/:query",
  protect,
  validate(searchUserSchema, ValidateType.Params),
  searchUsers,
);
router.post("/validate", protect, validateUser);
router.post("/socket-ticket", protect, createSocketTicket);
router.put("/:id", protect, validate(updateUserSchema), updateUser);
router.delete("/:id", protect, deleteUser);

router.post("/signup", validate(registerSchema), register);
router.post("/signin", validate(loginSchema), login);
router.post("/signout", logout);

export default router;

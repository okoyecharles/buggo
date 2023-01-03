import { Request } from "express";
import jwt from "jsonwebtoken";

interface AuthorizedRequest extends Request {
  user: string | jwt.JwtPayload;
};

export default AuthorizedRequest;
import { Request } from "express";
import jwt from "jsonwebtoken";

type AuthorizedRequest<T> = Request<never, never, T> & {
  user?: string | jwt.JwtPayload;
};

export default AuthorizedRequest;
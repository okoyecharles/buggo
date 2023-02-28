import { Request } from "express";

type AuthorizedRequest<T> = Request<never, never, T> & {
  user?: string;
  admin?: boolean;
};

export default AuthorizedRequest;
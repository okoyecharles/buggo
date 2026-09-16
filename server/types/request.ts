import { NextFunction, Request, Response } from "express";

// T is the type of the body
// P is the type of the params

type DefaultRequest<T = undefined, P = Record<string, string>> = Request<P, any, T>;

type ProtectedRequest<T = undefined, P = Record<string, string>> = DefaultRequest<T, P> & {
  user?: string;
  admin?: boolean;
};

// Middleware mounted ahead of a controller must leave the body and params open,
// otherwise express infers the route's generics from it and rejects the
// controller that follows. It carries user/admin itself rather than relying on a
// global Express.Request augmentation, which ts-node does not load.
type Middleware = (
  req: ProtectedRequest<any, any>,
  res: Response,
  next: NextFunction,
) => any;

export { DefaultRequest, ProtectedRequest, Middleware };

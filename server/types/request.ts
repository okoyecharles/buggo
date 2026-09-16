import { Request, RequestHandler } from "express";

// T is the type of the body
// P is the type of the params

type DefaultRequest<T = undefined, P = Record<string, string>> = Request<P, any, T>;

type ProtectedRequest<T = undefined, P = Record<string, string>> = DefaultRequest<T, P> & {
  user?: string;
  admin?: boolean;
};

// Middleware mounted ahead of a controller must stay generic, otherwise express
// infers the route's body/params from it and rejects the controller after it
type Middleware = RequestHandler<any, any, any>;

export { DefaultRequest, ProtectedRequest, Middleware };

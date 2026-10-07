import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";

export enum ValidateType {
  Query = "query",
  Params = "params",
  Body = "body",
}

export function validate(schema: ZodObject, type = ValidateType.Body) {
  return (req: Request, res: Response, next: NextFunction) => {
    let result;
    switch (type) {
      case ValidateType.Query:
        result = schema.safeParse(req.query);
        break;
      case ValidateType.Params:
        result = schema.safeParse(req.params);
        break;
      case ValidateType.Body:
        result = schema.safeParse(req.body);
        break;
      default:
        result = schema.safeParse(req.body);
    }

    if (!result.success) {
      // The client reads `message` off every error response, so lead with the
      const [issue] = result.error.issues;
      const field = issue.path.join(".");

      return res.status(400).json({
        message: field ? `${field}: ${issue.message}` : issue.message,
        issues: result.error.issues,
      });
    }

    // coersion applies, but only to the body -- params and query are left
    // as express parsed them
    if (type === ValidateType.Body) req.body = result.data;
    next();
  };
}

import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";

export function validate(schema: ZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // The client reads `message` off every error response, so lead with the
      const [issue] = result.error.issues;
      const field = issue.path.join(".");

      return res.status(400).json({
        message: field ? `${field}: ${issue.message}` : issue.message,
        issues: result.error.issues,
      });
    }

		// coersion applies
    req.body = result.data;
    next();
  };
}

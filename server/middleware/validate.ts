import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";

export function validate(schema: ZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Hand the controller the parsed body so coercions apply and unknown
      // keys are dropped, matching the type it infers from the schema.
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({ error });
    }
  };
}

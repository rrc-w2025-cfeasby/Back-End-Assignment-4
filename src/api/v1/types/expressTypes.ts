import { Request, Response, NextFunction } from "express";

/**
 * Strongly typed Express middleware function.
 */
export type MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;
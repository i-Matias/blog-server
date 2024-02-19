import { Handler, Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";

export const catchAsync =
  (fn: Handler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };

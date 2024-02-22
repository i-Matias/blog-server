import { NextFunction, Request, Response } from "express";

interface ApiError extends Error {
  status?: number;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status ?? 500;
  const message = err.message ?? "Something went wrong";

  res.status(status).send(message);
};

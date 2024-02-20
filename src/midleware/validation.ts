import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

export const validateRegister = [
  body("username").isString().isLength({ min: 3, max: 15 }),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }
    next();
  },
];

export const validateLogin = [
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }
    next();
  },
];

export const validatePost = [
  body("title").isString().isLength({ min: 3, max: 50 }),
  body("content").isString().isLength({ min: 3 }),
  body("tagName").notEmpty(),
  body("alt").isString().isLength({ min: 3, max: 50 }),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }
    next();
  },
];

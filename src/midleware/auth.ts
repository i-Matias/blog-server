import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { IUser } from "../utils/types";

const authToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, config.jwt.secret as string);

    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};

const generateToken = (user: IUser) => {
  const { id } = user;

  return jwt.sign({ id }, config.jwt.secret as string, {
    expiresIn: "1h",
  });
};

export { authToken, generateToken };

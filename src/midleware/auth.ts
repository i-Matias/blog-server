import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { config } from "../config/config";

const authToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, config.jwt.secret as string);

    req.user = verified;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).send("Token Expired");
    }
    res.status(400).send("Invalid Token");
  }
};

const generateToken = (id: number) => {
  return jwt.sign({ id }, config.jwt.secret as string, {
    expiresIn: "1h",
  });
};

export { authToken, generateToken };

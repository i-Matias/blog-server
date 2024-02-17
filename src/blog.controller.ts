import { Request, Response } from "express";
import { createUser, getUserByEmail } from "./blog.service";
import { StatusCodes } from "http-status-codes";

const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    const status = await createUser(username, email, password);
    if (status) {
      return res.status(StatusCodes.CREATED).send("User created successfully");
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send("Failed to create user");
    }
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("An error occurred");
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email, password);
    console.log(user);
    if (user) {
      return res.status(StatusCodes.OK).send("User logged in successfully");
    }
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send("Invalid email or password");
  } catch (err) {
    console.log(err);
  }
};

const guest = async (req: Request, res: Response) => {};

export { register, login, guest };

import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { generateToken } from "../midleware/auth";
import userService from "../service/user.service";
import { catchAsync } from "../utils/catchasync";
import { JwtPayload } from "jsonwebtoken";

const register = catchAsync(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const user = await userService.createUser(username, email, password);

  if (user) {
    return res.status(StatusCodes.CREATED).send(user);
  } else {
    return res.status(StatusCodes.BAD_REQUEST).send("Failed to create user");
  }
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log(email, password);

  const user = await userService.getUserByEmail(email, password);

  if (user) {
    const token = generateToken(user.id);
    return res
      .setHeader("Authorization", token)
      .status(StatusCodes.CREATED)
      .send();
  }
  return res.status(StatusCodes.UNAUTHORIZED).send("Invalid email or password");
});

const guest = catchAsync(async (req: Request, res: Response) => {
  const page = req.query.page as string;

  const posts = await userService.guessPage(+page);
  return res.status(StatusCodes.OK).send(posts);
});

const editUser = catchAsync(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const user = req.user as JwtPayload;
  const userId = +user.id;

  const updatedUser = await userService.editUser(
    userId,
    username,
    email,
    password
  );

  if (updatedUser) {
    return res.status(StatusCodes.OK).send(updatedUser);
  } else {
    return res.status(StatusCodes.BAD_REQUEST).send("Failed to update user");
  }
});

const deleteProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  if (!user) return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");

  const userId = +user.id;
  const status = await userService.deleteUserProfile(userId);
  if (status) {
    return res.status(StatusCodes.OK).send(status);
  }
  return res.status(StatusCodes.BAD_REQUEST).send("Failed to delete profile");
});

export default { guest, login, register, editUser, deleteProfile };

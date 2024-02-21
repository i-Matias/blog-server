import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { generateToken } from "../midleware/auth";
import {
  createPost,
  createUser,
  deleteUserProfile,
  editEmail,
  editPassword,
  editUserName,
  getPosts,
  getUserByEmail,
  searchForPost,
} from "../service/blog.service";
import { catchAsync } from "../utils/catchasync";

const register = catchAsync(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const user = await createUser(username, email, password);

  if (user) {
    return res.status(StatusCodes.CREATED).send(user);
  } else {
    return res.status(StatusCodes.BAD_REQUEST).send("Failed to create user");
  }
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await getUserByEmail(email, password);

  if (user) {
    const token = generateToken(user.id);
    return res.status(StatusCodes.CREATED).send(token);
  }

  return res.status(StatusCodes.UNAUTHORIZED).send("Invalid email or password");
});

const guest = catchAsync(async (req: Request, res: Response) => {
  const page = req.query.page as string;

  const posts = await getPosts(page);
  return res.status(StatusCodes.OK).send(posts);
});

const post = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;

  if (!user) return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");
  const userId = user.id;

  const { title, content, tagName, alt } = req.body;
  const img = req.file?.buffer;

  const post = await createPost({
    userId,
    title,
    content,
    tagName,
    alt,
    img,
  });
  if (post) {
    return res.status(StatusCodes.CREATED).send(post);
  }
  return res.status(StatusCodes.BAD_REQUEST).send("Failed to create post");
});

const editUserNameProfile = catchAsync(async (req: Request, res: Response) => {
  const { username } = req.body;
  const user = req.user as JwtPayload;
  const userId = +user.id;

  const status = await editUserName(userId, username);

  if (status) {
    return res.status(StatusCodes.OK).send(status);
  } else {
    return res.status(StatusCodes.BAD_REQUEST).send("Failed to update profile");
  }
});

const editEmailProfile = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = req.user as JwtPayload;
  const userId = +user.id;

  const status = await editEmail(userId, email);

  if (status) {
    return res.status(StatusCodes.OK).send(status);
  } else {
    return res.status(StatusCodes.BAD_REQUEST).send("Failed to update profile");
  }
});

const editPasswordProfile = catchAsync(async (req: Request, res: Response) => {
  const { password } = req.body;
  const user = req.user as JwtPayload;
  const userId = +user.id;

  const status = await editPassword(userId, password);

  if (status) {
    return res.status(StatusCodes.OK).send(status);
  } else {
    return res.status(StatusCodes.BAD_REQUEST).send("Failed to update profile");
  }
});

const retrievePosts = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  if (!user) return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");

  const userId = +user.id;
  const page = req.query.page as string;
  const post = await getPosts(page, userId);
  return res.status(StatusCodes.OK).send(post);
});

const deleteProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  if (!user) return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");

  const userId = +user.id;
  const status = await deleteUserProfile(userId);
  if (status) {
    return res.status(StatusCodes.OK).send(status);
  }
  return res.status(StatusCodes.BAD_REQUEST).send("Failed to delete profile");
});

const retrievePost = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  if (!user) return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");

  const postTitle = req.query.title as string;
  const userId = +user.id;

  const post = await searchForPost(userId, postTitle);

  return res.status(StatusCodes.OK).send(post);
});

export {
  deleteProfile,
  editEmailProfile,
  editPasswordProfile,
  editUserNameProfile,
  guest,
  login,
  post,
  register,
  retrievePost,
  retrievePosts,
};

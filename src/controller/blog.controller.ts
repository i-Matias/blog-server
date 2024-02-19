import { Request, Response } from "express";
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
import { StatusCodes } from "http-status-codes";
import { generateToken } from "../midleware/auth";
import { JwtPayload } from "jsonwebtoken";

const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const user = await createUser(username, email, password);

    if (user) {
      const token = generateToken(user);
      return res.status(StatusCodes.CREATED).send(token);
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

const guest = async (req: Request, res: Response) => {
  const posts = await getPosts();
  return res.status(StatusCodes.OK).send(posts);
};

const post = async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;

  if (!user) return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");
  const userId = user.id;

  const { title, content, tagName, alt } = req.body;
  const img = req.file?.buffer;

  const status = await createPost(userId, title, content, tagName, alt, img);
  if (status) {
    return res.status(StatusCodes.CREATED).send("Post created successfully");
  }
  return res.status(StatusCodes.BAD_REQUEST).send("Failed to create post");
};

const editProfile = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const user = req.user as JwtPayload;
  const userId = +user.id;

  try {
    let status;
    if (username) {
      status = await editUserName(userId, username);
    } else if (email) {
      status = await editEmail(userId, email);
    } else if (password) {
      status = await editPassword(userId, password);
    }

    if (status) {
      return res.status(StatusCodes.OK).send("Profile updated successfully");
    } else {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Failed to update profile");
    }
  } catch (err) {
    console.error("Error updating profile:", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("An error occurred while updating profile");
  }
};

const retrievePosts = async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  if (!user) return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");

  const userId = +user.id;
  const post = await getPosts(userId);
  return res.status(StatusCodes.OK).send(post);
};

const deleteProfile = async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  if (!user) return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");

  const userId = +user.id;
  const status = await deleteUserProfile(userId);
  if (status) {
    return res.status(StatusCodes.OK).send("Profile deleted successfully");
  }
  return res.status(StatusCodes.BAD_REQUEST).send("Failed to delete profile");
};

const retrievePost = async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  if (!user) return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");

  const userId = +user.id;
  const postTitle = req.body.title;
  const post = await searchForPost(userId, postTitle);
  return res.status(StatusCodes.OK).send(post);
};

export {
  register,
  login,
  guest,
  post,
  editProfile,
  retrievePosts,
  deleteProfile,
  retrievePost,
};

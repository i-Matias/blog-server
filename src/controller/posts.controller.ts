import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import postService from "../service/post.service";
import { catchAsync } from "../utils/catchasync";
import { IPost, filterPosts } from "../utils/types";

const post = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;

  if (!user) return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");
  const userId = user.id;

  const { title, content, tags } = req.body;
  const fileName = req.file?.filename;

  if (!fileName)
    return res.status(StatusCodes.BAD_REQUEST).send("Failed to upload image");

  const alt = fileName;

  const post = await postService.createPost({
    userId,
    title,
    content,
    tagName: tags,
    alt,
    fileName,
  });

  if (post) {
    return res.status(StatusCodes.CREATED).send(post);
  }
  return res.status(StatusCodes.BAD_REQUEST).send("Failed to create post");
});

const retrievePosts = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  if (!user) return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");

  const userId = +user.id;
  const page = req.query.page as string;

  const posts = await postService.getPosts(+page, userId);
  const filteredPosts = filterPosts(posts);
  return res.status(StatusCodes.OK).send(filteredPosts as IPost[]);
});

const retrievePost = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  if (!user) return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");

  const postTitle = req.params.title;
  const userId = +user.id;

  const post = await postService.searchForPost(userId, postTitle);

  const filterPost = filterPosts([post]);

  return res.status(StatusCodes.OK).send(filterPost);
});

const editPost = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  if (!user) return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");

  const postId = +req.params.id;
  const userId = +user.id;

  const { title, content, tagName, alt } = req.body;
  const fileName = req.file?.filename;

  if (!fileName) {
    return res.status(StatusCodes.BAD_REQUEST).send("Failed to upload image");
  }

  const post = await postService.updatePost(postId, {
    userId,
    title,
    content,
    tagName,
    alt,
    fileName,
  });

  if (post) {
    return res.status(StatusCodes.OK).send(post);
  }
  return res.status(StatusCodes.BAD_REQUEST).send("Failed to update post");
});

const deletePost = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  if (!user) return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");

  const postId = +req.params.id;

  const deletedPost = await postService.deletePostById(postId);

  if (deletedPost) {
    return res.status(StatusCodes.OK).send(deletedPost);
  }
  return res.status(StatusCodes.BAD_REQUEST).send("Failed to delete post");
});

export default { deletePost, post, retrievePost, retrievePosts };

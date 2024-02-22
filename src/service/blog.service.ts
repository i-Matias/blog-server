import { posts, users } from "@prisma/client";
import bcrypt from "bcrypt";
import { config } from "../config/config";
import prisma from "../database/prisma";
import { ICreatePostParams } from "../utils/types";

const createUser = async (
  username: string,
  email: string,
  password: string
): Promise<users | null> => {
  const hashPassword = await bcrypt.hash(password, +config.bcrypt.saltRounds);

  const user = await prisma.users.create({
    data: {
      username,
      email,
      password: hashPassword,
    },
  });

  return user;
};

const getUserByEmail = async (
  email: string,
  password: string
): Promise<users | null> => {
  const user = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  if (!user) return null;

  const match = await bcrypt.compare(password, user.password);
  if (match) {
    return user;
  }
  return null;
};

const createPost = async ({
  userId,
  title,
  content,
  tagName,
  alt,
  img,
}: ICreatePostParams): Promise<posts | null> => {
  return await prisma
    .$transaction(async (prisma) => {
      const tag = await prisma.tags.findUnique({
        where: { tag_name: tagName },
      });

      if (!tag) return null;

      const post = await prisma.posts.create({
        data: {
          title,
          content,
          created: new Date(),
          user_id: userId,
          post_tags: {
            create: {
              tag_id: tag.id,
            },
          },
          images: {
            create: {
              alt,
              img_data: img ?? Buffer.from(""),
            },
          },
        },
        include: {
          images: true,
          post_tags: true,
        },
      });

      return post;
    })
    .catch((error) => {
      console.error("Failed to create post:", error);
      return null;
    });
};

const getPosts = async (
  page: number,
  ignoreUserId?: number
): Promise<Array<posts>> => {
  const whereClause = ignoreUserId ? { user_id: { not: ignoreUserId } } : {};

  const posts = await prisma.posts.findMany({
    skip: +page * 10,
    take: 10,
    where: whereClause,
    include: {
      images: true,
      users: true,
      post_tags: true,
    },
  });

  return posts;
};

const editUserName = async (
  userId: number,
  username: string
): Promise<users> => {
  const updatedUser = await prisma.users.update({
    where: {
      id: userId,
    },
    data: {
      username,
    },
  });

  return updatedUser;
};

const editEmail = async (userId: number, email: string): Promise<users> => {
  const updatedUser = await prisma.users.update({
    where: {
      id: userId,
    },
    data: {
      email,
    },
  });
  return updatedUser;
};

const editPassword = async (
  userId: number,
  password: string
): Promise<users> => {
  const hashPassword = await bcrypt.hash(password, +config.bcrypt.saltRounds);

  const updatedUser = await prisma.users.update({
    where: {
      id: userId,
    },
    data: {
      password: hashPassword,
    },
  });
  return updatedUser;
};

const deleteUserProfile = async (userId: number): Promise<users> => {
  const deletedUser = await prisma.users.delete({
    where: {
      id: userId,
    },
  });

  return deletedUser;
};

const searchForPost = async (
  userId: number,
  title: string
): Promise<Array<posts>> => {
  const searchedPost = await prisma.posts.findMany({
    where: {
      user_id: {
        not: userId,
      },
      title: title,
    },
    include: {
      images: true,
      users: true,
      post_tags: true,
    },
  });

  return searchedPost;
};

const deletePostById = async (postId: number): Promise<posts | null> => {
  try {
    const deletedPost = await prisma.posts.delete({
      where: {
        id: postId,
      },
    });

    return deletedPost;
  } catch (error) {
    console.error("Failed to delete post:", error);
    return null;
  }
};

export {
  createPost,
  createUser,
  deleteUserProfile,
  editEmail,
  editPassword,
  editUserName,
  getPosts,
  getUserByEmail,
  searchForPost,
  deletePostById,
};

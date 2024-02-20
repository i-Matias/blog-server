import bcrypt from "bcrypt";
import prisma from "../database/prisma";
import { ICreatePostParams, IUser } from "../utils/types";

const createUser = async (
  username: string,
  email: string,
  password: string
): Promise<IUser | null> => {
  const hashPassword = await bcrypt.hash(password, 8);

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
): Promise<IUser | null> => {
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
}: ICreatePostParams): Promise<{} | null> => {
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

const getPosts = async (ignoreUserId?: number): Promise<Array<{}>> => {
  const whereClause = ignoreUserId ? { user_id: { not: ignoreUserId } } : {};

  const posts = await prisma.posts.findMany({
    where: whereClause,
    include: {
      images: true,
      users: true,
      post_tags: true,
    },
  });

  return posts;
};

const editUserName = async (userId: number, username: string): Promise<{}> => {
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

const editEmail = async (userId: number, email: string): Promise<{}> => {
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

const editPassword = async (userId: number, password: string): Promise<{}> => {
  const hashPassword = await bcrypt.hash(password, 8);

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

const deleteUserProfile = async (userId: number): Promise<{}> => {
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
): Promise<Array<{}>> => {
  const searchedPost = await prisma.posts.findMany({
    where: {
      user_id: userId,
      AND: {
        title: title,
      },
    },
    include: {
      images: true,
      users: true,
      post_tags: true,
    },
  });

  return searchedPost;
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
};

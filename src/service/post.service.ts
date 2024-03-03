import { posts } from "@prisma/client";
import prisma from "../database/prisma";
import { ICreatePostParams } from "../utils/types";

const createPost = async ({
  userId,
  title,
  content,
  tagName,
  alt,
  fileName,
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
              fileName: fileName,
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

const updatePost = async (
  postId: number,
  { userId, title, content, tagName, alt, fileName }: ICreatePostParams
): Promise<posts | null> => {
  // prisma.$transaction(async (prisma) => {
  //   const tag = await prisma.tags.findUnique({
  //     where: { tag_name: tagName },
  //   });
  //   if (!tag) return null;

  //   await prisma.post_tags.update({
  //     where: {
  //       post_id: postId,
  //     },
  //     data: {
  //       tag_id: tag.id,
  //     },
  //   });

  //   await prisma.posts.update({
  //     where: {
  //       id: postId,
  //     },
  //     data: {
  //       title,
  //       content,
  //       created: new Date(),
  //     },
  //   });

  //   await prisma.images.update({
  //     where: {
  //       post_id: postId,
  //     },
  //     data: {
  //       alt,
  //       fileName,
  //     },
  //   });
  // });

  return null;
};

export default {
  createPost,
  deletePostById,
  getPosts,
  searchForPost,
  updatePost,
};

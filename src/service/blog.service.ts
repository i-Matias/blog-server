import connection from "../database/database";
import bcrypt from "bcrypt";
import { IFullPost, IPost, IUser, executeQuery, mapPost } from "../utils/types";
import {
  insertToImg,
  insertToPost,
  insertToPost_Tags,
  insertUser,
} from "../database/insert";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import {
  searchPostForUserId,
  selectAllPosts,
  selectAllPostsWithoutUserId,
  selectTag,
} from "../database/select";
import {
  updateEmail,
  updatePassword,
  updateUserName,
} from "../database/update";
import { deleteUser } from "../database/deleteUser";
import prisma from "../database/prisma";
import { img } from "../database/table";

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
  // const result = (await executeQuery(connection, insertUser, [
  //   username,
  //   email,
  //   hashPassword,
  // ])) as ResultSetHeader;

  // return { id: result.insertId, username, email, password: hashPassword };
};

const getUserByEmail = async (
  email: string,
  password: string
): Promise<IUser | null> => {
  // const select = `SELECT * FROM users WHERE email = ?`;
  // const result = (await executeQuery(connection, select, [
  //   email,
  // ])) as RowDataPacket[];
  // const resultPassword = result[0].password;

  // const match = await bcrypt.compare(password, resultPassword);
  // if (match) {
  //   return { id: result[0].id, username: result[0].username, email, password };
  // }
  // return null;

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

const createPost = async (
  userId: number,
  title: string,
  content: string,
  tagName: string,
  alt: string,
  img: Buffer | undefined
): Promise<IPost | null> => {
  try {
    const created = new Date();
    const postResult = (await executeQuery(connection, insertToPost, [
      title,
      content,
      created,
      userId,
    ])) as ResultSetHeader;
    const postId = postResult.insertId;
    if (img && alt) {
      await executeQuery(connection, insertToImg, [alt, img, postId]);
    }
    const tagResult = (await executeQuery(connection, selectTag, [
      tagName,
    ])) as RowDataPacket[];
    const tagId = tagResult[0].id;
    await executeQuery(connection, insertToPost_Tags, [postId, tagId]);
    return { id: postId, title, content, created, userId };
  } catch (error) {
    console.error("Error hashing password: ", error);
    return null;
  }
};

const getPosts = async (ignoreUserId?: number): Promise<Array<IFullPost>> => {
  if (ignoreUserId) {
    const joinPostsUsersImagesTagsResult = (await executeQuery(
      connection,
      selectAllPostsWithoutUserId,
      [ignoreUserId]
    )) as RowDataPacket[];

    const posts = mapPost(joinPostsUsersImagesTagsResult);
    return posts;
  }
  const joinPostsUsersImagesTagsResult = (await executeQuery(
    connection,
    selectAllPosts,
    []
  )) as RowDataPacket[];

  const posts = mapPost(joinPostsUsersImagesTagsResult);
  return posts;
};

const editUserName = async (
  userId: number,
  username: string
): Promise<boolean> => {
  const result = (await executeQuery(connection, updateUserName, [
    username,
    userId,
  ])) as ResultSetHeader;

  if (result.affectedRows > 0) {
    return true;
  }
  return false;
};

const editEmail = async (userId: number, email: string): Promise<boolean> => {
  const result = (await executeQuery(connection, updateEmail, [
    email,
    userId,
  ])) as ResultSetHeader;

  if (result.affectedRows > 0) {
    return true;
  }
  return false;
};

const editPassword = async (
  userId: number,
  password: string
): Promise<boolean> => {
  const hashPassword = await bcrypt.hash(password, 8);

  const result = (await executeQuery(connection, updatePassword, [
    hashPassword,
    userId,
  ])) as ResultSetHeader;

  if (result.affectedRows > 0) {
    return true;
  }
  return false;
};

const deleteUserProfile = async (userId: number): Promise<boolean> => {
  const result = (await executeQuery(connection, deleteUser, [
    userId,
  ])) as ResultSetHeader;

  if (result.affectedRows > 0) {
    return true;
  }
  return false;
};

const searchForPost = async (title: string): Promise<Array<IFullPost>> => {
  const result = (await executeQuery(connection, searchPostForUserId, [
    title,
  ])) as RowDataPacket[];

  const post = mapPost(result);
  return post;
};

export {
  createUser,
  getUserByEmail,
  createPost,
  getPosts,
  editUserName,
  editEmail,
  editPassword,
  deleteUserProfile,
  searchForPost,
};

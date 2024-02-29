import { posts, users } from "@prisma/client";
import bcrypt from "bcrypt";
import { config } from "../config/config";
import prisma from "../database/prisma";
import postsService from "./post.service";

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

const editUser = async (
  id: number,
  username: string,
  email: string,
  password: string
): Promise<users | null> => {
  return null;
};

const guessPage = async (page: number): Promise<Array<posts>> => {
  const user = postsService.getPosts(page);
  return user;
};

export default {
  createUser,
  deleteUserProfile,
  editEmail,
  editPassword,
  editUserName,
  getUserByEmail,
  editUser,
  guessPage,
};

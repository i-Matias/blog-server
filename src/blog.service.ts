import { RowDataPacket } from "mysql2";
import connection from "./database";
import bcrypt from "bcrypt";
import { IUser } from "./types";

const createUser = async (
  username: string,
  email: string,
  password: string
): Promise<boolean> => {
  try {
    const hashPassword = await bcrypt.hash(password, 8);
    const insert = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;

    return new Promise((resolve, reject) => {
      connection.query(
        insert,
        [username, email, hashPassword],
        (err, results) => {
          if (err) {
            console.error("Insert user error: ", err.stack);
            return reject(false);
          }
          resolve(true);
        }
      );
    });
  } catch (error) {
    console.error("Error hashing password: ", error);
    return false;
  }
};

const getUserByEmail = async (
  email: string,
  password: string
): Promise<IUser> => {
  const select = `SELECT * FROM users WHERE email = ?`;

  return new Promise((resolve, reject) => {
    connection.query(select, [email], async (err, result: RowDataPacket[]) => {
      if (err) {
        return reject(
          new Error("Can not find such user with that email address")
        );
      }
      if (result.length === 0) {
        return reject(
          new Error("Can not find such user with that email address")
        );
      }
      const resultPassword = result[0].password;
      const isMatch = await bcrypt.compare(password, resultPassword);
      if (isMatch) {
        return resolve(result[0] as IUser);
      }
    });
  });
};

export { createUser, getUserByEmail };

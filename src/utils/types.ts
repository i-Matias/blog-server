import { JwtPayload } from "jsonwebtoken";
import { Connection, ResultSetHeader, RowDataPacket } from "mysql2";

interface IUser {
  id: number;
  username: string;
  email: string;
  password: string;
}

interface IPost {
  id: number;
  title: string;
  content: string;
  created: Date;
  userId: number;
}

interface IFullPost {
  username: string;
  title: string;
  content: string;
  created: Date;
  tagName: string;
  alt: string;
  img: Buffer;
}

const executeQuery = (
  connection: Connection,
  query: string,
  parameters: Array<any>
): Promise<ResultSetHeader | RowDataPacket[]> => {
  return new Promise((resolve, reject) => {
    connection.execute(query, parameters, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result as ResultSetHeader | RowDataPacket[]);
      }
    });
  });
};

const mapPost = (result: RowDataPacket[]): Array<IFullPost> => {
  const posts = result.map((post) => {
    return {
      username: post.username as string,
      title: post.title as string,
      content: post.content as string,
      created: post.created as Date,
      tagName: post.tag_name as string,
      alt: post.alt as string,
      img: post.img_data as Buffer,
    };
  });
  return posts;
};

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;
    }
  }
}

export { IUser, IPost, IFullPost, mapPost, executeQuery };

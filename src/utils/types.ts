import { JwtPayload } from "jsonwebtoken";

interface IFullPost {
  username: string;
  title: string;
  content: string;
  created: Date;
  tagName: string;
  alt: string;
  img: Buffer;
}

interface ICreatePostParams {
  userId: number;
  title: string;
  content: string;
  tagName: string;
  alt: string;
  fileName: string;
}

export interface IPost {
  postId: number;
  createdBy: string;
  createdAt: Date;
  title: string;
  content: string;
  image: {
    fileName: string;
    alt: string;
  }[];
  tagsName: string[];
}

export const filterPosts = (posts: any) => {
  return posts.map((post: any) => {
    const { username } = post.users;
    const { id, title, content, created } = post;

    const image: { fileName: string; alt: string }[] = post.images.map(
      (image: any) => ({
        alt: image.alt,
        fileName: image.fileName,
      })
    );
    const tagsName = post.post_tags.map((tag: any) => tag.tags.tag_name);

    const filteredPost: IPost = {
      postId: id,
      createdBy: username,
      createdAt: created,
      title,
      content,
      tagsName,
      image,
    };
    return filteredPost;
  });
};

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;
    }
  }
}

export { ICreatePostParams, IFullPost };

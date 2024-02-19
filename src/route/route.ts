import express from "express";
import {
  deleteProfile,
  editProfile,
  guest,
  login,
  post,
  register,
  retrievePost,
  retrievePosts,
} from "../controller/blog.controller";
import { authToken } from "../midleware/auth";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

router.post("/register", register);
router.post("/login", authToken, login);
router.post("/post", authToken, upload.single("img"), post);
router.post("/post/search", authToken, retrievePost);

router.get("/guest", guest);
router.get("/posts", authToken, retrievePosts);

router.put("/edit-profile", authToken, editProfile);

router.delete("/delete-profile", authToken, deleteProfile);

export default router;

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

router.get("/guest", guest);
router.post("/register", register);
router
  .use(authToken)
  .post("/login", login)
  .post("/post", upload.single("img"), post)
  .get("/posts", retrievePosts)
  .get("/post/search/", retrievePost)
  .put("/edit-profile", editProfile)
  .delete("/delete-profile", deleteProfile);

export default router;

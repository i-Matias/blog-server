import express from "express";
import multer from "multer";
import {
  deleteProfile,
  editEmailProfile,
  editPasswordProfile,
  editUserNameProfile,
  guest,
  login,
  post,
  register,
  retrievePost,
  retrievePosts,
} from "../controller/blog.controller";
import { authToken } from "../midleware/auth";

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
  .put("/edit-profile/username", editUserNameProfile)
  .put("/edit-profile/email", editEmailProfile)
  .put("/edit-profile/password", editPasswordProfile)
  .delete("/delete-profile", deleteProfile);

export default router;

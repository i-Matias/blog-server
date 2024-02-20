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
import {
  validateLogin,
  validatePost,
  validateRegister,
} from "../midleware/validation";

const router = express.Router();
const upload = multer();

router.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

router.get("/guest", guest);
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router
  .use(authToken)
  .post("/post", validatePost, upload.single("img"), post)
  .get("/posts", retrievePosts)
  .get("/post/search/", retrievePost)
  .put("/edit-profile/username", editUserNameProfile)
  .put("/edit-profile/email", editEmailProfile)
  .put("/edit-profile/password", editPasswordProfile)
  .delete("/delete-profile", deleteProfile);

export default router;

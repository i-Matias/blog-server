import express from "express";
import multer from "multer";
import {
  deletePost,
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
  validateEditedEmail,
  validateEditedPassword,
  validateEditedUserName,
  validateLogin,
  validatePost,
  validateRegister,
} from "../midleware/validation";

const router = express.Router();
const upload = multer();

router.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

router.get("/guest/", guest);
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router
  .use(authToken)
  .post("/post", upload.single("img"), validatePost, post)
  .get("/posts/", retrievePosts)
  .get("/post/search/", retrievePost)
  .put("/edit-profile/username", validateEditedUserName, editUserNameProfile)
  .put("/edit-profile/email", validateEditedEmail, editEmailProfile)
  .put("/edit-profile/password", validateEditedPassword, editPasswordProfile)
  .delete("/delete-post/:id", deletePost)
  .delete("/delete-profile", deleteProfile);

export default router;

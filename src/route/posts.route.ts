import express from "express";
import multer from "multer";
import postController from "../controller/posts.controller";
import { validatePost } from "../midleware/validation";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // Specify the directory where you want to save the uploaded files
  },
  filename: function (req, file, cb) {
    // You can customize the file name here if needed
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const router = express.Router();
const upload = multer({ storage });
router
  .post("/", upload.single("img"), validatePost, postController.post)
  .get("/", postController.retrievePosts)
  .get("/:title", postController.retrievePost)
  .delete("/:id", postController.deletePost);

export default router;

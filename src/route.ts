import express from "express";
import { guest, login, register } from "./blog.controller";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

router.post("/register", register);
router.post("/login", login);
router.post("/guest", guest);

export default router;

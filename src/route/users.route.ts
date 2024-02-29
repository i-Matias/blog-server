import express from "express";
import userController from "../controller/users.controller";
import { validateLogin, validateRegister } from "../midleware/validation";
import { authToken } from "../midleware/auth";

const router = express.Router();

router.get("/guest", userController.guest);
router.post("/register", validateRegister, userController.register);
router.post("/login", validateLogin, userController.login);

router.use(authToken);
router.post("/edit", userController.editUser);
router.delete("/delete-profile", userController.deleteProfile);

export default router;

import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import * as authController from "./auth.controller";

export const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);
authRouter.post("/refresh", authController.refresh);
authRouter.get("/me", authenticate, authController.me);

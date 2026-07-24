import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import * as assistantController from "./assistant.controller";

export const assistantRouter = Router();

assistantRouter.use(authenticate);

assistantRouter.post("/chat", assistantController.chat);

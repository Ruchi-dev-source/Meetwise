import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import * as participantController from "./participant.controller";

export const participantRouter = Router({ mergeParams: true });

participantRouter.use(authenticate);

participantRouter.post("/", participantController.inviteParticipant);
participantRouter.get("/", participantController.listParticipants);
participantRouter.delete("/:userId", participantController.removeParticipant);
participantRouter.patch("/me", participantController.updateSelfParticipant);

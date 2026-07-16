import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import * as meetingController from "./meeting.controller";

export const meetingRouter = Router();

meetingRouter.use(authenticate);

meetingRouter.post("/", meetingController.createMeeting);
meetingRouter.get("/", meetingController.listMeetings);
meetingRouter.get("/:id", meetingController.getMeetingById);
meetingRouter.patch("/:id", meetingController.updateMeeting);
meetingRouter.delete("/:id", meetingController.deleteMeeting);

import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { isProduction } from "../../config/env";
import * as aiController from "./ai.controller";

export const aiRouter = Router();

// Public, matching the existing /health module's precedent — infra and
// monitoring checks shouldn't need a token to confirm the AI provider is
// configured. Never returns the API key itself (see ai.service.getAiStatus).
aiRouter.get("/health", aiController.getHealth);

// Feature 7: "clearly isolate it for easy removal or protection later."
// This route is authenticated AND simply doesn't exist in production —
// the safest way to isolate a dev-only endpoint that calls a real,
// potentially costly external API.
if (!isProduction) {
  aiRouter.post("/test", authenticate, aiController.testPrompt);
}

import { Router } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { authMiddleware } from "../../common/middleware/authMiddleware.js";
import * as settingsController from "./settings.controller.js";

const router = Router();

router.use(authMiddleware);
router.get("/reminder", asyncHandler(settingsController.getReminder));
router.put("/reminder", asyncHandler(settingsController.updateReminder));

export default router;

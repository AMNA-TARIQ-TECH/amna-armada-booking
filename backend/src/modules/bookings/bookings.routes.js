import { Router } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { authMiddleware } from "../../common/middleware/authMiddleware.js";
import * as bookingsController from "./bookings.controller.js";

const router = Router();

router.use(authMiddleware);
router.get("/", asyncHandler(bookingsController.list));
router.post("/", asyncHandler(bookingsController.create));
router.get("/:id", asyncHandler(bookingsController.getOne));
router.put("/:id", asyncHandler(bookingsController.update));
router.patch("/:id/status", asyncHandler(bookingsController.updateStatus));
router.delete("/:id", asyncHandler(bookingsController.remove));

export default router;

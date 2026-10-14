import { Router } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { authMiddleware } from "../../common/middleware/authMiddleware.js";
import * as servicesController from "./services.controller.js";

const router = Router();

router.use(authMiddleware);
router.get("/", asyncHandler(servicesController.list));
router.post("/", asyncHandler(servicesController.create));
router.get("/:id", asyncHandler(servicesController.getOne));
router.put("/:id", asyncHandler(servicesController.update));
router.delete("/:id", asyncHandler(servicesController.remove));

export default router;

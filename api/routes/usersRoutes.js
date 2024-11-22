import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { updateProfile } from "../controllers/userController.js";
const router = express.Router();
// PUT METHOD + ROUTER
router.put("/update", protectRoute, updateProfile);

export default router;

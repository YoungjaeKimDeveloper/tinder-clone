import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  swipeLeft,
  swipeRight,
  getMatches,
  getUserProfiles,
} from "../controllers/matchController.js";

const router = express.Router();
// 어떤 행위로해서 Data를 업데이트해야할떄는 router.post
// 정보를 가져와야할때는 get
router.post("/swipe-left/:dislikedUserId", protectRoute, swipeLeft);
router.post("/swipe-right/:likedUserId", protectRoute, swipeRight);

// Match 된 정보 가져오기
// 개인정보를 가져올때는 protectRoute
router.get("/", protectRoute, getMatches);
router.get("/user-profiles", protectRoute, getUserProfiles);

export default router;

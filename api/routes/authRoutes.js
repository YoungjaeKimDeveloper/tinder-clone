import express from "express";
import { signup, login, logout } from "../controllers/authController.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();
// authentication Routes & Controllers
router.post("/signup", signup); // test with postman
router.post("/login", login);
router.post("/logout", logout);

// 유저 정보 보내주기
router.get("/me", protectRoute, (req, res) => {
  res.send({
    success: true,
    user: req.user,
  });
});

export default router;

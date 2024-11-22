import express from "express";
import { signup, login, logout } from "../controllers/authController.js";
const router = express.Router();
// authentication Routes & Controllers
router.post("/signup", signup); // test with postman
router.post("/login", login); 
router.post("/logout", logout);

export default router;

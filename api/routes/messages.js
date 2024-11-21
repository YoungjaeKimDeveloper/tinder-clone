import express from "express";

const router = express.Router();

router.get("/tester", (req, res) => {
  res.send({ message: "TESTER" });
});
export default router;

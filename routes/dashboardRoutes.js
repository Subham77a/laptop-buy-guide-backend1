import express from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verifyJWT, (req, res) => {
  res.json({ msg: "Dashboard access granted" });
});

export default router;

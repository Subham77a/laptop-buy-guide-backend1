import express from "express";
import { validateToken } from "../controllers/authController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/validate-token", verifyJWT, validateToken);

export default router;

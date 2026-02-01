import express from "express";
import { register, login, refresh, logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register); // POST /api/v1/auth/register
router.post("/login", login);       // POST /api/v1/auth/login
router.post("/refresh", refresh);   // POST /api/v1/auth/refresh
router.post("/logout", logout);     // POST /api/v1/auth/logout

export default router;

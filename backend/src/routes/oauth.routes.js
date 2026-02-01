import express from "express";
import passport from "passport";
import { oauthCallback, verifyPhone, oauthSuccess } from "../controllers/oauth.controller.js";
import { protectAuth } from "../middleware/auth.middleware.js";

const router = express.Router();


router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", oauthCallback("google"));
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback", oauthCallback("github"));
router.post("/verify-phone", protectAuth, verifyPhone);

router.get("/success", oauthSuccess);

export default router;

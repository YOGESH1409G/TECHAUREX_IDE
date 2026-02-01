import express from "express";
import User from "../models/user.model.js";
import Token from "../models/token.model.js";

const router = express.Router();


// Most recently registered user
router.get("/auth/register", async (req, res) => {
  const user = await User.findOne().sort({ createdAt: -1 }).select("name createdAt");
  if (!user) return res.status(200).json({ message: "No users registered yet 🫠" });

  res.status(200).json({
    message: "User registered successfully",
    data: {
      name: user.name,
      createdAt: user.createdAt
    }
  });
});


// All registered users
router.get("/auth/register/all", async (req, res) => {
  const users = await User.find().select("name createdAt");
  if (!users.length) return res.status(200).json({ message: "No users registered yet 🫠" });

  res.status(200).json({
    message: "All registered users",
    data: users
  });
});


//Most recently logged user
router.get("/auth/login", async (req, res) => {
  const user = await User.findOne().sort({ updatedAt: -1 }).select("name email updatedAt");
  if (!user) return res.status(200).json({ message: "No login records yet 🫠" });

  res.status(200).json({
    message: "Last login info",
    data: {
      name: user.name,
      email: user.email,
      lastLogin: user.updatedAt
    }
  });
});


//check refresh or not
router.get("/auth/refresh", async (req, res) => {
  const tokens = await Token.find().sort({ createdAt: -1 }).limit(2).populate("user", "name");
  if (!tokens.length) return res.json({ message: "No refresh tokens issued 🫠" });

  res.json({
    message: "Token refreshed successfully",
    data: {
      user: tokens[0].user.name,
      refreshToken: tokens[0].token,
      last_refreshToken: tokens[1]?.token || null
    }
  });
});

// Most recently logged out user
router.get("/auth/logout", async (req, res) => {
  // Find the most recently deleted/used refresh token
  const tokenDoc = await Token.findOne().sort({ updatedAt: -1 }).populate("user", "name");
  if (!tokenDoc) return res.status(200).json({ message: "No logout records yet 🫠" });

  res.status(200).json({
    message: "Logout successful",
    data: {
      user: tokenDoc.user.name,
      loggedOutAt: tokenDoc.updatedAt
    }
  });
});


export default router;

//congig/env.js
import dotenv from "dotenv";
dotenv.config();

export function loadEnv() {
  const {
    MONGO_URI,
    PORT = 4000,
    NODE_ENV = "development",
    CLIENT_URL = "http://localhost:5173",
    JWT_ACCESS_SECRET,
    JWT_ACCESS_EXPIRES,
    JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRES,
    CLOUDINARY_URL,
    REDIS_URL,
    USE_REDIS = "false",
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL,
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK_URL,
    BREVO_API_KEY,
    BREVO_SENDER_EMAIL = "noreply@techaurex.com",
    BREVO_SENDER_NAME = "TechAurex",
  } = process.env;

  if (!MONGO_URI) throw new Error("MONGO_URI is required");
  if (!JWT_ACCESS_SECRET) throw new Error("JWT_ACCESS_SECRET is required");
  if (!JWT_REFRESH_SECRET) throw new Error("JWT_REFRESH_SECRET is required");
  if (!JWT_ACCESS_EXPIRES) throw new Error("JWT_ACCESS_EXPIRES is required");
  if (!JWT_REFRESH_EXPIRES) throw new Error("JWT_REFRESH_EXPIRES is required");
  // Cloudinary is optional for local dev (file uploads won't work without it)
  // if (!CLOUDINARY_URL) throw new Error("CLOUDINARY_URL is required");
  if (USE_REDIS === "true") {
    if (!REDIS_URL) throw new Error("REDIS_URL is required when USE_REDIS=true");}
  // OAuth credentials are optional for local dev
  // if (!GOOGLE_CLIENT_ID) throw new Error("GOOGLE_CLIENT_ID is required");
  // if (!GOOGLE_CLIENT_SECRET) throw new Error("GOOGLE_CLIENT_SECRET is required");
  // if (!GOOGLE_CALLBACK_URL) throw new Error("GOOGLE_CALLBACK_URL is required");
  // if (!GITHUB_CLIENT_ID) throw new Error("GITHUB_CLIENT_ID is required");
  // if (!GITHUB_CLIENT_SECRET) throw new Error("GITHUB_CLIENT_SECRET is required");
  // if (!GITHUB_CALLBACK_URL) throw new Error("GITHUB_CALLBACK_URL is required");

  return {
    MONGO_URI,
    PORT: Number(PORT),
    NODE_ENV,
    CLIENT_URL,
    JWT_ACCESS_SECRET,
    JWT_ACCESS_EXPIRES,
    JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRES,
    CLOUDINARY_URL,
    REDIS_URL,
    USE_REDIS,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL,
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK_URL,
    BREVO_API_KEY,
    BREVO_SENDER_EMAIL,
    BREVO_SENDER_NAME,
  };
}

// src/services/auth.service.js
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import Token from "../models/token.model.js";
import { signAccessToken, verifyToken, signRefreshToken, decodeToken } from "../helpers/jwt.helper.js";
import { ApiError } from "../utils/ApiError.js";

export async function registerUser({ name, phone, email, password }) {
  const existing = await User.findOne({$or: [{ phone }, { email: email ? email.toLowerCase() : null }],});
  if (existing) throw new ApiError(400, "User with provided phone or email already exists");

  const user = await User.create({
    name,
    phone,
    email: email ? email.toLowerCase() : undefined,
    username: email ? email.split("@")[0] : undefined,
    password,
    phoneVerified: true,
  });
 
  const payload = { sub: user._id.toString() };
   // Generate tokens
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  // Hash refresh token for DB
  const hashedRefresh = await bcrypt.hash(refreshToken, 10);
  const decoded = decodeToken(refreshToken);
  const expiresAt = decoded && decoded.exp ? new Date(decoded.exp * 1000) : null;

  await Token.create({
    user: user._id,
    token: hashedRefresh,
    expiresAt,
    deviceInfo: "signup",
  });
  const safeUser = await User.findById(user._id).select("-password").lean();
  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
}


export async function loginUser({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) throw new ApiError(401, "Invalid credentials");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, "Invalid credentials");

  // generate tokens
  const payload = { sub: user._id.toString() };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // hash refresh token for DB
  const hashedRefresh = await bcrypt.hash(refreshToken, 10);
  const decoded = decodeToken(refreshToken);
  const expiresAt = decoded && decoded.exp ? new Date(decoded.exp * 1000) : null;

  await Token.create({
    user: user._id,
    token: hashedRefresh,
    expiresAt,
    deviceInfo: "login",
  });

  // safe user object
  const safeUser = await User.findById(user._id).select("-password").lean();

  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
}



export async function logoutUser(refreshToken) {
  if (!refreshToken) throw new ApiError(400, "Refresh token required");

  const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
  const userId = decoded.sub;
  const tokens = await Token.find({ user: userId });
  let removed = false;

  for (const tokenDoc of tokens) {
    const match = await bcrypt.compare(refreshToken, tokenDoc.token);
    if (match) {
      await Token.findByIdAndDelete(tokenDoc._id);
      removed = true;
      break;
    }
  }
  if (!removed) throw new ApiError(404, "Session already expired or invalid");
  return { message: "User logged out successfully" };
}


//NOTE: created separate token.service.js for refresh token logic 
//LINK - 'src/services/token.service.js'
// export async function refreshAuth(refreshToken) {
//   if (!refreshToken) throw new ApiError(401, "Refresh token missing");

//   // Verify refresh token and extract userId
//   let decoded;
//   try {
//     decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
//   } catch {
//     throw new ApiError(401, "Invalid or expired refresh token");
//   }

//   // Check token exists in DB and is valid
//   const tokens = await Token.find({ user: decoded.sub });
//   const validToken = await Promise.any(tokens.map(t => bcrypt.compare(refreshToken, t.token).then(v => v ? t : null)))
//     .catch(() => null);

//   if (!validToken) throw new ApiError(401, "Invalid or expired refresh token");

//   // Generate new access token (refresh token stays the same)
//   return { newAccessToken: signAccessToken({ sub: decoded.sub }), refreshToken };
// }


//oauth.service.js
import bcrypt from "bcrypt";
import User  from "../models/user.model.js"
import Token from "../models/token.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {signAccessToken,signRefreshToken, decodeToken} from "../helpers/jwt.helper.js";

  //If user exists → log in
  //Else → create new user (phoneVerified = false)
 
//NOTE -  Handles Google / GitHub OAuth login.
export const handleOAuthLogin = async (profileData) => {
  const { name, email, avatar, provider } = profileData;

  if (!email)throw new ApiError(400, `${provider} account must provide a valid email`);
  
  let user = await User.findOne({ email });
  // If new user, create one
  if (!user) {
    // Generate username from email (required field)
    const baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_");
    let username = baseUsername;
    let counter = 1;
    
    // Ensure unique username
    while (await User.findOne({ username })) {
      username = `${baseUsername}${counter}`;
      counter++;
    }
    
    user = await User.create({
      name,
      email,
      username, // ✅ Required field added
      avatar,
      provider,
      phoneVerified: false,
      password: Math.random().toString(36).slice(-10), // random placeholder password
    });
  } else {
    // Update avatar & provider if changed
    user.avatar = avatar || user.avatar;
    user.provider = provider;
    await user.save({ validateBeforeSave: false });
  }

  // Generate tokens with consistent payload structure (use 'sub' like manual auth)
  const payload = { sub: user._id.toString() };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // ✅ Hash refresh token before storing (security fix)
  const hashedRefresh = await bcrypt.hash(refreshToken, 10);
  const decoded = decodeToken(refreshToken);
  const expiresAt = decoded && decoded.exp ? new Date(decoded.exp * 1000) : null;

  await Token.create({
    user: user._id,
    token: hashedRefresh, // ✅ Store hashed token
    expiresAt,
    deviceInfo: `${provider}-oauth`,
  });


  // Return unified response
  return new ApiResponse(
    200,
    {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        provider: user.provider,
        phoneVerified: user.phoneVerified,
      },
      tokens: { accessToken, refreshToken },
    },
    "OAuth login successful"
  );
};


//NOTE - Handles phone verification after OAuth login
export const verifyPhoneAndUpdate = async (userId, phone) => {
  if (!phone) throw new ApiError(400, "Phone number is required");

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  user.phone = phone;
  user.phoneVerified = true;
  await user.save({ validateBeforeSave: false });

  // Use consistent payload structure (use 'sub' like manual auth)
  const payload = { sub: user._id.toString() };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // ✅ Hash refresh token before storing (security fix)
  const hashedRefresh = await bcrypt.hash(refreshToken, 10);
  const decoded = decodeToken(refreshToken);
  const expiresAt = decoded && decoded.exp ? new Date(decoded.exp * 1000) : null;

  // ✅ Replace old refresh tokens (if any)
  await Token.deleteMany({ user: user._id });
  await Token.create({
    user: user._id,
    token: hashedRefresh, // ✅ Store hashed token
    expiresAt,
    deviceInfo: "phone-verification",
  });

  return new ApiResponse(
    200,
    {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        phoneVerified: user.phoneVerified,
      },
      tokens: { accessToken, refreshToken },
    },
    "Phone verified successfully"
  );
};

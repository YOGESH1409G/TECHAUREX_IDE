import passport from "passport";
import { handleOAuthLogin, verifyPhoneAndUpdate } from "../services/oauth.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { loadEnv } from "../config/env.js";

const { CLIENT_URL } = loadEnv();

 //Google / GitHub OAuth callback controller
export const oauthCallback = (provider) => (req, res, next) => {
  passport.authenticate(provider, { session: false }, async (err, profileData) => {
    try {
      if (err || !profileData) {
        // Redirect to frontend with error
        return res.redirect(`${CLIENT_URL}/login?error=${encodeURIComponent(`${provider} authentication failed`)}`);
      }

      const result = await handleOAuthLogin(profileData);
      
      // Extract tokens from the ApiResponse
      const { accessToken, refreshToken } = result.data.tokens;
      const user = result.data.user;

      // Redirect back to frontend with tokens as URL parameters
      // Frontend will extract and store them
      const redirectUrl = `${CLIENT_URL}/oauth/callback?` +
        `token=${encodeURIComponent(accessToken)}&` +
        `refreshToken=${encodeURIComponent(refreshToken)}&` +
        `user=${encodeURIComponent(JSON.stringify(user))}`;

      return res.redirect(redirectUrl);
    } catch (error) {
      // Redirect to frontend with error
      const errorMessage = error.message || 'OAuth authentication failed';
      return res.redirect(`${CLIENT_URL}/login?error=${encodeURIComponent(errorMessage)}`);
    }
  })(req, res, next);
};


 // POST /api/v1/oauth/verify-phone
export const verifyPhone = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const userId = req.user?._id || req.user?.id;

    if (!userId) throw new ApiError(401, "Unauthorized access");
    if (!phone) throw new ApiError(400, "Phone number is required");

    const result = await verifyPhoneAndUpdate(userId, phone);
    return res.status(result.statusCode).json(result);
  } catch (error) {
    next(error);
  }
};


 //GET /api/v1/oauth/success 
export const oauthSuccess = (req, res) => {
  return res.status(200).json(new ApiResponse(200, null, "OAuth setup working ✅"));
};

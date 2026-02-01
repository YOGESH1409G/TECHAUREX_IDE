import { registerUser, loginUser, logoutUser } from "../services/auth.service.js";
import { refreshAccessToken } from "../services/token.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";

/**
 * @desc Register a new user
 * @route POST /api/v1/auth/register
 */
export const register = catchAsync(async (req, res) => {
  const { name, email, phone, password } = req.body;
  const result = await registerUser({ name, email, phone, password });
  return res.status(201).json(new ApiResponse(201, result, "User registered successfully"));
});

/**
 * @desc Login user
 * @route POST /api/v1/auth/login
 */
export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await loginUser({ email, password });
  return res.status(200).json(new ApiResponse(200, result, "Login successful"));
});


/**
 * @desc Logout user
 * @route POST /api/v1/auth/logout
 */
export const logout = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await logoutUser(refreshToken);
  return res.status(200).json(new ApiResponse(200, result, "Logout successful"));
});


/**
 * @desc Refresh JWT tokens
 * @route POST /api/v1/auth/refresh
 */
export const refresh = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await refreshAccessToken(refreshToken);
  // Send new access token to frontend
  return res
    .status(200)
    .json(new ApiResponse(200, result, "Access token refreshed successfully"));
});
import { Session } from "../models/session.model.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { ApiError } from "../utils/apiError.js";
import { generateRefreshToken } from "../utils/generateRefreshToken.js";
import { generateAccessToken } from "../utils/generateAccessToken.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";

export const refreshTokenController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new ApiError(401, "Unauthorized - No refresh token");
    }

    // verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // check session exists and is valid
    const session = await Session.findOne({
      userId: decoded.userId,
      refreshToken,
      isValid: true,
    });
    if (!session) {
      throw new ApiError(401, "Unauthorized - No session found");
    }

    const userDetails = await User.findById(decoded.userId).select("-password");
    if (!userDetails) throw new ApiError(401, "User not found");

    // regenerate access token
    const newAccessToken = generateAccessToken(
      userDetails._id,
      userDetails.email,
      userDetails.role,
    );
    // reGenerate JWT token - refresh
    const newRefreshToken = generateRefreshToken(decoded.userId);
    // update session with new refresh token
    await Session.updateOne(
      { userId: decoded.userId, isValid: true }, // for single device login
      // { userId: session._id, isValid: true }, // for multi device login
      {
        refreshToken: newRefreshToken,
        lastActive: Date.now(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }, // ✅ reset 7 days
    );
    // set Refresh token in cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    return res.status(200).json(
      new ApiResponse(200, "Token refreshed", {
        accessToken: newAccessToken,
        user: {
          id: userDetails._id,
          email: userDetails.email,
          username: userDetails.username,
          role: userDetails.role,
        },
      }),
    );
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return next(new ApiError(401, "Unauthorized - Invalid refresh token"));
    }
    next(error);
  }
};

import httpStatus from "http-status";
import { promisify } from "util";
import jwt from "jsonwebtoken";

import ApiError from "../utils/api-error.js";
import catchAsync from "../utils/catch-async.js";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";

const auth = (action) =>
  catchAsync(async (req, res, next) => {
    // Authentication
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new ApiError(
          httpStatus.UNAUTHORIZED,
          "You are not logged in! Please log in to get access."
        )
      );
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.userId);

    if (!currentUser) {
      return next(
        new ApiError(
          httpStatus.UNAUTHORIZED,
          "The user belonging to this token does no longer exist."
        )
      );
    }

    // 4) Check if user is active (not suspended)
    if (!currentUser.isActive) {
      return next(
        new ApiError(
          httpStatus.UNAUTHORIZED,
          "Your account has been disabled. Please contact the administrator for more information."
        )
      );
    }

    // 5) Check if user changed password after the token was issued
    if (currentUser.passwordChangedAt.getTime() / 1000 > decoded.iat) {
      return next(
        new ApiError(
          httpStatus.UNAUTHORIZED,
          "User recently changed password! Please log in again."
        )
      );
    }

    // Authorization
    const roleObject = await Role.findOne({ name: currentUser.role });

    if (!roleObject) {
      return next(new ApiError(httpStatus.NOT_FOUND, "Role does not exist."));
    }

    const permission = roleObject.permissions.get(action);

    if (!permission) {
      return next(
        new ApiError(
          httpStatus.UNAUTHORIZED,
          "You do not have permission to perform this action."
        )
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;

    next();
  });

export default auth;

import jwt from "jsonwebtoken";
import crypto from "crypto";
import * as userService from "./user.service.js";
import ApiError from "../utils/api-error.js";
import httpStatus from "http-status";
import User from "../models/user.model.js";

const generateAuthToken = async (userId, role) => {
  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRATION + "h",
  });

  return token;
};

const generateResetToken = () => {
  const tokenBuffer = crypto.randomBytes(32);
  const resetToken = tokenBuffer.toString("hex");
  console.log(resetToken);
  return resetToken;
};

const register = async (registerBody) => {
  const { email, username } = registerBody;

  const isExistingUser = await userService.checkIsExistingUser(email, username);

  if (!isExistingUser) {
    await userService.createUser(registerBody);
  }

  return { message: "Successfully registered !!" };
};

const login = async (email, password) => {
  const user = await userService.findByCredentials(email, password);
  const token = await generateAuthToken(user._id, user.role);

  return {
    user,
    token,
    tokenExpiresIn: process.env.JWT_ACCESS_EXPIRATION * 60 * 60,
  };
};

const changePassword = async (userId, oldPassword, newPassword) => {
  if (oldPassword === newPassword) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "New password must be different from old password !!"
    );
  }

  const user = await userService.getUser(userId, true);

  const isMatch = await userService.checkPassword(user.password, oldPassword);

  if (!isMatch) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Incorrect password !!");
  }

  user.password = newPassword;
  await user.save();

  return { message: "Password changed successfully !!" };
};

const resetPasswordRequest = async (email) => {
  const user = await userService.getUser({ email });
  if (!user) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User Not Exists! Kindly register"
    );
  }
  if ((user.passwordChangedAt.getTime()) + 30 * 60 * 1000 > Date.now()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password Recently Changed!");
  }
  if (user.resetToken && (user.resetToken.createdAt.getTime()) + 30 * 60 * 1000 > Date.now()) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Password Reset Token sent already check your mail!"
    );
  }

  const resetToken = generateResetToken();

  user.resetToken = {
    token: resetToken,
    createdAt: Date.now(),
    expiry: Date.now() + 30 * 60 * 1000,
  };
  await user.save();

  return {
    resetToken,
    message: "Token generated",
  };
};

const resetPassword = async (passwordResetBody) => {
  const { resetToken, password } = passwordResetBody;

  const user = await User.findOne({ "resetToken.token": resetToken });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invalid Token!");
  }

  if ((user.resetToken.expiry.getTime()) < Date.now()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Token Expired!");
  }

  user.password = password;
  await user.save();

  return {
    user,
    message: "Password Updated Successfully!",
  };
};

export { register, login, changePassword, resetPasswordRequest, resetPassword };

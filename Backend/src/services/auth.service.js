import jwt from "jsonwebtoken";
import crypto from "crypto";
import * as userService from "./user.service.js";
import ApiError from "../utils/api-error.js";
import httpStatus from "http-status";
import User from "../models/user.model.js";
import { sendTemplateEmail, templates } from "../utils/brevo.js";

const generateAuthToken = async (userId, role) => {
  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRATION + "h",
  });

  return token;
};

const generateResetToken = () => {
  const tokenBuffer = crypto.randomBytes(32);
  const resetToken = tokenBuffer.toString("hex");
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
  if (!user.isActive) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Account Disabled!");
  }
  if (user.passwordChangedAt.getTime() + 30 * 60 * 1000 > Date.now()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password Recently Changed!");
  }

  if (
    user.resetToken &&
    user.resetToken.createdAt &&
    user.resetToken.createdAt.getTime() + 30 * 60 * 1000 > Date.now()
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Reset token already sent via mail, try again later!"
    );
  }

  const resetToken = generateResetToken();

  user.resetToken = {
    token: resetToken,
    createdAt: Date.now(),
    expiry: Date.now() + 10 * 60 * 1000,
  };

  await user.save();

  sendTemplateEmail({
    to: email,
    subject: "Reset Password",
    templateId: templates.resetPassword,
    params: {
      resetLink: process.env.HOST_URL + "/reset-password?token=" + resetToken,
    },
  });

  return {
    message: "Reset Password Mail Sent Successfully!",
  };
};

const resetPassword = async (passwordResetBody) => {
  const { resetToken, password } = passwordResetBody;

  const user = await User.findOne({ "resetToken.token": resetToken });

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Token!");
  }

  if (user.resetToken.expiry.getTime() < Date.now()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Token Expired!");
  }

  user.password = password;
  user.resetToken = null;
  await user.save();

  return {
    message: "Password Updated Successfully!",
  };
};

const googleLogin = async (googleLoginBody) => {
  const { email, name, sub } = googleLoginBody;
  const username = email.split("@")[0];

  const isExistingUser = await userService.checkIsExistingUser(email, username);

  if (!isExistingUser) {
    await userService.createUser({
      firstName: name,
      email,
      username,
      password: sub,
    });
  }

  const user = await userService.findByCredentials(email, sub);
  const token = await generateAuthToken(user._id, user.role);

  return {
    user,
    token,
    tokenExpiresIn: process.env.JWT_ACCESS_EXPIRATION * 60 * 60,
  };
};

export {
  register,
  login,
  changePassword,
  resetPasswordRequest,
  resetPassword,
  googleLogin,
};

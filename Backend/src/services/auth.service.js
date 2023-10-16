import jwt from "jsonwebtoken";

import * as userService from "./user.service.js";
import ApiError from "../utils/api-error.js";
import httpStatus from "http-status";

const generateAuthToken = async (userId, role) => {
  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRATION + "h",
  });

  return token;
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

  return { user, token };
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

export { register, login, changePassword };

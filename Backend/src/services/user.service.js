import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import ApiError from "../utils/api-error.js";
import httpStatus from "http-status";

const findByCredentials = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid credentials !!");
  }

  if (!user.isActive) {
    throw new ApiError(httpStatus.BAD_REQUEST, "This account is disabled !!");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid credentials !!");
  }

  return { userId: user._id, role: user.role };
};

const checkIsExistingUser = async (email, username) => {
  const userCheckEmail = await User.findOne({ email });

  if (userCheckEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already exists !!");
  }

  const userCheckUsername = await User.findOne({ username });

  if (userCheckUsername) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Username already exists !!");
  }

  return false;
};

const createUser = async (userBody) => {
  const user = await User.create(userBody);

  if (!user) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error in creating user !!"
    );
  }

  return user;
};

const getUser = async (findBody) => {
  const user = await User.findOne(findBody);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found !!");
  }

  return user;
};

export { findByCredentials, createUser, checkIsExistingUser, getUser };

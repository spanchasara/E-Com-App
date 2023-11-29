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

  user.password = undefined;
  return user;
};

const checkIsExistingUser = async (email, username) => {
  const userCheckEmail = await User.findOne({ email });

  if (userCheckEmail) {
    return true;
  }

  const userCheckUsername = await User.findOne({ username });

  if (userCheckUsername) {
    return true;
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

const getUser = async (findBody, withPassword = false) => {
  const user = await User.findOne(findBody).select(withPassword && "+password");

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found !!");
  }

  return user;
};

const checkPassword = async (userPassword, inputPassword) => {
  return await bcrypt.compare(inputPassword, userPassword);
};

const getAllUsers = async (role, options) => {
  let query = role ? { role } : {};

  if (role) {
    if (role === "seller") {
      query = {
        $or: [{ role }, { role: "customer", companyName: { $ne: null } }],
      };
    } else if (role === "customer") {
      query = { role: "customer", companyName: null };
    }
  }

  const users = await User.paginate(query, options);
  if (!users) {
    throw new ApiError(httpStatus.NOT_FOUND, "No user not found !!");
  }
  return users;
};

const updateUser = async (userId, body) => {
  const user = await User.findByIdAndUpdate(userId, body, {
    new: true,
  });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  return user;
};

const getPublicUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found !!");
  }
  return user;
};

const toggleAccountStatus = async (userId, isSuspended) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isActive: !isSuspended },
    {
      new: true,
    }
  );
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found !!");
  }
  return user;
};

export {
  findByCredentials,
  createUser,
  checkIsExistingUser,
  getUser,
  getAllUsers,
  updateUser,
  getPublicUser,
  toggleAccountStatus,
  checkPassword,
};

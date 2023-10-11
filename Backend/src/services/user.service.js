import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import ApiError from "../utils/api-error.js";

const findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(400, "Unable to login");
  }

  return user;
};

const createUser = async (userBody) => {
  const user = await User.create(userBody);

  if (!user) {
    throw new ApiError(400, "Unable to login");
  }

  return user;
};

export { findByCredentials, createUser };

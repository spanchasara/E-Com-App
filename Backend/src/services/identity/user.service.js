import bcrypt from "bcryptjs";

import User from "../../models/identity/user.model.js";

const findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

const createUser = async (userBody) => {
  const user = await User.create(userBody);

  if (!user) {
    throw new Error("Unable to create user !");
  }

  return user;
};

export { findByCredentials, createUser };

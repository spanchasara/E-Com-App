import jwt from "jsonwebtoken";

import * as userService from "./user.service.js";

const generateAuthToken = async (user) => {
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION }
  );

  return token;
};

const register = async (registerBody) => {
  const user = await userService.createUser(registerBody);
  const token = await generateAuthToken(user);

  const userObject = user.toObject();

  return { user: userObject };
};

const login = async (email, password) => {
  const user = await userService.findByCredentials(email, password);
  const token = await generateAuthToken(user);

  const userObject = user.toObject();

  return { user: userObject, token };
};

export { register, login };

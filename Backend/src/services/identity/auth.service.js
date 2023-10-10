import jwt from "jsonwebtoken";

import * as userService from "./user.service.js";

const generateAuthToken = async (user) => {
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION }
  );

  user.tokens = user.tokens.concat(token);
  await user.save();

  return token;
};

const signup = async (signupBody) => {
  const user = await userService.createUser(signupBody);
  const token = await generateAuthToken(user);

  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.__v;

  return { user: userObject, token };
};

const login = async (email, password) => {
  const user = await userService.findByCredentials(email, password);
  const token = await generateAuthToken(user);

  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.__v;

  return { user: userObject, token };
};

export { signup, login };

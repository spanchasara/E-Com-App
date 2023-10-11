import jwt from "jsonwebtoken";

import * as userService from "./user.service.js";

const generateAuthToken = async (userId, role) => {
  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRATION,
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
  const { userId, role } = await userService.findByCredentials(email, password);
  const token = await generateAuthToken(userId, role);

  const user = await userService.getUser({ _id: userId });

  return { user, token };
};

export { register, login };

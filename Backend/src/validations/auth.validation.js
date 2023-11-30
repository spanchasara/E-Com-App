import Joi from "joi";

const register = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().allow(""),
    username: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    oldPassword: Joi.string().required().min(3),
    newPassword: Joi.string().required().min(3),
  }),
};

const resetPasswordRequest = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    resetToken: Joi.string().required(),
    password: Joi.string().required().min(3),
  }),
};

const socialLogin = {
  params: Joi.object().keys({
    provider: Joi.string().required(),
  }), 
  query: Joi.object().keys({
    idToken: Joi.string().required(),
  }), 
}

export { register, login, changePassword, resetPasswordRequest, resetPassword, socialLogin };

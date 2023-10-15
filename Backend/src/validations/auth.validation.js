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

export { register, login };

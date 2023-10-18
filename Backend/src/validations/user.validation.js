import Joi from "joi";

const getPublicUser = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};
const getAllUsers = {
  params: Joi.object().keys({
    role: Joi.string().allow("customer", "admin", "seller", ""),
  }),
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    sort: Joi.string().allow(""),
  }),
};
const updateUser = {
  body: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    username: Joi.string(),
    email: Joi.string().email(),
  }),
};

const toggleAccountStatus = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
  query: Joi.object().keys({
    isSuspended: Joi.boolean().required(),
  }),
};

export { getPublicUser, getAllUsers, updateUser, toggleAccountStatus };

import Joi from "joi";

const getPublicUser = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};
const getAllUsers = {
  query: Joi.object().keys({
    page: Joi.number(),
    limit: Joi.number(),
    sort: Joi.string(),
  }),
};
const updateUser = {
  body: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    username: Joi.string(),
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

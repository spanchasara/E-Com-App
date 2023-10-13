import Joi from "joi";

const createRolePermissions = {
  body: Joi.object().keys({
    name: Joi.string().required().valid("customer", "seller", "admin"),
    permissions: Joi.object().pattern(Joi.string(), Joi.boolean()).required(),
  }),
};

const updateRolePermissions = {
  params: Joi.object().keys({
    role: Joi.string().required().valid("customer", "seller", "admin"),
  }),
  body: Joi.object().keys({
    permissions: Joi.object().pattern(Joi.string(), Joi.boolean()).required(),
  }),
};

export { createRolePermissions, updateRolePermissions };

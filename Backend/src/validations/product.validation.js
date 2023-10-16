import Joi from "joi";

const getProducts = {
  params: Joi.object().keys({
    productId: Joi.string().allow(""),
  }),
  query: Joi.object().keys({
    keyword: Joi.string().allow(""),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    sort: Joi.string().allow(""),
  }),
};

const createProduct = {
  body: Joi.object().keys({
    title: Joi.string().required().min(3).max(30),
    description: Joi.string().required().min(10).max(100),
    price: Joi.number().min(1).required(),
    specifications: Joi.object().required(),
  }),
};

export { getProducts, createProduct };

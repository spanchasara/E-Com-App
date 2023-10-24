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

const getSellerProducts = {
  query: Joi.object().keys({
    keyword: Joi.string().allow(""),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    sort: Joi.string().allow(""),
  }),
};

const createProduct = {
  body: Joi.object().keys({
    title: Joi.string().required().min(3).max(150),
    description: Joi.string().required().min(10).max(300),
    price: Joi.number().min(1).required(),
    specifications: Joi.object().required(),
    stock: Joi.number().min(0).required(),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    title: Joi.string().min(3).max(150),
    description: Joi.string().min(10).max(300),
    price: Joi.number().min(1),
    specifications: Joi.object(),
    stock: Joi.number().min(0),
  }),
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().required(),
  }),
};

export {
  getProducts,
  getSellerProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};

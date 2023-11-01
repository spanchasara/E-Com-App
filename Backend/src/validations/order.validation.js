import Joi from "joi";

const createOrder = {
  body: Joi.object()
    .keys({
      addressId: Joi.string().required(),
      selectedProductIds: Joi.array().items(Joi.string()),
      productId: Joi.string(),
      qty: Joi.number(),
    })
    .custom((value, helpers) => {
      const { selectedProductIds, productId, qty } = value;
      if (selectedProductIds) {
        if (qty || productId) {
          return helpers.message("Only one field allowed: selectedProductIds");
        }
      } else {
        if (!qty && !productId) {
          return value;
        }
        if (!qty || !productId) {
          return helpers.message("Provide both fields: productId and qty");
        }
      }
      return value;
    }),
  params: Joi.object().keys({
    action: Joi.string().required().valid("single", "partial", "full"),
  }),
};

const getUserOrders = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    sort: Joi.string().default("-createdAt"),
  }),
  params: Joi.object().keys({
    orderId: Joi.string().optional(),
  }),
};

const getSellerOrders = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    sort: Joi.string().default("-createdAt"),
    isCurrent: Joi.boolean().default(true),
  }),
};

const getAllAdminOrders = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    sort: Joi.string().default("-createdAt"),
  }),
};

export { getUserOrders, createOrder, getSellerOrders, getAllAdminOrders };

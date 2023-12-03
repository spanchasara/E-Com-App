import Joi from "joi";

const addCoupon = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    type: Joi.string()
      .required()
      .valid("general", "first-order", "festival")
      .default("general"),
    discountPercent: Joi.number().required().min(1).max(100),
    activationDate: Joi.date().greater("now"),
    expiryDate: Joi.date()
      .required()
      .greater(Joi.ref("activationDate"))
      .greater("now"),
  }),
};

const getCoupon = {
  params: Joi.object().keys({
    couponId: Joi.string().required(),
  }),
};

const getAllCoupons = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    sort: Joi.string().default("-createdAt"),
    isOwn: Joi.boolean().default(true),
    isEnabled: Joi.boolean().default(true),
  }),
};

const getAllCustomerCoupons = {
  query: Joi.object().keys({
    keyword: Joi.string()
      .valid("available", "used", "not-active", "all")
      .default("all"),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    sort: Joi.string().default("-discountPercent"),
  }),
};

const updateCoupon = {
  params: Joi.object().keys({
    couponId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    type: Joi.string().valid("general", "first-order", "festival"),
    discountPercent: Joi.number().min(1).max(100),
    activationDate: Joi.date(),
    expiryDate: Joi.date().greater("now"),
    isEnabled: Joi.boolean(),
  }),
};

const deleteCoupon = {
  params: Joi.object().keys({
    couponId: Joi.string().required(),
  }),
};

export {
  addCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  getAllCoupons,
  getAllCustomerCoupons,
};

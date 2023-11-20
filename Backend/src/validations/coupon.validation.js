import Joi from "joi";

const addCoupon = {
  body: Joi.object().keys({
    discountPercent: Joi.number().required().min(1).max(100),
    validityPeriod: Joi.number().required(),
    userUsageLimit: Joi.number().required(),
    couponUsageLimit: Joi.number()
      .required()
      .greater(Joi.ref("userUsageLimit"))
      .allow(Joi.ref("userUsageLimit")),
    expiryDate: Joi.date().required().greater("now"),
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
    isActive: Joi.boolean().default(true),
  }),
};

const updateCoupon = {
  params: Joi.object().keys({
    couponId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    discountPercent: Joi.number().min(1).max(100),
    validityPeriod: Joi.number(),
    userUsageLimit: Joi.number(),
    couponUsageLimit: Joi.number().greater(Joi.ref("userUsageLimit")),
    expiryDate: Joi.date().greater("now"),
    isActive: Joi.boolean(),
  }),
};

const deleteCoupon = {
  params: Joi.object().keys({
    couponId: Joi.string().required(),
  }),
};

export { addCoupon, getCoupon, updateCoupon, deleteCoupon, getAllCoupons };

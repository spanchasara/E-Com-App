import Joi from "joi";

const addFeedback = {
  body: Joi.array().items({
    orderId: Joi.string().required(),
    productId: Joi.string(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().allow(""),
  }),
};

const getFeedback = {
  params: Joi.object().keys({
    orderId: Joi.string().required(),
  }),
};

export { addFeedback, getFeedback };

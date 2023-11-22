import Joi from "joi";

const addFeedback = {
  params: Joi.object().keys({
    type: Joi.string().required().valid("product", "app"),
  }),
  body: Joi.object().keys({
    orderId: Joi.string().required(),
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

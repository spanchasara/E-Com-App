import Joi from "joi";

const updateCustomerCart = {
  body: Joi.object()
    .keys({
      productId: Joi.string().required(),
      isAdd: Joi.boolean(),
      qty: Joi.number().integer().min(0),
    })
    .custom((value, helpers) => {
      const { isAdd, qty } = value;
      if (
        (isAdd === undefined && qty === undefined) ||
        (isAdd !== undefined && qty !== undefined)
      ) {
        return helpers.message("Either qty or isAdd must be provided");
      }

      return value;
    }),
};

export { updateCustomerCart };

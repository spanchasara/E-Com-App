import Joi from "joi";

const getSingleAddress = {
  params: Joi.object().keys({
    addressId: Joi.string().required(),
  }),
};

const addAddress = {
  body: Joi.object().keys({
    fullName: Joi.string().required(),
    phoneNo: Joi.string()
      .regex(/^\d{10}$/)
      .required(),
    country: Joi.string().optional().valid("India", ""),
    state: Joi.string().required(),
    city: Joi.string().required(),
    addressLane1: Joi.string().required(),
    addressLane2: Joi.string().optional(),
    landmark: Joi.string().optional(),
    pincode: Joi.string()
      .regex(/^\d{6}$/)
      .required(),
  }),
};

const editAddress = {
  params: Joi.object().keys({
    addressId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    fullName: Joi.string().optional(),
    phoneNo: Joi.string()
      .regex(/^\d{10}$/)
      .optional(),
    country: Joi.string().optional().valid("India", ""),
    state: Joi.string().optional(),
    city: Joi.string().optional(),
    addressLane1: Joi.string().optional(),
    addressLane2: Joi.string().optional(),
    landmark: Joi.string().optional(),
    pincode: Joi.string()
      .regex(/^\d{6}$/)
      .optional(),
  }),
};

const deleteAddress = {
  params: Joi.object().keys({
    addressId: Joi.string().required(),
  }),
};

export { getSingleAddress, addAddress, deleteAddress, editAddress };

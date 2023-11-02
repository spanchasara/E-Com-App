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
    addressLane2: Joi.string().allow(""),
    landmark: Joi.string().allow(""),
    pincode: Joi.string()
      .regex(/^\d{6}$/)
      .required(),
    isDefault: Joi.boolean().default(false),
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
    addressLane2: Joi.string().allow(""),
    landmark: Joi.string().allow(""),
    pincode: Joi.string()
      .regex(/^\d{6}$/)
      .optional(),
    isDefault: Joi.boolean().default(false),
  }),
};

const deleteAddress = {
  params: Joi.object().keys({
    addressId: Joi.string().required(),
  }),
};

const toggleDefaultAddress = {
  body: Joi.object().keys({
    oldAddressId: Joi.string().required(),
    newAddressId: Joi.string().required(),
  }),
};

export {
  getSingleAddress,
  addAddress,
  deleteAddress,
  editAddress,
  toggleDefaultAddress,
};

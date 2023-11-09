import Cart from "../models/cart.model.js";
import ApiError from "../utils/api-error.js";
import httpStatus from "http-status";

const getCustomerCart = async (filterQuery, populate = "") => {
  const cart1 = await Cart.findOne(filterQuery).populate(populate);

  const cart2 = cart1 || (await createCustomerCart(filterQuery));

  return cart2;
};

const customerCartExists = async (filterQuery) => {
  const cart = await Cart.findOne(filterQuery);
  return cart;
};

const createCustomerCart = async (createBody) => {
  const cart = await Cart.create(createBody);

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cart not found !!");
  }

  return cart;
};

export { getCustomerCart, createCustomerCart, customerCartExists };

import Order from "../models/order.model.js";
import ApiError from "../utils/api-error.js";
import httpStatus from "http-status";

const createOrder = async (orderBody) => {
  const order = await Order.create(orderBody);
  if (!order) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Could Not Place Order");
  }
  return order;
};

const getSingleOrders = async (userId, orderId) => {
  const order = await Order.findOne({ _id: orderId, customerId: userId });
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order Not Found");
  }
  return order;
};

const getAllUsersOrders = async (userId) => {
  const orders = await Order.paginate({ customerId: userId });

  if (!orders) {
    throw new ApiError(httpStatus.NOT_FOUND, "Orders not found!!");
  }

  return orders;
};

export { createOrder, getSingleOrders, getAllUsersOrders };

import catchAsync from "../utils/catch-async.js";
import * as orderService from "../services/order.service.js";
import * as productService from "../services/product.service.js";
import * as cartService from "../services/cart.service.js";
import ApiError from "../utils/api-error.js";
import httpStatus from "http-status";
import { v4 as uuidv4 } from "uuid";

const createOrder = catchAsync(async (req, res) => {
  const customerId = req.user._id;
  const orderBody = req.body;
  const { action } = req.params;
  const { addressId } = orderBody;

  const cart = await cartService.getCustomerCart({ customerId });

  if (action !== "single" && cart.products.length === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Items does not exist in cart!!"
    );
  }

  const orderId = uuidv4();
  let products = [];

  switch (action) {
    case "single":
      products = [orderBody];
      break;

    case "partial":
      products = cart.products.filter((prod) => {
        orderBody.selectedProductIds.some((id) => prod.productId === id);
      });

      cart.products.filter((prod) => {
        orderBody.selectedProductIds.some((id) => {
          prod.productId !== id;
        });
      });
      break;

    case "full":
      products = cart.products;
      cart.products = [];
      break;
  }

  await productService.updateProductStock({
    products,
    isAdd: false,
  });

  products.forEach(async (prod) => {
    await orderService.createOrder({
      product: prod.productId,
      qty: prod.qty,
      customerId,
      addressId,
      orderId,
    });
  });

  await cart.save();

  await res.send({
    message: "Order process started successfully",
  });
});

const getUserOrders = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const customerId = req.user._id;

  if (orderId) {
    const order = await orderService.getSingleOrder(customerId, orderId);
    res.send(order);
  }

  const options = req.query;
  const orders = await orderService.getAllUsersOrders(customerId, options);
  res.send(orders);
});

const getSellerOrders = catchAsync(async (req, res) => {
  const sellerId = req.user._id;
  const options = req.query;

  const orders = await orderService.getAllSellerOrders(sellerId, options);
  res.send(orders);
});

const getAllAdminOrders = catchAsync(async (req, res) => {
  const options = req.query;
  const orders = await orderService.getAllOrders(options);
  res.send(orders);
});

const markDelivered = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const sellerId = req.user._id;

  const order = await orderService.updateMany(
    {
      _id: orderId,
      sellerId,
      isPlaced: true,
    },
    {
      deliveredDate: Date.now(),
    }
  );

  res.send(order);
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const { orderId, status } = req.query;
  const customerId = req.user._id;

  let message = "Order placed successfully";

  if (status === "failed") {
    const order = await orderService.getSingleOrder(customerId, orderId, false);

    await productService.updateProductStock({
      products: order.products,
      isAdd: true,
    });

    await orderService.deleteOrder({ customerId, orderId });
    message = "Order failed";
  } else {
    await orderService.updateMany(
      {
        customerId,
        orderId,
      },
      {
        isPlaced: true,
      }
    );
  }

  res.send({ message });
});

export {
  createOrder,
  getUserOrders,
  getSellerOrders,
  getAllAdminOrders,
  updateOrderStatus,
  markDelivered,
};

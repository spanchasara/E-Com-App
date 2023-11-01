import catchAsync from "../utils/catch-async.js";
import * as orderService from "../services/order.service.js";
import * as cartService from "../services/cart.service.js";
import ApiError from "../utils/api-error.js";
import httpStatus from "http-status";

const createOrder = catchAsync(async (req, res) => {
  const customerId = req.user._id;
  const orderBody = req.body;
  const { action } = req.params;
  const { addressId } = orderBody;

  const cartItems = await cartService.getCustomerCart({ customerId });
  if(action!=='single' && cartItems.products.length === 0){
    throw new ApiError(httpStatus.BAD_REQUEST,"Items does not exist in cart!!")
  }
  let body;
  switch (action) {
    case "single":
      body = { products: [orderBody] };
      break;
    case "partial":
      const products = cartItems.products.filter((prod) => {
        orderBody.selectedProductIds.some((id) => {
          console.log("prod.productId " + prod.productId);
          console.log("id " + id);
          prod.productId === id;
        });
      });
      console.log(products);
      body = { products };
      cartItems.products.filter((prod) => {
        orderBody.selectedProductIds.some((id) => {
          prod.productId !== id;
        });
      });

      break;
    case "full":
      body = { products: cartItems.products };
      cartItems.products = [];
      break;
  }
  console.log(body);
  const order = await orderService.createOrder({
    ...body,
    addressId,
    customerId,
  });

  await cartItems.save();
  res.send(order);
});

const getUserOrders = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user._id;
  if (orderId) {
    const order = await orderService.getSingleOrders(userId, orderId);
    res.send(order);
  }

  const orders = await orderService.getAllUsersOrders(userId);
  res.send(orders);
});

export { createOrder, getUserOrders };

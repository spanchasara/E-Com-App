import catchAsync from "../utils/catch-async.js";
import * as orderService from "../services/order.service.js";
import * as productService from "../services/product.service.js";
import * as couponService from "../services/coupon.service.js";
import * as cartService from "../services/cart.service.js";
import ApiError from "../utils/api-error.js";
import httpStatus from "http-status";
import { v4 as uuidv4 } from "uuid";
import { sendTemplateEmail, templates } from "../utils/brevo.js";
import { formatDate, rupeeFormat } from "../utils/converters.js";

const createOrder = catchAsync(async (req, res) => {
  const customerId = req.user._id;
  const orderBody = req.body;
  const { action } = req.params;
  const { addressId, coupon } = orderBody;

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
        return orderBody.selectedProductIds.some((id) => prod.productId == id);
      });
      break;

    case "full":
      products = cart.products;
      break;
  }

  await productService.updateProductStock({
    products,
    isAdd: false,
  });

  setTimeout(async () => {
    try {
      const order = await orderService.getSingleOrder(
        customerId,
        orderId,
        false
      );

      if (order) {
        await productService.updateProductStock({
          products,
          isAdd: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }, 30 * 60 * 1000);

  products.forEach(async (prod) => {
    await orderService.createOrder({
      product: prod.productId,
      qty: prod.qty,
      customerId,
      addressId,
      orderId,
      coupon,
    });
  });

  await res.send({
    orderId,
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

  const order = await orderService.getOrder(
    {
      _id: orderId,
      sellerId,
      isPlaced: true,
    },
    [
      {
        path: "customerId",
        select: "_id email username",
      },
      {
        path: "product",
        select: "_id title price images",
      },
      {
        path: "addressId",
      },
    ]
  );

  order.deliveredDate = Date.now();
  await order.save();

  order.product.price = rupeeFormat(order.product.price);

  sendTemplateEmail({
    to: order.customerId.email,
    subject: "Order Delivered Successfully",
    params: {
      name: order.customerId.username,
      products: order.product,
      image:
        order.product.images && order.product.images.length > 0
          ? order.product.images[0].url
          : process.env.DEFAULT_PRODUCT_IMAGE,
      orderId: order.orderId,
      orderDate: formatDate(order.createdAt),
      totalAmount: rupeeFormat(order.totalAmount),
      totalQty: order.qty,
      deliveryAddress: order.addressId,
      homeUrl: process.env.HOST_URL + "/products",
      orderUrl: process.env.HOST_URL + "/orders",
    },
    templateId: templates.customerOrderDelivered,
  });

  const fullOrder = await orderService.getSingleOrder(
    order.customerId._id,
    order.orderId
  );

  let sendFeedback = true;
  fullOrder.products.forEach((prod) => {
    if (!prod.deliveredDate) sendFeedback = false;
  });

  if (sendFeedback) {
    sendTemplateEmail({
      to: order.customerId.email,
      subject: "Please Share Your Experience",
      params: {
        name: order.customerId.username,
        orderId: order.orderId,
        orderDate: formatDate(order.createdAt),
        feedbackUrl:
          process.env.HOST_URL + "/feedback?orderId=" + order.orderId,
      },
      templateId: templates.customerFeedback,
    });
  }

  res.send(order);
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const { orderId, status } = req.query;
  const customerId = req.user._id;

  let message = "Order placed successfully";

  const order = await orderService.getSingleOrder(customerId, orderId, false);

  if (status === "failed") {
    await productService.updateProductStock({
      products: order.products,
      isAdd: true,
    });

    await orderService.deleteOrder({ customerId, orderId });
    message = "Order failed";
  } else {
    if (order.coupon)
      await couponService.toggleCouponUsedCount(order.coupon._id, customerId);

    await orderService.updateMany(
      {
        customerId,
        orderId,
      },
      {
        isPlaced: true,
      }
    );

    const cart = await cartService.getCustomerCart({ customerId });

    cart.products = cart.products.filter((prod) => {
      return !order.products.some((p) => p.productId.equals(prod.productId));
    });

    await cart.save();

    const temp = JSON.parse(JSON.stringify(order.products));

    temp.forEach((prod) => {
      prod.price = rupeeFormat(prod.price);
      prod.amount = rupeeFormat(prod.amount);
      prod.image =
        prod.images && prod.images.length > 0
          ? prod.images[0].url
          : process.env.DEFAULT_PRODUCT_IMAGE;
    });

    const discount = order.coupon
      ? (order.totalAmount * order.coupon.discountPercent) / 100
      : 0;

    // send mail to customer
    sendTemplateEmail({
      to: req.user.email,
      subject: "Order Placed Successfully",
      params: {
        name: req.user.username,
        products: temp,
        orderId,
        orderDate: formatDate(order.createdAt),
        discount: rupeeFormat(discount),
        totalAmount: rupeeFormat(order.totalAmount),
        finalAmount: rupeeFormat(order.totalAmount - discount),
        totalQty: order.totalQty,
        deliveryAddress: order.address,
        homeUrl: process.env.HOST_URL + "/products",
        orderUrl: process.env.HOST_URL + "/orders",
      },
      templateId: templates.customerOrderPlaced,
    });

    // send mail to seller
    const sellerObj = order.products.reduce((acc, prod) => {
      if (!acc[prod.sellerId._id]) {
        acc[prod.sellerId._id] = {
          products: [prod],
          details: prod.sellerId,
        };
      } else {
        acc[prod.sellerId._id].products.push(prod);
      }
      return acc;
    }, {});

    for (let seller in sellerObj) {
      const totalAmount = sellerObj[seller].products.reduce((acc, prod) => {
        return acc + prod.amount;
      }, 0);

      const totalQty = sellerObj[seller].products.reduce((acc, prod) => {
        return acc + prod.qty;
      }, 0);

      sellerObj[seller].products.forEach((prod) => {
        prod.price = rupeeFormat(prod.price);
        prod.amount = rupeeFormat(prod.amount);
        prod.image =
          prod.images && prod.images.length > 0
            ? prod.images[0].url
            : process.env.DEFAULT_PRODUCT_IMAGE;
      });

      sendTemplateEmail({
        to: sellerObj[seller].details.email,
        subject: "Congratulations! New Order Received for Your Product",
        params: {
          name: sellerObj[seller].details.username,
          products: sellerObj[seller].products,
          orderId,
          orderDate: formatDate(order.createdAt),
          totalAmount: rupeeFormat(totalAmount),
          totalQty,
          deliveryAddress: order.address,
          orderUrl: process.env.HOST_URL + "/seller/orders",
          productsUrl: process.env.HOST_URL + "/seller/products",
        },
        templateId: templates.sellerOrderReceived,
      });
    }
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

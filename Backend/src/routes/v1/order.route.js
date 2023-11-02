import express from "express";
import * as orderController from "../../controllers/order.controller.js";
import * as orderValidation from "../../validations/order.validation.js";
import validate from "../../middlewares/validate.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

router
  .route("/:action")
  .post(
    auth("create_order"),
    validate(orderValidation.createOrder),
    orderController.createOrder
  );

router
  .route("/seller")
  .get(
    auth("get_seller_orders"),
    validate(orderValidation.getSellerOrders),
    orderController.getSellerOrders
  );

router
  .route("/admin/get-all")
  .get(
    auth("get_all_admin_orders"),
    validate(orderValidation.getAllAdminOrders),
    orderController.getAllAdminOrders
  );

router
  .route("/:orderId?")
  .get(
    auth("get_user_orders"),
    validate(orderValidation.getUserOrders),
    orderController.getUserOrders
  );

router
  .route("/")
  .patch(
    auth("update_order_status"),
    validate(orderValidation.updateOrderStatus),
    orderController.updateOrderStatus
  );

router
  .route("/delivered/:orderId")
  .patch(
    auth("mark_delivered"),
    validate(orderValidation.markDelivered),
    orderController.markDelivered
  );

export default router;

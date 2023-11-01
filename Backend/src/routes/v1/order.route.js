import express from "express";
import * as orderController from "../../controllers/order.controller.js";
import * as orderValidation from "../../validations/order.validation.js";
import validate from "../../middlewares/validate.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

router
  .route("/:orderId?")
  .get(
    auth("get_user_orders"),
    validate(orderValidation.getUserOrders),
    orderController.getUserOrders
  );

router
  .route("/:action")
  .post(
    auth("create_order"),
    validate(orderValidation.createOrder),
    orderController.createOrder
  );
export default router;

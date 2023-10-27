import express from "express";
import * as cartController from "../../controllers/cart.controller.js";
import * as cartValidation from "../../validations/cart.validation.js";
import validate from "../../middlewares/validate.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

router
  .route("/")
  .get(auth("get_customer_cart"), cartController.getCustomerCart)
  .patch(
    auth("update_customer_cart"),
    validate(cartValidation.updateCustomerCart),
    cartController.updateCustomerCart
  );

export default router;

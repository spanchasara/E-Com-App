import express from "express";
import * as productController from "../../controllers/product.controller.js";
import * as productValidation from "../../validations/product.validation.js";
import validate from "../../middlewares/validate.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

router
  .route("/:productId?")
  .get(validate(productValidation.getProducts), productController.getProducts);

router
  .route("/")
  .post(
    auth("create_product"),
    validate(productValidation.createProduct),
    productController.createProduct
  );

export default router;

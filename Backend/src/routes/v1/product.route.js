import express from "express";
import * as productController from "../../controllers/product.controller.js";
import * as productValidation from "../../validations/product.validation.js";
import validate from "../../middlewares/validate.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

router
  .route("/get-seller")
  .get(
    auth("get_seller_products"),
    validate(productValidation.getSellerProducts),
    productController.getSellerProducts
  );

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

router
  .route("/:productId")
  .patch(
    auth("update_product"),
    validate(productValidation.updateProduct),
    productController.updateProduct
  );

router
  .route("/:productId")
  .delete(
    auth("delete_product"),
    validate(productValidation.deleteProduct),
    productController.deleteProduct
  );

export default router;

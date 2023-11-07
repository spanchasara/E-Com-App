import express from "express";
import * as productController from "../../controllers/product.controller.js";
import * as productValidation from "../../validations/product.validation.js";
import validate from "../../middlewares/validate.js";
import auth from "../../middlewares/auth.js";
import uploadMiddleware from "../../middlewares/multer.js";

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

router
  .route("/images/:productId")
  .post(
    auth("upload_product_images"),
    uploadMiddleware,
    validate(productValidation.uploadProductImages),
    productController.uploadProductImages
  );

router
  .route("/images/:productId")
  .patch(
    auth("delete_product_images"),
    validate(productValidation.deleteProductImages),
    productController.deleteProductImages
  );

export default router;

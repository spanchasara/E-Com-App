import express from "express";
import * as couponController from "../../controllers/coupon.controller.js";
import * as couponValidation from "../../validations/coupon.validation.js";
import validate from "../../middlewares/validate.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

router
  .route("/")
  .post(
    auth("add_coupon"),
    validate(couponValidation.addCoupon),
    couponController.addCoupon
  );

router
  .route("/all")
  .get(
    auth("get_all_coupons"),
    validate(couponValidation.getAllCoupons),
    couponController.getAllCoupons
  );

router
  .route("/all-customer")
  .get(
    auth("get_all_customer_coupons"),
    validate(couponValidation.getAllCustomerCoupons),
    couponController.getAllCustomerCoupons
  );

router
  .route("/:couponId")
  .get(
    auth("get_coupon"),
    validate(couponValidation.getCoupon),
    couponController.getCoupon
  );

router
  .route("/:couponId")
  .patch(
    auth("update_coupon"),
    validate(couponValidation.updateCoupon),
    couponController.updateCoupon
  );

router
  .route("/:couponId")
  .delete(
    auth("delete_coupon"),
    validate(couponValidation.deleteCoupon),
    couponController.deleteCoupon
  );

export default router;

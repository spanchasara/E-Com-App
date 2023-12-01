import express from "express";
import * as authController from "../../controllers/auth.controller.js";
import * as authValidation from "../../validations/auth.validation.js";
import validate from "../../middlewares/validate.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

router
  .route("/register")
  .post(validate(authValidation.register), authController.register);

router
  .route("/login")
  .post(validate(authValidation.login), authController.login);

router
  .route("/change-password")
  .post(
    auth("change_password"),
    validate(authValidation.changePassword),
    authController.changePassword
  );

router
  .route("/reset-password/request")
  .post(
    validate(authValidation.resetPasswordRequest),
    authController.resetPasswordRequest
  );

router
  .route("/reset-password")
  .post(validate(authValidation.resetPassword), authController.resetPassword);

router.route("/social-login/:provider").get(
  validate(authValidation.socialLogin),
  authController.socialLogin);

export default router;

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

export default router;

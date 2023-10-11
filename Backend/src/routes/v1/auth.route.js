import express from "express";
import * as authController from "../../controllers/auth.controller.js";
import * as authValidation from "../../validations/auth.validation.js";
import validate from "../../middlewares/validate.js";

const router = express.Router();

router
  .route("/register")
  .post(validate(authValidation.register), authController.register);

router
  .route("/login")
  .post(validate(authValidation.login), authController.login);

export default router;

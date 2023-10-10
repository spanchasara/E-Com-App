import express from "express";
import { identityController } from "../../../controllers/index.js";
import validate from "../../../middlewares/validate.js";
import { identityValidation } from "../../../validations/index.js";

const router = express.Router();

const { authController } = identityController;
const { authValidation } = identityValidation;

router.route("/signup").post(validate(authValidation.signup),  authController.signup);

router.route("/login").post(validate(authValidation.login), authController.login);

export default router;

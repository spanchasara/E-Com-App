import express from "express";
import * as userController from "../../controllers/user.controller.js";
import * as userValidation from "../../validations/user.validation.js";
import validate from "../../middlewares/validate.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

router.route("/getMe").get(auth("get_user"), userController.getUserProfile);

router.route("/").get(auth("get_all_users"), userController.getAllUsers);

router
  .route("/:userId")
  .get(
    auth("get_public_user"),
    validate(userValidation.getPublicUser),
    userController.getPublicUser
  );

router
  .route("/")
  .patch(
    auth("update_user"),
    validate(userValidation.updateUser),
    userController.updateUser
  );

router
  .route("/toggleAccountStatus/:userId")
  .patch(
    auth("toggle_user"),
    validate(userValidation.toggleAccountStatus),
    userController.toggleAccountStatus
  );

export default router;

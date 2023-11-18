import express from "express";
import * as userController from "../../controllers/user.controller.js";
import * as userValidation from "../../validations/user.validation.js";
import validate from "../../middlewares/validate.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

router.route("/get-me").get(auth("get_user"), userController.getUserProfile);

router
  .route("/:role?")
  .get(
    auth("get_all_users"),
    validate(userValidation.getAllUsers),
    userController.getAllUsers
  );

router
  .route("/public/:userId")
  .get(
    auth("get_public_user"),
    validate(userValidation.getPublicUser),
    userController.getPublicUser
  );

router
  .route("/update-me")
  .patch(
    auth("update_user"),
    validate(userValidation.updateUser),
    userController.updateUser
  );

router
  .route("/toggle-account-status/:userId")
  .patch(
    auth("toggle_user"),
    validate(userValidation.toggleAccountStatus),
    userController.toggleAccountStatus
  );

router
  .route("/toggle-role/:role")
  .post(
    auth("toggle_user_role"),
    validate(userValidation.toggleRole),
    userController.toggleRole
  );

router
  .route("/mark-admin/:userId/:role")
  .post(
    auth("mark_admin"),
    validate(userValidation.markAdmin),
    userController.markAdmin
  );

router
  .route("/seller-register")
  .post(
    auth("seller_register"),
    validate(userValidation.sellerRegistration),
    userController.sellerRegistration
  );

export default router;

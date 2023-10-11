import express from "express";
import * as roleController from "../../controllers/role.controller.js";
import * as roleValidation from "../../validations/role.validation.js";
import validate from "../../middlewares/validate.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

router
  .route("/")
  .post(
    validate(roleValidation.createRolePermissions),
    auth("create_role_permissions"),
    roleController.createRolePermissions
  );

router
  .route("/:role")
  .patch(
    validate(roleValidation.updateRolePermissions),
    auth("update_role_permissions"),
    roleController.updateRolePermissions
  );

export default router;

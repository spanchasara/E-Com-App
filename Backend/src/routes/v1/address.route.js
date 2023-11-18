import express from "express";
import * as addressController from "../../controllers/address.controller.js";
import * as addressValidation from "../../validations/address.validation.js";
import validate from "../../middlewares/validate.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

router
  .route("/user")
  .get(
    auth("get_users_address"),
    addressController.getUsersAddress
  );

  
router
  .route("/:addressId")
  .get(
    auth("get_address"),
    validate(addressValidation.getSingleAddress),
    addressController.getSingleAddress
  );

  router
  .route("/")
  .post(
    auth("add_address"),
    validate(addressValidation.addAddress),
    addressController.addAddress
  );
  
router
  .route("/:addressId")
  .patch(
    auth("edit_address"),
    validate(addressValidation.editAddress),
    addressController.editAddress
  );

router
  .route("/:addressId")
  .delete(
    auth("delete_address"),
    validate(addressValidation.deleteAddress),
    addressController.deleteAddress
  );



export default router;

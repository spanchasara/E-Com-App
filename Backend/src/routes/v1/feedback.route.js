import express from "express";
import * as feedbackController from "../../controllers/feedback.controller.js";
import * as feedbackValidation from "../../validations/feedback.validation.js";
import validate from "../../middlewares/validate.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

router
  .route("/")
  .post(
    auth("add_feedback"),
    validate(feedbackValidation.addFeedback),
    feedbackController.addFeedback
  );

router
  .route("/:orderId")
  .get(
    auth("add_feedback"),
    validate(feedbackValidation.getFeedback),
    feedbackController.getFeedback
  );

export default router;

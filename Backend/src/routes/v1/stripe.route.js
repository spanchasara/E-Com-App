import express from "express";
import * as stripeController from "../../controllers/stripe.controller.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

router.route("/").post(auth("make_payment"), stripeController.makePayment);

export default router;

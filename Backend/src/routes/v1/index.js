import express from "express";
import authRoute from "./auth.route.js";
import userRoute from "./user.route.js";
import productRoute from "./product.route.js";
import cartRoute from "./cart.route.js";
import roleRoute from "./role.route.js";
import docsRoute from "./docs.route.js";
import addressRoute from "./address.route.js";
import orderRoute from "./order.route.js";
import paymentRoute from "./stripe.route.js";
import couponRoute from "./coupon.route.js";
import feedbackRoute from "./feedback.route.js";
import AnalysisRoute from "./analytics.route.js";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/product", productRoute);
router.use("/cart", cartRoute);
router.use("/role", roleRoute);
router.use("/docs", docsRoute);
router.use("/address", addressRoute);
router.use("/order", orderRoute);
router.use("/payment", paymentRoute);
router.use("/coupon", couponRoute);
router.use("/feedback", feedbackRoute);
router.use("/analysis", AnalysisRoute);

export default router;

import express from "express";
import * as analyticsController from "../../controllers/analytics.controller.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

router
  .route("/get-seller-analytics")
  .get(auth("get_seller_analytics"), analyticsController.getSellerAnalytics);

router
  .route("/get-seller-periodic-analytics")
  .get(
    auth("get_seller_periodic_analytics"),
    analyticsController.getSellerPeriodicAnalysis
  );

router
  .route("/get-admin-analytics")
  .get(auth("get_admin_analytics"), analyticsController.getAdminAnalytics);

router
  .route("/get-admin-periodic-analytics")
  .get(
    auth("get_admin_periodic_analytics"),
    analyticsController.getAdminPeriodicAnalysis
  );

export default router;

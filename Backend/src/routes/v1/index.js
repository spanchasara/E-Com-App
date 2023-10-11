import express from "express";
import authRoute from "./auth.route.js";
import roleRoute from "./role.route.js";
import docsRoute from "./docs.route.js";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/role", roleRoute);
router.use("/docs", docsRoute);

export default router;

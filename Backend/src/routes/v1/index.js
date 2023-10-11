import express from "express";
import authRoute from "./auth.route.js";
import roleRoute from "./role.route.js";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/role", roleRoute);

export default router;

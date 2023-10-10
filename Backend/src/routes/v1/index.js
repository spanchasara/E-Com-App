import express from "express";
import { authRoute } from "./identity/index.js";

const router = express.Router();

router.use("/auth", authRoute);

export default router;

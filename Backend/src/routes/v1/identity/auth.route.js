import express from "express";
import { identityController } from "../../../controllers/index.js";

const router = express.Router();

const { authController } = identityController;

router.post("/signup", authController.signup);

router.post("/login", authController.login);

export default router;

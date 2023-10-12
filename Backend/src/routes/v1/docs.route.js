import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import definition from "../../swagger/swagger-def.js";

const router = express.Router();

const swaggerSpec = swaggerJsdoc({
  definition,
  apis: ["src/swagger/*yml", "src/controllers/*.js"],
});

router.use("/", swaggerUi.serve);
router.get(
  "/",
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
  })
);

export default router;

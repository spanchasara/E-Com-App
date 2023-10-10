import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import routes from "./routes/v1/index.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use("/api/v1", routes);

export default app;

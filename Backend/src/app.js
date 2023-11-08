import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import routes from "./routes/v1/index.js";
import { errorConverter, errorHandler } from "./middlewares/error.js";
import { sendTemplateEmail } from "./utils/brevo.js";

dotenv.config();

const app = express();

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// v1 app routes
app.use("/api/v1", routes);

app.post("/test", (req, res) => {
  sendTemplateEmail({
    to: "sahil2@yopmail.com",
    subject: "test subject",
    params: {
      name: "mother",
      subject: "test subject",
    },
    templateId: 6,
  });
  res.send("Hello World!");
});

app.use(errorHandler);
app.use(errorConverter);

export default app;

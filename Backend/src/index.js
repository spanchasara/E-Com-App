import app from "./app.js";
import { connectMongo } from "./mongo/index.js";
import { cloudinaryConfig } from "./utils/cloudinary.js";
import { brevoConfig } from "./utils/brevo.js";

connectMongo();
cloudinaryConfig();
brevoConfig();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

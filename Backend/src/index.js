import app from "./app.js";
import { connectMongo } from "./mongo/index.js";

connectMongo();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

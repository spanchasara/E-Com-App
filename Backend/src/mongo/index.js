import mongoose from "mongoose";

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB Successfully");
  } catch (err) {
    console.error("Connection Failed");
    console.error(err);
  }
};

export { connectMongo };

import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: {
      type: String,
      trim: true,
      required: true,
    },
    phoneNo: {
      type: String,
      trim: true,
      required: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      default: 'India'
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    addressLane1: {
      type: String,
      required: true,
      trim: true,
    },
    addressLane2: {
      type: String,
      trim: true,
    },
    landmark: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.model("Address", addressSchema);

export default Address;

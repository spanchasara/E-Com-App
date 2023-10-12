import mongoose, { Schema } from "mongoose";

const roleSchema = new Schema(
  {
    name: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer",
      unique: [true, "Role already exists"],
    },
    permissions: {
      type: Map,
      of: Boolean,
      required: true,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model("Role", roleSchema);

export default Role;

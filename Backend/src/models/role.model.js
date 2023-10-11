import mongoose, { Schema } from "mongoose";

const roleSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer",
    },
    create_user: {
        type: Boolean,
        default: true,
    },
    update_user: {
        type: Boolean,
        default: true,
    },
    delete_user: {
        type: Boolean,
        default: true,
    },
    view_products: {
        type: Boolean,
        default: false,
    },
    add_to_cart: {
        type: Boolean,
        default: false,
    },
    manage_cart: {
        type: Boolean,
        default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model("Role", roleSchema);

export default Role;
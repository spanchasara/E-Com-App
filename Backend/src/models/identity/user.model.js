import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import ApiError from "../../utils/api-error.js";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    username: {
      type: String,
      trim: true,
      index: true,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new ApiError(400, "Invalid Email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
      default: Date.now(),
    },
    tokens: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// validation for unique email
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model("User", userSchema);

export default User;

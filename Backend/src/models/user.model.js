import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import ApiError from "../utils/api-error.js";
import httpStatus from "http-status";
import paginate from "mongoose-paginate-v2";

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
    },
    username: {
      type: String,
      trim: true,
      index: true,
      required: true,
      unique: [true, "username already exists"],
    },
    email: {
      type: String,
      required: true,
      unique: [true, "email already exists"],
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Email !!");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      select: false,
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
    companyName: {
      type: String,
      default: null,
    },
    resetToken: {
      token: {
        type: String,
      },
      createdAt: {
        type: Date,
      },
      expiry: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre(/^find/, function (next) {
  this.select({
    __v: 0,
  });
  next();
});

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
    user.passwordChangedAt = Date.now();
  }

  next();
});

userSchema.plugin(paginate);

const User = mongoose.model("User", userSchema);

export default User;

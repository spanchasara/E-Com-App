import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";

const couponSchema = new Schema(
  {
    couponCode: {
      type: String,
      required: true,
      unique: [true, "coupon code already exists"],
    },
    name: {
      type: String,
      required: true,
      unique: [true, "coupon name already exists"],
    },
    type: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      enum: ["general", "first-order", "festival"],
    },
    discountPercent: {
      type: Number,
      required: true,
    },
    activationDate: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    usedBy: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

couponSchema.pre(/^find/, function (next) {
  this.select({
    __v: 0,
  });
  next();
});

couponSchema.plugin(paginate);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;

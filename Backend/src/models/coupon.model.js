import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";

const couponSchema = new Schema(
  {
    couponCode: {
      type: String,
      required: true,
      unique: [true, "coupon code already exists"],
    },
    discountPercent: {
      type: Number,
      required: true,
    },
    validityPeriod: {
      type: Number,
      required: true,
    },
    userUsageLimit: {
      type: Number,
      required: true,
    },
    couponUsageLimit: {
      type: Number,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
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

import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";

const orderSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    qty: {
      type: Number,
      required: true,
      default: 0,
    },
    totalAmount: {
      type: Number,
    },
    deliveredDate: {
      type: Date,
      default: null,
    },
    addressId: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    orderId: {
      type: String,
      required: true,
    },
    isPlaced: {
      type: Boolean,
      default: false,
    },
    coupon: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.pre(/^find/, function (next) {
  this.select({
    __v: 0,
  });
  next();
});

orderSchema.pre("save", async function (next) {
  await this.populate({
    path: "product",
    select: "price sellerId",
  });

  this.totalAmount = this.product.price * this.qty;
  this.sellerId = this.product.sellerId;

  next();
});

orderSchema.plugin(paginate);
const Order = mongoose.model("Order", orderSchema);

export default Order;

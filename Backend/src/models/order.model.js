import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";

const orderSchema = new Schema(
  {
    totalAmount: {
      type: Number,
    },
    totalQty: {
      type: Number,
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        qty: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],

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
    path: "products.productId",
    select: "price",
  });
  this.totalQty = this.products.reduce(
    (total, product) => total + product.qty,
    0
  );
  this.totalAmount = this.products.reduce(
    (total, product) => total + product.qty * product.productId.price,
    0
  );
  next();
});

orderSchema.plugin(paginate);
const Order = mongoose.model("Order", orderSchema);

export default Order;

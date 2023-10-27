import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    totalQty: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

cartSchema.pre(/^find/, function (next) {
  this.select({
    __v: 0,
  });
  next();
});

cartSchema.pre("save", async function (next) {
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

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;

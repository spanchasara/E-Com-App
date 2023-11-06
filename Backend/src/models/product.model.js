import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    specifications: {
      type: Map,
      required: true,
      default: {},
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    images: {
      type: [
        {
          publicId: {
            type: String,
          },
          url: {
            type: String,
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre(/^find/, function (next) {
  this.select({
    __v: 0,
  });
  next();
});

productSchema.plugin(paginate);
const Product = mongoose.model("Product", productSchema);

export default Product;

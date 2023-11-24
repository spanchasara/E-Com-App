import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";

const feedbackSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    orderId: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

feedbackSchema.pre(/^find/, function (next) {
  this.select({
    __v: 0,
  });
  next();
});

feedbackSchema.plugin(paginate);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;

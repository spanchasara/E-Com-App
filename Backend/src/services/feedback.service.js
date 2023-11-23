import httpStatus from "http-status";
import Feedback from "../models/feedback.model.js";
import ApiError from "../utils/api-error.js";
import mongoose from "mongoose";

const addMultipleFeedback = async (feedbackBody) => {
  const feedbacks = await Feedback.insertMany(feedbackBody);

  if (!feedbacks) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error in Creating Feedback!"
    );
  }

  return feedbacks;
};

const getTopNFeedback = async (productId, n = 5) => {
  const feedbacks = await Feedback.find({ productId })
    .sort({ rating: -1 })
    .select("userId rating comment createdAt")
    .populate([
      {
        path: "userId",
        select: "username",
      },
    ])
    .limit(n);

  return feedbacks;
};

const getAvgRating = async (productId) => {
  const result = await Feedback.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  const num = result.length > 0 ? result[0].averageRating : 0;

  if ((Math.ceil(num) + Math.floor(num)) / 2 === num) return num;
  else return Math.round(num);
};

const getFeedback = async (userId, orderId) => {
  const feedback = await Feedback.findOne({
    userId,
    orderId,
  });

  if (!feedback) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Feedback not found for this order!"
    );
  }

  return feedback;
};

export { addMultipleFeedback, getTopNFeedback, getAvgRating, getFeedback };

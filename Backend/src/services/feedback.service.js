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

  return getCustomRating(num);
};

const getRatingsMapping = async (productIds) => {
  const result = await Feedback.find({ productId: { $in: productIds } }).select(
    "productId rating"
  );

  const mapping = {};

  result.forEach((feedback) => {
    if (!mapping[feedback.productId]) mapping[feedback.productId] = [];
    mapping[feedback.productId].push(feedback.rating);
  });

  // calculate average rating
  for (const key in mapping) {
    const num = mapping[key].length;
    const sum = mapping[key].reduce((a, b) => a + b, 0);
    const avg = sum / num;

    mapping[key] = getCustomRating(avg);
  }

  return mapping;
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

const getCustomRating = (value) => {
  if (value >= Math.floor(value) && value < Math.floor(value) + 0.5) {
    return Math.floor(value);
  } else if (
    value >= Math.floor(value) + 0.5 &&
    value < Math.floor(value) + 1
  ) {
    return Math.floor(value) + 0.5;
  } else {
    return value;
  }
};

export {
  addMultipleFeedback,
  getTopNFeedback,
  getAvgRating,
  getFeedback,
  getRatingsMapping,
  getCustomRating
};

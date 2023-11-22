import httpStatus from "http-status";
import Feedback from "../models/feedback.model.js";
import ApiError from "../utils/api-error.js";

const addFeedback = async (feedbackBody) => {
  const feedback = await Feedback.create(feedbackBody);

  if (!feedback) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error in Creating Feedback!"
    );
  }

  return feedback;
};

const getFeedback = async (userId, orderId) => {
  const feedback = await Feedback.findOne({
    userId,
    orderId,
  });

  if (!feedback) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error in Getting Feedback!"
    );
  }

  return feedback;
};

export { addFeedback, getFeedback };

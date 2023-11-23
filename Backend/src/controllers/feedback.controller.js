import catchAsync from "../utils/catch-async.js";
import * as feedbackService from "../services/feedback.service.js";

const addFeedback = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const feedbacks = req.body;

  feedbacks.forEach((feedback) => {
    feedback.userId = userId;
  });

  await feedbackService.addMultipleFeedback(feedbacks);

  res.send({
    message: "Feedback Added Successfully!",
  });
});

const getFeedback = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user._id;

  const feedback = await feedbackService.getFeedback(userId, orderId);

  res.send(feedback);
});

export { addFeedback, getFeedback };

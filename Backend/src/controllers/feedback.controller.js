import catchAsync from "../utils/catch-async.js";
import * as feedbackService from "../services/feedback.service.js";
import * as orderService from "../services/order.service.js";

const addFeedback = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { type } = req.params;
  const { orderId } = req.body;

  if (type === "app") {
    // app feedback
    const body = {
      ...req.body,
      userId,
    };

    await feedbackService.addFeedback(body);
  } else {
    // product feedback
    const order = await orderService.getSingleOrder(userId, orderId);

    const productIds = order.products.map((p) => p.productId);

    productIds.forEach(async (productId) => {
      const body = {
        ...req.body,
        userId,
        productId,
      };

      await feedbackService.addFeedback(body);
    });
  }

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

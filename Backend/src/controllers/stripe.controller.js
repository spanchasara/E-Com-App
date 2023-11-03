import catchAsync from "../utils/catch-async.js";
import * as stripeService from "../services/stripe.service.js";

const makePayment = catchAsync(async (req, res) => {
  const body = req.body;
  const paymentResponse = await stripeService.handlePayment(body);
  res.send(paymentResponse);
});

export { makePayment };

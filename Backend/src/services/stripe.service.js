import Stripe from "stripe";

const handlePayment = async (body) => {
  const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

  const { products, orderId } = body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "inr",
          },
          display_name: "Free shipping",
          // Delivers between 5-7 business days
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
    ],
    line_items: products.map((prod) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: prod.productId.title,
        },
        unit_amount: prod.productId.price * 100,
      },
      quantity: prod.qty,
    })),
    mode: "payment",
    success_url: `http://localhost:4200/status/?status=success&order_id=${orderId}`,
    cancel_url: `http://localhost:4200/status/?status=failed&order_id=${orderId}`,
  });

  return session;
};

export { handlePayment };

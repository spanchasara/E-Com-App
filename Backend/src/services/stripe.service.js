import Stripe from "stripe";

const createCoupon = async (body) => {
  const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);
  const { discountPercent, couponCode, name } = body;

  const coupon = await stripe.coupons.create({
    percent_off: discountPercent,
    duration: "forever",
    id: couponCode,
    name,
  });

  return coupon;
};

const updateCoupon = async (body) => {
  const { couponCode } = body;

  await deleteCoupon(couponCode);
  const coupon = await createCoupon(body);

  return coupon;
};

const deleteCoupon = async (couponCode) => {
  const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

  const coupon = await stripe.coupons.del(couponCode);

  return coupon;
};

const handlePayment = async (body) => {
  const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

  const { products, orderId, couponCode } = body;

  const totalBeforeDiscount = products.reduce(
    (total, prod) => total + prod.productId.price * prod.qty,
    0
  );

  const discountAmount = (totalBeforeDiscount * 10) / 100;

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
          images:
            prod.productId.images.length > 0
              ? prod.productId.images.map((img) => img.url)
              : ["https://m.media-amazon.com/images/I/91oF9q-jE5L.jpg"],
        },
        unit_amount: prod.productId.price * 100,
      },
      quantity: prod.qty,
    })),

    discounts: [
      couponCode && {
        coupon: couponCode,
      },
    ],
    mode: "payment",
    success_url: `http://localhost:4200/status/?status=success&order_id=${orderId}`,
    cancel_url: `http://localhost:4200/status/?status=failed&order_id=${orderId}`,
  });

  return session;
};

export { createCoupon, handlePayment, updateCoupon, deleteCoupon };

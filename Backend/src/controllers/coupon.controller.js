import { v4 as uuidv4 } from "uuid";

import catchAsync from "../utils/catch-async.js";
import * as couponService from "../services/coupon.service.js";

const getCoupon = catchAsync(async (req, res) => {
  const { couponId } = req.params;
  const coupon = await couponService.getCoupon(couponId);
  res.send(coupon);
});

const getAllCoupons = catchAsync(async (req, res) => {
  const options = req.query;
  const coupons = await couponService.getAllCoupons(req.user._id, options);
  res.send(coupons);
});

const getAllCustomerCoupons = catchAsync(async (req, res) => {
  const options = req.query;
  const coupons = await couponService.getAllCustomerCoupons(
    req.user._id,
    options
  );
  res.send(coupons);
});

const addCoupon = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const couponCode = uuidv4();

  const body = { ...req.body, couponCode, createdBy: userId };
  const coupon = await couponService.addCoupon(body);
  res.send(coupon);
});

const updateCoupon = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { couponId } = req.params;
  const body = req.body;

  const coupon = await couponService.updateCoupon(userId, couponId, body);
  res.send(coupon);
});

const deleteCoupon = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { couponId } = req.params;
  const response = await couponService.deleteCoupon(userId, couponId);
  res.send(response);
});

export {
  addCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  getAllCoupons,
  getAllCustomerCoupons,
};

import httpStatus from "http-status";
import Coupon from "../models/coupon.model.js";
import ApiError from "../utils/api-error.js";
import * as stripeService from "./stripe.service.js";

const getCoupon = async (couponId) => {
  const coupon = await Coupon.findOne({ _id: couponId, isEnabled: true });

  if (!coupon) {
    throw new ApiError(httpStatus.NOT_FOUND, "Coupon not found!");
  }
  return coupon;
};

const getAllCoupons = async (userId, options) => {
  const filter = {
    createdBy: options.isOwn ? userId : { $ne: userId },
  };

  options.populate = [
    {
      path: "usedBy",
      select: "username email",
    },
    {
      path: "createdBy",
      select: "username",
    },
  ];

  const coupons = await Coupon.paginate(filter, options);

  if (!coupons) {
    throw new ApiError(httpStatus.NOT_FOUND, "Coupons not found!");
  }
  return coupons;
};

const getAllCustomerCoupons = async (userId, options) => {
  const { keyword } = options;

  const filterBody = {
    isEnabled: true,
    expiryDate: { $gte: new Date() },
  };

  if (keyword === "available") {
    filterBody.usedBy = { $nin: [userId] };
    filterBody.activationDate = { $lte: new Date() };
  } else if (keyword === "used") {
    filterBody.usedBy = { $in: [userId] };
  } else if (keyword === "not-active") {
    filterBody.activationDate = { $gt: new Date() };
  }

  const coupons = await Coupon.paginate(filterBody, options);

  if (!coupons) {
    throw new ApiError(httpStatus.NOT_FOUND, "Coupons not found!");
  }
  return coupons;
};

const addCoupon = async (couponBody) => {
  const coupon = await Coupon.create(couponBody);

  if (!coupon) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error in Creating Coupon!"
    );
  }

  await stripeService.createCoupon(couponBody);

  return coupon;
};

const toggleCouponUsedCount = async (couponId, userId, isApplied = true) => {
  const coupon = await Coupon.findById(couponId);

  if (!coupon) throw new ApiError(httpStatus.NOT_FOUND, "Coupon Not Found");

  const idx = coupon.usedBy.indexOf(userId);

  if (isApplied) {
    if (idx !== -1) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Coupon already applied by this user!"
      );
    }

    coupon.usedBy.push(userId);
  } else {
    if (idx === -1) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Coupon not applied by this user!"
      );
    }

    coupon.usedBy.splice(idx, 1);
  }

  await coupon.save();

  return coupon;
};

const updateCoupon = async (userId, couponId, couponBody) => {
  const coupon = await Coupon.findOneAndUpdate(
    { createdBy: userId, _id: couponId },
    couponBody,
    {
      new: true,
    }
  );

  if (!coupon) throw new ApiError(httpStatus.NOT_FOUND, "Coupon Not Found");

  await stripeService.updateCoupon(coupon);

  return coupon;
};

const deleteCoupon = async (userId, couponId) => {
  const coupon = await Coupon.findOneAndDelete({
    createdBy: userId,
    _id: couponId,
  });

  if (!coupon) throw new ApiError(httpStatus.NOT_FOUND, "Coupon Not Found");

  await stripeService.deleteCoupon(coupon.couponCode);

  return { message: "Coupon Deleted Successfully!" };
};

export {
  getCoupon,
  addCoupon,
  deleteCoupon,
  updateCoupon,
  getAllCoupons,
  toggleCouponUsedCount,
  getAllCustomerCoupons,
};

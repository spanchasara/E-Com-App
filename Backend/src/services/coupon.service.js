import httpStatus from "http-status";
import Coupon from "../models/coupon.model.js";
import ApiError from "../utils/api-error.js";

const getCoupon = async (couponId) => {
  const coupon = await Coupon.findOne({ _id: couponId, isActive: true });

  if (!coupon) {
    throw new ApiError(httpStatus.NOT_FOUND, "Coupon not found!");
  }
  return coupon;
};

const getAllCoupons = async (userId, options) => {
  const filter = {
    createdBy: options.isOwn ? userId : { $ne: userId },
  };

  const coupons = await Coupon.paginate(filter, options);

  if (!coupons) {
    throw new ApiError(httpStatus.NOT_FOUND, "Coupon not found!");
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

  return coupon;
};

const deleteCoupon = async (userId, couponId) => {
  const coupon = await Coupon.findOneAndDelete({
    createdBy: userId,
    _id: couponId,
  });

  if (!coupon) throw new ApiError(httpStatus.NOT_FOUND, "Coupon Not Found");

  return { message: "Coupon Deleted Successfully!" };
};

export { getCoupon, addCoupon, deleteCoupon, updateCoupon, getAllCoupons };

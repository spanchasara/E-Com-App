import Order from "../models/order.model.js";
import ApiError from "../utils/api-error.js";
import httpStatus from "http-status";

const createOrder = async (orderBody) => {
  const order = await Order.create(orderBody);

  if (!order) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Could Not Place Order");
  }

  return order;
};

const aggregateQuery = async (
  filterQuery,
  isPaginated = false,
  options = {}
) => {
  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;

  const resp = await Order.aggregate([
    {
      $match: { isPlaced: true, ...filterQuery },
    },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "productInfo",
      },
    },
    {
      $unwind: "$productInfo",
    },
    {
      $lookup: {
        from: "addresses",
        localField: "addressId",
        foreignField: "_id",
        as: "addressInfo",
      },
    },
    {
      $unwind: {
        path: "$addressInfo",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "coupons",
        localField: "coupon",
        foreignField: "_id",
        as: "couponInfo",
      },
    },
    {
      $unwind: {
        path: "$couponInfo",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "sellerId",
        foreignField: "_id",
        as: "sellerInfo",
      },
    },
    {
      $unwind: {
        path: "$sellerInfo",
      },
    },
    {
      $group: {
        _id: {
          orderId: "$orderId",
          addressId: "$addressId",
          customerId: "$customerId",
        },
        totalAmount: {
          $sum: {
            $multiply: ["$productInfo.price", "$qty"],
          },
        },
        totalQty: {
          $sum: "$qty",
        },
        products: {
          $push: {
            _id: "$_id",
            productId: "$productInfo._id",
            title: "$productInfo.title",
            price: "$productInfo.price",
            qty: "$qty",
            deliveredDate: "$deliveredDate",
            images: "$productInfo.images",
            amount: "$totalAmount",
            sellerId: {
              _id: "$sellerInfo._id",
              username: "$sellerInfo.username",
              email: "$sellerInfo.email",
              companyName: "$sellerInfo.companyName",
            },
          },
        },
        address: {
          $first: "$addressInfo",
        },
        coupon: {
          $first: "$couponInfo",
        },
        createdAt: {
          $first: "$createdAt",
        },
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $skip: isPaginated ? skip : 0,
    },
    {
      $limit: isPaginated ? limit : 1,
    },
    {
      $project: {
        _id: 0,
        orderId: "$_id.orderId",
        customerId: "$_id.customerId",
        createdAt: 1,
        sellerId: "$_id.sellerId",
        totalAmount: 1,
        totalQty: 1,
        products: 1,
        address: 1,
        coupon: 1,
      },
    },
  ]);

  return resp;
};

const totalCountQuery = async (filterQuery, groupQuery) => {
  const resp = await Order.aggregate([
    {
      $match: { isPlaced: true, ...filterQuery },
    },
    {
      $group: {
        _id: groupQuery,
        count: {
          $sum: 1,
        },
      },
    },
    {
      $group: {
        _id: null,
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  return resp[0]?.count || 0;
};

const getSingleOrder = async (customerId, orderId, isPlaced = true) => {
  const order = await aggregateQuery(
    {
      orderId,
      customerId,
      isPlaced,
    },
    false
  );

  if (!order.length) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order Not Found");
  }

  return order[0];
};

const getSellerSingleOrder = async (sellerId, orderId, isPlaced = true) => {
  const order = await aggregateQuery(
    {
      orderId,
      sellerId,
      isPlaced,
    },
    false
  );

  if (!order.length) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order Not Found");
  }

  return order[0];
};

const getAllUsersOrders = async (customerId, options) => {
  const { page = 1, limit = 10 } = options;
  const filterQuery = {
    customerId,
  };

  const totalDocs = await totalCountQuery(filterQuery, {
    orderId: "$orderId",
    customerId: "$customerId",
  });

  const docs = await aggregateQuery(filterQuery, true, options);

  if (!docs) {
    throw new ApiError(httpStatus.NOT_FOUND, "Orders not found!!");
  }

  const orders = {
    docs,
    totalDocs,
    limit,
    page,
  };

  return orders;
};

const getAllSellerOrders = async (sellerId, options) => {
  const { page = 1, limit = 10, isCurrent = false } = options;
  const filterQuery = {
    sellerId,
    deliveredDate: isCurrent ? null : { $ne: null },
  };

  const totalDocs = await totalCountQuery(filterQuery, {
    orderId: "$orderId",
    sellerId: "$sellerId",
  });

  const docs = await aggregateQuery(filterQuery, true, options);

  if (!docs) {
    throw new ApiError(httpStatus.NOT_FOUND, "Orders not found!!");
  }

  const orders = {
    docs,
    totalDocs,
    limit,
    page,
  };

  return orders;
};

const getAllOrders = async (options) => {
  const { page = 1, limit = 10 } = options;
  const filterQuery = {};

  const totalDocs = await totalCountQuery(filterQuery, {
    orderId: "$orderId",
  });

  const docs = await aggregateQuery(filterQuery, true, options);

  if (!docs) {
    throw new ApiError(httpStatus.NOT_FOUND, "Orders not found!!");
  }

  const orders = {
    docs,
    totalDocs,
    limit,
    page,
  };

  return orders;
};

const updateMany = async (filterQuery, updateBody) => {
  const order = await Order.updateMany(filterQuery, updateBody);

  if (!order) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Could Not update order");
  }

  return order;
};

const getOrder = async (filterQuery, populate = "") => {
  const order = await Order.findOne(filterQuery).populate(populate);

  if (!order) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Order Not Found");
  }

  return order;
};

const deleteOrder = async (deleteBody) => {
  const order = await Order.deleteMany(deleteBody);

  if (!order) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Could Not delete order");
  }

  return order;
};

export {
  createOrder,
  getSingleOrder,
  getAllUsersOrders,
  getAllSellerOrders,
  getAllOrders,
  deleteOrder,
  updateMany,
  getSellerSingleOrder,
  getOrder,
};

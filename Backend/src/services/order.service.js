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
      $match: filterQuery,
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
      $group: {
        _id: {
          orderId: "$orderId",
          addressId: "$addressId",
          customerId: "$customerId",
          createdAt: "$createdAt",
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
            amount: "$totalAmount",
            sellerId: "$productInfo.sellerId",
          },
        },
        address: {
          $first: "$addressInfo",
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
        createdAt: "$_id.createdAt",
        sellerId: "$_id.sellerId",
        totalAmount: 1,
        totalQty: 1,
        products: 1,
        address: 1,
      },
    },
  ]);

  return resp;
};

const totalCountQuery = async (filterQuery, groupQuery) => {
  const resp = await Order.aggregate([
    {
      $match: filterQuery,
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

const getSingleOrder = async (customerId, orderId) => {
  const order = await aggregateQuery(
    {
      orderId,
      customerId,
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

export {
  createOrder,
  getSingleOrder,
  getAllUsersOrders,
  getAllSellerOrders,
  getAllOrders,
};

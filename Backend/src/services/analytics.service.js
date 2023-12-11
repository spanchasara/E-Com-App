import httpStatus from "http-status";
import Order from "../models/order.model.js";
import ApiError from "../utils/api-error.js";
import Feedback from "../models/feedback.model.js";

const getAnalytics = async (filterQuery) => {
  const allProducts = await allProductsSold(filterQuery);
  const worstProducts = allProducts.slice(-3).reverse();
  const bestProducts = allProducts.slice(0, 3);

  let totalProductsSold = 0;
  let totalSales = 0;
  const orderSet = new Set();
  for (const obj of allProducts) {
    totalProductsSold += obj.totalQty;
    totalSales += obj.totalAmount;
    obj.orderIds.reduce((s, e) => orderSet.add(e), orderSet);
  }
  return {
    allProducts,
    worstProducts,
    bestProducts,
    totalProductsSold,
    totalSales,
    totalOrders: orderSet.size,
    avgRating:
      filterQuery.sellerId != null
        ? await getSellerAvgRating(filterQuery)
        : await getAppRating(),
  };
};

const allProductsSold = async (filterQuery) => {
  const resp = await Order.aggregate([
    {
      $match: { ...filterQuery, isPlaced: true, deliveredDate: { $ne: null } },
    },
    {
      $lookup: {
        from: "products",
        let: { productId: "$product" },
        pipeline: [
          {
            $match: { $expr: { $eq: ["$_id", "$$productId"] } },
          },
          {
            $project: {
              _id: 1,
              title: 1,
              stock: 1,
              price: 1,
              images: 1,
            },
          },
        ],
        as: "productInfo",
      },
    },
    {
      $unwind: "$productInfo",
    },
    {
      $lookup: {
        from: "feedbacks",
        localField: "product",
        foreignField: "productId",
        as: "feedbacks",
      },
    },
    {
      $addFields: {
        avgRating: {
          $ifNull: [{ $avg: "$feedbacks.rating" }, 0],
        },
      },
    },
    {
      $group: {
        _id: {
          productId: "$productInfo._id",
          title: "$productInfo.title",
          stock: "$productInfo.stock",
          price: "$productInfo.price",
          images: "$productInfo.images",
        },
        totalAmount: {
          $sum: {
            $multiply: ["$productInfo.price", "$qty"],
          },
        },
        totalQty: {
          $sum: "$qty",
        },
        avgRating: { $first: "$avgRating" },
        orderIds: {
          $addToSet: "$orderId",
        },
      },
    },
    {
      $sort: {
        totalQty: -1,
      },
    },
    {
      $project: {
        _id: 0,
        productId: "$_id.productId",
        title: "$_id.title",
        stock: "$_id.stock",
        price: "$_id.price",
        images: "$_id.images",
        avgRating: 1,
        totalAmount: 1,
        totalQty: 1,
        orderIds: 1,
      },
    },
  ]);

  if (!resp) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "No Products Found for the seller"
    );
  }
  return resp;
};

const getMonthAnalysis = async (filterQuery) => {
  const firstDate = new Date();
  firstDate.setMonth(0, 1);
  firstDate.setHours(0, 0, 0, 0);
  const resp = await Order.aggregate([
    {
      $match: {
        ...filterQuery,
        isPlaced: true,
        deliveredDate: { $ne: null },
        createdAt: { $gte: firstDate },
      },
    },
    {
      $lookup: {
        from: "products",
        let: { productId: "$product" },
        pipeline: [
          {
            $match: { $expr: { $eq: ["$_id", "$$productId"] } },
          },
          {
            $project: {
              _id: 1,
              title: 1,
              stock: 1,
              price: 1,
            },
          },
        ],
        as: "productInfo",
      },
    },
    {
      $unwind: "$productInfo",
    },
    {
      $group: {
        _id: {
          month: { $month: { $toDate: "$createdAt" } },
        },
        totalAmount: {
          $sum: {
            $multiply: ["$productInfo.price", "$qty"],
          },
        },
        totalQty: {
          $sum: "$qty",
        },
        orderIds: {
          $addToSet: "$orderId",
        },
      },
    },
    {
      $sort: {
        "_id.month": 1,
        totalQty: -1,
      },
    },
    {
      $project: {
        _id: 0,
        productId: "$_id.productId",
        title: "$_id.title",
        stock: "$_id.stock",
        price: "$_id.price",
        totalAmount: 1,
        totalQty: 1,
        orderIds: 1,
        month: "$_id.month",
      },
    },
  ]);
  return resp;
};

const getYearAnalysis = async (filterQuery) => {
  const resp = await Order.aggregate([
    {
      $match: { ...filterQuery, isPlaced: true, deliveredDate: { $ne: null } },
    },
    {
      $lookup: {
        from: "products",
        let: { productId: "$product" },
        pipeline: [
          {
            $match: { $expr: { $eq: ["$_id", "$$productId"] } },
          },
          {
            $project: {
              _id: 1,
              title: 1,
              stock: 1,
              price: 1,
            },
          },
        ],
        as: "productInfo",
      },
    },
    {
      $unwind: "$productInfo",
    },
    {
      $group: {
        _id: {
          year: { $year: { $toDate: "$createdAt" } },
        },
        totalAmount: {
          $sum: {
            $multiply: ["$productInfo.price", "$qty"],
          },
        },
        totalQty: {
          $sum: "$qty",
        },
        orderIds: {
          $addToSet: "$orderId",
        },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        totalQty: -1,
      },
    },
    {
      $project: {
        _id: 0,
        productId: "$_id.productId",
        title: "$_id.title",
        stock: "$_id.stock",
        price: "$_id.price",
        totalAmount: 1,
        totalQty: 1,
        orderIds: 1,
        year: "$_id.year",
      },
    },
  ]);
  return resp;
};

const getSellerAvgRating = async (filterQuery) => {
  const { sellerId } = filterQuery;
  const resp = await Feedback.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $match: {
        "product.sellerId": sellerId,
      },
    },
    {
      $group: {
        _id: {
          sellerId: "$product.sellerId",
        },
        avgRating: { $avg: "$rating" },
      },
    },
    {
      $project: {
        avgRating: 1,
        _id: 0,
      },
    },
  ]);
  return resp[0].avgRating;
};

const getAppRating = async () => {
  const resp = await Feedback.aggregate([
    {
      $match: {
        $or: [{ productId: { $eq: null } }, { productId: { $exists: false } }],
      },
    },
    {
      $group: {
        _id: null,
        avgAppRating: { $avg: "$rating" },
      },
    },
  ]);
  return resp[0].avgAppRating;
};

export { getAnalytics, getMonthAnalysis, getYearAnalysis };

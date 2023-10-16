import Product from "../models/product.model.js";
import ApiError from "../utils/api-error.js";
import httpStatus from "http-status";

const getProductById = async (productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found !!");
  }

  return product;
};

const getProducts = async (keyword = "", options = {}) => {
  const keywordRegx = new RegExp(keyword, "i");

  const products = await Product.paginate(
    {
      $or: [
        { title: { $regex: keywordRegx } },
        { description: { $regex: keywordRegx } },
      ],
    },
    options
  );

  if (!products) {
    throw new ApiError(httpStatus.NOT_FOUND, "Products not found!!");
  }

  return products;
};

const createProduct = async (productBody) => {
  const product = await Product.create(productBody);

  if (!product) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Product not created !!"
    );
  }

  return product;
};

export { getProducts, getProductById, createProduct };

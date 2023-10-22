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

const getProducts = async (filterQuery = {}, options = {}) => {
  const products = await Product.paginate(filterQuery, options);

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
      "Error creating the product !!"
    );
  }

  return product;
};

const updateProduct = async (query, productBody) => {
  if (Object.keys(productBody).length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No data provided !!");
  }

  const product = await Product.findOneAndUpdate(query, productBody, {
    new: true,
  });

  if (!product) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Product not found or not registered with this seller !!"
    );
  }

  return product;
};

const deleteProduct = async (query) => {
  const product = await Product.findOneAndDelete(query);

  if (!product) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Product not found or not registered with this seller !!"
    );
  }

  return product;
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

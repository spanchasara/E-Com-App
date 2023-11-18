import Product from "../models/product.model.js";
import ApiError from "../utils/api-error.js";
import httpStatus from "http-status";

import { uploadImage, deleteImage } from "../utils/cloudinary.js";

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

const uploadProductImages = async (productId, images) => {
  const product = await getProductById(productId);

  if (product.images.length + images.length > 5) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You can upload maximum 5 images !!"
    );
  }

  const productLinks = [];

  for (let i = 0; i < images.length; i++) {
    const { path } = images[i];
    const obj = await uploadImage(productId, path);
    productLinks.push(obj);
  }

  product.images = product.images.concat(productLinks);

  await product.save();

  return product;
};

const deleteProductImages = async (productId, publicIds) => {
  const product = await getProductById(productId);

  if (product.images.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No images to delete !!");
  }

  const images = product.images.filter(
    (image) => !publicIds.includes(image.publicId)
  );

  for (let i = 0; i < publicIds.length; i++) {
    const publicId = publicIds[i];
    await deleteImage(publicId);
  }

  product.images = images;

  await product.save();

  return product;
};

const updateProductStock = async (productBody) => {
  const { products, isAdd = false } = productBody;

  if (Object.keys(products).length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No data provided !!");
  }

  const productIds = products.map((product) => product.productId);

  for (let i = 0; i < productIds.length; i++) {
    const productId = productIds[i];
    const productQty = isAdd ? products[i].qty : -products[i].qty;

    await Product.updateOne(
      { _id: productId },
      {
        $inc: {
          stock: productQty,
        },
      }
    );
  }
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
  updateProductStock,
  uploadProductImages,
  deleteProductImages,
};

import cloudinary from "cloudinary";
import httpStatus from "http-status";
import fs from "fs";

import ApiError from "./api-error.js";

const cloudinaryConfig = () => {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
};

const uploadImage = async (productId, imgPath) => {
  try {
    const result = await cloudinary.v2.uploader.upload(imgPath, {
      folder: `products/${productId}`,
    });

    fs.unlink(imgPath, (err) => {
      if (err) {
        console.error(err);
      }
    });

    const { secure_url, public_id } = result;
    return { publicId: public_id, url: secure_url };
  } catch (error) {
    console.error(error);
    throw new ApiError(httpStatus.BAD_REQUEST, error?.message);
  }
};

const deleteImage = async (publicId) => {
  try {
    await cloudinary.v2.uploader.destroy(publicId);
  } catch (error) {
    console.error(error);
    throw new ApiError(httpStatus.BAD_REQUEST, error?.message);
  }
};

export { uploadImage, deleteImage, cloudinaryConfig };

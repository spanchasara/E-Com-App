import multer from "multer";
import fs from "fs";
import path from "path";
import httpStatus from "http-status";

import ApiError from "../utils/api-error.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      path.join(path.dirname(new URL(import.meta.url).pathname), "../../upload")
    );
  },
  filename: (req, file, cb) => {
    const fileName =
      req.params.productId +
      "-" +
      file.originalname.toLowerCase().split(" ").join("-");
    cb(null, fileName);
  },
});

const upload = multer({
  storage,
});

const uploadMiddleware = (req, res, next) => {
  upload.array("images", 5)(req, res, (err) => {
    if (err) {
      throw new ApiError(httpStatus.BAD_REQUEST, err.message);
    }

    const files = req.files;
    const errors = [];

    files.forEach((file) => {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      const maxSize = 5 * 1024 * 1024;

      if (!allowedTypes.includes(file.mimetype)) {
        errors.push(`Invalid file type: ${file.originalname}`);
      }

      if (file.size > maxSize) {
        errors.push(`File too large: ${file.originalname}`);
      }
    });

    if (errors.length > 0) {
      files.forEach((file) => {
        fs.unlinkSync(file.path);
      });

      throw new ApiError(httpStatus.BAD_REQUEST, errors.join(", "));
    }

    req.files = files;
    next();
  });
};

export default uploadMiddleware;

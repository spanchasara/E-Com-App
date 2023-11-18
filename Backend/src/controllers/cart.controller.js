import httpStatus from "http-status";
import * as cartService from "../services/cart.service.js";
import * as productService from "../services/product.service.js";
import ApiError from "../utils/api-error.js";
import catchAsync from "../utils/catch-async.js";

/* getCustomerCart - controller */
const getCustomerCart = catchAsync(async (req, res) => {
  const customerId = req.user._id;

  const populate = {
    path: "products.productId",
    select: "title price stock images",
  };

  const cart = await cartService.getCustomerCart({ customerId }, populate);
  res.send(cart);
});

/* updateCustomerCart - controller */
const updateCustomerCart = catchAsync(async (req, res) => {
  const { productId, qty, isAdd } = req.body;
  const customerId = req.user._id;

  // Check if the product exists
  const product = await productService.getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found!!");
  }

  // Check if customer cart exists, create if not
  let cart = await cartService.customerCartExists({ customerId });
  if (!cart) {
    cart = await cartService.createCustomerCart({ customerId });
  }

  // Find existing product idx in the cart
  const existingProductIndex = cart.products.findIndex(
    (p) => p.productId == productId
  );

  // Handle different cases based on qty and isAdd flags
  if (qty) {
    if (product.stock < qty) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Quantity is greater than stock!!"
      );
    }

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].qty = qty;
    } else {
      cart.products.push({ productId, qty });
    }
  } else if (isAdd) {
    // if (product.stock < 1) {
    //   throw new ApiError(httpStatus.BAD_REQUEST, "Product is out of stock!!");
    // }

    if (existingProductIndex !== -1) {
      if (product.stock <= cart.products[existingProductIndex].qty) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Quantity is greater than stock!!"
        );
      }
      cart.products[existingProductIndex].qty++;
    } else {
      cart.products.push({ productId, qty: 1 });
    }
  } else {
    if (existingProductIndex !== -1) {
      cart.products.splice(existingProductIndex, 1);
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, "Product not found in cart!!");
    }
  }

  // Save the updated cart and send the response
  const savedCart = await cart.save();
  res.send(savedCart);
});

export { getCustomerCart, updateCustomerCart };

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management
 *
 * /product:
 *   post:
 *     summary: Create a new product.
 *     tags: [Product]
 *     security:
 *       -  bearerAuth: []
 *     responses:
 *       "201":
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /product/{productId}:
 *   get:
 *     summary: get product by id / get all products / filter products.
 *     tags: [Product]
 *     parameters:
 *       -  in: path
 *          name: productId
 *          schema:
 *            type: string
 *          description: product id
 *       -  in: query
 *          name: keyword
 *          schema:
 *            type: string
 *          description: search keyword
 *       -  in: query
 *          name: page
 *          schema:
 *            type: number
 *            default: 1
 *          description: page number
 *       -  in: query
 *          name: limit
 *          schema:
 *            type: number
 *            default: 10
 *          description: page limit
 *       -  in: query
 *          name: sort
 *          schema:
 *            type: string
 *          description: sorts the response
 *     responses:
 *       "200 Without Id":
 *         description: all products / filtered products (productId not provided).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 docs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 page:
 *                   type: integer
 *                   example: 2
 *                 limit:
 *                   type: integer
 *                   example: 2
 *                 sort:
 *                   type: string
 *                   example: firstName
 *                 totalPages:
 *                   type: integer
 *                   example: 2
 *                 totalResults:
 *                   type: integer
 *                   example: 2
 *       "200 With Id":
 *         description: product by id (productId provided).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */

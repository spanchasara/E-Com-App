import * as productService from "../services/product.service.js";
import catchAsync from "../utils/catch-async.js";

/* getProducts - controller */
const getProducts = catchAsync(async (req, res) => {
  const { productId } = req.params;

  if (productId) {
    const product = await productService.getProductById(productId);
    res.send(product);
  } else {
    const { keyword = "" } = req.query;
    const keywordRegx = new RegExp(keyword, "i");

    const filterQuery = {
      $or: [
        { title: { $regex: keywordRegx } },
        { description: { $regex: keywordRegx } },
      ],
    };

    const options = {
      ...req.query,
    };

    const products = await productService.getProducts(filterQuery, options);
    res.send(products);
  }
});

/* getSellerProducts - controller */
const getSellerProducts = catchAsync(async (req, res) => {
  const { keyword = "" } = req.query;
  const keywordRegx = new RegExp(keyword, "i");

  const filterQuery = {
    $or: [
      { title: { $regex: keywordRegx } },
      { description: { $regex: keywordRegx } },
    ],
    sellerId: req.user._id,
  };

  const products = await productService.getProducts(filterQuery, req.query);
  res.send(products);
});

/* createProduct - controller */
const createProduct = catchAsync(async (req, res) => {
  const productBody = req.body;
  const product = await productService.createProduct({
    ...productBody,
    sellerId: req.user._id,
  });
  res.status(201).send(product);
});

/* updateProduct - controller */
const updateProduct = catchAsync(async (req, res) => {
  const productBody = req.body;
  const { productId } = req.params;

  const query = {
    _id: productId,
    sellerId: req.user._id,
  };

  const product = await productService.updateProduct(query, productBody);
  res.send(product);
});

/* deleteProduct - controller */
const deleteProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const query = {
    _id: productId,
    sellerId: req.user._id,
  };

  await productService.deleteProduct(query);
  res.send({
    message: "Product deleted successfully !!",
  });
});

export {
  getProducts,
  getSellerProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management
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

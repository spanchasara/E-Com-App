import catchAsync from "../utils/catch-async.js";
import * as addressService from "../services/address.service.js";

const getUsersAddress = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const addresses = await addressService.getUsersAddress(userId);
  res.send(addresses);
});

const getSingleAddress = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { addressId } = req.params;
  const address = await addressService.getSingleAddress(userId, addressId);
  res.send(address);
});

const addAddress = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const body = req.body;
  const address = await addressService.addAddress(userId, { userId, ...body });
  res.send(address);
});

const editAddress = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { addressId } = req.params;
  const body = req.body;
  const address = await addressService.editAddress(userId, addressId, body);
  res.send(address);
});

const deleteAddress = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { addressId } = req.params;
  const response = await addressService.deleteAddress(userId, addressId);
  res.send(response);
});

export {
  getUsersAddress,
  getSingleAddress,
  addAddress,
  deleteAddress,
  editAddress,
};

// get users addresses
/**
 * @swagger
 * tags:
 *   name: Address
 *   description: Address API'S
 *
 * /address/user:
 *   get:
 *     summary: Get User's Addresses.
 *     tags: [Address]
 *     security:
 *       -  bearerAuth: []
 *     responses:
 *       200:
 *         description: User's Addresses Retrieved Successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             properties:
 *               address:
 *                 $ref:'#/components/schemas/Address'
 *       500:
 *         description: Internal server error. There was an error retrieving Addresses.
 */

// get single address
/**
 * @swagger
 * tags:
 *   name: Address
 *   description: Address API
 *
 * /address/{addressId}:
 *   get:
 *     summary: Get particular address of user.
 *     tags: [Address]
 *     security:
 *       -  bearerAuth: []
 *     parameters:
 *       -  in: path
 *          name: addressId
 *          schema:
 *            type: string
 *          description: addressId
 *     responses:
 *       200:
 *         description: User's Address Retrieved Successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             properties:
 *               address:
 *                 $ref:'#/components/schemas/Address'
 *       500:
 *         description: Internal server error. There was an error retrieving Address.
 */

// add Address
/**
 * @swagger
 * tags:
 *   name: Address
 *   description: Address API
 *
 * /address/:
 *   post:
 *     summary: Add a new address of user.
 *     tags: [Address]
 *     security:
 *       -  bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               phoneNo:
 *                 type: string
 *                 pattern: '^[0-9]{10}$'
 *               country:
 *                 type: string
 *               state:
 *                 type: string
 *               city:
 *                 type: string
 *               addressLane1:
 *                 type: string
 *               addressLane2:
 *                 type: string
 *               landmark:
 *                 type: string
 *               pincode:
 *                 type: string
 *                 pattern: '^[0-9]{6}$'
 *               isDefault:
 *                 type: boolean
 *             required:
 *              - fullName
 *              - phoneNo
 *              - state
 *              - city
 *              - addressLane1
 *              - pincode
 *     responses:
 *       200:
 *         description: Address Addedd Successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             properties:
 *               address:
 *                 $ref:'#/components/schemas/Address'
 *       500:
 *         description: Internal server error. There was an error retrieving Address.
 */

// edit Address
/**
 * @swagger
 * tags:
 *   name: Address
 *   description: Address API
 *
 * /address/{addressId}:
 *   patch:
 *     summary: Edit an existing address of user.
 *     tags: [Address]
 *     security:
 *       -  bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               phoneNo:
 *                 type: string
 *                 pattern: '^[0-9]{10}$'
 *               state:
 *                 type: string
 *               city:
 *                 type: string
 *               addressLane1:
 *                 type: string
 *               addressLane2:
 *                 type: string
 *               landmark:
 *                 type: string
 *               pincode:
 *                 type: string
 *                 pattern: '^[0-9]{6}$'
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Address Updated Successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             properties:
 *               address:
 *                 $ref:'#/components/schemas/Address'
 *       500:
 *         description: Internal server error. There was an error retrieving Address.
 */

// delete address
/**
 * @swagger
 * tags:
 *   name: Address
 *   description: Address API
 *
 * /address/{addressId}:
 *   delete:
 *     summary: delete particular address of user.
 *     tags: [Address]
 *     security:
 *       -  bearerAuth: []
 *     parameters:
 *       -  in: path
 *          name: addressId
 *          schema:
 *            type: string
 *          description: addressId
 *     responses:
 *       200:
 *         description: User's Address Deleted Successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             properties:
 *               address:
 *                 $ref:'#/components/schemas/Address'
 *       500:
 *         description: Internal server error. There was an error retrieving Address.
 */

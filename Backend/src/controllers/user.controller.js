import httpStatus from "http-status";
import * as userService from "../services/user.service.js";
import ApiError from "../utils/api-error.js";
import catchAsync from "../utils/catch-async.js";
import { sendTemplateEmail, templates } from "../utils/brevo.js";

/* getUserProfile - controller */
const getUserProfile = catchAsync(async (req, res) => {
  res.send(req.user);
});

/* getAllUsers - controller */
const getAllUsers = catchAsync(async (req, res) => {
  const query = req.query;
  const { role } = req.params;
  const response = await userService.getAllUsers(role, query);
  res.send(response);
});

/* getPublicUser - controller */
const getPublicUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const response = await userService.getPublicUser(userId);
  res.send(response);
});

/* updateUser - controller */
const updateUser = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const reqBody = req.body;
  const response = await userService.updateUser(userId, reqBody);
  res.send(response);
});

/* toggleAccountStatus - controller */
const toggleAccountStatus = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { isSuspended } = req.query;

  const response = await userService.toggleAccountStatus(userId, isSuspended);
  res.send(response);
});

/* toggleUserRole - controller*/
const toggleRole = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { role } = req.params;

  if (req.user.role === role) {
    throw new ApiError(httpStatus.BAD_REQUEST, `User is already a ${role}`);
  }

  if (req.user.role === "customer" && req.user.companyName === null) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User is not registered as seller"
    );
  }

  const response = await userService.updateUser(userId, { role });

  sendTemplateEmail({
    to: req.user.email,
    subject: "Successfully registered as seller !!",
    params: {
      name: req.user.username,
    },
    templateId: templates.sellerRegistration,
  });

  res.send(response);
});

/* markAdmin - controller*/
const markAdmin = catchAsync(async (req, res) => {
  const { userId, role } = req.params;

  const user = await userService.getPublicUser(userId);

  if (user.role === role) {
    throw new ApiError(httpStatus.BAD_REQUEST, `User is already a ${role}`);
  }

  user.role = role;
  await user.save();

  const emailBody = {
    to: user.email,
    subject:
      role === "admin"
        ? "You are now an admin !!"
        : "You are no longer an admin !!",
    params: {
      name: user.username,
      admin: req.user.username,
    },
    templateId:
      role === "admin"
        ? templates.markUserAsAdmin
        : templates.unmarkUserAsAdmin,
  };

  sendTemplateEmail(emailBody);

  res.send(user);
});

/* sellerRegistration - controller*/
const sellerRegistration = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { companyName } = req.body;

  if (req.user.role !== "customer" && req.user.companyName !== null) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User already registered as seller"
    );
  }

  const response = await userService.updateUser(userId, {
    role: "seller",
    companyName,
  });

  res.send(response);
});

export {
  getUserProfile,
  getAllUsers,
  getPublicUser,
  toggleRole,
  updateUser,
  toggleAccountStatus,
  sellerRegistration,
  markAdmin,
};

// get profile of logged in user
/**
 * @swagger
 * tags:
 *   name: User
 *   description: user management
 *
 * /user/getMe:
 *   get:
 *     summary: get profile of logged in user.
 *     tags: [User]
 *     security:
 *       -  bearerAuth: []
 *     responses:
 *       "200":
 *         description: user fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

// get all users
/**
 * @swagger
 * /user:
 *   get:
 *     summary: get all users.
 *     tags: [User]
 *     security:
 *       -  bearerAuth: []
 *     parameters:
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
 *       "200":
 *         description: users fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 docs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
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
 */

// get profile of public user
/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     summary: get profile of public user.
 *     tags: [User]
 *     security:
 *       -  bearerAuth: []
 *     parameters:
 *       -  in: path
 *          name: userId
 *          schema:
 *            type: string
 *          description: public profile userId
 *     responses:
 *       "200":
 *         description: user fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

// update profile of logged in user
/**
 * @swagger
 * /user:
 *   patch:
 *     summary: update profile of logged in user.
 *     tags: [User]
 *     security:
 *       -  bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 default: ''
 *               lastName:
 *                 type: string
 *                 default: ''
 *               username:
 *                 type: string
 *                 default: ''
 *     responses:
 *       "200":
 *         description: user updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

//  update account status of a user
/**
 * @swagger
 * /user/toggle-account-status/{userId}:
 *   patch:
 *     summary: update account status of a user.
 *     tags: [User]
 *     security:
 *       -  bearerAuth: []
 *     parameters:
 *       -  in: query
 *          name: isSuspended
 *          schema:
 *            type: boolean
 *            default: false
 *          description: is suspended
 *       -  in: path
 *          name: userId
 *          schema:
 *            type: string
 *          description: public profile userId
 *     responses:
 *       "200":
 *         description: user account status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

// toggle account role of user
/**
 * @swagger
 * /user/toggle-role/{userId}:
 *   patch:
 *     summary: update role of a user.
 *     tags: [User]
 *     security:
 *       -  bearerAuth: []
 *     parameters:
 *       -  in: path
 *          name: role
 *          schema:
 *            type: string
 *          description: pudates role
 *     responses:
 *       "200":
 *         description: user role  updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

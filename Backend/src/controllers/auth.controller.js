import * as authService from "../services/auth.service.js";
import { addToContactList } from "../utils/brevo.js";
import catchAsync from "../utils/catch-async.js";
import { OAuth2Client } from "google-auth-library";

/* Register - controller */
const register = catchAsync(async (req, res) => {
  const registerBody = req.body;
  const response = await authService.register(registerBody);
  const { email, username } = registerBody;
  addToContactList(email, username);
  res.send(response);
});

/* Login - controller */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const response = await authService.login(email, password);

  res.send(response);
});

/* changePassword - controller */
const changePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const response = await authService.changePassword(
    req.user._id,
    oldPassword,
    newPassword
  );
  res.send(response);
});

const resetPasswordRequest = catchAsync(async (req, res) => {
  const { email } = req.body;
  const response = await authService.resetPasswordRequest(email);
  res.send(response);
});

const resetPassword = catchAsync(async (req, res) => {
  const reqBody = req.body;
  const response = await authService.resetPassword(reqBody);
  res.send(response);
});

const socialLogin = catchAsync(async (req, res) => {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken: req.body.idToken,
    audience:
      "631074242418-om4kcvar28m2bvdrj6fl585qjtkq7cmo.apps.googleusercontent.com",
  });
  const payload = ticket.getPayload();
  const userid = payload["sub"];
  res.send(payload);
  // If request specified a G Suite domain:
  // const domain = payload['hd'];

  // const { provider } = req.params;
  // const reqBody = req.body;

  // if (provider === "google") {
  //   const response = await authService.googleLogin(reqBody);
  //   return res.send(response);
  // }
});

export {
  register,
  login,
  changePassword,
  resetPasswordRequest,
  resetPassword,
  socialLogin,
};

// Register
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 *
 * /auth/register:
 *   post:
 *     summary: Registers a new user.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 3
 *             required:
 *              - firstName
 *              - username
 *              - email
 *              - password
 *
 *     responses:
 *       200:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request. The request body is invalid.
 *       500:
 *         description: Internal server error. There was an error registering the user.
 */

// login
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Logs in a user.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 3
 *             required:
 *              - email
 *              - password
 *
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       400:
 *         description: Bad request. The request body is invalid.
 *       401:
 *         description: Unauthorized. The email or password is incorrect.
 *       500:
 *         description: Internal server error. There was an error logging in the user.
 */

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Changes the password of a user.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 minLength: 3
 *               newPassword:
 *                 type: string
 *                 minLength: 3
 *             required:
 *              - oldPassword
 *              - newPassword
 *
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request. The request body is invalid.
 *       401:
 *         description: Unauthorized. The email or password is incorrect.
 *       500:
 *         description: Internal server error. There was an error logging in the user.
 */

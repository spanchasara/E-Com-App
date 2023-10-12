import * as authService from "../services/auth.service.js";
import catchAsync from "../utils/catch-async.js";

/* Register - controller */
const register = catchAsync(async (req, res) => {
  const registerBody = req.body;
  const response = await authService.register(registerBody);
  res.send(response);
});

/* Login - controller */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const response = await authService.login(email, password);
  res.send(response);
});

export { register, login };

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

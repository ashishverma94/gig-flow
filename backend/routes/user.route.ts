import express from "express";
import { loginUser, registerUser } from "../controllers/user.controller";

const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: |
 *       Creates a new user account by accepting name, email, and password.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           examples:
 *              success:
 *                  $ref: '#/components/examples/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *          application/json:
 *           examples:
 *              success:
 *                  $ref: '#/components/examples/RegisterResponse'
 *       400:
 *         description: Validation error or email already exists
 *       500:
 *         description: Internal server error
 */
userRouter.post("/register", registerUser as any);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           examples:
 *             success:
 *                  $ref: '#/components/examples/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *          application/json:
 *           examples:
 *              success:
 *                  $ref: '#/components/examples/LoginResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 */
userRouter.post("/login", loginUser as any);

export default userRouter;

import express from "express";
import { createGig, getOpenGigs } from "../controllers/gig.controller";
import { isAuthenticated } from "../middleware/auth";

const gigRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Gigs
 *   description: Gig management APIs
 */

/**
 * @swagger
 * /api/gigs:
 *   post:
 *     summary: Create a new gig
 *     tags: [Gigs]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           examples:
 *             success:
 *               $ref: '#/components/examples/CreateGigRequest'
 *     responses:
 *       201:
 *         description: Gig created successfully
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 $ref: '#/components/examples/CreateGigResponse'
 *       400:
 *          description: All fields are required | Budget must be a positive number
 *       500:
 *          description: Internal server error
 */
gigRouter.post("/", isAuthenticated, createGig as any);

/**
 * @swagger
 * /api/gigs:
 *   get:
 *     summary: Get list of all open gigs
 *     tags: [Gigs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter gigs by title keyword
 *         example: MERN
 *     responses:
 *       200:
 *         description: List of open gigs
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 $ref: '#/components/examples/GetGigsResponse'
 *       500:
 *         description: Internal server error
 */

gigRouter.get("/", isAuthenticated, getOpenGigs as any);

export default gigRouter;

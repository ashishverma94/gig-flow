import express from "express";
import {
  submitBid,
  getBidsForGig,
  hirePerson,
} from "../controllers/bid.controller";
import { isAuthenticated } from "../middleware/auth";

const bidRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Bids
 *   description: Bid management APIs
 */

/**
 * @swagger
 * /api/bids:
 *   post:
 *     summary: Submit a bid for a gig
 *     tags: [Bids]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           examples:
 *             success:
 *              $ref: '#/components/examples/SubmitBidRequest'
 *     responses:
 *       201:
 *         description: Bid submitted successfully
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 $ref: '#/components/examples/SubmitBidResponse'
 *       400:
 *         description: gigId and message are required | Validation error
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Gig not found
 */
bidRouter.post("/", isAuthenticated, submitBid as any);

/**
 * @swagger
 * /api/bids/{gigId}:
 *   get:
 *     summary: Get all bids for a specific gig (Owner only)
 *     tags: [Bids]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: gigId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the gig
 *     responses:
 *       201:
 *         description: Get all bids for a gig
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 $ref: '#/components/examples/GetBidsResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Forbidden - Not the gig owner
 *       404:
 *         description: Gig not found
 */
bidRouter.get("/:gigId", isAuthenticated, getBidsForGig as any);

/**
 * @swagger
 * /api/bids/{bidId}/hire:
 *   patch:
 *     summary: Hire a specific bid for a gig (Client only)
 *     tags: [Bids]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: bidId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the bid to hire
 *     responses:
 *       200:
 *         description: Bid hired successfully
 *       400:
 *         description: Gig is not open
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Forbidden - Not the gig owner
 *       404:
 *         description: Bid or gig not found
 */
bidRouter.put("/:bidId/hire", isAuthenticated, hirePerson as any);

export default bidRouter;

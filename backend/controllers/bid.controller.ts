import { Request, Response } from "express";
import bidModel from "../models/bid.model";
import { gigModel } from "../models/gig.model";
import mongoose from "mongoose";

export const submitBid = async (req: Request, res: Response) => {
  try {
    const { gigId, message } = req.body;

    if (!gigId || !message) {
      return res
        .status(400)
        .json({ success: false, message: "gigId and message are required" });
    }

    const gig = await gigModel.findById(gigId);
    const userId = (req as any).userId;

    if (!gig)
      return res.status(404).json({ success: false, message: "Gig not found" });
    if (gig.status !== "open")
      return res
        .status(400)
        .json({ success: false, message: "Gig is not open" });

    const bid = await bidModel.create({
      gigId,
      freelancerId: userId,
      message,
    });

    return res.status(201).json({ success: true, bid });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getBidsForGig = async (req: Request, res: Response) => {
  try {
    const { gigId } = req.params;
    const userId = (req as any).userId;

    if (!gigId) {
      return res
        .status(400)
        .json({ success: false, message: "gigId is required" });
    }

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const gig = await gigModel.findById(gigId);
    if (!gig) {
      return res.status(404).json({ success: false, message: "Gig not found" });
    }

    if (gig.ownerId.toString() !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: Not the gig owner" });
    }

    const bids = await bidModel
      .find({ gigId })
      .populate("freelancerId", "name email");

    return res.status(200).json({ success: true, bids });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const hirePerson = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bidId } = req.params;
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const bid = await bidModel.findById(bidId).session(session);
    if (!bid) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Bid not found" });
    }

    const gig = await gigModel.findById(bid.gigId).session(session);
    if (!gig) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Gig not found" });
    }

    if (gig.ownerId.toString() !== userId) {
      await session.abortTransaction();
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: Not the gig owner" });
    }

    if (gig.status !== "open") {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "Gig is not open for hiring" });
    }

    gig.status = "assigned";
    await gig.save({ session });

    bid.status = "hired";
    await bid.save({ session });

    await bidModel.updateMany(
      { gigId: gig._id, _id: { $ne: bid._id } },
      { status: "rejected" },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Bid hired successfully",
      hiredBid: bid,
    });
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

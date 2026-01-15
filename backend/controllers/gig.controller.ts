import { Request, Response } from "express";
import { gigModel } from "../models/gig.model";
import { AuthRequest } from "../middleware/auth";

export const createGig = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, budget } = req.body;

    if (!title || !description || budget === undefined) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (budget < 0) {
      return res.status(400).json({
        success: false,
        message: "Budget must be a positive number",
      });
    }

    const gig = await gigModel.create({
      title,
      description,
      budget,
      ownerId: req.userId,
      status: "open",
    });

    return res.status(201).json({
      success: true,
      message: "Gig created successfully",
      gig,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getOpenGigs = async (req: Request, res: Response) => {
  try {
    const { title } = req.query;

    const filter: any = { status: "open" };

    if (title) {
      filter.title = {
        $regex: title,
        $options: "i",
      };
    }

    const gigs = await gigModel
      .find(filter)
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: gigs.length,
      gigs,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

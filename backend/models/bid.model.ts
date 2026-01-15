import mongoose, { Schema, Document } from "mongoose";

export interface IBid extends Document {
  gigId: mongoose.Types.ObjectId;
  freelancerId: mongoose.Types.ObjectId;
  message: string;
  status: "pending" | "hired" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const bidSchema = new Schema<IBid>(
  {
    gigId: { type: Schema.Types.ObjectId, ref: "Gig", required: true },
    freelancerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "hired", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const bidModel = mongoose.model<IBid>("Bid", bidSchema);
export default bidModel;

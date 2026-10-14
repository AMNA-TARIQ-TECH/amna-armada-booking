import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    durationMinutes: { type: Number, required: true, min: 1, default: 30 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Service = mongoose.model("Service", serviceSchema);

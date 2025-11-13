import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  resumeUrl: String,
  score: Number, // AI match score
  appliedAt: { type: Date, default: Date.now },
});

export const Application = mongoose.model("Application", applicationSchema);

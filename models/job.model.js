import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  company: String,
  location: String,
  skillsRequired: [String],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }, // employer
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }], // link applications
  createdAt: {
    type: Date,
    default: Date.now,
  },
  appliedcount: {
    type: Number,
  },
});

export const Job = mongoose.model("Job", jobSchema);

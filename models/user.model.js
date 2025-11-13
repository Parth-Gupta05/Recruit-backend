import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["applicant", "employer"], required: true },
  phone: String,
  resumeUrl: String, // for applicants
});

export const User = mongoose.model("User", userSchema);

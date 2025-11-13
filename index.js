import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import resumeRoutes from "./routes/resumeRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import connection from "./database/dbconnect.js";
import authRoutes from "./routes/authRoutes.js"; // ← ADD THIS
import jobRoutes from "./routes/jobRoutes.js";
import { Job } from "./models/job.model.js";
import applicationRoutes from './routes/applicatiionRoutes.js'

dotenv.config();
const app = express();
const options = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // Adjust as needed
  credentials: true,
};
app.use(cors(options));
app.use(express.json()); // ← ADD THIS for JSON parsing
app.use(express.urlencoded({ extended: true })); // ← ADD THIS for form data

app.use(bodyParser.json());
app.use("/api/resumes", resumeRoutes);
app.use("/api/match", matchRoutes);
app.use("/auth", authRoutes); // ← ADD THIS
app.use("/jobs", jobRoutes);
app.use("/applications", applicationRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`✅ Server running on port ${process.env.PORT || 5000}`);
});

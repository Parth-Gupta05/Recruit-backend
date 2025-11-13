import express from "express";
import { createJob, getAllJobs, getJobsByUserId } from "../controllers/jobController.js";

const router = express.Router();

// GET /jobs - fetch all jobs
router.get("/", getAllJobs);
router.get('/user/:userId', getJobsByUserId)
router.post("/create", createJob);

export default router;

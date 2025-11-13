import express from "express";
import { getApplicantsForJob } from "../controllers/applicationController.js";

const router = express.Router();

router.get("/job/:jobId", getApplicantsForJob);

export default router;

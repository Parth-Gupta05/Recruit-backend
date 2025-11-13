import express from "express";
import { matchCandidates } from "../controllers/matchController.js";

const router = express.Router();
router.post("/", matchCandidates);
export default router;

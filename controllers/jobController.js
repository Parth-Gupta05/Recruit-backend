import { Job } from "../models/job.model.js";

export const getAllJobs = async (req, res) => {
  try {
    // Optionally add pagination in future (limit/skip)
    const jobs = await Job.find()
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ jobs, count: jobs.length });
  } catch (error) {
    console.error("❌ Error fetching jobs:", error.message);
    return res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

export const getJobsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Fetch jobs posted by the given user
    const jobs = await Job.find({ postedBy: userId })
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    if (jobs.length === 0) {
      return res.status(200).json({ jobs: [], count: 0 });
    }

    return res.status(200).json({ jobs, count: jobs.length });
  } catch (error) {
    console.error("❌ Error fetching jobs by user ID:", error.message);
    return res.status(500).json({ error: "Failed to fetch user's jobs" });
  }
};

export const createJob = async (req, res) => {
  try {
    const { title, description, company, location, skillsRequired, postedBy } = req.body;

    if (!title || !description || !company || !postedBy) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const job = await Job.create({
      title,
      description,
      company,
      location,
      skillsRequired,
      postedBy,
      appliedcount: 0,
    });

    return res.status(201).json({ message: "Job posted successfully", job });
  } catch (error) {
    console.error("❌ Error posting job:", error);
    return res.status(500).json({ error: "Failed to post job" });
  }
};
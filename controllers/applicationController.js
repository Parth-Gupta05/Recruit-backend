import { Application } from "../models/application.model.js";
import { User } from "../models/user.model.js";

export const getApplicantsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({ jobId })
      .populate("userId", "name email phone resumeUrl")
      .sort({ score: -1 }); // sort from highest score to lowest

    if (!applications.length) {
      return res.status(404).json({ message: "No applicants found for this job" });
    }

    res.status(200).json({ applicants: applications });
  } catch (error) {
    console.error("❌ Error fetching applicants:", error.message);
    res.status(500).json({ error: "Failed to fetch applicants" });
  }
};

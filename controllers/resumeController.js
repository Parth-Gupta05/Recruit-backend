import fs from "fs";
import { extractTextFields } from "../utils/extractText.js";
import { callOpenAI } from "../utils/openaiClient.js";

// ✅ Import the CommonJS helper using createRequire
import { createRequire } from "module";
import { cosineSimilarity } from "../utils/similarity.js";
import { callOpenAIscore } from "../utils/openaiscorematch.js";
import { uploadResumeToCloudinary } from "../utils/cloudinaryUpload.js";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
const require = createRequire(import.meta.url);
const { parsepdf } = require("../utils/pdfParser.cjs");

export const parseResume = async (req, res) => {
  try {
    const {description,jobid,userid}=req.body
    // console.log(req.body.description)
    
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const text = await parsepdf(filePath);
    // console.log(text)
    console.log(filePath)

    const basic = extractTextFields(text);
    const aiExtract = await callOpenAI(text);
    const matchscore=await callOpenAIscore(text, description)
    
    // Upload resume to Cloudinary
    let resumeUrl = null;
    try {
      if (userid) {
        resumeUrl = await uploadResumeToCloudinary(filePath, userid);
        console.log("✅ Resume uploaded to Cloudinary:", resumeUrl);
      }
    } catch (uploadError) {
      console.warn("⚠️ Cloudinary upload failed, continuing without URL:", uploadError.message);
    }

    // ✅ Save application to MongoDB after successful upload
    let savedApplication = null;
    try {
      if (userid && jobid && resumeUrl) {
        const application = new Application({
          jobId: jobid,
          userId: userid,
          resumeUrl: resumeUrl,
          score: Number(matchscore),
        });
        savedApplication = await application.save();
        console.log("✅ Application saved to MongoDB:", savedApplication._id);

        // Update job's applicants array
        await Job.findByIdAndUpdate(
          jobid,
          {
            $push: { applicants: savedApplication._id },
            $inc: { appliedcount: 1 },
          },
          { new: true }
        );
        console.log("✅ Job updated with application reference");
      }
    } catch (dbError) {
      console.warn("⚠️ Database save failed:", dbError.message);
    }

    const combined = {
      name: basic.name,
      email: basic.email,
      phone: basic.phone,
      aiData: aiExtract,
      score: Number(matchscore),
      resumeUrl: resumeUrl, // ✅ Add Cloudinary URL to response
      applicationId: savedApplication?._id, // ✅ Include application ID in response
    };

    // Clean up local file after upload
    fs.unlinkSync(filePath);
    return res.json(combined);
  } catch (error) {
    console.error("❌ Error parsing resume:", error);
    // Clean up file on error
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ error: "Failed to parse resume" });
  }
};

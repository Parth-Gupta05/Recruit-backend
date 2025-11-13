import cloudinary from "./cloudinaryConfig.js";
import fs from "fs";

/**
 * Upload resume PDF to Cloudinary
 * @param {string} filePath - local file path of the resume
 * @param {string} userId - user ID (used for organizing uploads)
 * @returns {Promise<string>} - Cloudinary secure URL of the uploaded file
 */
export const uploadResumeToCloudinary = async (filePath, userId) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder: `recruitment-app/resumes/${userId}`,
      resource_type: "auto",
      public_id: `resume_${Date.now()}`,
    });

    return result.secure_url;
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error.message);
    throw error;
  }
};

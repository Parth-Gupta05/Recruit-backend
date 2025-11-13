import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
import { extractSections } from "../utils/extractSections.js";


const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});



export const callOpenAIscore = async (resumeText,jobDescription) => {
  const extracted = extractSections(resumeText);
  const { experience, skills, projects, certifications, education } = extracted;
  console.log(extracted)
  const prompt = `
  You are a recruitment matching assistant. 
Evaluate how well this candidate fits the given job role based on the extracted resume sections below.

Consider:
1. Core technical & functional skills
2. Domain or role relevance
3. Transferability to required technologies
4. Experience depth (years, seniority, project scale)
5. Soft skills or leadership traits

Return ONLY a single number (0–100) representing the overall match score in percentage.

Resume Data:
Experience: ${experience}
Skills: ${skills}
Projects: ${projects}
Certifications: ${certifications}
Education: ${education}

Job Description:
${jobDescription}
  `;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature:0,
    messages: [{ role: "user", content: prompt }],
  });

  const text = completion.choices[0].message.content;
  return text;
};

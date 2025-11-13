import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const callOpenAI = async (resumeText) => {
  const prompt = `
  Extract the following details from this resume text:
  - Top Skills (comma-separated)
  - Total Experience (in years)
  - Last Job Title
  - Education (highest qualification)
  - 2-line Professional Summary

  Resume Text:
  ${resumeText.substring(0, 3000)}
  `;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const text = completion.choices[0].message.content;
  return text;
};

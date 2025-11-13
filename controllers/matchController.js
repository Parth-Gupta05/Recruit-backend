import { cosineSimilarity } from "../utils/similarity.js";
import { callOpenAI } from "../utils/openaiClient.js";

const dummyCandidates = [
  {
    name: "Rahul Mehta",
    skills: "Python, SQL, Machine Learning, FastAPI",
    summary: "Data scientist with 3 years of experience in predictive models.",
  },
  {
    name: "Sneha Rao",
    skills: "Excel, Tableau, Power BI, SQL",
    summary: "Analyst experienced in data visualization and reporting.",
  },
  {
    name: "Rohan Patel",
    skills: "React, Node.js, MongoDB, AWS",
    summary: "Full-stack developer with 2 years of experience.",
  },
];

export const matchCandidates = async (req, res) => {
  try {
    const { jobDesc } = req.body;
    const ranked = [];

    for (let c of dummyCandidates) {
      const candidateText = `${c.skills} ${c.summary}`;
      const score = cosineSimilarity(jobDesc, candidateText);
      ranked.push({ ...c, score: score.toFixed(2) });
    }

    ranked.sort((a, b) => b.score - a.score);
    res.json({ ranked });
  } catch (error) {
    console.error("❌ Error matching candidates:", error);
    res.status(500).json({ error: "Failed to match candidates" });
  }
};

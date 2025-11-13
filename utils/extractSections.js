// utils/extractSections.js
export const extractSections = (resumeText) => {
  if (!resumeText) return {};

  // Normalize text
  const text = resumeText.replace(/\r/g, "").split("\n").join(" ").toLowerCase();

  // Define regex patterns for each section
  const sections = {
    experience: /(experience|work history|employment|professional background)/i,
    skills: /(skills|technical skills|key skills|proficiencies)/i,
    projects: /(projects|portfolio|case studies)/i,
    education: /(education|academic background|qualifications|degree)/i,
    certifications: /(certifications|courses|licenses|achievements)/i,
  };

  // Split text into chunks by common section headings
  const parts = text.split(/(?=\b(experience|skills|projects|education|certifications)\b)/gi);

  const data = {
    experience: "",
    skills: "",
    projects: "",
    education: "",
    certifications: "",
  };

  // Assign content to matching section
  let current = null;
  for (const part of parts) {
    const clean = part.trim();

    for (const [key, regex] of Object.entries(sections)) {
      if (regex.test(clean)) {
        current = key;
        data[current] += clean + " ";
        break;
      }
    }

    if (current && !Object.values(sections).some((r) => r.test(clean))) {
      data[current] += clean + " ";
    }
  }

  // Truncate each section to limit tokens (optional)
  for (const key of Object.keys(data)) {
    data[key] = data[key].substring(0, 800).trim();
  }

  return data;
};

export const extractTextFields = (text) => {
  const nameMatch = text.match(/[A-Z][a-z]+ [A-Z][a-z]+/);
  const emailMatch = text.match(/[\w\.-]+@[\w\.-]+/);
  const phoneMatch = text.match(/\+?\d[\d\s-]{8,12}\d/);

  return {
    name: nameMatch ? nameMatch[0] : "",
    email: emailMatch ? emailMatch[0] : "",
    phone: phoneMatch ? phoneMatch[0] : "",
  };
};

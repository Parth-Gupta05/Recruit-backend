const { PDFExtract } = require("pdf.js-extract");
const pdfExtract = new PDFExtract();


const parsepdf = async (filePath) => {
  return new Promise((resolve, reject) => {
    pdfExtract.extract(filePath, {}, (err, data) => {
      if (err) return reject(err);

      // Combine all text from all pages
      const text = data.pages
        .map((page) =>
          page.content
            .map((item) => item.str)
            .join(" ")
        )
        .join("\n\n");

      resolve(text.trim());
    });
  });
};

module.exports = { parsepdf };

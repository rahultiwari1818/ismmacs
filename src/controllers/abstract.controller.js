import Abstract from "../model/abstract.model.js";

export const submitAbstract = async (req, res) => {
  try {
    const { fullName, title, position, affiliation, abstractTitle } = req.body;
    let coauthors = req.body.coauthors;

    if (!Array.isArray(coauthors)) {
      coauthors = coauthors ? [coauthors] : [];
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "PDF file is required." });
    }

    const newAbstract = new Abstract({
      fullName,
      title,
      position,
      affiliation,
      abstractTitle,
      coauthors,
      pdfFilePath: req.file.path
    });

    await newAbstract.save();
    res.status(201).json({ success: true, message: "Abstract submitted successfully." });
  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

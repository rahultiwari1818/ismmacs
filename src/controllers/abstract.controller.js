import Abstract from "../model/abstract.model.js";
import fs from "fs";
import path from "path";
import archiver from "archiver";

export const submitAbstract = async (req, res) => {
  try {
    const {
      fullName,
      title,
      position,
      affiliation,
      abstractTitle,
    } = req.body;

    // Parse coauthors (array of JSON strings from frontend)
    let coauthors = [];
    if (req.body.coauthors && Array.isArray(req.body.coauthors)) {
      coauthors = req.body.coauthors.map((ca) => JSON.parse(ca));
    }

    // Save file path
    const filePath = req.file ? req.file.path : null;


    const newAbstract = new Abstract({
      fullName,
      title,
      position,
      affiliation,
      abstractTitle,
      coauthors,
      abstractFile: filePath,
    });

    await newAbstract.save();

    res.status(201).json({ message: "Abstract submitted successfully!" });
  } catch (error) {
    console.error("Error submitting abstract:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllAbstracts = async (req, res) => {
  try {
    const abstracts = await Abstract.find();
    res.status(200).json(abstracts);
  } catch (error) {
    console.error("Fetch Abstracts Error:", error);
    res.status(500).json({ message: "Failed to fetch abstracts" });
  }
};


export const downloadAllAbstractsZip = (req, res) => {
  const abstractsDir = path.join("uploads","abstracts"); // Update if needed
  const archive = archiver("zip", { zlib: { level: 9 } });

  res.attachment("abstracts.zip");
  archive.pipe(res);

  archive.directory(abstractsDir, false);
  archive.finalize();
};

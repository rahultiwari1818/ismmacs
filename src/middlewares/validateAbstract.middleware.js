export const validateAbstract = (req, res, next) => {
  const {
    fullName,
    title,
    position,
    affiliation,
    abstractTitle,
  } = req.body;

  if (!fullName || !title || !position || !affiliation || !abstractTitle) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Validate coauthors (optional)
  if (req.body.coauthors && Array.isArray(req.body.coauthors)) {
    for (const ca of req.body.coauthors) {
      let parsed;
      try {
        parsed = JSON.parse(ca);
      } catch (err) {
        return res.status(400).json({ message: "Invalid co-author format." });
      }

      if (!parsed.name || !parsed.affiliation) {
        return res.status(400).json({ message: "Each co-author must include name and affiliation." });
      }
    }
  }

  // Validate file presence (if required)
  if (!req.file) {
    return res.status(400).json({ message: "PDF abstract file is required." });
  }

  next();
};

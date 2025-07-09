import mongoose from "mongoose";

const AbstractSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  title: { type: String, required: true },
  position: { type: String, required: true },
  affiliation: { type: String, required: true },
  abstractTitle: { type: String, required: true },
  coauthors: [String],
  pdfFilePath: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Abstract = mongoose.model("Abstract", AbstractSchema);
export default Abstract;

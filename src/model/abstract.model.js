import mongoose from "mongoose";

const coauthorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  affiliation: { type: String, required: true },
});

const abstractSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    title: { type: String, required: true },
    position: { type: String, required: true },
    affiliation: { type: String, required: true },
    abstractTitle: { type: String, required: true },
    coauthors: [coauthorSchema],
    abstractFile: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Abstract", abstractSchema);

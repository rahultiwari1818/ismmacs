import mongoose from "mongoose";

const RegistrationSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    instituteName: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    nationality: { type: String },
    membership: { type: String },
    category: { type: String, required: true },
    address: { type: String },
    amount: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
    },
    paymentReference: { type: String },
    membershipReceiptPath: { type: String }, // New field
  },
  { timestamps: true }
);

export default mongoose.model("Registration", RegistrationSchema);

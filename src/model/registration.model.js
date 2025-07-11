import mongoose from "mongoose";

const RegistrationSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  instituteName: String,
  email: String,
  phone: String,
  nationality: String,
  membership: String,
  category: String,
  address: String,
  amount: String,
  paymentStatus: {
    type: String,
    enum: ["Pending", "Success", "Failed"],
    default: "Pending",
  },
  paymentReference: String,
}, { timestamps: true });

export default mongoose.model("Registration", RegistrationSchema);

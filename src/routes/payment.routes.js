import express from "express";
import { handlePaymentCallback, initiateRegistrationAndPayment } from "../controllers/payment.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/payment", (req, res, next) => {
  // Conditionally use multer only if membership type is "New ISMMACS Member"
  upload.single("membershipReceipt")(req, res, function (err) {
    if (req.body.membership === "New ISMMACS Member" && err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, initiateRegistrationAndPayment);

router.post("/paymemtSuccessfull", handlePaymentCallback);


export default router;

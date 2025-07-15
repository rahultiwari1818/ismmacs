import express from "express";
import { handlePaymentCallback, initiateRegistrationAndPayment } from "../controllers/payment.controller.js";
import  { imageUpload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/payment", imageUpload.single("membershipReceipt"), initiateRegistrationAndPayment);

router.post("/paymemtSuccessfull", handlePaymentCallback);


export default router;

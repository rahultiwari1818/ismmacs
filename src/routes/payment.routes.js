import express from "express";
import { handlePaymentCallback, initiateRegistrationAndPayment, registerForeignParticipants } from "../controllers/payment.controller.js";
import  upload, { imageUpload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/payment", imageUpload.single("membershipReceipt"), initiateRegistrationAndPayment);

router.post("/paymemtSuccessfull", handlePaymentCallback);

router.post("/register",imageUpload.single("foreignPaymentProof"),registerForeignParticipants)


export default router;

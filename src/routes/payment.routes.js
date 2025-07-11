import express from "express";
import { handlePaymentCallback, initiateRegistrationAndPayment } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/payment",initiateRegistrationAndPayment)
router.post("/paymemtSuccessfull", handlePaymentCallback);


export default router;

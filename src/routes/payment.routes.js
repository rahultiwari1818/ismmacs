import express from "express";
import { redirectToPayment } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/payment",redirectToPayment)

export default router;

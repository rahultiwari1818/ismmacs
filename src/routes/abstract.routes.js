import express from "express";
import upload from "../middlewares/upload.middleware.js";
import { submitAbstract } from "../controllers/abstract.controller.js";

const router = express.Router();

router.post("/submit", upload.single("abstractFile"), submitAbstract);

export default router;

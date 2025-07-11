import express from "express";
import upload from "../middlewares/upload.middleware.js";
import { downloadAllAbstractsZip, getAllAbstracts, submitAbstract } from "../controllers/abstract.controller.js";
import { validateAbstract } from "../middlewares/validateAbstract.middleware.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/submit", upload.single("abstractFile"),validateAbstract, submitAbstract);
router.get("/all", verifyAdmin, getAllAbstracts);

router.get("/downloadAllZip",downloadAllAbstractsZip)

export default router;

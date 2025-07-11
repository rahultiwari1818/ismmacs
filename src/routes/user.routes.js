import express from "express";
import { registerUser, loginUser, getAllRegistrations } from "../controllers/user.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/allRegistrations", verifyAdmin, getAllRegistrations);


export default router;

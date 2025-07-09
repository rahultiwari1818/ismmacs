import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/mongoDB.config.js";
import abstractRoutes from "./routes/abstract.routes.js";
import userRoutes from "./routes/user.routes.js";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// To handle __dirname with ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect DB
connectDB();

// API routes
app.use("/api/abstract", abstractRoutes);

app.use("/api/users", userRoutes);

// Serve uploaded files if needed
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));

// Fallback route for SPA
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

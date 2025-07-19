import multer from "multer";
import path from "path";
import fs from "fs";

const abstractDir = "uploads/abstracts/";
const paymentProofDir = "uploads/proofs/";



const abstractStorage = multer.diskStorage({
  destination: (req, file, cb) => {

    cb(null, abstractDir);
  },
  filename: (req, file, cb) => {
    // Assuming `fullName` is sent in body
    let fullName = req.body.fullName || req.body.firstName ||"user";
    // Remove spaces and special characters for filename safety
    fullName = fullName.replace(/[^a-zA-Z0-9]/g, "_");
    const timestamp = Date.now();
    cb(null, `${fullName}-${timestamp}${path.extname(file.originalname)}`);
  }
});
const proofStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, paymentProofDir);
  },
  filename: (req, file, cb) => {
    // Assuming `fullName` is sent in body
    let fullName = req.body.fullName || req.body.firstName ||"user";
    // Remove spaces and special characters for filename safety
    fullName = fullName.replace(/[^a-zA-Z0-9]/g, "_");
    const timestamp = Date.now();
    cb(null, `${fullName}-${timestamp}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const imageFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpg, jpeg, png, webp) are allowed"), false);
  }
};

export const imageUpload = multer({
  storage:proofStorage,
  limits:{fileSize:40*1024*1024},
  imageFilter
})

const upload = multer({
  storage:abstractStorage,
  limits: { fileSize: 40 * 1024 * 1024 },
  fileFilter
});

export default upload;
